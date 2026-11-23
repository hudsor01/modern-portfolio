import { createSeededRandom } from '@/lib/seeded-random'
import type { GrowthData } from '@/types/analytics'
import { getDisplayYearMonth } from '@/lib/data-formatters'
import { getBaseMetric } from './base'

export function generateGrowthData(
  baseMetrics: Map<string, number>,
  quartersCount: number = 8,
  rng: () => number = createSeededRandom('growth')
): GrowthData[] {
  const data: GrowthData[] = []
  const baseRevenue = getBaseMetric(baseMetrics, 'base_revenue')
  const growthTrend = getBaseMetric(baseMetrics, 'growth_trend')
  const { year: currentYear, month: currentMonth } = getDisplayYearMonth()

  for (let i = 0; i < quartersCount; i++) {
    const date = new Date(Date.UTC(currentYear, currentMonth - i * 3, 1))
    const quarter = `Q${Math.floor(date.getUTCMonth() / 3) + 1} ${date.getUTCFullYear()}`

    // Calculate realistic growth with some variance
    const quarterlyGrowthRate = growthTrend / 4 + (rng() - 0.5) * 0.05
    const cumulativeGrowth = (1 + quarterlyGrowthRate) ** (quartersCount - i)

    const revenue = Math.floor(baseRevenue * cumulativeGrowth * (0.9 + rng() * 0.2))
    const partners = Math.floor(150 * 1.03 ** (quartersCount - i) * (0.95 + rng() * 0.1))
    const deals = Math.floor(200 * 1.05 ** (quartersCount - i) * (0.9 + rng() * 0.2))

    // Calculate growth rate compared to same quarter previous year
    const yoyGrowthRate =
      i >= 4
        ? (revenue / (data[i - 4]?.revenue || revenue * 0.85) - 1) * 100
        : quarterlyGrowthRate * 4 * 100

    // Target achievement (assuming targets grow with inflation + company goals)
    const targetRevenue = baseRevenue * 1.15 ** ((quartersCount - i) / 4)
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
