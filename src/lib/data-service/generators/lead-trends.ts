import { createSeededRandom } from '@/lib/seeded-random'
import { getDisplayYearMonth } from '@/lib/data-formatters'
import type { LeadTrendData } from '@/types/analytics'

export function generateLeadTrendData(
  monthsCount: number = 12,
  rng: () => number = createSeededRandom('lead-trends')
): LeadTrendData[] {
  const data: LeadTrendData[] = []
  const baseLeads = 950
  const baseConversionRate = 0.12
  const { year: currentYear, month: currentMonth } = getDisplayYearMonth()

  for (let i = 0; i < monthsCount; i++) {
    const date = new Date(Date.UTC(currentYear, currentMonth - i, 1))
    const monthName = date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
    const seasonalFactor = 1 + Math.sin((date.getUTCMonth() * Math.PI) / 6) * 0.15
    const leads = Math.floor(baseLeads * seasonalFactor * (0.85 + rng() * 0.3))
    const conversionRate = baseConversionRate + (rng() - 0.5) * 0.04
    const conversions = Math.floor(leads * Math.max(0.05, conversionRate))

    data.unshift({
      id: `lead-trend-${date.getTime()}`,
      timestamp: date,
      source: 'generated',
      month: monthName,
      leads,
      conversions,
      conversion_rate: Math.round((conversions / Math.max(leads, 1)) * 1000) / 10,
      metadata: {
        seasonal_factor: seasonalFactor,
      },
    })
  }

  return data
}
