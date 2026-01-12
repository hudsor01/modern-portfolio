/**
 * Unit tests for useInView hook
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useInView } from '../use-in-view'
import { useRef } from 'react'

describe('useInView', () => {
  let observeMock: ReturnType<typeof vi.fn>
  let disconnectMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    observeMock = vi.fn()
    disconnectMock = vi.fn()

    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: observeMock,
      disconnect: disconnectMock,
      unobserve: vi.fn(),
      root: null,
      rootMargin: '',
      thresholds: []
    }))
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
    renderHook(({ elementRef }) => useInView(elementRef), {
      initialProps: { elementRef: { current: document.createElement('div') } }
    })

    expect(observeMock).toHaveBeenCalled()
  })

  it('should support once option', () => {
    renderHook(
      ({ elementRef }) => useInView(elementRef, { once: true }),
      {
        initialProps: { elementRef: { current: document.createElement('div') } }
      }
    )

    expect(observeMock).toHaveBeenCalled()
  })
})
