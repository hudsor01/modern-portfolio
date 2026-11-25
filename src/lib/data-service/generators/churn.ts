import { createSeededRandom } from '@/lib/seeded-random'
import type { ChurnAnalyticsData } from '@/types/analytics'
import { getDisplayYearMonth } from '@/lib/data-formatters'
import { getBaseMetric } from './base'

export function generateChurnData(
  baseMetrics: Map<string, number>,
  monthsCount: number = 12,
  rng: () => number = createSeededRandom('churn')
): ChurnAnalyticsData[] {
  const data: ChurnAnalyticsData[] = []
  const baseChurn = getBaseMetric(baseMetrics, 'churn_baseline')
  const basePartners = getBaseMetric(baseMetrics, 'base_partners')
  const { year: currentYear, month: currentMonth } = getDisplayYearMonth()

  for (let i = 0; i < monthsCount; i++) {
    const date = new Date(Date.UTC(currentYear, currentMonth - i, 1))
    const monthName = date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    })

    // Add seasonal variation (higher churn in Q1, lower in Q4)
    const seasonalFactor = 1 + Math.sin((date.getUTCMonth() * Math.PI) / 6) * 0.3
    const churnRate = baseChurn * seasonalFactor + (rng() - 0.5) * 0.8

    const totalPartners = Math.floor(basePartners + (rng() - 0.5) * 20)
    const churnedPartners = Math.floor((churnRate / 100) * totalPartners)
    const newPartners = Math.floor(2 + rng() * 8)
    const retainedPartners = totalPartners - churnedPartners
    const recoveryRate = Math.max(0, Math.min(100, 85 + (rng() - 0.5) * 20))

    data.unshift({
      id: `churn-${date.getTime()}`,
      timestamp: date,
      source: 'generated',
      month: monthName,
      churn_rate: Math.max(0.5, Math.min(5.0, churnRate)),
      retained_partners: retainedPartners,
      churned_partners: churnedPartners,
      new_partners: newPartners,
      recovery_rate: recoveryRate,
      metadata: {
        seasonal_factor: seasonalFactor,
        total_partners: totalPartners,
      },
    })
  }

  return data
}
