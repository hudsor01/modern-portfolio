// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createRef } from 'react'
import { useInView } from '@/hooks/use-in-view'

type EntryCallback = (entries: { isIntersecting: boolean }[]) => void

function installIntersectionObserverMock() {
  const observers: Array<{
    target: Element | null
    callback: EntryCallback
    disconnected: boolean
  }> = []

  class MockIO {
    callback: EntryCallback
    target: Element | null = null
    disconnected = false
    constructor(callback: EntryCallback) {
      this.callback = callback
      observers.push(this)
    }
    observe(el: Element) {
      this.target = el
    }
    disconnect() {
      this.disconnected = true
    }
    unobserve() {}
    takeRecords() {
      return []
    }
  }
  ;(globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = MockIO

  return {
    fire(isIntersecting: boolean) {
      for (const obs of observers) {
        if (!obs.disconnected) {
          act(() => obs.callback([{ isIntersecting }]))
        }
      }
    },
    observers,
  }
}

let restore: ReturnType<typeof installIntersectionObserverMock>
const orig = (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver

beforeEach(() => {
  restore = installIntersectionObserverMock()
})

afterEach(() => {
  ;(globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = orig
})

describe('useInView', () => {
  it('returns false initially when ref is unattached', () => {
    const ref = createRef<HTMLDivElement>()
    const { result } = renderHook(() => useInView(ref))
    expect(result.current).toBe(false)
  })

  it('returns false initially when ref is attached but element is offscreen', () => {
    const ref = { current: document.createElement('div') } as React.RefObject<HTMLElement>
    const { result } = renderHook(() => useInView(ref))
    expect(result.current).toBe(false)
  })

  it('toggles true when intersection fires', () => {
    const ref = { current: document.createElement('div') } as React.RefObject<HTMLElement>
    const { result } = renderHook(() => useInView(ref))
    restore.fire(true)
    expect(result.current).toBe(true)
  })

  it('toggles back to false when intersection ends (without once)', () => {
    const ref = { current: document.createElement('div') } as React.RefObject<HTMLElement>
    const { result } = renderHook(() => useInView(ref))
    restore.fire(true)
    expect(result.current).toBe(true)
    restore.fire(false)
    expect(result.current).toBe(false)
  })

  it('disconnects observer after first intersection when { once: true }', () => {
    const ref = { current: document.createElement('div') } as React.RefObject<HTMLElement>
    const { result } = renderHook(() => useInView(ref, { once: true }))
    restore.fire(true)
    expect(result.current).toBe(true)
    expect(restore.observers[0]?.disconnected).toBe(true)
    // Subsequent fire should not reset (already disconnected)
    restore.fire(false)
    expect(result.current).toBe(true)
  })

  it('disconnects observer on unmount', () => {
    const ref = { current: document.createElement('div') } as React.RefObject<HTMLElement>
    const { unmount } = renderHook(() => useInView(ref))
    unmount()
    expect(restore.observers.every((o) => o.disconnected)).toBe(true)
  })
})
