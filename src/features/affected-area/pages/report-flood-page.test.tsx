import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  renderWithProviders,
  screen,
  within,
} from '@/testing/test-utils'
import { i18n } from '@/lib/i18n/i18n'
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

describe('ReportFloodPage', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the mobile progress with location as the current step', () => {
    renderWithProviders(<ReportFloodPage />)

    const progress = screen.getByRole('navigation', { name: 'Report progress' })

    expect(within(progress).getByText('1. Location')).toBeInTheDocument()
    expect(within(progress).getByText('2. Situation')).toBeInTheDocument()
    expect(within(progress).getByText('3. Photos')).toBeInTheDocument()
    expect(within(progress).getByText('4. Review')).toBeInTheDocument()

    expect(
      within(progress).getByText('1. Location').closest('li'),
    ).toHaveAttribute('aria-current', 'step')
    expect(
      within(progress).getByText('2. Situation').closest('li'),
    ).not.toHaveAttribute('aria-current')
  })

  it('asks where the flooding is and how to share location', () => {
    renderWithProviders(<ReportFloodPage />)

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
    renderWithProviders(<ReportFloodPage />)

    expect(screen.getByRole('radio', { name: 'Device' })).toBeChecked()
    expect(screen.getByText('Any 1 method required')).toBeInTheDocument()
    expect(screen.getByText('Only 1 needed to proceed')).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: 'Acquire GPS Location (1 Tap)',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Works offline with cached satellite • Accuracy ~5-15m',
      ),
    ).toBeInTheDocument()
  })

  it('switches between the device, search, and map methods', async () => {
    renderWithProviders(<ReportFloodPage />)

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
    renderWithProviders(<ReportFloodPage />)

    expect(
      screen.queryByRole('complementary', {
        name: 'Emergency and privacy guidance',
      }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByText(
        'Saved securely on local storage • Zero connection needed',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Next' }),
    ).toBeInTheDocument()
  })

  it('shows and switches the desktop location methods', async () => {
    stubDesktopViewport()

    renderWithProviders(
      <MemoryRouter initialEntries={['/en/report-flood']}>
        <ReportFloodPage />
      </MemoryRouter>,
    )

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
        'Saved securely on local device storage • Zero data connection needed to submit',
      ),
    ).toBeInTheDocument()
    expect(screen.getByText(/Incident ref:/)).toBeInTheDocument()
    expect(screen.getByText('#AS-26-TEMP')).toBeInTheDocument()
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
  })
})
