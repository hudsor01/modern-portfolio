import type { GrowthData } from '@/types/analytics'
import { getBaseMetric } from './base'

export function generateGrowthData(
  baseMetrics: Map<string, number>,
  quartersCount: number = 8
): GrowthData[] {
  const data: GrowthData[] = []
  const baseRevenue = getBaseMetric(baseMetrics, 'base_revenue')
  const growthTrend = getBaseMetric(baseMetrics, 'growth_trend')
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()

  for (let i = 0; i < quartersCount; i++) {
    const date = new Date(currentYear, currentMonth - i * 3, 1)
    const quarter = `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`

    // Calculate realistic growth with some variance
    const quarterlyGrowthRate = growthTrend / 4 + (Math.random() - 0.5) * 0.05
    const cumulativeGrowth = Math.pow(1 + quarterlyGrowthRate, quartersCount - i)

    const revenue = Math.floor(baseRevenue * cumulativeGrowth * (0.9 + Math.random() * 0.2))
    const partners = Math.floor(
      150 * Math.pow(1.03, quartersCount - i) * (0.95 + Math.random() * 0.1)
    )
    const deals = Math.floor(
      200 * Math.pow(1.05, quartersCount - i) * (0.9 + Math.random() * 0.2)
    )

    // Calculate growth rate compared to same quarter previous year
    const yoyGrowthRate =
      i >= 4
        ? (revenue / (data[i - 4]?.revenue || revenue * 0.85) - 1) * 100
        : quarterlyGrowthRate * 4 * 100

    // Target achievement (assuming targets grow with inflation + company goals)
    const targetRevenue = baseRevenue * Math.pow(1.15, (quartersCount - i) / 4)
    const targetAchievement = (revenue / targetRevenue) * 100

    data.unshift({
      id: `growth-${date.getTime()}`,
      timestamp: date,
      source: 'generated',
      quarter,
      revenue,
      partners,
      deals,
      growth_rate: Math.round(yoyGrowthRate * 100) / 100,
      target_achievement: Math.round(targetAchievement * 100) / 100,
      metadata: {
        quarterly_growth_rate: Math.round(quarterlyGrowthRate * 10000) / 100,
        target_revenue: Math.floor(targetRevenue),
        cumulative_growth: Math.round(cumulativeGrowth * 1000) / 1000,
      },
    })
  }

  return data
}
