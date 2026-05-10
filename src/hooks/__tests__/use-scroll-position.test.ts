// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useScrollPosition } from '@/hooks/use-scroll-position'

describe('useScrollPosition', () => {
  it('reflects window.scrollY at first render', () => {
    Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 0 })
    const { result } = renderHook(() => useScrollPosition())
    expect(result.current).toBe(0)
  })

  it('updates on scroll events', () => {
    Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 0 })
    const { result } = renderHook(() => useScrollPosition())

    act(() => {
      Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 250 })
      window.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toBe(250)

    act(() => {
      Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 100 })
      window.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toBe(100)
  })
})
