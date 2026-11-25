// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AnalyticsDataService } from '../service'
import { BASE_METRICS } from '../generators/base'
import { generateYearOverYearData } from '../generators/year-over-year'
import { calculateGrowth } from '@/app/projects/revenue-kpi/utils'
import { formatPercentage } from '@/lib/data-formatters'
import { TRANSACTION_GROWTH } from '@/lib/stats'

vi.mock('@/lib/logger', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), fatal: vi.fn() },
}))

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-11-15T18:00:00Z'))
})
afterEach(() => {
  vi.useRealTimers()
})

describe('year-over-year latestTransactionGrowthPct anchor', () => {
  it('grows exactly 432% latest vs previous', () => {
    const data = generateYearOverYearData(BASE_METRICS, 5, undefined, {
      latestTransactionGrowthPct: 432,
    })
    const latest = data[data.length - 1]!
    const prev = data[data.length - 2]!
    const growth = calculateGrowth(latest.total_transactions, prev.total_transactions)
    expect(Math.round(growth)).toBe(432)
    expect(formatPercentage(growth / 100, { decimals: 0 })).toBe(TRANSACTION_GROWTH)
  })

  it('recomputes revenue_per_transaction', () => {
    const data = generateYearOverYearData(BASE_METRICS, 5, undefined, {
      latestTransactionGrowthPct: 432,
    })
    const latest = data[data.length - 1]!
    expect(latest.metadata?.revenue_per_transaction).toBe(
      Math.floor(latest.total_revenue / latest.total_transactions)
    )
  })

  it('keeps revenue_per_transaction coherent: only the anchored year breaks the trend', () => {
    const pct = 432
    const data = generateYearOverYearData(BASE_METRICS, 5, undefined, {
      latestTransactionGrowthPct: pct,
    })
    const rpt = data.map((d) => d.metadata?.revenue_per_transaction as number)
    // Pre-anchor years: revenue and transactions both compound at single-digit to
    // low-double-digit rates, so the ratio moves by well under 25% a year.
    for (let i = 1; i < data.length - 1; i++) {
      expect(Math.abs(rpt[i]! / rpt[i - 1]! - 1)).toBeLessThan(0.25)
    }
    // Anchored year: the drop is exactly the revenue ratio over the 5.32x volume
    // jump (within integer flooring), not an unexplained collapse.
    const last = data.length - 1
    const expected = data[last]!.total_revenue / data[last - 1]!.total_revenue / (1 + pct / 100)
    expect(rpt[last]! / rpt[last - 1]!).toBeCloseTo(expected, 1)
    expect(rpt[last]!).toBeGreaterThan(0)
  })

  it('without the option the seeded series is the frozen 12-02 output (no anchor applied)', () => {
    const data = generateYearOverYearData(BASE_METRICS, 5)
    expect(data.map((d) => [d.year, d.total_revenue, d.total_transactions])).toEqual([
      [2022, 10000000, 800],
      [2023, 11428294, 875],
      [2024, 12597975, 960],
      [2025, 14316905, 1021],
      [2026, 15990660, 1096],
    ])
    // An empty options object must not anchor either.
    expect(generateYearOverYearData(BASE_METRICS, 5, undefined, {})[4]!.total_transactions).toBe(
      1096
    )
  })

  it('service satisfies the 432 relation', async () => {
    const svc = new AnalyticsDataService()
    try {
      const data = await svc.getYearOverYearData(5, false)
      const growth = calculateGrowth(
        data[data.length - 1]!.total_transactions,
        data[data.length - 2]!.total_transactions
      )
      expect(Math.round(growth)).toBe(432)
    } finally {
      svc.destroy()
    }
  })

  it('seeded latest revenue exceeds the $4.2M framed by the narrative', () => {
    const data = generateYearOverYearData(BASE_METRICS, 5, undefined, {
      latestTransactionGrowthPct: 432,
    })
    expect(data[data.length - 1]!.total_revenue).toBeGreaterThan(4_200_000)
  })

  it('single year does not throw and stays unchanged', () => {
    const base = generateYearOverYearData(BASE_METRICS, 1)
    const anchored = generateYearOverYearData(BASE_METRICS, 1, undefined, {
      latestTransactionGrowthPct: 432,
    })
    expect(anchored).toEqual(base)
  })
})
