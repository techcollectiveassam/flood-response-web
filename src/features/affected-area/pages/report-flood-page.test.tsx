import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { MemoryRouter, useLocation } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  renderWithProviders,
  screen,
  waitFor,
  within,
} from '@/testing/test-utils'
import { i18n } from '@/lib/i18n/i18n'
import { server } from '@/testing/mocks/server'
import { ReportDraftProvider } from '../contexts/report-draft-provider'
import { ReportFloodPage } from './report-flood-page'

function stubDesktopViewport() {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  )
}

const originalGeolocation = Object.getOwnPropertyDescriptor(
  navigator,
  'geolocation',
)

function stubGeolocation(
  implementation: (
    success: PositionCallback,
    error?: PositionErrorCallback | null,
  ) => void,
) {
  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: {
      getCurrentPosition: vi.fn(implementation),
    },
  })
}

function stubSuccessfulGeolocation() {
  stubGeolocation((success) => {
    success({
      coords: {
        latitude: 26.7509,
        longitude: 94.2037,
        accuracy: 8,
      },
    } as GeolocationPosition)
  })
}

function renderFlowPage() {
  return renderWithProviders(
    <MemoryRouter initialEntries={['/en/report-flood']}>
      <ReportDraftProvider>
        <ReportFloodPage />
        <LocationProbe />
      </ReportDraftProvider>
    </MemoryRouter>,
  )
}

function LocationProbe() {
  const { pathname } = useLocation()

  return (
    <p data-testid="location" hidden>
      {pathname}
    </p>
  )
}

function renderDesktopFlowPage() {
  stubDesktopViewport()

  return renderWithProviders(
    <MemoryRouter initialEntries={['/en/report-flood']}>
      <ReportDraftProvider>
        <ReportFloodPage />
        <LocationProbe />
      </ReportDraftProvider>
    </MemoryRouter>,
  )
}

async function captureGps() {
  await userEvent.click(
    screen.getByRole('button', {
      name: 'Acquire GPS Location (1 Tap)',
    }),
  )
  await screen.findByText(/Location captured/)
}

async function reachReviewStep() {
  await captureGps()
  await userEvent.click(screen.getByRole('button', { name: 'Next' }))
  await userEvent.click(screen.getByRole('radio', { name: 'Urgent' }))
  await userEvent.click(
    screen.getByRole('button', { name: 'Next: Attach photos' }),
  )
  await userEvent.click(
    screen.getByRole('button', { name: 'Next: Review report' }),
  )
}

const DISASTER_REF_ID = '3f2a9c1e-7b4d-4e2a-9c1e-5d6f7a8b9c0d'

const createdAffectedAreaResponse = {
  data: {
    affected_area: {
      ref_id: '3f2a9c1e-7b4d-4e2a-9c1e-5d6f7a8b9c0d',
      disaster_ref_id: DISASTER_REF_ID,
      latitude: 26.7509,
      longitude: 94.2037,
      severity: 'high',
      verification_status: 'reported',
      report_count: 1,
    },
    report: {
      ref_id: '4f2a9c1e-7b4d-4e2a-9c1e-5d6f7a8b9c0d',
      severity: 'high',
      location: {
        source: 'gps',
        latitude: 26.7509,
        longitude: 94.2037,
      },
      created_at: '2026-11-22T00:00:00Z',
    },
    is_new_area: true,
    confidence: 0,
    match_reason: 'none',
  },
}

function stubSuccessfulSubmission() {
  let requestBody: unknown

  server.use(
    http.post('*/api/v1/affected-areas', async ({ request }) => {
      requestBody = await request.json()
      return HttpResponse.json(createdAffectedAreaResponse, {
        status: 201,
      })
    }),
  )

  return () => requestBody
}

describe('ReportFloodPage', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
    vi.stubEnv('VITE_DISASTER_REF_ID', DISASTER_REF_ID)
    stubSuccessfulGeolocation()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()

    if (originalGeolocation) {
      Object.defineProperty(navigator, 'geolocation', originalGeolocation)
    } else {
      Reflect.deleteProperty(navigator, 'geolocation')
    }
  })

  it('shows the mobile progress with location as the current step', () => {
    renderFlowPage()

    const progress = screen.getByRole('navigation', { name: 'Report progress' })

    expect(within(progress).getByText('Location')).toBeInTheDocument()
    expect(within(progress).getByText('Situation')).toBeInTheDocument()
    expect(within(progress).getByText('Photos')).toBeInTheDocument()
    expect(within(progress).getByText('Review')).toBeInTheDocument()

    expect(
      within(progress).getByText('Location').closest('li'),
    ).toHaveAttribute('aria-current', 'step')
    expect(
      within(progress).getByText('Situation').closest('li'),
    ).not.toHaveAttribute('aria-current')
  })

  it('asks where the flooding is and how to share location', () => {
    renderFlowPage()

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Where is the flooding?',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Choose any ONE method to share location — whichever is easiest for you right now.',
      ),
    ).toBeInTheDocument()
  })

  it('selects the device GPS method and shows the one-tap action', () => {
    renderFlowPage()

    expect(screen.getByRole('radio', { name: 'Device' })).toBeChecked()
    expect(screen.getByText('Any 1 method required')).toBeInTheDocument()
    expect(screen.getByText('Only 1 needed to proceed')).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: 'Acquire GPS Location (1 Tap)',
      }),
    ).toBeInTheDocument()
  })

  it('captures GPS coordinates and shows them in review', async () => {
    stubSuccessfulGeolocation()
    renderFlowPage()

    await userEvent.click(
      screen.getByRole('button', {
        name: 'Acquire GPS Location (1 Tap)',
      }),
    )

    expect(await screen.findByText('Location captured')).toBeInTheDocument()
    expect(screen.getByText(/26\.75090° N/)).toBeInTheDocument()
    expect(screen.getByText(/94\.20370° E/)).toBeInTheDocument()
    expect(screen.getByText('Accuracy: 8 m')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Device' })).toBeChecked()

    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    await userEvent.click(screen.getByRole('radio', { name: 'Urgent' }))
    await userEvent.click(
      screen.getByRole('button', { name: 'Next: Attach photos' }),
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Next: Review report' }),
    )

    expect(screen.getByText(/26\.75090° N/)).toBeInTheDocument()
    expect(screen.getByText(/Accuracy: 8 m/)).toBeInTheDocument()
  })

  it('shows a localized GPS permission error', async () => {
    stubGeolocation((_success, error) => {
      error?.({ code: 1 } as GeolocationPositionError)
    })
    renderFlowPage()

    await userEvent.click(
      screen.getByRole('button', {
        name: 'Acquire GPS Location (1 Tap)',
      }),
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Location permission was denied',
    )
  })

  it('requires a captured location before advancing', async () => {
    renderFlowPage()

    await userEvent.click(screen.getByRole('button', { name: 'Next' }))

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Where is the flooding?',
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Capture or select a location to continue.',
    )

    await captureGps()

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Next' }))

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'What is the situation?',
      }),
    ).toBeInTheDocument()
  })

  it('marks unfinished search and map methods as unavailable', async () => {
    renderFlowPage()

    const deviceRadio = screen.getByRole('radio', { name: 'Device' })
    const searchRadio = screen.getByRole('radio', {
      name: 'Search Village or Landmark',
    })
    const mapRadio = screen.getByRole('radio', { name: 'Tap to Pin on Map' })

    expect(deviceRadio).toBeChecked()
    expect(deviceRadio).toBeEnabled()
    expect(searchRadio).toBeDisabled()
    expect(mapRadio).toBeDisabled()
    expect(screen.getAllByText('Not available yet')).toHaveLength(2)

    await userEvent.click(screen.getByText('Search Village or Landmark'))
    await userEvent.click(screen.getByText('Tap to Pin on Map'))

    expect(deviceRadio).toBeChecked()
    expect(searchRadio).not.toBeChecked()
    expect(mapRadio).not.toBeChecked()
  })

  it('shows the mobile local-save note and next action', () => {
    renderFlowPage()

    expect(
      screen.queryByRole('complementary', {
        name: 'Emergency and privacy guidance',
      }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByText(
        'Your answers are kept while you complete this report',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Next' }),
    ).toBeInTheDocument()
  })

  it('moves between the location and situation steps in one route', async () => {
    renderFlowPage()

    await captureGps()
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'What is the situation?',
      }),
    ).toBeInTheDocument()

    const progress = screen.getByRole('navigation', { name: 'Report progress' })

    expect(within(progress).getByText(/Completed:/)).toBeInTheDocument()
    expect(
      within(progress).getByText('Situation').closest('li'),
    ).toHaveAttribute('aria-current', 'step')

    await userEvent.click(
      screen.getByRole('button', { name: 'Back to location' }),
    )

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Where is the flooding?',
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Device' })).toBeChecked()
  })

  it('blocks the situation step until severity is selected', async () => {
    renderFlowPage()

    await captureGps()
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    await userEvent.click(
      screen.getByRole('button', { name: 'Next: Attach photos' }),
    )

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'What is the situation?',
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Select a severity level to continue.',
    )

    await userEvent.click(screen.getByRole('radio', { name: 'Not sure' }))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: 'Next: Attach photos' }),
    )

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Show us what you see',
      }),
    ).toBeInTheDocument()
  })

  it('keeps the selected severity when moving between steps', async () => {
    renderFlowPage()

    await captureGps()
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))

    expect(
      screen.getByRole('group', { name: /Severity level/ }),
    ).toBeInTheDocument()

    const criticalRadio = screen.getByRole('radio', { name: 'Critical' })

    expect(criticalRadio).not.toBeChecked()

    await userEvent.click(criticalRadio)

    expect(criticalRadio).toBeChecked()

    await userEvent.click(
      screen.getByRole('button', { name: 'Back to location' }),
    )
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))

    expect(screen.getByRole('radio', { name: 'Critical' })).toBeChecked()
  })

  it('keeps additional details when moving between steps', async () => {
    renderFlowPage()

    await captureGps()
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))

    const details = screen.getByRole('textbox', {
      name: 'Additional details',
    })

    await userEvent.type(details, 'Family stranded near the school')

    expect(details).toHaveValue('Family stranded near the school')
    expect(
      screen.getByRole('button', { name: 'Next: Attach photos' }),
    ).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: 'Back to location' }),
    )
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))

    expect(
      screen.getByRole('textbox', { name: 'Additional details' }),
    ).toHaveValue('Family stranded near the school')
  })

  it('moves through the photos and review steps', async () => {
    renderFlowPage()

    await captureGps()
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    await userEvent.click(screen.getByRole('radio', { name: 'Urgent' }))
    await userEvent.click(
      screen.getByRole('button', { name: 'Next: Attach photos' }),
    )

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Show us what you see',
      }),
    ).toBeInTheDocument()

    const photosProgress = screen.getByRole('navigation', {
      name: 'Report progress',
    })

    expect(
      within(photosProgress).getByText('Photos').closest('li'),
    ).toHaveAttribute('aria-current', 'step')
    expect(
      screen.getByRole('button', { name: 'Skip, no photos right now' }),
    ).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: 'Next: Review report' }),
    )

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Review and submit',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Location' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Situation' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Photos' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Edit Location' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Edit Situation' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Edit Photos' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Submit report' }),
    ).toBeInTheDocument()
    expect(screen.getByText('No photos attached.')).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: 'Back to photos' }),
    )

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Show us what you see',
      }),
    ).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: 'Skip, no photos right now' }),
    )

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Review and submit',
      }),
    ).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: 'Back to photos' }),
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Back to situation' }),
    )

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'What is the situation?',
      }),
    ).toBeInTheDocument()
  })

  it('opens a review section for editing', async () => {
    renderFlowPage()

    await captureGps()
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    await userEvent.click(screen.getByRole('radio', { name: 'Urgent' }))
    await userEvent.click(
      screen.getByRole('button', { name: 'Next: Attach photos' }),
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Next: Review report' }),
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Edit Situation' }),
    )

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'What is the situation?',
      }),
    ).toBeInTheDocument()
  })

  it('stores optional reporter contact details on review', async () => {
    renderFlowPage()

    await captureGps()
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    await userEvent.click(screen.getByRole('radio', { name: 'Urgent' }))
    await userEvent.click(
      screen.getByRole('button', { name: 'Next: Attach photos' }),
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Next: Review report' }),
    )

    const nameInput = screen.getByRole('textbox', { name: 'Full name' })
    const mobileInput = screen.getByRole('textbox', {
      name: 'Mobile number',
    })

    await userEvent.type(nameInput, 'Anjali Das')
    await userEvent.type(mobileInput, '৯৮০০০০০০১২')

    expect(nameInput).toHaveValue('Anjali Das')
    expect(mobileInput).toHaveValue('9800000012')

    await userEvent.click(
      screen.getByRole('button', { name: 'Back to photos' }),
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Next: Review report' }),
    )

    expect(
      screen.getByRole('textbox', { name: 'Full name' }),
    ).toHaveValue('Anjali Das')
    expect(
      screen.getByRole('textbox', { name: 'Mobile number' }),
    ).toHaveValue('9800000012')
  })

  it('shows the desktop location methods with unfinished options disabled', async () => {
    renderDesktopFlowPage()

    const breadcrumb = screen.getByRole('navigation', { name: 'Breadcrumb' })

    expect(
      within(breadcrumb).getByRole('link', { name: 'Home' }),
    ).toHaveAttribute('href', '/en')
    expect(within(breadcrumb).getByText('Citizen Services')).toBeInTheDocument()
    expect(
      within(breadcrumb).getByText('Report Flooded Area'),
    ).toHaveAttribute('aria-current', 'page')

    expect(screen.getByText('Step 1')).toBeInTheDocument()
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument()
    expect(screen.getByText('Estimated time: 90 seconds')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Where is the flooding?',
      }),
    ).toBeInTheDocument()

    const deviceRadio = screen.getByRole('radio', {
      name: 'Device GPS Satellite',
    })
    const searchRadio = screen.getByRole('radio', {
      name: 'Search Village, Landmark, or Revenue Circle',
    })
    const mapRadio = screen.getByRole('radio', {
      name: 'Tap or Pin on Interactive Flood Map',
    })

    expect(deviceRadio).toBeChecked()
    expect(screen.getByText('Fastest & most accurate')).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: 'Acquire GPS Location (1 Tap)',
      }),
    ).toBeInTheDocument()

    const searchbox = screen.getByRole('searchbox', {
      name: 'Search Village, Landmark, or Revenue Circle',
    })

    expect(searchbox).toBeDisabled()
    expect(searchRadio).toBeDisabled()
    expect(mapRadio).toBeDisabled()
    expect(screen.getAllByText('Not available yet')).toHaveLength(2)
    expect(
      screen.getByRole('button', {
        name: 'Voice input is not available yet.',
      }),
    ).toBeDisabled()
    expect(
      screen.getByRole('img', { name: 'Flood map preview' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Expand Fullscreen Map' }),
    ).toBeDisabled()

    expect(
      screen.getByText(
        'Your answers are kept on this device while you complete this report',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Draft · Not submitted'),
    ).toBeInTheDocument()
    expect(screen.queryByText('#AS-26-TEMP')).not.toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Back to Citizen Home' }),
    ).toHaveAttribute('href', '/en')
    expect(
      screen.getByRole('button', { name: 'Next: Situation details' }),
    ).toBeInTheDocument()

    const support = screen.getByRole('complementary', {
      name: 'Emergency and privacy guidance',
    })

    expect(
      within(support).getByRole('heading', {
        name: 'Life Threatening Situation?',
      }),
    ).toBeInTheDocument()
    expect(
      within(support).getByRole('link', {
        name: /State Emergency Operations/,
      }),
    ).toHaveAttribute('href', 'tel:1070')
    expect(
      within(support).getByRole('link', {
        name: /District Disaster Cell/,
      }),
    ).toHaveAttribute('href', 'tel:1077')
    expect(
      within(support).getByText(
        'Toll-free direct lines available 24/7 in all local languages',
      ),
    ).toBeInTheDocument()
    expect(
      within(support).getByRole('heading', {
        name: 'Privacy & Data Masking',
      }),
    ).toBeInTheDocument()
    expect(
      within(support).getByText('ASDMA Disaster Protocol Compliant'),
    ).toBeInTheDocument()
    expect(
      within(support).getByRole('heading', {
        name: 'Cellular Tower Blackouts',
      }),
    ).toBeInTheDocument()

    await captureGps()

    await userEvent.click(
      screen.getByRole('button', { name: 'Next: Situation details' }),
    )

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'What is the situation?',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Step 2')).toBeInTheDocument()
    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument()

    const situationProgress = screen.getByRole('region', {
      name: 'Report progress',
    })

    expect(
      within(situationProgress).getByText(/Completed:/),
    ).toBeInTheDocument()
    expect(
      within(situationProgress).getByText('Situation').closest('li'),
    ).toHaveAttribute('aria-current', 'step')

    const severityGroup = screen.getByRole('group', {
      name: /Severity level/,
    })
    const urgentRadio = within(severityGroup).getByRole('radio', {
      name: 'Urgent',
    })

    expect(urgentRadio).not.toBeChecked()

    await userEvent.click(urgentRadio)

    expect(urgentRadio).toBeChecked()
    expect(
      screen.getByRole('textbox', { name: 'Additional details' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: 'Voice input is not available yet.',
      }),
    ).toBeDisabled()
    expect(
      screen.getByRole('button', { name: 'Next: Attach photos' }),
    ).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: 'Back to location' }),
    )

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Where is the flooding?',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Step 1')).toBeInTheDocument()
    expect(
      screen.getByRole('radio', {
        name: 'Device GPS Satellite',
      }),
    ).toBeChecked()
  })

  it('shows the desktop photos and review frames', async () => {
    renderDesktopFlowPage()

    await captureGps()
    await userEvent.click(
      screen.getByRole('button', { name: 'Next: Situation details' }),
    )
    await userEvent.click(screen.getByRole('radio', { name: 'Urgent' }))
    await userEvent.click(
      screen.getByRole('button', { name: 'Next: Attach photos' }),
    )

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Show us what you see',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Step 3')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Skip, no photos right now' }),
    ).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: 'Next: Review report' }),
    )

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Review and submit',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Step 4')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Location' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Edit Photos' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Submit report' }),
    ).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: 'Back to photos' }),
    )

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Show us what you see',
      }),
    ).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: 'Back to situation' }),
    )

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'What is the situation?',
      }),
    ).toBeInTheDocument()
  })

  it('submits the report and shows the submitted screen', async () => {
    const getRequestBody = stubSuccessfulSubmission()

    renderFlowPage()
    await reachReviewStep()

    await userEvent.click(
      screen.getByRole('button', { name: 'Submit report' }),
    )

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Report submitted',
      }),
    ).toHaveFocus()
    expect(
      screen.getByText('3f2a9c1e-7b4d-4e2a-9c1e-5d6f7a8b9c0d'),
    ).toBeInTheDocument()
    expect(screen.getByText('Under verification')).toBeInTheDocument()
    expect(screen.getByText('In progress')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Done' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Report another area' }),
    ).toBeInTheDocument()

    expect(getRequestBody()).toEqual({
      disaster_ref_id: DISASTER_REF_ID,
      location: {
        source: 'gps',
        latitude: 26.7509,
        longitude: 94.2037,
      },
      severity: 'high',
    })
  })

  it('returns home from the submitted screen', async () => {
    stubSuccessfulSubmission()

    renderFlowPage()
    await reachReviewStep()
    await userEvent.click(
      screen.getByRole('button', { name: 'Submit report' }),
    )
    await userEvent.click(
      await screen.findByRole('button', { name: 'Done' }),
    )

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent(/^\/en$/)
    })
  })

  it('starts a new report from the submitted screen', async () => {
    stubSuccessfulSubmission()

    renderFlowPage()
    await reachReviewStep()
    await userEvent.click(
      screen.getByRole('button', { name: 'Submit report' }),
    )
    await userEvent.click(
      await screen.findByRole('button', {
        name: 'Report another area',
      }),
    )

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Where is the flooding?',
      }),
    ).toBeInTheDocument()
    expect(
      screen.queryByText('3f2a9c1e-7b4d-4e2a-9c1e-5d6f7a8b9c0d'),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Location captured')).not.toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Device' })).toBeChecked()
  })

  it('shows a localized error when submission fails', async () => {
    server.use(
      http.post('*/api/v1/affected-areas', () =>
        HttpResponse.json(
          {
            error: {
              code: 'internal_error',
              message: 'internal server error',
            },
          },
          { status: 500 },
        ),
      ),
    )

    renderFlowPage()
    await reachReviewStep()

    await userEvent.click(
      screen.getByRole('button', { name: 'Submit report' }),
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The server encountered an error. Please try again later.',
    )
    expect(screen.getByTestId('location')).toHaveTextContent(
      '/en/report-flood',
    )
    expect(
      screen.getByRole('button', { name: 'Submit report' }),
    ).toBeEnabled()
  })

  it('blocks submission when the reporter mobile is incomplete', async () => {
    let requestCount = 0

    server.use(
      http.post('*/api/v1/affected-areas', () => {
        requestCount += 1
        return HttpResponse.json(createdAffectedAreaResponse, {
          status: 201,
        })
      }),
    )

    renderFlowPage()
    await reachReviewStep()

    await userEvent.type(
      screen.getByRole('textbox', { name: 'Mobile number' }),
      '12345',
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Submit report' }),
    )

    expect(
      screen.getByText('Enter a valid 10-digit mobile number.'),
    ).toBeInTheDocument()
    expect(requestCount).toBe(0)
  })
})
