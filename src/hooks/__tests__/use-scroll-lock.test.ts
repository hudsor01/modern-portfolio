// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { renderHook, cleanup } from '@testing-library/react'
import { useScrollLock } from '@/hooks/use-scroll-lock'

const root = () => document.documentElement

describe('useScrollLock', () => {
  afterEach(() => {
    cleanup()
    root().style.overflow = ''
  })

  it('leaves html overflow untouched while unlocked', () => {
    renderHook(({ locked }) => useScrollLock(locked), { initialProps: { locked: false } })
    expect(root().style.overflow).toBe('')
  })

  it('sets overflow hidden when locked', () => {
    const { rerender } = renderHook(({ locked }) => useScrollLock(locked), {
      initialProps: { locked: false },
    })
    rerender({ locked: true })
    expect(root().style.overflow).toBe('hidden')
  })

  it('restores overflow when unlocked', () => {
    const { rerender } = renderHook(({ locked }) => useScrollLock(locked), {
      initialProps: { locked: true },
    })
    expect(root().style.overflow).toBe('hidden')
    rerender({ locked: false })
    expect(root().style.overflow).toBe('')
  })

  it('restores overflow when unmounted while locked', () => {
    const { unmount } = renderHook(() => useScrollLock(true))
    expect(root().style.overflow).toBe('hidden')
    unmount()
    expect(root().style.overflow).toBe('')
  })

  it('restores the previous inline value captured at lock time', () => {
    root().style.overflow = 'scroll'
    const { rerender } = renderHook(({ locked }) => useScrollLock(locked), {
      initialProps: { locked: false },
    })
    rerender({ locked: true })
    expect(root().style.overflow).toBe('hidden')
    rerender({ locked: false })
    expect(root().style.overflow).toBe('scroll')
  })
})
