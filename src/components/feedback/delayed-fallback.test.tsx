import { act, renderWithProviders, screen } from '@/testing/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DelayedFallback } from './delayed-fallback'

describe('DelayedFallback', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows a loading status after the supplied delay', () => {
    renderWithProviders(<DelayedFallback delay={200} />)

    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Loading')).toBeInTheDocument()
  })
})
