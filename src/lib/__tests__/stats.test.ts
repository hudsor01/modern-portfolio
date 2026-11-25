import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import { STAT_LABELS, STAT_VALUES, TRANSACTION_GROWTH_CONTEXT } from '../stats'

describe('stats', () => {
  it('exposes canonical labels', () => {
    expect(STAT_LABELS).toEqual({
      revenue: 'Revenue Impact',
      'transaction-growth': 'Transaction Growth',
      'network-growth': 'Network Growth',
      years: 'Years Experience',
    })
  })

  it('exposes canonical values', () => {
    expect(STAT_VALUES).toEqual({
      revenue: '$4.8M+',
      'transaction-growth': '432%',
      'network-growth': '2,217%',
      years: '10+',
    })
  })

  it('exposes the single context line', () => {
    expect(TRANSACTION_GROWTH_CONTEXT).toBe(
      'On track year-over-year, per the Revenue KPI case study'
    )
  })

  it('no longer documents per-surface label drift', () => {
    const src = readFileSync(resolve(__dirname, '../stats.ts'), 'utf8')
    expect(src).not.toContain('intentionally differ')
  })
})
