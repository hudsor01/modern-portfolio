// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '@/hooks/use-debounce'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useDebounce', () => {
  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 200))
    expect(result.current).toBe('initial')
  })

  it('does not update before the delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 200),
      { initialProps: { value: 'a' } }
    )
    rerender({ value: 'b' })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toBe('a')
  })

  it('updates after the delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 200),
      { initialProps: { value: 'a' } }
    )
    rerender({ value: 'b' })
    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(result.current).toBe('b')
  })

  it('resets the timer on rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 200),
      { initialProps: { value: 'a' } }
    )
    rerender({ value: 'b' })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    rerender({ value: 'c' })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    // Only 100ms since 'c' was set — still 'a'
    expect(result.current).toBe('a')
    act(() => {
      vi.advanceTimersByTime(150)
    })
    // Now 250ms since 'c' — debounced
    expect(result.current).toBe('c')
  })

  it('cancels timer on unmount (no leaked update)', () => {
    const { unmount } = renderHook(({ value }: { value: string }) => useDebounce(value, 200), {
      initialProps: { value: 'a' },
    })
    unmount()
    // No throw when timer would have fired
    expect(() => vi.advanceTimersByTime(500)).not.toThrow()
  })
})
