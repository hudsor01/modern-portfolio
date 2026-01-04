import { describe, it, expect } from 'bun:test'
import { renderHook, waitFor } from '@testing-library/react'
import { useDebounce } from '../use-debounce'

// Helper to wait for a specific duration
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

describe('useDebounce', () => {
  // Use short delays for testing (real timers)
  const SHORT_DELAY = 50

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', SHORT_DELAY))
    expect(result.current).toBe('initial')
  })

  it('should debounce value updates', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: SHORT_DELAY } }
    )

    // Initial value
    expect(result.current).toBe('initial')

    // Update value
    rerender({ value: 'updated', delay: SHORT_DELAY })

    // Value should not change immediately
    expect(result.current).toBe('initial')

    // Wait for debounce to complete
    await waitFor(() => {
      expect(result.current).toBe('updated')
    }, { timeout: SHORT_DELAY * 3 })
  })

  it('should reset timer on rapid value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: SHORT_DELAY } }
    )

    // Rapid updates - each update should reset the timer
    rerender({ value: 'b', delay: SHORT_DELAY })
    await wait(20) // Wait less than debounce delay

    rerender({ value: 'c', delay: SHORT_DELAY })
    await wait(20)

    rerender({ value: 'd', delay: SHORT_DELAY })

    // Still showing initial value because timer keeps resetting
    expect(result.current).toBe('a')

    // After full delay from last change
    await waitFor(() => {
      expect(result.current).toBe('d')
    }, { timeout: SHORT_DELAY * 3 })
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

  it('should handle delay changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'test', delay: SHORT_DELAY } }
    )

    // Change delay
    rerender({ value: 'new', delay: SHORT_DELAY })

    await waitFor(() => {
      expect(result.current).toBe('new')
    }, { timeout: SHORT_DELAY * 3 })
  })
})
