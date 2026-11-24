/**
 * Shared helpers for the "write-up wins" guards (not a test file).
 *
 * The case-study write-up is the source of truth for every project figure. A
 * figure is "sourced" only when it appears in that project's NARRATIVE sources:
 * `_components/NarrativeSections.tsx`, every `.ts`/`.tsx` under `<slug>/data/`,
 * plus the explicit NARRATIVE_CONSTANTS snippets below. Page copy (page.tsx,
 * PageContent files, metadata.json) is deliberately never part of the corpus,
 * so stale page copy cannot vouch for itself.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import {
  classifyRow,
  IMPROVEMENT_RE,
  PAIR_RE,
  parseMeasure,
  type PreviewResultRow,
} from '@/lib/project-preview'

// One parser: re-exported so guards never grow a second copy of these.
export { classifyRow, IMPROVEMENT_RE, PAIR_RE, parseMeasure }

const PROJECTS_DIR = join(process.cwd(), 'src/app/projects')

/** Figures the parent passes into NarrativeSections as props. */
export const NARRATIVE_CONSTANTS: Array<{ slug: string; file: string; snippet: string }> = [
  {
    slug: 'churn-retention',
    file: '_components/ChurnPageContent.tsx',
    snippet: 'revenueSaved={830000}',
  },
]

/** Escape hatch for a figure the write-up states in words. Each entry needs its snippet verbatim in the narrative corpus. */
export const CONTEXT_EXCEPTIONS: Array<{ slug: string; figure: string; snippet: string }> = [
  // The "Team Size" card is the write-up's "125 sales professionals"; the label words
  // (team, size) never sit within 40 characters of the number.
  {
    slug: 'sales-enablement',
    figure: '125',
    snippet: 'We had {formatNumber(125)} sales professionals',
  },
]

export function projectSlugDirs(): string[] {
  return readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== '[slug]')
    .filter((d) => existsSync(join(PROJECTS_DIR, d.name, 'page.tsx')))
    .map((d) => d.name)
    .sort()
}

function walkTs(dir: string): string[] {
  if (!existsSync(dir)) return []
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    if (name === '__tests__') continue
    const full = join(dir, name)
    if (statSync(full).isDirectory()) out.push(...walkTs(full))
    else if (/\.tsx?$/.test(name)) out.push(full)
  }
  return out.sort()
}

export function narrativeCorpus(slug: string): string {
  const dir = join(PROJECTS_DIR, slug)
  const parts: string[] = []
  const narrative = join(dir, '_components/NarrativeSections.tsx')
  if (existsSync(narrative)) parts.push(readFileSync(narrative, 'utf8'))
  for (const f of walkTs(join(dir, 'data'))) parts.push(readFileSync(f, 'utf8'))
  for (const c of NARRATIVE_CONSTANTS.filter((n) => n.slug === slug)) {
    const src = readFileSync(join(dir, c.file), 'utf8')
    if (!src.includes(c.snippet)) {
      throw new Error(`NARRATIVE_CONSTANTS snippet "${c.snippet}" not found in ${slug}/${c.file}`)
    }
    parts.push(c.snippet)
  }
  return parts.join('\n')
}

const round6 = (n: number): number => Number(n.toFixed(6))

/** Plain numeric tokens, thousands separators stripped. */
export function plainNumbers(text: string): Set<number> {
  const out = new Set<number>()
  for (const m of text.matchAll(/\d[\d,]*(?:\.\d+)?/g)) {
    out.add(round6(Number(m[0].replace(/,/g, ''))))
  }
  return out
}

/** Plain tokens plus the figure each `formatPercentage(0.832)` / `formatTrend(...)` literal renders (x100). */
export function corpusNumbers(text: string): Set<number> {
  const out = plainNumbers(text)
  for (const m of text.matchAll(/format(?:Percentage|Trend)\(\s*-?(\d*\.\d+)/g)) {
    out.add(round6(Number(m[1]) * 100))
  }
  return out
}

interface Rendered {
  text: string
  spans: Array<[number, number]>
}

const FORMATTER_RE = /format(Percentage|Trend|Number|Currency)\(\s*(-?\d*\.?\d+)\s*(?:,([^)]*))?\)/g

function compactCurrency(x: number): string {
  if (x >= 1e6) return `$${round6(Number((x / 1e6).toFixed(1)))}M`
  if (x >= 1e3) return `$${round6(Number((x / 1e3).toFixed(x >= 1e5 ? 0 : 1)))}K`
  return `$${x}`
}

function renderWithSpans(code: string): Rendered {
  let out = ''
  let last = 0
  const spans: Array<[number, number]> = []
  for (const m of code.matchAll(FORMATTER_RE)) {
    const name = m[1] as string
    const x = Number(m[2])
    const args = m[3] ?? ''
    let rendered: string
    if (name === 'Percentage') rendered = `${round6(x * 100)}%`
    else if (name === 'Trend') {
      const sign = x < 0 ? '-' : '+'
      const fmt = /format:\s*'(currency|number)'/.exec(args)?.[1]
      if (fmt === 'currency') rendered = `${sign}$${Math.abs(x)}`
      else if (fmt === 'number') rendered = `${sign}${Math.abs(x)}`
      else rendered = `${sign}${round6(Math.abs(x) * 100)}%`
    } else if (name === 'Number') rendered = x.toLocaleString('en-US')
    else
      rendered = /compact:\s*true/.test(args) ? compactCurrency(x) : `$${x.toLocaleString('en-US')}`
    out += code.slice(last, m.index)
    spans.push([out.length, out.length + rendered.length])
    out += rendered
    last = (m.index ?? 0) + m[0].length
  }
  out += code.slice(last)
  return { text: out, spans }
}

/** Rewrites formatter calls with literal arguments into the figure text they render. */
export function renderFormatters(code: string): string {
  return renderWithSpans(code).text
}

export type Unit = '%' | 'x' | ':1' | '$' | 'pts' | 'mo' | 'days' | 'hours' | 'plain'

export interface Figure {
  raw: string
  value: number
  scale: number
  decimals: number
  unit: Unit
  typed: boolean
  signed: boolean
  /** A claim that something changed by this much (not a baseline or end-state). */
  change: boolean
  contextWords: string[]
}

const STEM_RE =
  /\b(?:improv|reduc|increas|decreas|grow|faster|lower|higher|cut|gain|boost|saving|optimi)/i
const STOP = new Set([
  'with',
  'from',
  'that',
  'this',
  'have',
  'over',
  'into',
  'than',
  'then',
  'were',
  'your',
  'been',
  'more',
  'most',
  'such',
  'also',
  'each',
  'only',
  'across',
  'about',
  'after',
  'their',
])
const UNIT_WORDS: Record<string, string> = { mo: 'month', days: 'day', hours: 'hour', pts: 'point' }

export function words(text: string): string[] {
  return (text.match(/[A-Za-z]{4,}/g) ?? []).filter((w) => !STOP.has(w.toLowerCase()))
}

export function hasChangeStem(text: string): boolean {
  return STEM_RE.test(text)
}

const UNIT_RES: Array<[RegExp, Unit]> = [
  [/^%/, '%'],
  [/^:1(?!\d)/, ':1'],
  [/^x(?![A-Za-z])/, 'x'],
  [/^\s?(?:pts?|(?:percentage )?points?)\b/i, 'pts'],
  [/^\s?mo(?:nths?)?\b/i, 'mo'],
  [/^\s?days?\b/i, 'days'],
  [/^\s?hours?\b/i, 'hours'],
]

const FIGURE_RE = /(?<![A-Za-z\d.,])(\$)?(\d+(?:,\d{3})*(?:\.\d+)?)([KM](?![A-Za-z]))?/g

export function extractFigures(
  text: string,
  labelWords: string[] = [],
  opts: { labelChange?: boolean; forceChange?: boolean } = {}
): Figure[] {
  const figs: Figure[] = []
  for (const m of text.matchAll(FIGURE_RE)) {
    const i = m.index ?? 0
    const numStr = m[2] as string
    const value = Number(numStr.replace(/,/g, ''))
    const decimals = numStr.includes('.') ? numStr.length - numStr.indexOf('.') - 1 : 0
    const scale = m[3] === 'K' ? 1e3 : m[3] === 'M' ? 1e6 : 1
    let end = i + m[0].length
    const rest = text.slice(end)
    let unit: Unit = m[1] ? '$' : 'plain'
    for (const [re, u] of UNIT_RES) {
      const um = re.exec(rest)
      if (um) {
        unit = u
        end += um[0].length
        break
      }
    }
    if (unit === 'plain' && scale === 1 && decimals === 0 && value >= 1900 && value <= 2100)
      continue
    const prevChar = text[i - 1]
    const signed =
      (prevChar === '+' || prevChar === '-') && (i < 2 || !/[A-Za-z\d]/.test(text[i - 2] as string))
    const before = text.slice(Math.max(0, i - 60), i)
    const after = text.slice(end, end + 60)
    const baseline = /\b(?:from|to) $/i.test(before) || /→ ?$/.test(before)
    const byClaim = /\bby (?:at least )?$/i.test(before)
    const stemAfter = (after.match(/[A-Za-z]+/g) ?? []).slice(0, 3).some((w) => STEM_RE.test(w))
    const pctLike = unit === '%' || (signed && (unit === 'pts' || unit === 'days'))
    const change =
      pctLike &&
      (opts.forceChange === true ||
        (!baseline && (byClaim || signed || stemAfter || opts.labelChange === true)))
    const near = [...words(before).slice(-3), ...words(after).slice(0, 3)]
    const unitWord = UNIT_WORDS[unit]
    figs.push({
      raw: text.slice(i, end).trim(),
      value,
      scale,
      decimals,
      unit,
      typed:
        unit === '$' ||
        decimals > 0 ||
        ['%', 'x', ':1'].includes(unit) ||
        scale > 1 ||
        value >= 1000,
      signed,
      change,
      contextWords: [...near, ...labelWords, ...(unitWord ? [unitWord] : [])],
    })
  }
  return figs
}

interface CorpusInfo {
  raw: string
  numbers: Set<number>
  rendered: Rendered
  baselines: Set<number>
}

const cache = new Map<string, CorpusInfo>()

function corpusInfo(slug: string): CorpusInfo {
  const hit = cache.get(slug)
  if (hit) return hit
  const raw = narrativeCorpus(slug)
  const rendered = renderWithSpans(raw)
  const baselines = new Set<number>()
  for (const m of rendered.text.matchAll(/\bfrom\s+\$?(\d+(?:,\d{3})*(?:\.\d+)?)/gi)) {
    baselines.add(round6(Number((m[1] as string).replace(/,/g, ''))))
  }
  const info = { raw, numbers: corpusNumbers(raw), rendered, baselines }
  cache.set(slug, info)
  return info
}

function numberTokens(text: string, value: number): Array<[number, number]> {
  const hits: Array<[number, number]> = []
  for (const m of text.matchAll(/(?<![\d.,])\d+(?:,\d{3})*(?:\.\d+)?/g)) {
    if (round6(Number(m[0].replace(/,/g, ''))) === round6(value)) {
      hits.push([m.index ?? 0, (m.index ?? 0) + m[0].length])
    }
  }
  return hits
}

function changeSourced(fig: Figure, info: CorpusInfo): boolean {
  const { text, spans } = info.rendered
  const mantissa = fig.scale > 1 ? fig.value * fig.scale : fig.value
  for (const [s, e] of numberTokens(text, mantissa)) {
    if (/\b(?:from|to) \$?$/i.test(text.slice(Math.max(0, s - 8), s))) continue
    const tail = text.slice(e, e + 20)
    if (fig.unit === '%' && /^\s?(?:percentage )?points?\b/i.test(tail)) continue
    // "34.2" in a data constant (no % sign) still counts; "31 days" or "31 partners" does not.
    if (fig.unit === '%' && !tail.startsWith('%') && /^\s?[A-Za-z]/.test(tail)) continue
    const fromCard = spans.some(([a, b]) => s >= a && s < b)
    // The prose states this figure as a baseline ("from 26% to 19%"); a card that
    // happens to carry the same number cannot turn it into a change.
    if (fromCard && info.baselines.has(round6(mantissa))) continue
    // camelCase keys ("performanceImprovement") carry stems too.
    const win = text.slice(Math.max(0, s - 80), e + 80).replace(/([a-z])([A-Z])/g, '$1 $2')
    if (STEM_RE.test(win)) return true
  }
  return false
}

function bareSourced(fig: Figure, info: CorpusInfo): boolean {
  const ctx = [...new Set(fig.contextWords.map((w) => w.slice(0, 5).toLowerCase()))]
  if (ctx.length === 0) return false
  const text = info.rendered.text
  for (const [s, e] of numberTokens(text, fig.value)) {
    if (/^(?:%|\.\d|,\d)/.test(text.slice(e, e + 2))) continue
    const win = text.slice(Math.max(0, s - 40), e + 40).toLowerCase()
    if (ctx.some((w) => win.includes(w))) return true
  }
  return false
}

export function isSourced(fig: Figure, slug: string): boolean {
  const info = corpusInfo(slug)
  const exception = CONTEXT_EXCEPTIONS.find((x) => x.slug === slug && x.figure === fig.raw)
  if (exception && info.raw.includes(exception.snippet) && exception.snippet.includes(fig.raw)) {
    return true
  }
  if (fig.change) return changeSourced(fig, info)
  if (!fig.typed) return bareSourced(fig, info)
  if (info.raw.includes(fig.raw)) return true
  if (fig.scale === 1) return info.numbers.has(round6(fig.value))
  for (const n of info.numbers) {
    if (Number((n / fig.scale).toFixed(fig.decimals)) === fig.value) return true
  }
  return false
}

/** Failure messages (empty when every figure in `text` is sourced). */
export function unsourced(
  slug: string,
  where: string,
  text: string,
  labelWords: string[] = [],
  opts: { labelChange?: boolean; forceChange?: boolean } = {}
): { checked: number; errors: string[] } {
  const figs = extractFigures(text, labelWords, opts)
  const errors = figs
    .filter((f) => !isSourced(f, slug))
    .map(
      (f) =>
        `${slug} ${where}: "${f.raw}"${f.change ? ' (change claim)' : f.typed ? '' : ' (bare)'} not in the write-up`
    )
  return { checked: figs.length, errors }
}

/** Relative change of a paired row, as a rounded percent; null when unparseable. */
export function relativeChange(before: string, after: string): number | null {
  const b = parseMeasure(before)
  const a = parseMeasure(after)
  if (!b || !a || b.unit !== a.unit || b.value === 0) return null
  return Math.round((Math.abs(a.value - b.value) / b.value) * 100)
}

export function rowFigureErrors(
  slug: string,
  row: PreviewResultRow
): { checked: number; errors: string[] } {
  const lw = words(row.metric)
  const own = relativeChange(row.before, row.after)
  const checked: string[] = []
  let n = 0
  for (const [field, text] of [
    ['before', row.before],
    ['after', row.after],
  ] as const) {
    const r = unsourced(slug, `${row.metric} ${field}`, text, lw)
    n += r.checked
    checked.push(...r.errors)
  }
  const imp = IMPROVEMENT_RE.test(row.improvement) ? Number.parseFloat(row.improvement) : null
  if (!(imp !== null && own !== null && imp === own)) {
    const r = unsourced(slug, `${row.metric} improvement`, row.improvement, lw, {
      forceChange: true,
    })
    n += r.checked
    checked.push(...r.errors)
  }
  return { checked: n, errors: checked }
}
