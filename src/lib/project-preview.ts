/**
 * Single classification of a project's results into a generated preview.
 * Shared by ProjectPreview, /api/og and the data guards so the chart, the OG
 * card and the catalog checks can never disagree. Client-safe: pure, no I/O.
 *
 * Source strings are never reformatted or rounded for display; only the bar
 * widths are derived numbers. A row that is not a real measurement is omitted
 * rather than drawn, so no number is ever fabricated.
 */

export const PAIR_RE = /^\$?\d[\d,]*(\.\d+)?(K|M)?(%|x|:1| mo| days| hours?)?\+?$/
export const IMPROVEMENT_RE = /^\d+(\.\d+)?%$/
export const METRIC_RE = /^[+-]?\$?\d[\d,]*(\.\d+)?(K|M|%|x|:1| mo| days)?\+?$/

export type UnitKey = '%' | 'x' | ':1' | '$' | 'mo' | 'days' | 'hours' | 'count'

export interface PreviewResultRow {
  metric: string
  before: string
  after: string
  improvement: string
}

export interface PreviewSource {
  results?: PreviewResultRow[] | null
  displayMetrics?: ReadonlyArray<{ label: string; value: string }> | null
}

export type PreviewRow =
  | {
      kind: 'paired'
      metric: string
      before: string
      after: string
      beforeWidth: number
      afterWidth: number
    }
  | { kind: 'improvement'; metric: string; improvement: string; width: number }

export interface PreviewMetric {
  label: string
  value: string
}

export type ProjectPreviewModel =
  | { kind: 'rows'; rows: PreviewRow[]; hasPaired: boolean }
  | { kind: 'metrics'; items: PreviewMetric[] }
  | { kind: 'empty' }

const MAX_ITEMS = 3

function width(x: number): number {
  return Math.max(2, Math.round(x * 10) / 10)
}

export function parseMeasure(value: string): { value: number; unit: UnitKey } | null {
  let s: string
  if (PAIR_RE.test(value)) {
    s = value
  } else if (METRIC_RE.test(value)) {
    s = value.replace(/^[+-]/, '')
  } else {
    return null
  }
  const dollar = s.startsWith('$')
  const m = /^\$?(\d[\d,]*(?:\.\d+)?)(K|M)?(%|x|:1| mo| days| hours?)?\+?$/.exec(s)
  if (!m) return null
  const num = Number((m[1] as string).replace(/,/g, ''))
  if (!Number.isFinite(num)) return null
  const mult = m[2] === 'K' ? 1e3 : m[2] === 'M' ? 1e6 : 1
  const suffix = m[3]
  let unit: UnitKey
  if (dollar) unit = '$'
  else if (suffix === undefined) unit = 'count'
  else if (suffix === '%') unit = '%'
  else if (suffix === 'x') unit = 'x'
  else if (suffix === ':1') unit = ':1'
  else if (suffix === ' mo') unit = 'mo'
  else if (suffix === ' days') unit = 'days'
  else unit = 'hours'
  return { value: num * mult, unit }
}

export function classifyRow(row: PreviewResultRow): PreviewRow | null {
  if (PAIR_RE.test(row.before) && PAIR_RE.test(row.after)) {
    const b = parseMeasure(row.before)
    const a = parseMeasure(row.after)
    if (b && a && b.unit === a.unit) {
      const max = Math.max(b.value, a.value)
      return {
        kind: 'paired',
        metric: row.metric,
        before: row.before,
        after: row.after,
        beforeWidth: max > 0 ? width((b.value / max) * 100) : 2,
        afterWidth: max > 0 ? width((a.value / max) * 100) : 2,
      }
    }
  }
  if (IMPROVEMENT_RE.test(row.improvement)) {
    const v = Number.parseFloat(row.improvement)
    if (v > 0 && v < 100) {
      return {
        kind: 'improvement',
        metric: row.metric,
        improvement: row.improvement,
        width: width(v),
      }
    }
  }
  return null
}

export function buildProjectPreview(source: PreviewSource): ProjectPreviewModel {
  const rows: PreviewRow[] = []
  for (const r of source.results ?? []) {
    const c = classifyRow(r)
    if (c) rows.push(c)
    if (rows.length === MAX_ITEMS) break
  }
  if (rows.length > 0) {
    return { kind: 'rows', rows, hasPaired: rows.some((r) => r.kind === 'paired') }
  }
  const items: PreviewMetric[] = []
  for (const m of source.displayMetrics ?? []) {
    if (METRIC_RE.test(m.value)) items.push({ label: m.label, value: m.value })
    if (items.length === MAX_ITEMS) break
  }
  if (items.length > 0) return { kind: 'metrics', items }
  return { kind: 'empty' }
}

export function previewAriaLabel(model: ProjectPreviewModel): string {
  if (model.kind === 'rows') {
    const clauses = model.rows.map((r) =>
      r.kind === 'paired'
        ? `${r.metric} ${r.before} to ${r.after}`
        : `${r.metric} improved ${r.improvement}`
    )
    return `Results chart. ${clauses.join('; ')}.`
  }
  if (model.kind === 'metrics') {
    return `Key metrics. ${model.items.map((i) => `${i.label} ${i.value}`).join('; ')}.`
  }
  return ''
}
