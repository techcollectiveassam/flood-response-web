import { act, renderHook } from '@/testing/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLiveTimer } from './use-live-timer'

describe('useLiveTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns and updates the current timestamp', () => {
    const { result } = renderHook(() => useLiveTimer(1000))

    expect(result.current).toBe(Date.now())

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current).toBe(Date.now())
  })

  it('clears the interval on unmount', () => {
    const { unmount } = renderHook(() => useLiveTimer(1000))

    unmount()

    expect(vi.getTimerCount()).toBe(0)
  })
})
