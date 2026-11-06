import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders, screen } from '@/testing/test-utils'
import { ReloadPrompt } from './reload-prompt'

const mocks = vi.hoisted(() => ({
  updateServiceWorker: vi.fn(),
  useRegisterSW: vi.fn(),
}))

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: mocks.useRegisterSW,
}))

function setRegisterState({
  needRefresh = false,
  offlineReady = false,
}: {
  needRefresh?: boolean
  offlineReady?: boolean
}) {
  mocks.useRegisterSW.mockReturnValue({
    needRefresh: [needRefresh, vi.fn()],
    offlineReady: [offlineReady, vi.fn()],
    updateServiceWorker: mocks.updateServiceWorker,
  })
}

describe('ReloadPrompt', () => {
  beforeEach(() => {
    mocks.updateServiceWorker.mockReset()
    mocks.useRegisterSW.mockReset()
  })

  it('shows the offline-ready message', () => {
    setRegisterState({ offlineReady: true })

    renderWithProviders(<ReloadPrompt />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Ready to work offline.',
    )
  })

  it('shows the update prompt when a refresh is needed', () => {
    setRegisterState({ needRefresh: true })

    renderWithProviders(<ReloadPrompt />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'A new version is available.',
    )
    expect(
      screen.getByRole('button', { name: 'Reload' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Dismiss' }),
    ).toBeInTheDocument()
  })

  it('reloads the service worker when Reload is clicked', async () => {
    setRegisterState({ needRefresh: true })

    renderWithProviders(<ReloadPrompt />)
    await userEvent.click(screen.getByRole('button', { name: 'Reload' }))

    expect(mocks.updateServiceWorker).toHaveBeenCalledWith(true)
  })
})
