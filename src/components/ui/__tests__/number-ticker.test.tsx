// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { NumberTicker } from '../number-ticker'

// Stub IntersectionObserver — motion's useInView calls into it.
class IOStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
;(globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
  (globalThis as unknown as { IntersectionObserver?: unknown }).IntersectionObserver ?? IOStub

describe('NumberTicker', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders the startValue (default 0) on initial mount', () => {
    const { container } = render(<NumberTicker value={1000} />)
    const span = container.querySelector('span')
    expect(span).toBeTruthy()
    expect(span?.textContent).toBe('0')
  })

  it('honors a custom startValue', () => {
    const { container } = render(<NumberTicker value={1000} startValue={500} />)
    const span = container.querySelector('span')
    expect(span?.textContent).toBe('500')
  })

  it('forwards a className', () => {
    const { container } = render(<NumberTicker value={1} className="my-extra-class" />)
    const span = container.querySelector('span')
    expect(span?.className).toContain('my-extra-class')
    // Default classes still applied
    expect(span?.className).toContain('tabular-nums')
  })

  it('renders as a <span> element', () => {
    const { container } = render(<NumberTicker value={42} />)
    expect(container.querySelector('span')).toBeTruthy()
  })

  it('forwards arbitrary HTML span props (data-* etc.)', () => {
    const { container } = render(
      <NumberTicker value={42} data-testid="ticker" aria-label="metric" />
    )
    const span = container.querySelector('span[data-testid="ticker"]')
    expect(span).toBeTruthy()
    expect(span?.getAttribute('aria-label')).toBe('metric')
  })

  it('accepts the decimalPlaces prop without throwing', () => {
    const { container } = render(<NumberTicker value={4.8} decimalPlaces={1} />)
    expect(container.querySelector('span')).toBeTruthy()
  })

  it('accepts direction="down"', () => {
    const { container } = render(<NumberTicker value={100} startValue={0} direction="down" />)
    expect(container.querySelector('span')).toBeTruthy()
  })
})
