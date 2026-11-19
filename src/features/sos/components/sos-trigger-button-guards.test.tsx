import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PERMISSION_DENIED_ERROR_CODE } from '@/lib/api-error'
import { i18n } from '@/lib/i18n/i18n'
import { renderWithProviders, screen } from '@/testing/test-utils'
import { SosTriggerButton } from './sos-trigger-button'

const mocks = vi.hoisted(() => {
  const createMutation = () => ({
    mutate: vi.fn(),
    reset: vi.fn(),
    isPending: false,
    isError: false,
    error: null as unknown,
    isSuccess: false,
    data: undefined as unknown,
  })

  return {
    gps: createMutation(),
    mobile: createMutation(),
    callCount: 0,
    permission: 'prompt' as 'prompt' | 'denied' | 'granted' | 'unknown',
  }
})

vi.mock('../hooks/use-geolocation-permission', () => ({
  useGeolocationPermission: () => mocks.permission,
}))

vi.mock('../api/create-sos-request', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../api/create-sos-request')>()

  return {
    ...actual,
    useCreateSosRequest: () => {
      mocks.callCount += 1
      const mutation = mocks.callCount % 2 === 1 ? mocks.gps : mocks.mobile
      return mutation as unknown as ReturnType<
        typeof actual.useCreateSosRequest
      >
    },
  }
})

function resetMutation(mutation: typeof mocks.gps) {
  mutation.mutate.mockReset()
  mutation.reset.mockReset()
  mutation.isPending = false
  mutation.isError = false
  mutation.error = null
  mutation.isSuccess = false
  mutation.data = undefined
}

function showLocationError() {
  mocks.gps.isError = true
  mocks.gps.error = { code: PERMISSION_DENIED_ERROR_CODE }
}

describe('SosTriggerButton submission guards', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
    mocks.callCount = 0
    mocks.permission = 'prompt'
    resetMutation(mocks.gps)
    resetMutation(mocks.mobile)
  })

  it('blocks both paths while the mobile request is pending', () => {
    showLocationError()
    mocks.mobile.isPending = true

    renderWithProviders(<SosTriggerButton />)

    expect(
      screen.getByRole('button', { name: 'Send immediate SOS alert' }),
    ).toBeDisabled()
    expect(screen.getByLabelText('Mobile number')).toBeDisabled()
    expect(
      screen.getByRole('button', { name: /Send SOS|Loading/ }),
    ).toBeDisabled()
  })

  it('blocks both paths while the GPS request is pending', () => {
    showLocationError()
    mocks.gps.isPending = true

    renderWithProviders(<SosTriggerButton />)

    expect(
      screen.getByRole('button', { name: 'Send immediate SOS alert' }),
    ).toBeDisabled()
    expect(screen.getByLabelText('Mobile number')).toBeDisabled()
    expect(
      screen.getByRole('button', { name: /Send SOS|Loading/ }),
    ).toBeDisabled()
  })

  it('restores both controls after a successful mobile request', () => {
    showLocationError()
    mocks.mobile.isPending = true

    const { rerender } = renderWithProviders(<SosTriggerButton />)

    expect(screen.getByLabelText('Mobile number')).toBeDisabled()

    mocks.mobile.isPending = false
    mocks.mobile.isSuccess = true
    rerender(<SosTriggerButton />)

    expect(screen.getByLabelText('Mobile number')).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Send SOS' })).toBeEnabled()
    expect(
      screen.getByRole('button', { name: 'Send immediate SOS alert' }),
    ).toBeEnabled()
  })

  it('restores both controls after a failed mobile request', () => {
    showLocationError()
    mocks.mobile.isPending = true

    const { rerender } = renderWithProviders(<SosTriggerButton />)

    expect(screen.getByLabelText('Mobile number')).toBeDisabled()

    mocks.mobile.isPending = false
    mocks.mobile.isError = true
    mocks.mobile.error = new Error('boom')
    rerender(<SosTriggerButton />)

    expect(screen.getByLabelText('Mobile number')).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Send SOS' })).toBeEnabled()
    expect(
      screen.getByRole('button', { name: 'Send immediate SOS alert' }),
    ).toBeEnabled()
    expect(
      screen.getByText('Something went wrong. Please try again.'),
    ).toBeInTheDocument()
  })
})
