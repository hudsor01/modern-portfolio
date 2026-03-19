import type { LeadTrendData } from '@/types/analytics'

export function generateLeadTrendData(
  _baseMetrics: Map<string, number>,
  monthsCount: number = 12
): LeadTrendData[] {
  const data: LeadTrendData[] = []
  const baseLeads = 950
  const baseConversionRate = 0.12
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()

  for (let i = 0; i < monthsCount; i++) {
    const date = new Date(currentYear, currentMonth - i, 1)
    const monthName = date.toLocaleDateString('en-US', { month: 'short' })
    const seasonalFactor = 1 + Math.sin((date.getMonth() * Math.PI) / 6) * 0.15
    const leads = Math.floor(baseLeads * seasonalFactor * (0.85 + Math.random() * 0.3))
    const conversionRate = baseConversionRate + (Math.random() - 0.5) * 0.04
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
