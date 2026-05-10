// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMediaQuery } from '@/hooks/use-media-query'

type Listener = (event: MediaQueryListEvent) => void

function installMatchMediaMock(initialMatches: Record<string, boolean>) {
  const queryToListeners = new Map<string, Set<Listener>>()
  const matchesByQuery: Record<string, boolean> = { ...initialMatches }

  function dispatch(query: string, matches: boolean) {
    matchesByQuery[query] = matches
    for (const listener of queryToListeners.get(query) ?? []) {
      listener({ matches } as MediaQueryListEvent)
    }
  }

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => {
      let listeners = queryToListeners.get(query)
      if (!listeners) {
        listeners = new Set()
        queryToListeners.set(query, listeners)
      }
      return {
        matches: matchesByQuery[query] ?? false,
        media: query,
        onchange: null,
        addEventListener: (_event: 'change', cb: Listener) => listeners!.add(cb),
        removeEventListener: (_event: 'change', cb: Listener) => listeners!.delete(cb),
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => true,
      }
    },
  })

  return { dispatch }
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('useMediaQuery', () => {
  it('returns the matching state from window.matchMedia', () => {
    installMatchMediaMock({ '(min-width: 768px)': true })
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(true)
  })

  it('returns false when query does not match', () => {
    installMatchMediaMock({ '(min-width: 1200px)': false })
    const { result } = renderHook(() => useMediaQuery('(min-width: 1200px)'))
    expect(result.current).toBe(false)
  })

  it('updates when matchMedia change event fires', () => {
    const { dispatch } = installMatchMediaMock({ '(min-width: 768px)': false })
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(false)

    act(() => {
      dispatch('(min-width: 768px)', true)
    })
    expect(result.current).toBe(true)
  })

  it('removes the listener on unmount', () => {
    const removeSpy = vi.fn()
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: () => ({
        matches: false,
        media: '',
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: removeSpy,
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => true,
      }),
    })
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    unmount()
    expect(removeSpy).toHaveBeenCalled()
  })
})
