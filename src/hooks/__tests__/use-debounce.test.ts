import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '../use-debounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('should debounce value updates', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    // Initial value
    expect(result.current).toBe('initial')

    // Update value
    rerender({ value: 'updated', delay: 500 })

    // Value should not change immediately
    expect(result.current).toBe('initial')

    // Advance time by less than delay
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('initial')

    // Advance time past delay
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('updated')
  })

  it('should reset timer on rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 500 } }
    )

    // Rapid updates
    rerender({ value: 'b', delay: 500 })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    rerender({ value: 'c', delay: 500 })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    rerender({ value: 'd', delay: 500 })

    // Still showing initial value because timer keeps resetting
    expect(result.current).toBe('a')

    // After full delay from last change
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(result.current).toBe('d')
  })

  it('should work with different data types', () => {
    // Number
    const { result: numberResult } = renderHook(() => useDebounce(42, 100))
    expect(numberResult.current).toBe(42)

    // Object
    const obj = { foo: 'bar' }
    const { result: objectResult } = renderHook(() => useDebounce(obj, 100))
    expect(objectResult.current).toEqual({ foo: 'bar' })

    // Array
    const arr = [1, 2, 3]
    const { result: arrayResult } = renderHook(() => useDebounce(arr, 100))
    expect(arrayResult.current).toEqual([1, 2, 3])
  })

  it('should handle delay changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'test', delay: 500 } }
    )

    // Change delay
    rerender({ value: 'new', delay: 100 })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current).toBe('new')
  })
})
