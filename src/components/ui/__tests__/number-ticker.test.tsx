// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { NumberTicker } from '../number-ticker'

const motion = vi.hoisted(() => ({ reducedMotion: false }))

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>()
  return { ...actual, useReducedMotion: () => motion.reducedMotion }
})

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

/** Pin the ticker's on-screen position, as getBoundingClientRect reports it. */
function placeTickers(top: number) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    top,
    bottom: top + 40,
    left: 0,
    right: 100,
    width: 100,
    height: 40,
    x: 0,
    y: top,
    toJSON: () => ({}),
  } as DOMRect)
}

describe('NumberTicker', () => {
  beforeEach(() => {
    cleanup()
    vi.restoreAllMocks()
    motion.reducedMotion = false
  })

  describe('server render', () => {
    // The regression this guards: SSR used to emit startValue (0), so crawlers,
    // link previews and no-JS visitors saw "$0M+ / 0% / 0% / 0+" on the homepage.
    it('emits the final value, not the start value', () => {
      const html = renderToString(<NumberTicker value={432} />)
      expect(html).toContain('>432</span>')
      expect(html).not.toContain('>0</span>')
    })

    it('formats with grouping and fixed decimals', () => {
      expect(renderToString(<NumberTicker value={2217} />)).toContain('>2,217</span>')
      expect(renderToString(<NumberTicker value={4.8} decimalPlaces={1} />)).toContain(
        '>4.8</span>'
      )
    })

    it('emits startValue as the final value when counting down', () => {
      const html = renderToString(<NumberTicker value={100} startValue={5} direction="down" />)
      expect(html).toContain('>5</span>')
    })
  })

  describe('client render', () => {
    it('keeps the final value for a counter already on screen at mount', () => {
      placeTickers(100)
      const { container } = render(<NumberTicker value={1000} />)
      expect(container.querySelector('span')?.textContent).toBe('1,000')
    })

    it('resets an off-screen counter to the start value, ready to count up', () => {
      placeTickers(5000)
      const { container } = render(<NumberTicker value={1000} startValue={500} />)
      expect(container.querySelector('span')?.textContent).toBe('500')
    })

    it('never animates under prefers-reduced-motion', () => {
      motion.reducedMotion = true
      placeTickers(5000)
      const { container } = render(<NumberTicker value={1000} />)
      expect(container.querySelector('span')?.textContent).toBe('1,000')
    })
  })

  it('forwards a className', () => {
    const { container } = render(<NumberTicker value={1} className="my-extra-class" />)
    const span = container.querySelector('span')
    expect(span?.className).toContain('my-extra-class')
    // Default classes still applied
    expect(span?.className).toContain('tabular-nums')
  })

  it('forwards arbitrary HTML span props (data-* etc.)', () => {
    const { container } = render(
      <NumberTicker value={42} data-testid="ticker" aria-label="metric" />
    )
    const span = container.querySelector('span[data-testid="ticker"]')
    expect(span).toBeTruthy()
    expect(span?.getAttribute('aria-label')).toBe('metric')
  })
})
