import { createSeededRandom } from '@/lib/seeded-random'
import type { GrowthData } from '@/types/analytics'
import { getDisplayYearMonth } from '@/lib/data-formatters'
import { getBaseMetric } from './base'

/**
 * Owner rule (A11Y-07): the revenue trend shows 7 completed quarters ending at
 * the last completed quarter. For example, while Q4 2026 is in progress the
 * series runs Q1 2025 to Q3 2026.
 */
export const REVENUE_TREND_QUARTERS = 7

/**
 * Quarterly series ending at the last completed quarter on the America/Chicago
 * calendar, computed from the injected `now`. The revenue-kpi page is
 * prerendered and revalidated hourly (ISR), so the served window can trail a
 * quarter rollover by at most the regeneration lag, never shows an unfinished
 * quarter, and does not wait for a deploy to advance.
 */
export function generateGrowthData(
  baseMetrics: Map<string, number>,
  quartersCount: number = REVENUE_TREND_QUARTERS,
  rng: () => number = createSeededRandom('growth'),
  now: Date = new Date()
): GrowthData[] {
  const data: GrowthData[] = []
  const baseRevenue = getBaseMetric(baseMetrics, 'base_revenue')
  const growthTrend = getBaseMetric(baseMetrics, 'growth_trend')
  const { year, month } = getDisplayYearMonth(now)
  // First month of the most recent fully elapsed quarter (Date.UTC rolls negatives back a year)
  const lastCompletedQuarterStart = month - (month % 3) - 3

  for (let i = 0; i < quartersCount; i++) {
    const date = new Date(Date.UTC(year, lastCompletedQuarterStart - i * 3, 1))
    const quarter = `Q${Math.floor(date.getUTCMonth() / 3) + 1} ${date.getUTCFullYear()}`

    // Calculate realistic growth with some variance
    const quarterlyGrowthRate = growthTrend / 4 + (rng() - 0.5) * 0.05
    const cumulativeGrowth = (1 + quarterlyGrowthRate) ** (quartersCount - i)

    const revenue = Math.floor(baseRevenue * cumulativeGrowth * (0.9 + rng() * 0.2))
    const partners = Math.floor(150 * 1.03 ** (quartersCount - i) * (0.95 + rng() * 0.1))
    const deals = Math.floor(200 * 1.05 ** (quartersCount - i) * (0.9 + rng() * 0.2))

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
      // Provisional: annualised quarterly rate. Rows that have the same quarter
      // of the previous year in the series are overwritten with true YoY below.
      growth_rate: Math.round(quarterlyGrowthRate * 4 * 100 * 100) / 100,
      target_achievement: Math.round(targetAchievement * 100) / 100,
      metadata: {
        quarterly_growth_rate: Math.round(quarterlyGrowthRate * 10000) / 100,
        target_revenue: Math.floor(targetRevenue),
        cumulative_growth: Math.round(cumulativeGrowth * 1000) / 1000,
      },
    })
  }

  // Year-over-year growth: `data` is oldest-first, so the same quarter of the
  // previous year sits four rows earlier. Computed after the loop because the
  // loop generates newest-first and the earlier quarter does not exist yet.
  for (let k = 4; k < data.length; k++) {
    const current = data[k]
    const yearAgo = data[k - 4]
    if (current && yearAgo && yearAgo.revenue > 0) {
      current.growth_rate = Math.round((current.revenue / yearAgo.revenue - 1) * 100 * 100) / 100
    }
  }

  return data
}
