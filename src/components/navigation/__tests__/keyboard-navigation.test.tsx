// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  useKeyboardNavigation,
  useFocusManagement,
  useAccessibilityAnnouncer,
  useRovingTabindex,
} from '../keyboard-navigation'

function makeKeyboardEvent(key: string, opts: Partial<KeyboardEventInit> = {}) {
  // React.KeyboardEvent shape — only the bits the hook reads.
  let prevented = false
  let stopped = false
  return {
    key,
    shiftKey: !!opts.shiftKey,
    preventDefault: () => {
      prevented = true
    },
    stopPropagation: () => {
      stopped = true
    },
    get _prevented() {
      return prevented
    },
    get _stopped() {
      return stopped
    },
  } as unknown as React.KeyboardEvent & { _prevented: boolean; _stopped: boolean }
}

function clearBody() {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild)
  }
}

beforeEach(() => {
  clearBody()
})

describe('useKeyboardNavigation', () => {
  it('invokes onEnter when Enter is pressed and prevents default', () => {
    const onEnter = vi.fn()
    const { result } = renderHook(() => useKeyboardNavigation({ onEnter }))
    const e = makeKeyboardEvent('Enter')
    act(() => result.current.handleKeyDown(e))
    expect(onEnter).toHaveBeenCalled()
    expect((e as { _prevented: boolean })._prevented).toBe(true)
  })

  it('invokes onSpace when Space is pressed', () => {
    const onSpace = vi.fn()
    const { result } = renderHook(() => useKeyboardNavigation({ onSpace }))
    act(() => result.current.handleKeyDown(makeKeyboardEvent(' ')))
    expect(onSpace).toHaveBeenCalled()
  })

  it('invokes onEscape on Escape', () => {
    const onEscape = vi.fn()
    const { result } = renderHook(() => useKeyboardNavigation({ onEscape }))
    act(() => result.current.handleKeyDown(makeKeyboardEvent('Escape')))
    expect(onEscape).toHaveBeenCalled()
  })

  it('routes the four arrow keys to their handlers', () => {
    const handlers = {
      onArrowUp: vi.fn(),
      onArrowDown: vi.fn(),
      onArrowLeft: vi.fn(),
      onArrowRight: vi.fn(),
    }
    const { result } = renderHook(() => useKeyboardNavigation(handlers))
    act(() => result.current.handleKeyDown(makeKeyboardEvent('ArrowUp')))
    act(() => result.current.handleKeyDown(makeKeyboardEvent('ArrowDown')))
    act(() => result.current.handleKeyDown(makeKeyboardEvent('ArrowLeft')))
    act(() => result.current.handleKeyDown(makeKeyboardEvent('ArrowRight')))
    expect(handlers.onArrowUp).toHaveBeenCalledTimes(1)
    expect(handlers.onArrowDown).toHaveBeenCalledTimes(1)
    expect(handlers.onArrowLeft).toHaveBeenCalledTimes(1)
    expect(handlers.onArrowRight).toHaveBeenCalledTimes(1)
  })

  it('routes Tab vs Shift+Tab to the right handler', () => {
    const onTab = vi.fn()
    const onShiftTab = vi.fn()
    const { result } = renderHook(() => useKeyboardNavigation({ onTab, onShiftTab }))
    act(() => result.current.handleKeyDown(makeKeyboardEvent('Tab')))
    act(() => result.current.handleKeyDown(makeKeyboardEvent('Tab', { shiftKey: true })))
    expect(onTab).toHaveBeenCalledTimes(1)
    expect(onShiftTab).toHaveBeenCalledTimes(1)
  })

  it('does not call preventDefault when preventDefault=false is configured', () => {
    const onEnter = vi.fn()
    const { result } = renderHook(() => useKeyboardNavigation({ onEnter, preventDefault: false }))
    const e = makeKeyboardEvent('Enter')
    act(() => result.current.handleKeyDown(e))
    expect((e as { _prevented: boolean })._prevented).toBe(false)
  })

  it('calls stopPropagation when stopPropagation=true', () => {
    const onEnter = vi.fn()
    const { result } = renderHook(() => useKeyboardNavigation({ onEnter, stopPropagation: true }))
    const e = makeKeyboardEvent('Enter')
    act(() => result.current.handleKeyDown(e))
    expect((e as { _stopped: boolean })._stopped).toBe(true)
  })

  it('is a no-op when no handlers are configured', () => {
    const { result } = renderHook(() => useKeyboardNavigation({}))
    const e = makeKeyboardEvent('Enter')
    expect(() => act(() => result.current.handleKeyDown(e))).not.toThrow()
  })
})

describe('useAccessibilityAnnouncer', () => {
  it('creates an aria-live region attached to document.body', () => {
    renderHook(() => useAccessibilityAnnouncer({ politeness: 'polite' }))
    const live = document.querySelector('[aria-live="polite"]')
    expect(live).toBeTruthy()
  })

  it('announce() writes textContent into the live region', () => {
    const { result } = renderHook(() => useAccessibilityAnnouncer())
    act(() => result.current.announce('hello world'))
    const live = document.querySelector('[aria-live="polite"]')
    expect(live?.textContent).toBe('hello world')
  })

  it('removes the live region on unmount', () => {
    const { unmount } = renderHook(() => useAccessibilityAnnouncer())
    expect(document.querySelector('[aria-live]')).toBeTruthy()
    unmount()
    expect(document.querySelector('[aria-live]')).toBeNull()
  })
})

describe('useFocusManagement', () => {
  it('exposes containerRef + focusFirst + focusLast', () => {
    const { result } = renderHook(() => useFocusManagement())
    expect(result.current.containerRef).toBeDefined()
    expect(typeof result.current.focusFirst).toBe('function')
    expect(typeof result.current.focusLast).toBe('function')
    expect(typeof result.current.handleKeyDown).toBe('function')
  })
})

describe('useRovingTabindex', () => {
  it('exposes activeIndex starting at defaultIndex', () => {
    const { result } = renderHook(() => useRovingTabindex({ defaultIndex: 2 }))
    expect(result.current.activeIndex).toBe(2)
  })

  it('moveToIndex updates the active index (with looping)', () => {
    const { result } = renderHook(() => useRovingTabindex({ loop: true }))
    // Register two items so moveToIndex has bounds
    const a = document.createElement('button')
    const b = document.createElement('button')
    document.body.appendChild(a)
    document.body.appendChild(b)
    act(() => {
      result.current.registerItem(a, 0)
      result.current.registerItem(b, 1)
    })
    act(() => result.current.moveToIndex(1))
    expect(result.current.activeIndex).toBe(1)
    act(() => result.current.moveToIndex(2)) // loops to 0
    expect(result.current.activeIndex).toBe(0)
  })
})
