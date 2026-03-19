import type { LeadAttributionData } from '@/types/analytics'

export function generateLeadAttributionData(
  _baseMetrics: Map<string, number>
): LeadAttributionData[] {
  const sources = [
    { name: 'Website', traffic_quality: 0.8, cost_factor: 0.3 },
    { name: 'Referrals', traffic_quality: 0.95, cost_factor: 0.1 },
    { name: 'LinkedIn', traffic_quality: 0.75, cost_factor: 0.6 },
    { name: 'Conferences', traffic_quality: 0.85, cost_factor: 1.2 },
    { name: 'Email', traffic_quality: 0.65, cost_factor: 0.4 },
    { name: 'Google Ads', traffic_quality: 0.7, cost_factor: 0.8 },
    { name: 'Content Marketing', traffic_quality: 0.8, cost_factor: 0.5 },
  ]

  return sources.map((source) => {
    const baseLeads = 100 + Math.floor(Math.random() * 400)
    const qualificationRate = source.traffic_quality * (0.4 + Math.random() * 0.4)
    const closingRate = qualificationRate * (0.15 + Math.random() * 0.25)

    const leads = Math.floor(baseLeads * (0.8 + Math.random() * 0.4))
    const qualified = Math.floor(leads * qualificationRate)
    const closed = Math.floor(qualified * (closingRate / qualificationRate))
    const avgDealSize = 20000 + Math.random() * 30000
    const revenue = closed * avgDealSize
    const costPerLead = 50 + source.cost_factor * 150 + Math.random() * 100
    const conversionRate = (closed / leads) * 100
    const totalCost = leads * costPerLead
    const roi = ((revenue - totalCost) / totalCost) * 100

    return {
      id: `lead-${source.name.toLowerCase().replace(/\s+/g, '-')}`,
      timestamp: new Date(),
      source: 'generated', // This is from BaseAnalyticsData
      channel: source.name, // This is the specific lead channel
      leads,
      qualified,
      closed,
      revenue: Math.floor(revenue),
      cost_per_lead: Math.floor(costPerLead),
      conversion_rate: Math.round(conversionRate * 100) / 100,
      roi: Math.round(roi * 100) / 100,
      metadata: {
        traffic_quality: source.traffic_quality,
        avg_deal_size: Math.floor(avgDealSize),
        total_cost: Math.floor(totalCost),
      },
    }
  })
}
