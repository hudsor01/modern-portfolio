// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, cleanup, act } from '@testing-library/react'
import { AnimatedCounter } from '../animated-counter'

// Stub IntersectionObserver and capture the callback so tests can fire visibility.
type EntryCb = (entries: { isIntersecting: boolean }[]) => void
const observers: { cb: EntryCb }[] = []

class IOStub {
  cb: EntryCb
  constructor(cb: EntryCb) {
    this.cb = cb
    observers.push(this)
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

beforeEach(() => {
  cleanup()
  observers.length = 0
  ;(globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IOStub
  vi.useFakeTimers()
  // requestAnimationFrame in jsdom isn't tied to fake timers — replace it.
  vi.stubGlobal('requestAnimationFrame', (cb: (t: number) => void) => {
    return setTimeout(() => cb(performance.now()), 16) as unknown as number
  })
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

function fireInView() {
  for (const obs of observers) {
    act(() => obs.cb([{ isIntersecting: true }]))
  }
}

describe('AnimatedCounter', () => {
  it('initially renders the literal value (before in-view triggers animation)', () => {
    const { container } = render(<AnimatedCounter value="$3.7M+" />)
    const span = container.querySelector('span')
    expect(span?.textContent).toBe('$3.7M+')
  })

  it('forwards a custom className', () => {
    const { container } = render(<AnimatedCounter value="100%" className="my-counter" />)
    const span = container.querySelector('span')
    expect(span?.className).toBe('my-counter')
  })

  it('switches to "0" pattern as soon as in-view fires for currency format', () => {
    const { container } = render(<AnimatedCounter value="$3.7M+" duration={50} />)
    fireInView()
    // After in-view, animateNumber sets initial value to "$0.0M+"
    const span = container.querySelector('span')
    expect(span?.textContent).toBe('$0.0M+')
  })

  it('switches to "0%" pattern as soon as in-view fires for percentage format', () => {
    const { container } = render(<AnimatedCounter value="432%" duration={50} />)
    fireInView()
    const span = container.querySelector('span')
    expect(span?.textContent).toBe('0%')
  })

  it('switches to "0+" pattern as soon as in-view fires for simple number format', () => {
    const { container } = render(<AnimatedCounter value="8+" duration={50} />)
    fireInView()
    const span = container.querySelector('span')
    expect(span?.textContent).toBe('0+')
  })

  it('animation eventually reaches the target value', async () => {
    const { container } = render(<AnimatedCounter value="100%" duration={20} />)
    fireInView()
    // Drive enough fake-timer ticks for the rAF chain to converge
    await act(async () => {
      vi.advanceTimersByTime(500)
    })
    const span = container.querySelector('span')
    expect(span?.textContent).toBe('100%')
  })

  it('does not crash on a value with no parseable number', () => {
    const { container } = render(<AnimatedCounter value="N/A" />)
    fireInView()
    const span = container.querySelector('span')
    // Falls through all branches, leaves displayValue at original
    expect(span?.textContent).toBe('N/A')
  })
})
