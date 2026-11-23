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

const HEADING_TYPOGRAPHY = /<h[2-4][^>]*className="[^"]*typography-h[1-6]/

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

  it('revenue-kpi charts do not use CardTitle', () => {
    const offenders = rels
      .filter((rel) => rel.includes('revenue-kpi/_components/'))
      .filter((rel) => readFileSync(join(ROOT, rel), 'utf8').includes('CardTitle'))
    expect(offenders).toEqual([])
  })
})
