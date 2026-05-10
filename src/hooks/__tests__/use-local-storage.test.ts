// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { z } from 'zod'

vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  },
}))

import { useLocalStorage, useSessionStorage } from '@/hooks/use-local-storage'

// Vitest 4's jsdom environment exposes localStorage as a getter rather than the
// MDN Storage API; install minimal in-memory shims so test isolation is reliable.
function installStorageShim(propName: 'localStorage' | 'sessionStorage') {
  const store = new Map<string, string>()
  Object.defineProperty(window, propName, {
    configurable: true,
    value: {
      getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
      setItem: (key: string, value: string) => {
        store.set(key, String(value))
      },
      removeItem: (key: string) => store.delete(key),
      clear: () => store.clear(),
      key: (i: number) => Array.from(store.keys())[i] ?? null,
      get length() {
        return store.size
      },
    },
  })
}

beforeEach(() => {
  installStorageShim('localStorage')
  installStorageShim('sessionStorage')
})

describe('useLocalStorage', () => {
  it('returns the initial value when key is absent', () => {
    const { result } = renderHook(() => useLocalStorage('absent', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('reads and parses pre-existing JSON value from localStorage', () => {
    window.localStorage.setItem('preset', JSON.stringify({ a: 1 }))
    const { result } = renderHook(() => useLocalStorage('preset', { a: 0 }))
    expect(result.current[0]).toEqual({ a: 1 })
  })

  it('persists a new value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('persist-me', 0))
    act(() => {
      result.current[1](42)
    })
    expect(JSON.parse(window.localStorage.getItem('persist-me')!)).toBe(42)
  })

  it('supports updater function form', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0))
    act(() => {
      result.current[1]((prev) => prev + 5)
    })
    expect(result.current[0]).toBe(5)
  })

  it('falls back to initial value when stored JSON is malformed', () => {
    window.localStorage.setItem('bad', '{not json')
    const { result } = renderHook(() => useLocalStorage('bad', 'fallback'))
    expect(result.current[0]).toBe('fallback')
  })

  it('falls back to initial value when stored value fails Zod validation', () => {
    window.localStorage.setItem('typed', JSON.stringify({ x: 'should-be-number' }))
    const schema = z.object({ x: z.number() })
    const { result } = renderHook(() => useLocalStorage('typed', { x: 0 }, schema))
    expect(result.current[0]).toEqual({ x: 0 })
  })
})

describe('useSessionStorage', () => {
  it('writes to sessionStorage (not localStorage)', () => {
    const { result } = renderHook(() => useSessionStorage('s-key', 0))
    act(() => {
      result.current[1](7)
    })
    expect(window.sessionStorage.getItem('s-key')).toBe('7')
    expect(window.localStorage.getItem('s-key')).toBeNull()
  })
})
