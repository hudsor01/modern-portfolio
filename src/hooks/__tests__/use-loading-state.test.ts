// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLoadingState } from '@/hooks/use-loading-state'

// useLoadingState's `initialDelay` is typed as the literal `1000` (the
// default `TIMING.LOADING_STATE_RESET` is `as const`). Tests use the
// default to keep the type contract clean — advance timers > 1000ms to
// observe the loading→idle transition.

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useLoadingState', () => {
  it('starts in loading=true', () => {
    const { result } = renderHook(() => useLoadingState())
    expect(result.current.isLoading).toBe(true)
  })

  it('flips to loading=false after the initial delay (1000ms)', () => {
    const { result } = renderHook(() => useLoadingState())
    act(() => {
      vi.advanceTimersByTime(1100)
    })
    expect(result.current.isLoading).toBe(false)
  })

  it('handleRefresh toggles loading back to true and clears after delay', () => {
    const { result } = renderHook(() => useLoadingState())
    act(() => {
      vi.advanceTimersByTime(1100)
    })
    expect(result.current.isLoading).toBe(false)

    act(() => {
      result.current.handleRefresh()
    })
    expect(result.current.isLoading).toBe(true)

    act(() => {
      vi.advanceTimersByTime(1100)
    })
    expect(result.current.isLoading).toBe(false)
  })

  it('cleanup on unmount does not throw when timer fires after', () => {
    const { unmount } = renderHook(() => useLoadingState())
    unmount()
    expect(() => vi.advanceTimersByTime(1500)).not.toThrow()
  })

  it('exposes setIsLoading for external control', () => {
    const { result } = renderHook(() => useLoadingState())
    act(() => {
      vi.advanceTimersByTime(1100)
    })
    expect(result.current.isLoading).toBe(false)
    act(() => {
      result.current.setIsLoading(true)
    })
    expect(result.current.isLoading).toBe(true)
  })
})
