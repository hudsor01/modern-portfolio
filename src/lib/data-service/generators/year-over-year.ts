import { createSeededRandom } from '@/lib/seeded-random'
import type { YearOverYearData } from '@/types/analytics'
import { getDisplayYearMonth } from '@/lib/data-formatters'
import { getBaseMetric } from './base'

export function generateYearOverYearData(
  baseMetrics: Map<string, number>,
  yearsCount: number = 5,
  rng: () => number = createSeededRandom('year-over-year'),
  options: { latestTransactionGrowthPct?: number } = {}
): YearOverYearData[] {
  const data: YearOverYearData[] = []
  const baseRevenue = getBaseMetric(baseMetrics, 'base_revenue')
  const growthTrend = getBaseMetric(baseMetrics, 'growth_trend')
  const basePartners = getBaseMetric(baseMetrics, 'base_partners')
  const { year: currentYear } = getDisplayYearMonth()

  // Oldest year first: every series compounds the previous year's value by a
  // positive per-year rate (trend ± a small spread), so revenue, transactions,
  // partners and commissions all rise every year and growth_percentage is the
  // true year-on-year change. The commission rate drifts by at most ±0.2pt, far
  // less than revenue growth, so commissions rise with revenue.
  const firstYearRevenue = baseRevenue * 4 // Annual total
  let revenue = firstYearRevenue
  let transactions = 800
  let partners = basePartners
  let previousRevenue = 0

  for (let k = 0; k < yearsCount; k++) {
    const year = currentYear - (yearsCount - 1 - k)
    const annualGrowth = growthTrend + (rng() - 0.5) * 0.06
    const transactionGrowth = 0.08 + (rng() - 0.5) * 0.04
    const commissionRate = 0.08 + (rng() - 0.5) * 0.004
    const partnerGrowth = 0.06 + (rng() - 0.5) * 0.04
    if (k > 0) {
      revenue *= 1 + annualGrowth
      transactions *= 1 + transactionGrowth
      partners *= 1 + partnerGrowth
    }
    const cumulativeGrowth = revenue / firstYearRevenue

    const totalRevenue = Math.floor(revenue)
    const totalTransactions = Math.floor(transactions)
    const totalCommissions = Math.floor(totalRevenue * commissionRate)
    const partnerCount = Math.floor(partners)

    const growthPercentage = k === 0 ? 0 : (totalRevenue / previousRevenue - 1) * 100
    previousRevenue = totalRevenue
    const commissionGrowth = annualGrowth * 100 + (rng() - 0.5) * 5

    // Market share (simulated - growing over time)
    const marketShare = 2.5 + (k + 1) * 0.3 + (rng() - 0.5) * 0.5

    data.push({
      id: `yoy-${year}`,
      timestamp: new Date(Date.UTC(year, 11, 31)), // End of year
      source: 'generated',
      year,
      total_revenue: totalRevenue,
      total_transactions: totalTransactions,
      total_commissions: totalCommissions,
      partner_count: partnerCount,
      commission_growth_percentage: Math.round(commissionGrowth * 100) / 100,
      growth_percentage: Math.round(growthPercentage * 100) / 100,
      market_share: Math.round(marketShare * 100) / 100,
      metadata: {
        commission_rate: Math.round(commissionRate * 10000) / 100,
        revenue_per_transaction: Math.floor(totalRevenue / totalTransactions),
        cumulative_growth: Math.round(cumulativeGrowth * 1000) / 1000,
      },
    })
  }

  // Anchor: the owner-locked "Volume +432%" figure forces the latest year's
  // transactions to prev * (1 + pct/100). Revenue (and the growth/commission
  // figures shown beside it) must not move, so revenue_per_transaction falls by
  // a factor of (1 + revenueGrowth) / (1 + pct/100) in that one year. That drop
  // is the unavoidable arithmetic of the anchor, not drift in the generator:
  // every earlier year's ratio moves only by the small revenue/transaction
  // growth spread (pinned in year-over-year-anchor.test.ts). The metadata field
  // is not rendered anywhere; it is recomputed here so it stays equal to
  // revenue / transactions for the year it describes.
  const pct = options.latestTransactionGrowthPct
  if (pct !== undefined && data.length >= 2) {
    const latest = data[data.length - 1]
    const prev = data[data.length - 2]
    if (latest && prev) {
      latest.total_transactions = Math.round(prev.total_transactions * (1 + pct / 100))
      latest.metadata = {
        ...latest.metadata,
        revenue_per_transaction: Math.floor(latest.total_revenue / latest.total_transactions),
      }
    }
  }

  return data
}
