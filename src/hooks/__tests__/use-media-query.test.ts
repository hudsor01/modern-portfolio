import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMediaQuery } from '../use-media-query'

describe('useMediaQuery', () => {
  let mockMatchMedia: ReturnType<typeof vi.fn>
  let listeners: Map<string, Set<(e: MediaQueryListEvent) => void>>

  beforeEach(() => {
    listeners = new Map()

    mockMatchMedia = vi.fn((query: string) => {
      const queryListeners = new Set<(e: MediaQueryListEvent) => void>()
      listeners.set(query, queryListeners)

      return {
        matches: query.includes('min-width: 768px') ? false : true,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn((_, handler) => {
          queryListeners.add(handler)
        }),
        removeEventListener: vi.fn((_, handler) => {
          queryListeners.delete(handler)
        }),
        dispatchEvent: vi.fn()
      }
    })

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return initial match state', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(false)
  })

  it('should return true for matching query', () => {
    // Update mock to return true for this specific query
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }))

    const { result } = renderHook(() => useMediaQuery('(max-width: 640px)'))
    expect(result.current).toBe(true)
  })

  it('should call matchMedia with the provided query', () => {
    renderHook(() => useMediaQuery('(prefers-color-scheme: dark)'))
    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
  })

  it('should add and remove event listener', () => {
    const addEventListenerSpy = vi.fn()
    const removeEventListenerSpy = vi.fn()

    mockMatchMedia.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: addEventListenerSpy,
      removeEventListener: removeEventListenerSpy
    }))

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 1024px)'))

    expect(addEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function))

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should update when media query changes', () => {
    let currentMatches = false
    let changeHandler: ((e: MediaQueryListEvent) => void) | null = null

    mockMatchMedia.mockImplementation((query: string) => ({
      matches: currentMatches,
      media: query,
      addEventListener: vi.fn((_, handler) => {
        changeHandler = handler
      }),
      removeEventListener: vi.fn()
    }))

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(false)

    // Simulate media query change
    currentMatches = true
    act(() => {
      changeHandler?.({ matches: true } as MediaQueryListEvent)
    })

    expect(result.current).toBe(true)
  })

  it('should re-subscribe when query changes', () => {
    const { rerender } = renderHook(
      ({ query }) => useMediaQuery(query),
      { initialProps: { query: '(min-width: 640px)' } }
    )

    expect(mockMatchMedia).toHaveBeenCalledTimes(1)
    expect(mockMatchMedia).toHaveBeenLastCalledWith('(min-width: 640px)')

    rerender({ query: '(min-width: 1024px)' })

    expect(mockMatchMedia).toHaveBeenCalledTimes(2)
    expect(mockMatchMedia).toHaveBeenLastCalledWith('(min-width: 1024px)')
  })
})
