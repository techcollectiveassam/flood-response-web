import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders, screen } from '@/testing/test-utils'
import { i18n } from '@/lib/i18n/i18n'
import { SosQuickActions } from './sos-quick-actions'
import { SosQuickActionsDesktop } from './sos-quick-actions-desktop'
import { SosQuickActionsMobile } from './sos-quick-actions-mobile'

function expectQuickActions() {
  expect(
    screen.getByRole('link', { name: /Report flooded area/i }),
  ).toHaveAttribute('href', '#')
  expect(screen.getByText('Share real-time data')).toBeInTheDocument()

  expect(
    screen.getByRole('link', { name: /Request relief/i }),
  ).toHaveAttribute('href', '#')
  expect(screen.getByText('Food, water, or medicine')).toBeInTheDocument()

  expect(
    screen.getByRole('button', { name: 'Send immediate SOS alert' }),
  ).toBeInTheDocument()
  expect(screen.getByText('SOS')).toBeInTheDocument()
  expect(screen.getByText('Tap to alert')).toBeInTheDocument()
}

describe('SosQuickActions', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the mobile report, relief, and SOS actions', () => {
    renderWithProviders(<SosQuickActionsMobile />)

    expectQuickActions()
  })

  it('renders the desktop report, relief, and SOS actions', () => {
    renderWithProviders(<SosQuickActionsDesktop />)

    expectQuickActions()

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Assam Floods 2026 Emergency Coordination',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Immediate Distress Dispatch',
      }),
    ).toBeInTheDocument()

    expect(screen.getByText('Active Relief Ops')).toBeInTheDocument()
    expect(screen.getByText('Verified Relief Depots')).toBeInTheDocument()
    expect(screen.getByText('18,420+')).toBeInTheDocument()
    expect(screen.getByText('68%')).toBeInTheDocument()

    expect(screen.getByText('No account needed')).toBeInTheDocument()
    expect(screen.getByText('Instant GPS Geo-Lock')).toBeInTheDocument()
    expect(screen.getByText('Low-Bandwidth SMS Fallback')).toBeInTheDocument()
  })

  it('selects the desktop layout on desktop viewports', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: true,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    )

    renderWithProviders(<SosQuickActions />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Assam Floods 2026 Emergency Coordination',
      }),
    ).toBeInTheDocument()
  })
})
