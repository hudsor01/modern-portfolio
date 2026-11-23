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
import type { Project } from '@/types/project'

const featured = ['a', 'b', 'c', 'd'].map(
  (k) =>
    ({
      id: `id-${k}`,
      slug: `slug-${k}`,
      title: `Title ${k}`,
      description: `Description ${k}`,
      image: `/images/${k}.jpg`,
      client: `Client ${k}`,
      category: 'RevOps',
      tags: ['X'],
      featured: true,
      displayMetrics: [{ label: `Metric ${k}`, value: `${k}1x`, iconName: 'trending-up' }],
    }) as unknown as Project
)

describe('HomePageContent — ImpactMetric (regression #3)', () => {
  beforeEach(() => {
    cleanup()
    numberTickerSpy.mockClear()
  })

  it('renders 4 NumberTicker instances unconditionally — one per ImpactMetric', () => {
    render(<HomePageContent featuredProjects={featured} />)
    const tickers = screen.getAllByTestId('number-ticker')
    expect(tickers.length).toBe(4)
  })

  it('forwards the correct value to each NumberTicker', () => {
    render(<HomePageContent featuredProjects={featured} />)
    const values = numberTickerSpy.mock.calls.map((call) => (call[0] as { value: number }).value)
    expect(values).toEqual(expect.arrayContaining([4.8, 432, 2217, 10]))
  })

  it('forwards the delay prop (staggered animation: 0, 0.1, 0.2, 0.3)', () => {
    render(<HomePageContent featuredProjects={featured} />)
    const delays = numberTickerSpy.mock.calls.map((call) => (call[0] as { delay: number }).delay)
    expect(delays).toEqual(expect.arrayContaining([0, 0.1, 0.2, 0.3]))
  })

  it('forwards decimalPlaces=1 for the $4.8M revenue metric', () => {
    render(<HomePageContent featuredProjects={featured} />)
    const revenueCall = numberTickerSpy.mock.calls.find(
      (call) => (call[0] as { value: number }).value === 4.8
    )
    expect(revenueCall).toBeTruthy()
    expect((revenueCall![0] as { decimalPlaces?: number }).decimalPlaces).toBe(1)
  })

  it('renders the "Proven Results" section heading', () => {
    render(<HomePageContent featuredProjects={featured} />)
    expect(screen.getByText('Proven Results')).toBeTruthy()
  })

  it('does NOT show a "0" stuck-state — value is forwarded directly to NumberTicker', () => {
    render(<HomePageContent featuredProjects={featured} />)
    // Each ticker rendered with its target value via data-value attribute,
    // proving the component is not gated behind a mounted check that would
    // otherwise leave it on the initial 0.
    const tickers = screen.getAllByTestId('number-ticker')
    const dataValues = tickers.map((t) => t.getAttribute('data-value'))
    expect(dataValues.every((v) => v !== '0' && v !== null)).toBe(true)
  })

  it('styles the running-text mailto link with the shared text-link utility', () => {
    const { container } = render(<HomePageContent featuredProjects={featured} />)
    const link = container.querySelector('p a[href="mailto:hudsor01@icloud.com"]')
    expect(link).not.toBeNull()
    expect(link!.className).toBe('text-link')
  })

  it('renders featured ProjectCards in order under Featured Work', () => {
    const { container } = render(<HomePageContent featuredProjects={featured} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Featured Work' })).toBeTruthy()
    const hrefs = Array.from(container.querySelectorAll('a[href^="/projects/"]')).map((a) =>
      a.getAttribute('href')
    )
    expect(hrefs).toEqual(featured.map((p) => `/projects/${p.slug}`))
    for (const p of featured) {
      expect(screen.getByRole('heading', { level: 3, name: p.title })).toBeTruthy()
    }
  })

  it('renders no Featured Work section when no projects resolve', () => {
    render(<HomePageContent featuredProjects={[]} />)
    expect(screen.queryByText('Featured Work')).toBeNull()
  })

  it('drops the old hardcoded featured copy', () => {
    const { container } = render(<HomePageContent featuredProjects={featured} />)
    expect(container.textContent).not.toContain('improving accuracy by 31%')
  })
})
