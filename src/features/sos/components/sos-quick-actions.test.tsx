import { beforeEach, describe, expect, it } from 'vitest'
import { renderWithProviders, screen } from '@/testing/test-utils'
import { i18n } from '@/lib/i18n/i18n'
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

  it('renders the mobile report, relief, and SOS actions', () => {
    renderWithProviders(<SosQuickActionsMobile />)

    expectQuickActions()
  })

  it('renders the desktop report, relief, and SOS actions', () => {
    renderWithProviders(<SosQuickActionsDesktop />)

    expectQuickActions()
  })
})
