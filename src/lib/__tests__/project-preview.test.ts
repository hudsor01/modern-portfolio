// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  PAIR_RE,
  METRIC_RE,
  parseMeasure,
  classifyRow,
  buildProjectPreview,
  previewAriaLabel,
  type PreviewResultRow,
} from '../project-preview'

const row = (
  metric: string,
  before: string,
  after: string,
  improvement = ''
): PreviewResultRow => ({
  metric,
  before,
  after,
  improvement,
})

describe('classifyRow paired', () => {
  it('scales percent pairs against the larger value', () => {
    expect(classifyRow(row('A', '82%', '94%'))).toMatchObject({
      kind: 'paired',
      beforeWidth: 87.2,
      afterWidth: 100,
    })
    expect(classifyRow(row('A', '18%', '6%'))).toMatchObject({
      beforeWidth: 100,
      afterWidth: 33.3,
    })
  })
  it('pairs dollars, months, hours, counts and ratios', () => {
    for (const [b, a] of [
      ['$247', '$168'],
      ['$18,150', '$12,345'],
      ['14.2 mo', '8.4 mo'],
      ['8.5 hours', '2.3 hour'],
      ['3.4', '4.7'],
      ['2.8:1', '3.6:1'],
    ] as const) {
      expect(classifyRow(row('M', b, a))?.kind).toBe('paired')
    }
  })
  it('clamps the smaller width to 2', () => {
    expect(classifyRow(row('M', '1', '100'))).toMatchObject({ beforeWidth: 2, afterWidth: 100 })
  })
  it('draws equal values as two full bars', () => {
    expect(classifyRow(row('M', '50%', '50%'))).toMatchObject({ beforeWidth: 100, afterWidth: 100 })
  })
  it('keeps a paired row paired even with a non-percent improvement', () => {
    const r = classifyRow(row('M', '63%', '94%', '31 pts'))
    expect(r).toMatchObject({ kind: 'paired', beforeWidth: 67 })
    expect(r).not.toHaveProperty('improvement')
  })
})

describe('classifyRow improvement and omission', () => {
  it('uses improvement when the pair is not measurable', () => {
    expect(classifyRow(row('M', '15+ hours/week', '10+ hours saved weekly', '65%'))).toMatchObject({
      kind: 'improvement',
      width: 65,
    })
    expect(classifyRow(row('M', '', '', '47.8%'))).toMatchObject({
      kind: 'improvement',
      width: 47.8,
    })
    expect(classifyRow(row('M', 'Baseline', '+34%', '34%'))).toMatchObject({
      kind: 'improvement',
      width: 34,
    })
  })
  it('omits sentinels and non-measurements', () => {
    expect(classifyRow(row('M', '2 weeks delay', 'Real-time', '100%'))).toBeNull()
    expect(classifyRow(row('M', 'Basic', '5 tiers', '100%'))).toBeNull()
    expect(classifyRow(row('M', 'N/A', '92%', '100%'))).toBeNull()
    expect(classifyRow(row('M', '2 weeks', '2 days', ''))).toBeNull()
    expect(classifyRow(row('M', 'Basic', 'Pro', '0%'))).toBeNull()
  })
})

describe('parseMeasure', () => {
  it('parses suffixes and units', () => {
    expect(parseMeasure('$1.28M')).toEqual({ value: 1280000, unit: '$' })
    expect(parseMeasure('$480K')).toEqual({ value: 480000, unit: '$' })
    expect(parseMeasure('4,200+')).toEqual({ value: 4200, unit: 'count' })
    expect(parseMeasure('90%+')).toEqual({ value: 90, unit: '%' })
    expect(parseMeasure('nope')).toBeNull()
  })
  it('accepts a signed value only through METRIC_RE', () => {
    expect(PAIR_RE.test('-31 days')).toBe(false)
    expect(METRIC_RE.test('-31 days')).toBe(true)
    expect(parseMeasure('-31 days')).toEqual({ value: 31, unit: 'days' })
  })
})

describe('buildProjectPreview', () => {
  const five = ['1', '2', '3', '4', '5'].map((n) => row(`R${n}`, '10%', '20%'))
  it('keeps the first 3 rows', () => {
    const m = buildProjectPreview({ results: five })
    expect(m.kind === 'rows' && m.rows.length).toBe(3)
    expect(m.kind === 'rows' && m.hasPaired).toBe(true)
  })
  it('hasPaired is false for improvement-only', () => {
    const m = buildProjectPreview({ results: [row('A', '', '', '22%')] })
    expect(m).toMatchObject({ kind: 'rows', hasPaired: false })
  })
  it('falls back to metrics, skipping non-numeric', () => {
    const m = buildProjectPreview({
      results: [row('A', 'Basic', '5 tiers', '100%')],
      displayMetrics: [
        { label: 'Stack', value: 'Full Stack' },
        { label: 'Active Partners', value: '47' },
        { label: 'Automation', value: '90%+' },
        { label: 'Revenue from Partners', value: '35%' },
        { label: 'Onboarding', value: '15 days' },
      ],
    })
    expect(m).toEqual({
      kind: 'metrics',
      items: [
        { label: 'Active Partners', value: '47' },
        { label: 'Automation', value: '90%+' },
        { label: 'Revenue from Partners', value: '35%' },
      ],
    })
  })
  it('accepts days in the fallback', () => {
    expect(
      buildProjectPreview({ displayMetrics: [{ label: 'Onboarding', value: '15 days' }] })
    ).toMatchObject({ kind: 'metrics' })
  })
  it('returns empty and tolerates null', () => {
    expect(buildProjectPreview({ results: null, displayMetrics: null })).toEqual({ kind: 'empty' })
    expect(buildProjectPreview({})).toEqual({ kind: 'empty' })
  })
  it('is deterministic', () => {
    expect(buildProjectPreview({ results: five })).toEqual(buildProjectPreview({ results: five }))
  })
})

describe('previewAriaLabel', () => {
  it('labels rows', () => {
    const m = buildProjectPreview({
      results: [row('Forecast Accuracy', '63%', '94%'), row('Deal Slippage', '26%', '19%')],
    })
    expect(previewAriaLabel(m)).toBe(
      'Results chart. Forecast Accuracy 63% to 94%; Deal Slippage 26% to 19%.'
    )
  })
  it('labels improvement clauses', () => {
    const m = buildProjectPreview({ results: [row('Partner Churn', '', '', '22%')] })
    expect(previewAriaLabel(m)).toBe('Results chart. Partner Churn improved 22%.')
  })
  it('labels metrics and empty', () => {
    const m = buildProjectPreview({
      displayMetrics: [
        { label: 'Active Partners', value: '47' },
        { label: 'Automation', value: '90%+' },
        { label: 'Revenue from Partners', value: '35%' },
      ],
    })
    expect(previewAriaLabel(m)).toBe(
      'Key metrics. Active Partners 47; Automation 90%+; Revenue from Partners 35%.'
    )
    expect(previewAriaLabel({ kind: 'empty' })).toBe('')
  })
})

describe('unit alignment between PAIR_RE, METRIC_RE and parseMeasure', () => {
  const units = [
    ['8.5 hours', 'hours'],
    ['8.5 hour', 'hours'],
    ['8.5hours', 'hours'],
    ['14.2 mo', 'mo'],
    ['8.4mo', 'mo'],
    ['31 days', 'days'],
    ['28 pts', 'pts'],
    ['94%', '%'],
    ['4.7x', 'x'],
    ['7:1', ':1'],
    ['$8.7M', '$'],
    ['47', 'count'],
  ] as const

  it.each(units)('%s is a pair value, a metric value and parses as %s', (value, unit) => {
    expect(PAIR_RE.test(value)).toBe(true)
    expect(METRIC_RE.test(value)).toBe(true)
    expect(parseMeasure(value)?.unit).toBe(unit)
  })

  it('metric tiles accept a signed value that pairs cannot', () => {
    expect(METRIC_RE.test('+28 pts')).toBe(true)
    expect(parseMeasure('+28 pts')).toEqual({ value: 28, unit: 'pts' })
    expect(PAIR_RE.test('+28 pts')).toBe(false)
  })

  it('keeps a results-less project with an unspaced month metric as a tile', () => {
    const model = buildProjectPreview({
      displayMetrics: [{ label: 'CAC Payback', value: '8.4mo' }],
    })
    expect(model).toEqual({ kind: 'metrics', items: [{ label: 'CAC Payback', value: '8.4mo' }] })
  })

  it('rejects prose and unknown units', () => {
    for (const bad of ['n/a', '8.4 parsecs', 'about 5', '12 mos']) {
      expect(PAIR_RE.test(bad)).toBe(false)
      expect(METRIC_RE.test(bad)).toBe(false)
    }
  })
})
