// @vitest-environment node
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Guard for UI-09: every project chart card heads with `ChartHeader`. A
 * `typography-h*` utility on an h2-h4 inside src/app/projects means a card
 * header drifted back to the old 12px-uppercase style. The three
 * StrategicImpact callouts are not chart cards and are the only allowlist.
 */
const ROOT = process.cwd()
const PROJECTS = join(ROOT, 'src/app/projects')

const ALLOWLIST = [
  'src/app/projects/customer-lifetime-value/_components/StrategicImpact.tsx',
  'src/app/projects/multi-channel-attribution/_components/StrategicImpact.tsx',
  'src/app/projects/revenue-operations-center/_components/StrategicImpact.tsx',
]

function walk(dir: string): string[] {
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    if (name === '__tests__') continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else if (p.endsWith('.tsx')) out.push(p)
  }
  return out
}

/**
 * An h2-h4 opening tag whose attributes mention `typography-h*` anywhere: plain
 * strings, `cn(...)`, template literals, and tags spread over several lines
 * (`[^>]` matches newlines).
 */
const HEADING_TYPOGRAPHY = /<h[2-4]\b[^>]*typography-h[1-6]/

describe('HEADING_TYPOGRAPHY detector', () => {
  const bad = [
    '<h3 className="typography-h4 mb-2">',
    '<h3\n  className="mb-2 typography-h4"\n>',
    '<h2 className={cn(\'mb-2\', "typography-h3")}>',
    '<h4 className={`mb-2 typography-h5`}>',
  ]
  const good = ['<h3 className="text-lg font-semibold">', '<p className="typography-h3">']
  for (const src of bad)
    it(`flags ${JSON.stringify(src)}`, () => expect(HEADING_TYPOGRAPHY.test(src)).toBe(true))
  for (const src of good)
    it(`allows ${JSON.stringify(src)}`, () => expect(HEADING_TYPOGRAPHY.test(src)).toBe(false))
})

describe('project chart header style', () => {
  const rels = walk(PROJECTS).map((f) => relative(ROOT, f))

  it('allowlisted StrategicImpact files exist', () => {
    for (const rel of ALLOWLIST) expect(rels).toContain(rel)
  })

  it('has no typography-h* heading outside the StrategicImpact allowlist', () => {
    const offenders = rels
      .filter((rel) => !ALLOWLIST.includes(rel))
      .filter((rel) => HEADING_TYPOGRAPHY.test(readFileSync(join(ROOT, rel), 'utf8')))
    expect(offenders).toEqual([])
  })

  it('every recharts file in a project page is headed by ChartHeader', () => {
    // A chart file passes if it renders a wrapper itself, or if every file that
    // imports it (static or `dynamic(() => import(...))`) does. ChartWrapper is
    // ChartContainer under another name (lazy-charts.tsx), and ChartContainer
    // renders ChartHeader.
    const lazyCharts = readFileSync(join(ROOT, 'src/components/charts/lazy-charts.tsx'), 'utf8')
    expect(lazyCharts).toContain(
      "import { ChartContainer as ChartCard } from '@/components/ui/chart-container'"
    )
    expect(lazyCharts).toMatch(/export function ChartWrapper[\s\S]*<ChartCard\b/)
    const container = readFileSync(join(ROOT, 'src/components/ui/chart-container.tsx'), 'utf8')
    expect(container).toMatch(/<ChartHeader\b/)

    const WRAPS = /<(ChartHeader|ChartContainer|ChartWrapper)\b/
    const sources = new Map(rels.map((rel) => [rel, readFileSync(join(ROOT, rel), 'utf8')]))
    const importersOf = (rel: string) => {
      const base = rel.replace(/^.*\//, '').replace(/\.tsx$/, '')
      const dir = rel.replace(/\/[^/]+$/, '')
      return rels.filter((other) => {
        if (other === rel || !other.startsWith(`${dir}/`)) return false
        return new RegExp(`(from\\s+|import\\(\\s*)['"]\\./${base}['"]`).test(
          sources.get(other) ?? ''
        )
      })
    }
    const charts = rels.filter((rel) => /from ['"]recharts['"]/.test(sources.get(rel) ?? ''))
    expect(charts.length).toBeGreaterThan(20)
    const unheaded = charts.filter((rel) => {
      if (WRAPS.test(sources.get(rel) ?? '')) return false
      const importers = importersOf(rel)
      return importers.length === 0 || !importers.every((i) => WRAPS.test(sources.get(i) ?? ''))
    })
    expect(unheaded).toEqual([])
  })

  it('revenue-kpi charts do not use CardTitle', () => {
    const offenders = rels
      .filter((rel) => rel.includes('revenue-kpi/_components/'))
      .filter((rel) => readFileSync(join(ROOT, rel), 'utf8').includes('CardTitle'))
    expect(offenders).toEqual([])
  })
})
