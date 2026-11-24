// @vitest-environment node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { projectSlugDirs, renderFormatters, unsourced, words } from './sourcing'

const PROJECTS_DIR = join(process.cwd(), 'src/app/projects')

// ---------------------------------------------------------------- extraction

/** Reads one or more `+`-joined string literals starting at `from`; returns their concatenation. */
function readLiterals(src: string, from: number): string {
  let i = from
  let out = ''
  for (;;) {
    while (i < src.length && /\s/.test(src[i] as string)) i++
    const q = src[i]
    if (q !== "'" && q !== '"' && q !== '`') break
    i++
    while (i < src.length && src[i] !== q) {
      if (src[i] === '\\') i++
      out += src[i]
      i++
    }
    i++
    let j = i
    while (j < src.length && /\s/.test(src[j] as string)) j++
    if (src[j] === '+') i = j + 1
    else break
  }
  return out
}

function genMetaBlock(pageSrc: string): string {
  const start = pageSrc.indexOf('genMeta({')
  return start === -1 ? '' : pageSrc.slice(start, pageSrc.indexOf('\n})', start))
}

function pageDescription(pageSrc: string): string {
  const block = genMetaBlock(pageSrc)
  const at = block.indexOf('description:')
  return at === -1 ? '' : readLiterals(block, at + 'description:'.length)
}

function balanced(src: string, open: number, o: string, c: string): string {
  let depth = 0
  let quote: string | null = null
  for (let i = open; i < src.length; i++) {
    const ch = src[i] as string
    if (quote) {
      if (ch === '\\') i++
      else if (ch === quote) quote = null
      continue
    }
    if (ch === "'" || ch === '"' || ch === '`') quote = ch
    else if (ch === o) depth++
    else if (ch === c && --depth === 0) return src.slice(open, i + 1)
  }
  return src.slice(open)
}

function jsonLdDescription(src: string): string {
  const start = src.indexOf('<ProjectJsonLd')
  if (start === -1) return ''
  const end = src.indexOf('/>', start)
  const tag = src.slice(start, end)
  const at = tag.indexOf('description=')
  if (at === -1) return ''
  const v = at + 'description='.length
  if (tag[v] === '"') return tag.slice(v + 1, tag.indexOf('"', v + 1))
  if (tag[v] === '{') return readLiterals(tag, v + 1)
  return ''
}

function layoutOpeningTag(src: string): string {
  const start = src.indexOf('<ProjectPageLayout')
  if (start === -1) return ''
  let depth = 0
  let quote: string | null = null
  for (let i = start; i < src.length; i++) {
    const ch = src[i] as string
    if (quote) {
      if (ch === '\\') i++
      else if (ch === quote) quote = null
      continue
    }
    if (ch === '"' && depth === 0) quote = '"'
    else if (ch === "'" || ch === '`') quote = ch
    else if (ch === '{') depth++
    else if (ch === '}') depth--
    else if (ch === '>' && depth === 0) return src.slice(start, i + 1)
  }
  return src.slice(start)
}

function kpiArrays(src: string): string[] {
  const out: string[] = []
  for (const m of src.matchAll(/<MetricsGrid\s+metrics=\{\s*(\[|[A-Za-z_]\w*)/g)) {
    const idx = (m.index ?? 0) + m[0].length - m[1]!.length
    if (m[1] === '[') {
      out.push(balanced(src, idx, '[', ']'))
      continue
    }
    const decl = new RegExp(`const\\s+${m[1]}\\s*(?::[^=]+)?=\\s*`).exec(src)
    if (!decl) continue
    const at = (decl.index ?? 0) + decl[0].length
    if (src[at] === '[') out.push(balanced(src, at, '[', ']'))
    else if (src.startsWith('useMemo(', at))
      out.push(balanced(src, at + 'useMemo'.length, '(', ')'))
  }
  return out
}

function tsxFiles(dir: string): string[] {
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    if (name === '__tests__' || name === 'data') continue
    const full = join(dir, name)
    if (statSync(full).isDirectory()) out.push(...tsxFiles(full))
    else if (/\.tsx$/.test(name)) out.push(full)
  }
  return out.sort()
}

interface PageCopy {
  slug: string
  page: string
  jsonLd: string
  layoutTag: string
  kpis: string[]
  hasMetricsGrid: boolean
}

function loadPageCopy(slug: string): PageCopy {
  const dir = join(PROJECTS_DIR, slug)
  const page = readFileSync(join(dir, 'page.tsx'), 'utf8')
  const files = tsxFiles(dir).map((f) => readFileSync(f, 'utf8'))
  const jsonLdSrc = files.find((s) => s.includes('<ProjectJsonLd')) ?? ''
  const layoutSrc = files.find((s) => s.includes('<ProjectPageLayout')) ?? ''
  return {
    slug,
    page: pageDescription(page),
    jsonLd: jsonLdDescription(jsonLdSrc),
    layoutTag: layoutOpeningTag(layoutSrc),
    kpis: kpiArrays(layoutSrc),
    hasMetricsGrid: layoutSrc.includes('<MetricsGrid'),
  }
}

/**
 * The text a region DISPLAYS: string literals plus the figure each literal-argument
 * formatter call renders. Computed expressions (`x / 100`, `.toFixed(1)`, formatter
 * calls on variables) carry no copy and are skipped.
 */
function copyText(code: string): string {
  const src = code.replace(/(^|\s)\/\/[^\n]*/g, '$1').replace(/\/\*[\s\S]*?\*\//g, '')
  const pieces: string[] = []
  let i = 0
  while (i < src.length) {
    const ch = src[i] as string
    const fm = /^format(?:Percentage|Trend|Number|Currency)\(/.exec(src.slice(i, i + 20))
    if (fm) {
      const call = balanced(src, i + fm[0].length - 1, '(', ')')
      const full = src.slice(i, i + fm[0].length - 1) + call
      const rendered = renderFormatters(full)
      if (rendered !== full) pieces.push(rendered)
      i += full.length
    } else if (ch === "'" || ch === '"' || ch === '`') {
      let j = i + 1
      let lit = ''
      while (j < src.length && src[j] !== ch) {
        if (ch === '`' && src[j] === '$' && src[j + 1] === '{') {
          const inner = balanced(src, j + 1, '{', '}')
          lit += copyText(inner.slice(1, -1))
          j += inner.length + 1
          continue
        }
        if (src[j] === '\\') j++
        lit += src[j]
        j++
      }
      pieces.push(lit)
      i = j + 1
    } else i++
  }
  return pieces.join(' | ')
}

function checkRegion(slug: string, where: string, text: string, isCode = false) {
  const shown = isCode ? copyText(text) : text
  return unsourced(slug, where, shown, [...new Set(words(shown))])
}

// ------------------------------------------------------------------ detector

describe('page copy detector', () => {
  const fakePage = `export const metadata = genMeta({
  title: 'T',
  description:
    'First half. ' +
    'Second half 12%.',
  path: '/x',
})
`
  const fakeContent = `
  const metrics = [{ label: 'A', value: formatTrend(-0.26, { format: 'percentage' }) }, { label: 'B', value: '5' }]
  <ProjectJsonLd title="T" description="Json desc 7%" slug="x" />
  <ProjectPageLayout title="T" description="Layout desc" tags={[{ label: \`Win: \${formatNumber(125)}\` }]}>
    <MetricsGrid metrics={metrics} columns={4} />
  </ProjectPageLayout>`

  it('the region extractor finds the four regions in a synthetic pair', () => {
    expect(pageDescription(fakePage)).toBe('First half. Second half 12%.')
    expect(jsonLdDescription(fakeContent)).toBe('Json desc 7%')
    expect(layoutOpeningTag(fakeContent)).toContain('tags={[{ label:')
    expect(layoutOpeningTag(fakeContent).endsWith('>')).toBe(true)
    const kpis = kpiArrays(fakeContent)
    expect(kpis).toHaveLength(1)
    expect(kpis[0]).toContain("label: 'B'")
  })

  it('formatTrend(-0.26, ...) renders 26%', () => {
    expect(renderFormatters("formatTrend(-0.26, { format: 'percentage' })")).toContain('26%')
    expect(renderFormatters('formatNumber(4200, { suffix: "+" })')).toContain('4,200')
    expect(renderFormatters('formatCurrency(830000, { compact: true })')).toBe('$830K')
  })

  it('a fabricated figure in a region fails, a sourced one passes', () => {
    expect(
      checkRegion('forecast-pipeline-intelligence', 'x', 'Cut churn by 61%').errors.length
    ).toBeGreaterThan(0)
    expect(checkRegion('forecast-pipeline-intelligence', 'x', 'accuracy of 94%').errors).toEqual([])
  })

  it('code regions keep displayed text only, not computed expressions', () => {
    const shown = copyText(
      [
        '{ label: `Retention: $',
        '{formatPercentage(rate / 100)}`, v: x ? 0 : 100,',
        " w: formatTrend(-0.26, { format: 'percentage' }) }",
      ].join('')
    )
    expect(shown).toContain('Retention: ')
    expect(shown).toContain('26%')
    expect(shown).not.toContain('100')
    expect(
      checkRegion(
        'forecast-pipeline-intelligence',
        'kpi',
        "[{ value: formatTrend(-0.26, { format: 'percentage' }), label: 'Slippage' }]",
        true
      ).errors.length
    ).toBeGreaterThan(0)
  })

  // The pre-13-11 forecast description, checked against the real forecast
  // write-up: its 26% is the "from 26%" baseline, not a stated change, so the
  // change-claim rule must reject it. A fixture (not the live page) keeps this
  // detector check meaningful after the page copy was corrected.
  const STALE_FORECAST_COPY =
    'Forecast and pipeline intelligence that improved forecast accuracy by 31% and reduced slippage by 26%.'

  it('rejects a change claim that is really the write-up baseline (forecast 26%)', () => {
    const { errors } = checkRegion(
      'forecast-pipeline-intelligence',
      'page description',
      STALE_FORECAST_COPY
    )
    expect(errors.join('\n')).toContain('"26%" (change claim)')
  })

  it('accepts the corrected forecast page description', () => {
    const copy = loadPageCopy('forecast-pipeline-intelligence')
    const { errors } = checkRegion('forecast-pipeline-intelligence', 'page description', copy.page)
    expect(errors).toEqual([])
  })
})

// ---------------------------------------------------------------- non-vacuity

const SLUGS = projectSlugDirs()
const COPY = SLUGS.map(loadPageCopy)

describe('page copy non-vacuity', () => {
  it('covers the 14 project slugs', () => {
    expect(SLUGS).toHaveLength(14)
    expect(existsSync(PROJECTS_DIR)).toBe(true)
  })

  it('every slug yields a page description, JSON-LD description and layout tag', () => {
    for (const c of COPY) {
      expect(c.page.length, `${c.slug} page description`).toBeGreaterThan(20)
      expect(c.jsonLd.length, `${c.slug} JSON-LD description`).toBeGreaterThan(20)
      expect(c.layoutTag.length, `${c.slug} layout tag`).toBeGreaterThan(20)
      if (c.hasMetricsGrid) expect(c.kpis.length, `${c.slug} KPI array`).toBeGreaterThan(0)
    }
  })

  it('at least 40 figures are checked across the 14 slugs', () => {
    let n = 0
    for (const c of COPY) {
      for (const [where, text] of regions(c))
        n += checkRegion(
          c.slug,
          where,
          text,
          where !== 'page meta description' && where !== 'JSON-LD description'
        ).checked
    }
    expect(n).toBeGreaterThanOrEqual(40)
  })
})

function regions(c: PageCopy): Array<[string, string]> {
  return [
    ['page meta description', c.page],
    ['JSON-LD description', c.jsonLd],
    ['ProjectPageLayout title/description/tags', c.layoutTag],
    ...c.kpis.map((k, i): [string, string] => [`KPI tiles #${i + 1}`, k]),
  ]
}

for (const c of COPY) {
  describe(`page copy sourced: ${c.slug}`, () => {
    it('page meta description', () => {
      expect(checkRegion(c.slug, 'page.tsx genMeta description', c.page).errors.join('\n')).toBe('')
    })
    it('JSON-LD description', () => {
      expect(checkRegion(c.slug, 'ProjectJsonLd description', c.jsonLd).errors.join('\n')).toBe('')
    })
    it('ProjectPageLayout title, description and tags', () => {
      expect(checkRegion(c.slug, 'ProjectPageLayout', c.layoutTag, true).errors.join('\n')).toBe('')
    })
    it('KPI tiles', () => {
      const errors = c.kpis.flatMap(
        (k, i) => checkRegion(c.slug, `MetricsGrid KPI array #${i + 1}`, k, true).errors
      )
      expect(errors.join('\n')).toBe('')
    })
  })
}
