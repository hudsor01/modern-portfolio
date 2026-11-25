// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

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

vi.mock('@/components/ui/number-ticker', () => ({
  NumberTicker: () => <span data-testid="number-ticker" />,
}))
vi.mock('@/components/about/animated-counter', () => ({
  AnimatedCounter: ({ value }: { value: string }) => <span>{value}</span>,
}))

import HomePageContent from '@/components/layout/home-page-content'
import { ProjectStats } from '@/components/projects/project-stats'
import { ProjectCTASection } from '@/components/projects/project-cta-section'
import { ExperienceStats } from '@/components/about/experience-stats'
import { STAT_LABELS, STAT_VALUES, type StatKey } from '@/lib/stats'
import type { Project } from '@/types/project'

const KEYS = Object.keys(STAT_LABELS) as StatKey[]

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

const aboutStats = (['revenue', 'transaction-growth', 'network-growth', 'years'] as StatKey[]).map(
  (k) => ({ statKey: k, label: STAT_LABELS[k], value: STAT_VALUES[k], icon: 'star' })
)

/**
 * Every stat in `expected` must render exactly once (value and label), every
 * other stat zero times, and each label must be the canonical copy. A stat that
 * disappears, or a label that loses its data-stat-label hook, fails here.
 */
function assertCanonical(container: HTMLElement, expected: StatKey[]) {
  for (const k of KEYS) {
    const count = expected.includes(k) ? 1 : 0
    const values = container.querySelectorAll(`[data-stat="${k}"]`)
    expect(values.length, `data-stat=${k}`).toBe(count)
    const labels = container.querySelectorAll(`[data-stat-label="${k}"]`)
    expect(labels.length, `data-stat-label=${k}`).toBe(count)
    if (count === 1) expect(labels[0]?.textContent?.trim()).toBe(STAT_LABELS[k])
  }
}

const HOME_STATS: StatKey[] = ['revenue', 'transaction-growth', 'network-growth', 'years']
const PROJECTS_STATS: StatKey[] = ['revenue', 'transaction-growth', 'network-growth']

afterEach(cleanup)

describe('stat single-use guard', () => {
  it('home renders each of its stats exactly once with canonical labels', () => {
    const { container } = render(<HomePageContent featuredProjects={featured} />)
    assertCanonical(container, HOME_STATS)
  })

  it('/projects composition renders each of its stats exactly once; CTA adds none', () => {
    const { container } = render(
      <>
        <ProjectStats totalProjects={14} />
        <ProjectCTASection />
      </>
    )
    assertCanonical(container, PROJECTS_STATS)
    const cta = render(<ProjectCTASection />)
    expect(cta.container.querySelectorAll('[data-stat]').length).toBe(0)
  })

  it('/about ExperienceStats renders each stat exactly once', () => {
    const { container } = render(<ExperienceStats stats={aboutStats} />)
    assertCanonical(container, KEYS)
  })

  it('source guard (not rendered): contact-client.tsx declares exactly one revenue stat', () => {
    const src = readFileSync(join(process.cwd(), 'src/app/contact/contact-client.tsx'), 'utf8')
    expect(src.match(/data-stat="/g)?.length).toBe(1)
    expect(src.match(/data-stat="revenue"/g)?.length).toBe(1)
    expect(src.match(/data-stat-label="/g)?.length).toBe(1)
    expect(src.match(/data-stat-label="revenue"/g)?.length).toBe(1)
  })
})
