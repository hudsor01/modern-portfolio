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

  it('is identical to 12-02 output without options', () => {
    expect(generateYearOverYearData(BASE_METRICS, 5)).toEqual(
      generateYearOverYearData(BASE_METRICS, 5, undefined, {})
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
