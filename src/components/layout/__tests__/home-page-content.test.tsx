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
import { STAT_LABELS, TRANSACTION_GROWTH_CONTEXT, type StatKey } from '@/lib/stats'

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

  it('scopes the hero H1 size with the hero-title class and keeps its copy', () => {
    render(<HomePageContent featuredProjects={featured} />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.className).toContain('hero-title')
    expect(h1.textContent).toContain('Transforming')
    expect(h1.textContent).toContain('Revenue')
    expect(h1.textContent).toContain('Operations')
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

  const keys: StatKey[] = ['revenue', 'transaction-growth', 'network-growth', 'years']

  it('shows each stat once with its canonical label, in order', () => {
    const { container } = render(<HomePageContent featuredProjects={featured} />)
    for (const k of keys) {
      expect(container.querySelectorAll(`[data-stat="${k}"]`).length).toBe(1)
      expect(container.querySelector(`[data-stat-label="${k}"]`)?.textContent).toBe(STAT_LABELS[k])
    }
    const order = Array.from(container.querySelectorAll('[data-stat-label]')).map((e) =>
      e.getAttribute('data-stat-label')
    )
    expect(order).toEqual(keys)
  })

  it('renders the 432% context line exactly once, inside the transaction metric', () => {
    const { container } = render(<HomePageContent featuredProjects={featured} />)
    const matches = screen.getAllByText(TRANSACTION_GROWTH_CONTEXT)
    expect(matches.length).toBe(1)
    const p = matches[0]!
    expect(p.tagName).toBe('P')
    expect(p.className).toBe('text-xs font-normal text-muted-foreground mt-1 max-w-[24ch]')
    const label = container.querySelector('[data-stat-label="transaction-growth"]')
    expect(label?.parentElement?.contains(p)).toBe(true)
  })

  it('hero profile card has no stat tiles', () => {
    render(<HomePageContent featuredProjects={featured} />)
    const card = screen
      .getByRole('heading', { level: 2, name: 'Richard Hudson' })
      .closest('.rounded-3xl')
    expect(card).not.toBeNull()
    expect(card!.textContent).not.toContain('Revenue Impact')
    expect(card!.textContent).not.toMatch(/\$4\.8M|432%|2,217%/)
    expect(screen.getAllByTestId('number-ticker').length).toBe(4)
  })

  it('capability cards and checklist use icons, not dots', () => {
    const { container } = render(<HomePageContent featuredProjects={featured} />)
    for (const title of ['Data-Driven Insights', 'Process Automation', 'System Integration']) {
      const card = screen.getByRole('heading', { level: 3, name: title }).parentElement!
      const svgs = card.querySelectorAll('svg')
      expect(svgs.length).toBe(1)
      expect(svgs[0]?.getAttribute('aria-hidden')).toBe('true')
    }
    const items = Array.from(container.querySelectorAll('ul li'))
    expect(items.length).toBe(4)
    for (const li of items) expect(li.querySelectorAll('svg').length).toBe(1)
    for (const li of items) expect(li.querySelector('span.w-2.h-2.rounded-full')).toBeNull()
  })

  it('stacks hero CTAs full width on mobile', () => {
    const { container } = render(<HomePageContent featuredProjects={featured} />)
    const hero = container.querySelector('main section')!
    const wrapper = hero.querySelector('div.flex.flex-col.sm\\:flex-row')!
    expect(wrapper.className).toContain('sm:flex-wrap')
    expect(wrapper.className).toContain('gap-4')
    const links = wrapper.querySelectorAll('a')
    expect(links.length).toBe(3)
    for (const a of Array.from(links)) expect(a.className).toContain('w-full sm:w-auto')
  })

  it('every non-hero section uses one vertical rhythm', () => {
    const { container } = render(<HomePageContent featuredProjects={featured} />)
    const sections = Array.from(container.querySelectorAll('main > section')).slice(1)
    expect(sections.length).toBeGreaterThan(0)
    for (const sec of sections) {
      const c = sec.className.split(/\s+/)
      expect(c).toContain('py-12')
      expect(c).toContain('lg:py-16')
      for (const bad of ['py-16', 'py-20', 'lg:py-20', 'lg:py-24']) expect(c).not.toContain(bad)
    }
  })
})
