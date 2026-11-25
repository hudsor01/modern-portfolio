// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { buildProjectPreview, type PreviewSource } from '@/lib/project-preview'
import { showcaseProjects } from '../projects'

type P = { metric: string; before: string; after: string }
type I = { metric: string; improvement: string }
type Dm = Array<[label: string, value: string]>

interface Expected {
  /** Rows drawn, in order. Empty when the preview falls back to metrics. */
  rows: Array<P | I>
  /** Metrics drawn when results is empty (first three numeric displayMetrics). */
  metrics?: Array<{ label: string; value: string }>
  displayMetrics: Dm
}

const p = (metric: string, before: string, after: string): P => ({ metric, before, after })
const i = (metric: string, improvement: string): I => ({ metric, improvement })

/** Source: 13-UI-SPEC "Data prerequisites" write-up table (write-up wins). */
const EXPECTED: Record<string, Expected> = {
  'revenue-kpi': {
    rows: [
      p('Forecast Accuracy', '82%', '94%'),
      p('Forecast Variance', '18%', '6%'),
      i('Manual Reporting Time', '65%'),
    ],
    displayMetrics: [
      ['Revenue Increase', '$4.2M'],
      ['Manual Reporting Cut', '65%'],
      ['Forecast Accuracy', '94%'],
    ],
  },
  'churn-retention': {
    rows: [
      p('Partner Churn Rate (quarterly)', '14.2%', '10.9%'),
      i('Partner Satisfaction', '18%'),
      i('Retention Team Workload', '34%'),
    ],
    displayMetrics: [
      ['Churn Reduced', '23%'],
      ['Prediction Accuracy', '89%'],
      ['Revenue Saved', '$830K'],
    ],
  },
  'deal-funnel': {
    rows: [
      p('Forecast Accuracy', '73%', '89%'),
      p('Enterprise Conversion Rate', '18%', '24%'),
      i('Overall Conversion Rate', '27%'),
    ],
    displayMetrics: [
      ['Conversion Rate', '+27%'],
      ['Sales Cycle', '-31 days'],
      ['Forecast Accuracy', '89%'],
    ],
  },
  'lead-attribution': {
    rows: [
      i('Marketing ROI', '34%'),
      i('Lead-to-Customer Rate', '29%'),
      i('Cost per Acquisition', '28%'),
    ],
    displayMetrics: [
      ['Marketing ROI', '+34%'],
      ['Budget Savings', '$480K'],
      ['Lead-to-Customer', '+29%'],
    ],
  },
  'cac-unit-economics': {
    rows: [
      p('Blended CAC', '$247', '$168'),
      p('Payback Period', '14.2 mo', '8.4 mo'),
      i('Contribution Margin', '28%'),
    ],
    displayMetrics: [
      ['CAC Reduction', '32%'],
      ['LTV:CAC Ratio', '3.6:1'],
      ['Payback Period', '8.4mo'],
    ],
  },
  'commission-optimization': {
    rows: [
      p('Commission Processing Time', '8.5 hours', '2.3 hours'),
      p('Dispute Rate', '3.8%', '1.2%'),
      p('Calculation Accuracy', '87.8%', '99.8%'),
    ],
    displayMetrics: [
      ['Commission Pool', '$254K'],
      ['Performance', '+34.2%'],
      ['Automation', '87.5%'],
    ],
  },
  'customer-lifetime-value': {
    rows: [
      p('Churn Probability (at-risk segments)', '21%', '12.8%'),
      i('Marketing Campaign Efficiency', '42%'),
      i('Customer Retention', '18%'),
    ],
    displayMetrics: [
      ['Prediction Accuracy', '94.3%'],
      ['Predicted Revenue Impact', '$1.28M'],
      ['Segments', '5'],
    ],
  },
  'forecast-pipeline-intelligence': {
    rows: [p('Forecast Accuracy', '63%', '94%'), p('Deal Slippage', '26%', '19%')],
    displayMetrics: [
      ['Forecast Accuracy', '94%'],
      ['Deal Slippage', '19%'],
      ['Deals Tracked', '4,200+'],
    ],
  },
  'multi-channel-attribution': {
    rows: [
      p('Campaign ROI Prediction Accuracy', '67%', '92.4%'),
      i('Conversion Rate', '47.8%'),
      i('Customer Acquisition Cost', '31%'),
    ],
    displayMetrics: [
      ['Accuracy', '92.4%'],
      ['ROI Impact', '$2.3M'],
      ['Channels', '12'],
    ],
  },
  'partner-performance': {
    rows: [i('Certified Partner Revenue Contribution', '63%'), i('Partner Churn', '22%')],
    displayMetrics: [
      ['Win Rate', '83.2%'],
      ['Partner Revenue', '$904K'],
      ['Quick Ratio', '4.7x'],
    ],
  },
  'partnership-program-implementation': {
    rows: [],
    metrics: [
      { label: 'Active Partners', value: '47' },
      { label: 'Automation', value: '90%+' },
      { label: 'Revenue from Partners', value: '35%' },
    ],
    displayMetrics: [
      ['Active Partners', '47'],
      ['Automation', '90%+'],
      ['Revenue from Partners', '35%'],
      ['Onboarding', '15 days'],
    ],
  },
  'quota-territory-management': {
    rows: [
      p('Forecast Accuracy', '64%', '92%'),
      p('Quota Attainment Variance', '32%', '11%'),
      p('Sales Rep Turnover', '28%', '10%'),
    ],
    displayMetrics: [
      ['Accuracy Gain', '+28 pts'],
      ['Incremental Revenue', '$8.7M'],
      ['Territories', '47'],
    ],
  },
  'revenue-operations-center': {
    rows: [
      p('Forecast Accuracy', '74%', '96.8%'),
      i('Manual Reporting Time', '78%'),
      i('Lead-to-Opportunity Conversion', '31%'),
    ],
    displayMetrics: [
      ['Forecast Accuracy', '96.8%'],
      ['Revenue Growth', '+34.2%'],
      ['Operational Efficiency', '89.7%'],
    ],
  },
  'sales-enablement': {
    rows: [
      p('Win Rate', '52%', '70%'),
      p('Ramp Time', '9 mo', '5 mo'),
      p('Manager Satisfaction', '3.4', '4.7'),
    ],
    displayMetrics: [
      ['Win Rate', '+34%'],
      ['Ramp Time', '-45%'],
      ['Team Size', '125'],
    ],
  },
}

interface Entry extends PreviewSource {
  results: Array<{ metric: string; before: string; after: string; improvement: string }>
  displayMetrics: Array<{ label: string; value: string }>
}

function catalogDiff(entry: Entry, expected: Expected): string[] {
  const errors: string[] = []
  const model = buildProjectPreview(entry)
  if (expected.rows.length > 0) {
    if (model.kind !== 'rows') {
      errors.push(`expected kind rows, got ${model.kind}`)
    } else {
      if (model.rows.length !== expected.rows.length) {
        errors.push(`expected ${expected.rows.length} drawn rows, got ${model.rows.length}`)
      }
      expected.rows.forEach((want, idx) => {
        const got = model.rows[idx]
        if (!got) return
        if (got.metric !== want.metric) {
          errors.push(`row ${idx}: metric "${got.metric}" !== "${want.metric}"`)
        }
        if ('improvement' in want) {
          if (got.kind !== 'improvement')
            errors.push(`row ${idx} (${want.metric}): expected improvement-only, got paired`)
          else if (got.improvement !== want.improvement) {
            errors.push(
              `row ${idx} (${want.metric}): improvement "${got.improvement}" !== "${want.improvement}"`
            )
          }
        } else if (got.kind !== 'paired') {
          errors.push(`row ${idx} (${want.metric}): expected paired, got improvement-only`)
        } else if (got.before !== want.before || got.after !== want.after) {
          errors.push(
            `row ${idx} (${want.metric}): "${got.before}" -> "${got.after}" !== "${want.before}" -> "${want.after}"`
          )
        }
      })
    }
    if (entry.results.length !== expected.rows.length) {
      errors.push(`results has ${entry.results.length} rows, expected ${expected.rows.length}`)
    }
  } else {
    if (model.kind !== 'metrics') errors.push(`expected kind metrics, got ${model.kind}`)
    else if (JSON.stringify(model.items) !== JSON.stringify(expected.metrics)) {
      errors.push(`metrics ${JSON.stringify(model.items)} !== ${JSON.stringify(expected.metrics)}`)
    }
    if (entry.results.length !== 0)
      errors.push(`results must be empty, has ${entry.results.length}`)
  }
  const gotDm = JSON.stringify(entry.displayMetrics.map((m) => [m.label, m.value]))
  if (gotDm !== JSON.stringify(expected.displayMetrics)) {
    errors.push(`displayMetrics ${gotDm} !== ${JSON.stringify(expected.displayMetrics)}`)
  }
  return errors
}

function synthetic(expected: Expected): Entry {
  return {
    results: expected.rows.map((r) =>
      'improvement' in r
        ? { metric: r.metric, before: 'Baseline', after: 'Improved', improvement: r.improvement }
        : { metric: r.metric, before: r.before, after: r.after, improvement: '10%' }
    ),
    displayMetrics: expected.displayMetrics.map(([label, value]) => ({ label, value })),
  }
}

describe('catalog detector', () => {
  it('passes a conforming synthetic entry for rows and metrics projects', () => {
    expect(
      catalogDiff(
        synthetic(EXPECTED['revenue-kpi'] as Expected),
        EXPECTED['revenue-kpi'] as Expected
      )
    ).toEqual([])
    const pp = EXPECTED['partnership-program-implementation'] as Expected
    expect(catalogDiff(synthetic(pp), pp)).toEqual([])
  })
  it('fails when one value changes', () => {
    const exp = EXPECTED['revenue-kpi'] as Expected
    const entry = synthetic(exp)
    ;(entry.results[0] as { after: string }).after = '95%'
    expect(catalogDiff(entry, exp).length).toBeGreaterThan(0)
  })
  it('fails when an extra row is left in the data', () => {
    const exp = EXPECTED['revenue-kpi'] as Expected
    const entry = synthetic(exp)
    entry.results.push({ metric: 'Extra', before: '1%', after: '2%', improvement: '100%' })
    expect(catalogDiff(entry, exp).length).toBeGreaterThan(0)
  })
  it('fails when a displayMetric value changes', () => {
    const exp = EXPECTED['revenue-kpi'] as Expected
    const entry = synthetic(exp)
    ;(entry.displayMetrics[0] as { value: string }).value = '$3.7M'
    expect(catalogDiff(entry, exp).length).toBeGreaterThan(0)
  })
})

describe('preview catalog (top level)', () => {
  it('the table covers exactly the showcase slugs', () => {
    expect(Object.keys(EXPECTED).sort()).toEqual(showcaseProjects.map((s) => s.slug).sort())
  })
  it('partnership-program-implementation is the only metrics-fallback project and none is empty', () => {
    const kinds = showcaseProjects.map((s) => [s.slug, buildProjectPreview(s).kind] as const)
    expect(kinds.filter(([, k]) => k === 'metrics').map(([s]) => s)).toEqual([
      'partnership-program-implementation',
    ])
    expect(kinds.filter(([, k]) => k === 'empty')).toEqual([])
  })
})

for (const entry of showcaseProjects) {
  describe(`preview catalog: ${entry.slug}`, () => {
    it('draws the write-up rows', () => {
      const exp = EXPECTED[entry.slug]
      expect(exp, `no expected table entry for ${entry.slug}`).toBeDefined()
      expect(catalogDiff(entry, exp as Expected).join('\n')).toBe('')
    })
  })
}
