import type { YearOverYearData } from '@/types/analytics'
import { getBaseMetric } from './base'

export function generateYearOverYearData(
  baseMetrics: Map<string, number>,
  yearsCount: number = 5
): YearOverYearData[] {
  const data: YearOverYearData[] = []
  const baseRevenue = getBaseMetric(baseMetrics, 'base_revenue')
  const growthTrend = getBaseMetric(baseMetrics, 'growth_trend')
  const basePartners = getBaseMetric(baseMetrics, 'base_partners')
  const currentYear = new Date().getFullYear()

  for (let i = 0; i < yearsCount; i++) {
    const year = currentYear - i
    const annualGrowth = growthTrend + (Math.random() - 0.5) * 0.06
    const cumulativeGrowth = (1 + annualGrowth) ** (yearsCount - i - 1)

    const totalRevenue = Math.floor(baseRevenue * cumulativeGrowth * 4) // Annual total
    const totalTransactions = Math.floor(
      800 * 1.08 ** (yearsCount - i - 1) * (0.9 + Math.random() * 0.2)
    )
    const commissionRate = 0.08 + (Math.random() - 0.5) * 0.02
    const totalCommissions = Math.floor(totalRevenue * commissionRate)
    const partnerCount = Math.floor(
      basePartners * 1.06 ** (yearsCount - i - 1) * (0.9 + Math.random() * 0.2)
    )

    const growthPercentage =
      i === 0 ? 0 : (totalRevenue / (data[i - 1]?.total_revenue || totalRevenue * 0.9) - 1) * 100
    const commissionGrowth = annualGrowth * 100 + (Math.random() - 0.5) * 5

    // Market share (simulated - growing over time)
    const marketShare = 2.5 + (yearsCount - i) * 0.3 + (Math.random() - 0.5) * 0.5

    data.unshift({
      id: `yoy-${year}`,
      timestamp: new Date(year, 11, 31), // End of year
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

  return data
}
