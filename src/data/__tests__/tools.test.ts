// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import {
  tools,
  getTool,
  toolTrail,
  trailJsonLdItems,
  TOOLS_HUB_PATH,
  TOOLS_HUB_LAST_UPDATED,
} from '@/data/tools'
import { QUESTIONS, PILLARS, TIERS } from '@/lib/revops-maturity'
import { SITE_ORIGIN } from '@/lib/absolute-url'

const toolsDir = join(process.cwd(), 'src/app/tools')
const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8')

describe('tool catalog', () => {
  it('lists at least two tools with unique slugs, matching hrefs and known icons', () => {
    expect(tools.length).toBeGreaterThanOrEqual(2)
    const slugs = tools.map((t) => t.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const t of tools) {
      expect(t.href).toBe(`/tools/${t.slug}`)
      expect(['Calculator', 'ClipboardCheck']).toContain(t.icon)
    }
  })

  it('matches the routes on disk in both directions', () => {
    for (const t of tools) {
      expect(existsSync(join(toolsDir, t.slug, 'page.tsx'))).toBe(true)
    }
    const onDisk = readdirSync(toolsDir).filter(
      (d) =>
        !d.startsWith('_') &&
        statSync(join(toolsDir, d)).isDirectory() &&
        existsSync(join(toolsDir, d, 'page.tsx'))
    )
    expect(onDisk.sort()).toEqual(tools.map((t) => t.slug).sort())
  })

  it('uses the page h1 as the tool name', () => {
    for (const t of tools) {
      expect(read(`src/app/tools/${t.slug}/page.tsx`)).toContain(`>${t.name}</h1>`)
    }
  })

  it('grounds scorecard copy in the scorecard code', () => {
    const t = getTool('revops-maturity-scorecard')
    expect(t.effort).toBe(`${QUESTIONS.length} statements to rate, about two minutes`)
    expect(read('src/app/tools/revops-maturity-scorecard/page.tsx').toLowerCase()).toContain(
      'two minutes'
    )
    for (const p of PILLARS) expect(t.summary).toContain(p.label.toLowerCase())
    expect(t.outcome).toContain(`1 ${TIERS[0]?.label}`)
    expect(t.outcome).toContain(`${TIERS.length} ${TIERS[TIERS.length - 1]?.label}`)
  })

  it('grounds calculator copy in the calculator code', () => {
    const src = read(
      'src/app/tools/pipeline-coverage-calculator/_components/pipeline-coverage-calculator.tsx'
    )
    const inputs = (src.match(/useState\(/g) ?? []).length
    expect(inputs).toBe(6)
    const t = getTool('pipeline-coverage-calculator')
    expect(t.effort).toBe(`2 inputs to start, ${inputs - 2} optional`)
    expect(t.effort).toBe('2 inputs to start, 4 optional')
    expect(t.summary).toContain('3×')
    expect(t.outcome).toContain('3×')
    expect(t.summary).not.toContain('3x')
    expect(t.outcome).not.toContain('3x')
  })

  it('avoids dropped claims', () => {
    for (const t of tools) {
      const all = `${t.summary} ${t.outcome} ${t.effort}`.toLowerCase()
      for (const w of ['instant', 'signup', 'sign-up']) expect(all).not.toContain(w)
    }
  })

  it('makes no uncited benchmark or percentile claim (TOOL-03)', () => {
    const files = [
      'src/lib/revops-maturity.ts',
      'src/app/tools/revops-maturity-scorecard/page.tsx',
      'src/app/tools/revops-maturity-scorecard/_components/revops-maturity-scorecard.tsx',
      'src/data/tools.ts',
    ]
    const banned = [
      /percentile/i,
      /B2B teams/i,
      /published[^.]*benchmark/i,
      /median team/i,
      /in 10 teams/i,
      /% of teams/i,
    ]
    for (const f of files) {
      const src = read(f)
      for (const re of banned) expect(re.test(src), `${f} matches ${re}`).toBe(false)
    }
    expect(getTool('revops-maturity-scorecard').outcome).not.toMatch(/percentile/i)
  })

  it('has a hub path and an ISO hub date', () => {
    expect(TOOLS_HUB_PATH).toBe('/tools')
    expect(TOOLS_HUB_LAST_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('looks tools up by slug and throws on unknown', () => {
    expect(getTool('revops-maturity-scorecard').name).toBe('RevOps Maturity Scorecard')
    expect(() => getTool('nope')).toThrow()
  })

  it('builds trails and JSON-LD items from one array', () => {
    const t = getTool('revops-maturity-scorecard')
    expect(toolTrail()).toEqual([
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools' },
    ])
    expect(trailJsonLdItems(toolTrail(t))).toEqual([
      { name: 'Home', url: SITE_ORIGIN },
      { name: 'Tools', url: `${SITE_ORIGIN}/tools` },
      { name: t.name, url: `${SITE_ORIGIN}${t.href}` },
    ])
  })
})
