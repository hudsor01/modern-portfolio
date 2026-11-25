import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { showcaseProjects } from '../projects'

const entry = showcaseProjects.find((p) => p.slug === 'revenue-kpi')

describe('revenue-kpi figures reconcile with the case-study write-up', () => {
  it('card displayMetrics match the narrative', () => {
    expect(entry?.displayMetrics.map((m) => m.value)).toEqual(['$4.2M', '65%', '94%'])
    expect(entry?.displayMetrics.map((m) => m.label)).toEqual([
      'Revenue Increase',
      'Manual Reporting Cut',
      'Forecast Accuracy',
    ])
  })

  it('contains no stale figures', () => {
    const json = JSON.stringify({
      ...entry,
      displayMetrics: entry?.displayMetrics.map((m) => ({ label: m.label, value: m.value })),
    })
    for (const stale of ['$3.7M', '95%', '40%']) expect(json).not.toContain(stale)
  })

  it('results rows carry write-up figures', () => {
    const rows = entry?.results ?? []
    expect(rows.find((r) => r.metric === 'Forecast Accuracy')).toMatchObject({
      before: '82%',
      after: '94%',
      improvement: '15%',
    })
    expect(rows.find((r) => r.metric === 'Manual Reporting Time')).toMatchObject({
      before: '15+ hours/week',
      after: '10+ hours saved weekly',
      improvement: '65%',
    })
  })

  it('narrative source contains the same figures', () => {
    const src = readFileSync(
      join(process.cwd(), 'src/app/projects/revenue-kpi/_components/NarrativeSections.tsx'),
      'utf8'
    )
    for (const s of ['formatCurrency(4200000)', 'value="94%"', 'value="65%"', '432%', '82%']) {
      expect(src).toContain(s)
    }
  })
})
