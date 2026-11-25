// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/components/ui/chart-container', () => ({ ChartContainer: () => null }))
vi.mock('@/components/ui/chart', () => ({
  ChartContainer: () => null,
  ChartTooltip: () => null,
  ChartTooltipContent: () => null,
}))
vi.mock('@/components/charts/lazy-charts', () => ({
  LazyBarChart: () => null,
  LazyPieChart: () => null,
}))

import { tierColor } from '../PartnerGroupPieChart'
import { wrapLabel } from '../TopPartnersChart'

const DIR = join(process.cwd(), 'src/app/projects/revenue-kpi/_components')
const read = (f: string) => readFileSync(join(DIR, f), 'utf8')

describe('A-4: one chart header style', () => {
  it.each(['RevenueLineChart.tsx', 'TransactionVolumeChart.tsx'])(
    '%s uses the subtitle, not a bottom caption',
    (f) => {
      expect(read(f)).not.toMatch(/\bcaption=/)
      expect(read(f)).toMatch(/\bdescription=/)
    }
  )
  it('cards sharing a grid row use the same box size', () => {
    const size = (f: string) => [...read(f).matchAll(/size="(\w+)"\n\s+headingLevel/g)].pop()?.[1]
    expect(size('RevenueBarChart.tsx')).toBe('md') // beside RevenueLineChart (md)
    expect(size('TopPartnersChart.tsx')).toBe('md') // beside PartnerGroupPieChart (md)
    expect(size('PartnerGroupPieChart.tsx')).toBe('md')
  })
})

describe('A-3: quarterly axis', () => {
  it('uses an evenly spaced tick interval, not preserveStartEnd', () => {
    const src = read('RevenueBarChart.tsx')
    expect(src).toContain('equidistantPreserveStart')
    expect(src).not.toContain('preserveStartEnd"')
  })
})

describe('A-5: partner labels are never truncated', () => {
  it('wraps long names onto two lines without losing words', () => {
    expect(wrapLabel('Global Systems Partners')).toEqual(['Global Systems', 'Partners'])
    expect(wrapLabel('Enterprise Solutions').join(' ')).toBe('Enterprise Solutions')
    expect(wrapLabel('Acme')).toEqual(['Acme'])
  })
  it('no longer slices names or reserves a double left gutter', () => {
    const src = read('TopPartnersChart.tsx')
    expect(src).not.toContain('slice(0, 15)')
    expect(src).not.toContain('left: 100')
  })
})

describe('A-6: donut', () => {
  it('colours tiers by meaning and falls back by index', () => {
    expect(tierColor('Gold', 0)).not.toBe(tierColor('Silver', 1))
    expect(tierColor('gold', 0)).toBe(tierColor('GOLD', 3))
    expect(tierColor('Unknown', 0)).toBeTruthy()
  })
  it('uses a legend instead of clipped outside labels', () => {
    const src = read('PartnerGroupPieChart.tsx')
    expect(src).toContain('<Legend')
    expect(src).not.toContain('labelLine')
  })
})
