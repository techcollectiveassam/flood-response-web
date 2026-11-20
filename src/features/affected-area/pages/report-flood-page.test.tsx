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

  it('shows the desktop breadcrumb, step count, and progress layout', () => {
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
  })
})
