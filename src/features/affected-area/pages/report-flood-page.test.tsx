import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  renderWithProviders,
  screen,
  within,
} from '@/testing/test-utils'
import { i18n } from '@/lib/i18n/i18n'
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

function renderFlowPage() {
  return renderWithProviders(
    <ReportDraftProvider>
      <ReportFloodPage />
    </ReportDraftProvider>,
  )
}

function renderDesktopFlowPage() {
  stubDesktopViewport()

  return renderWithProviders(
    <MemoryRouter initialEntries={['/en/report-flood']}>
      <ReportDraftProvider>
        <ReportFloodPage />
      </ReportDraftProvider>
    </MemoryRouter>,
  )
}

describe('ReportFloodPage', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
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

  it('switches between the device, search, and map methods', async () => {
    renderFlowPage()

    const deviceRadio = screen.getByRole('radio', { name: 'Device' })
    const searchRadio = screen.getByRole('radio', {
      name: 'Search Village or Landmark',
    })
    const mapRadio = screen.getByRole('radio', { name: 'Tap to Pin on Map' })

    expect(deviceRadio).toBeChecked()
    expect(searchRadio).not.toBeChecked()
    expect(mapRadio).not.toBeChecked()

    await userEvent.click(screen.getByText('Search Village or Landmark'))

    expect(searchRadio).toBeChecked()
    expect(deviceRadio).not.toBeChecked()
    expect(mapRadio).not.toBeChecked()

    await userEvent.click(screen.getByText('Tap to Pin on Map'))

    expect(mapRadio).toBeChecked()
    expect(deviceRadio).not.toBeChecked()
    expect(searchRadio).not.toBeChecked()
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

    await userEvent.click(screen.getByText('Tap to Pin on Map'))
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
    expect(
      screen.getByRole('radio', { name: 'Tap to Pin on Map' }),
    ).toBeChecked()
  })

  it('keeps the selected severity when moving between steps', async () => {
    renderFlowPage()

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

    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
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

    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
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

  it('shows and switches the desktop location methods', async () => {
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

    expect(searchbox).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Search by voice' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'Flood map preview' }),
    ).toBeInTheDocument()

    await userEvent.click(searchRadio)

    expect(searchRadio).toBeChecked()
    expect(deviceRadio).not.toBeChecked()

    await userEvent.click(mapRadio)

    expect(mapRadio).toBeChecked()
    expect(searchRadio).not.toBeChecked()

    await userEvent.click(searchbox)

    expect(searchRadio).toBeChecked()

    await userEvent.type(searchbox, 'Kamalabari')

    expect(searchbox).toHaveValue('Kamalabari')

    await userEvent.click(
      screen.getByRole('button', { name: 'Expand Fullscreen Map' }),
    )

    expect(mapRadio).toBeChecked()

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
        name: 'Dictate additional details',
      }),
    ).toBeInTheDocument()
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
        name: 'Tap or Pin on Interactive Flood Map',
      }),
    ).toBeChecked()
    expect(
      screen.getByRole('searchbox', {
        name: 'Search Village, Landmark, or Revenue Circle',
      }),
    ).toHaveValue('Kamalabari')
  })

  it('shows the desktop photos and review frames', async () => {
    renderDesktopFlowPage()

    await userEvent.click(
      screen.getByRole('button', { name: 'Next: Situation details' }),
    )
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
})
