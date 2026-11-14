import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { i18n } from '@/lib/i18n/i18n'
import { renderWithProviders, screen } from '@/testing/test-utils'
import { SosTriggerButton } from './sos-trigger-button'

const originalPermissions = Object.getOwnPropertyDescriptor(
  navigator,
  'permissions',
)

const permissionStatus = {
  state: 'denied' as PermissionState,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}

describe('SosTriggerButton location fallback', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')

    Object.defineProperty(navigator, 'permissions', {
      configurable: true,
      value: {
        query: vi.fn().mockResolvedValue(permissionStatus),
      },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()

    if (originalPermissions) {
      Object.defineProperty(navigator, 'permissions', originalPermissions)
    } else {
      Reflect.deleteProperty(navigator, 'permissions')
    }
  })

  it('shows the mobile fallback when location permission is denied', async () => {
    renderWithProviders(<SosTriggerButton />)

    expect(
      await screen.findByText(/Location is unavailable/i),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Mobile number')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Send SOS' }),
    ).toBeInTheDocument()
  })

  it('validates the mobile number before submitting', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SosTriggerButton />)

    const mobileInput = await screen.findByLabelText('Mobile number')

    await user.type(mobileInput, '123')
    await user.click(screen.getByRole('button', { name: 'Send SOS' }))

    expect(
      await screen.findByText('Enter a valid 10-digit mobile number.'),
    ).toBeInTheDocument()
  })
})
