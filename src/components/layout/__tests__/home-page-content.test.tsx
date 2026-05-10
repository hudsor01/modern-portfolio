// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

// Stub next/navigation (Navbar uses usePathname)
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Stub IntersectionObserver — NumberTicker uses motion's useInView under the
// hood, which expects this global.
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

// Spy on NumberTicker so we can assert the ImpactMetric renders it
// unconditionally and forwards the `delay` / `value` / `decimalPlaces` props.
// (regression: audit fix #3 — counters were stuck on 0 because the component
// was gated behind a mounted check; the fix renders NumberTicker always and
// lets it manage its own animation lifecycle.)
const numberTickerSpy = vi.fn()
vi.mock('@/components/ui/number-ticker', () => ({
  NumberTicker: (props: Record<string, unknown>) => {
    numberTickerSpy(props)
    return <span data-testid="number-ticker" data-value={String(props.value)} />
  },
}))

import HomePageContent from '../home-page-content'

describe('HomePageContent — ImpactMetric (regression #3)', () => {
  beforeEach(() => {
    cleanup()
    numberTickerSpy.mockClear()
  })

  it('renders 4 NumberTicker instances unconditionally — one per ImpactMetric', () => {
    render(<HomePageContent />)
    const tickers = screen.getAllByTestId('number-ticker')
    expect(tickers.length).toBe(4)
  })

  it('forwards the correct value to each NumberTicker', () => {
    render(<HomePageContent />)
    const values = numberTickerSpy.mock.calls.map((call) => (call[0] as { value: number }).value)
    expect(values).toEqual(expect.arrayContaining([4.8, 432, 2217, 10]))
  })

  it('forwards the delay prop (staggered animation: 0, 0.1, 0.2, 0.3)', () => {
    render(<HomePageContent />)
    const delays = numberTickerSpy.mock.calls.map((call) => (call[0] as { delay: number }).delay)
    expect(delays).toEqual(expect.arrayContaining([0, 0.1, 0.2, 0.3]))
  })

  it('forwards decimalPlaces=1 for the $4.8M revenue metric', () => {
    render(<HomePageContent />)
    const revenueCall = numberTickerSpy.mock.calls.find(
      (call) => (call[0] as { value: number }).value === 4.8
    )
    expect(revenueCall).toBeTruthy()
    expect((revenueCall![0] as { decimalPlaces?: number }).decimalPlaces).toBe(1)
  })

  it('renders the "Proven Results" section heading', () => {
    render(<HomePageContent />)
    expect(screen.getByText('Proven Results')).toBeTruthy()
  })

  it('does NOT show a "0" stuck-state — value is forwarded directly to NumberTicker', () => {
    render(<HomePageContent />)
    // Each ticker rendered with its target value via data-value attribute,
    // proving the component is not gated behind a mounted check that would
    // otherwise leave it on the initial 0.
    const tickers = screen.getAllByTestId('number-ticker')
    const dataValues = tickers.map((t) => t.getAttribute('data-value'))
    expect(dataValues.every((v) => v !== '0' && v !== null)).toBe(true)
  })
})
