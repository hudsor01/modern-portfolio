/**
 * Unit tests for useInView hook
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useInView } from '../use-in-view'
import { useRef } from 'react'

describe('useInView', () => {
  let mockIntersectionObserver: typeof IntersectionObserver

  beforeEach(() => {
    // Mock IntersectionObserver
    mockIntersectionObserver = vi.fn()
    mockIntersectionObserver.prototype.observe = vi.fn()
    mockIntersectionObserver.prototype.disconnect = vi.fn()
    mockIntersectionObserver.prototype.unobserve = vi.fn()

    global.IntersectionObserver = mockIntersectionObserver
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return false initially', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      return useInView(ref)
    })

    expect(result.current).toBe(false)
  })

  it('should observe element when ref is set', () => {
    renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      // Simulate setting the ref
      if (!ref.current) {
        ref.current = document.createElement('div')
      }
      return useInView(ref)
    })

    expect(mockIntersectionObserver.prototype.observe).toHaveBeenCalled()
  })

  it('should support once option', () => {
    renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      if (!ref.current) {
        ref.current = document.createElement('div')
      }
      return useInView(ref, { once: true })
    })

    expect(mockIntersectionObserver.prototype.observe).toHaveBeenCalled()
  })
})
