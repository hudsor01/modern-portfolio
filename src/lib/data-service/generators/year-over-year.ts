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

  // Oldest year first: each year's revenue compounds the previous year's by
  // that year's own growth rate (growthTrend ± 3%, always positive), so the
  // series rises every year and growth_percentage is the true year-on-year change.
  const firstYearRevenue = baseRevenue * 4 // Annual total
  let revenue = firstYearRevenue
  let previousRevenue = 0

  for (let k = 0; k < yearsCount; k++) {
    const year = currentYear - (yearsCount - 1 - k)
    const annualGrowth = growthTrend + (rng() - 0.5) * 0.06
    if (k > 0) revenue *= 1 + annualGrowth
    const cumulativeGrowth = revenue / firstYearRevenue

    const totalRevenue = Math.floor(revenue)
    const totalTransactions = Math.floor(800 * 1.08 ** k * (0.9 + rng() * 0.2))
    const commissionRate = 0.08 + (rng() - 0.5) * 0.02
    const totalCommissions = Math.floor(totalRevenue * commissionRate)
    const partnerCount = Math.floor(basePartners * 1.06 ** k * (0.9 + rng() * 0.2))

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
