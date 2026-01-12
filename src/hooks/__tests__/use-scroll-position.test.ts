/**
 * Unit tests for useScrollPosition hook
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useScrollPosition } from '../use-scroll-position'

describe('useScrollPosition', () => {
  beforeEach(() => {
    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return 0 initially', () => {
    const { result } = renderHook(() => useScrollPosition())
    expect(result.current).toBe(0)
  })

  it('should update when scrollY changes', () => {
    const { result } = renderHook(() => useScrollPosition())

    act(() => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 100,
      })
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(100)
  })

  it('should update multiple times', () => {
    const { result } = renderHook(() => useScrollPosition())

    act(() => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 200,
      })
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(200)

    act(() => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 300,
      })
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(300)
  })
})
