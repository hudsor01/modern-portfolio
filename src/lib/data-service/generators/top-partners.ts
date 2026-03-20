import type { TopPartnerData } from '@/types/analytics'

export function generateTopPartnersData(
  _baseMetrics: Map<string, number>,
  count: number = 15
): TopPartnerData[] {
  const partnerNames = [
    'Enterprise Solutions Inc',
    'Tech Innovations LLC',
    'Global Systems Corp',
    'Digital Transform Co',
    'Cloud Services Pro',
    'Data Analytics Plus',
    'Modern Software Labs',
    'Integration Experts',
    'AI Solutions Group',
    'Cyber Security Pro',
    'DevOps Consultants',
    'Mobile First Tech',
    'Blockchain Ventures',
    'IoT Innovations',
    'Machine Learning Co',
  ]

  const tiers: Array<{ name: TopPartnerData['tier']; multiplier: number; probability: number }> = [
    { name: 'platinum', multiplier: 2.5, probability: 0.1 },
    { name: 'gold', multiplier: 1.8, probability: 0.2 },
    { name: 'silver', multiplier: 1.3, probability: 0.3 },
    { name: 'bronze', multiplier: 1.0, probability: 0.4 },
  ]

  return partnerNames
    .slice(0, count)
    .map((name, index): TopPartnerData => {
      // Explicit return type for map callback
      // Higher tier partners are more likely to be at the top
      const tierRandom = Math.random() * (1 + index * 0.1)
      // tiers array is guaranteed non-empty, so selectedTier will be initialized.
      let selectedTier: {
        name: TopPartnerData['tier']
        multiplier: number
        probability: number
      } = tiers[tiers.length - 1]!
      let cumulativeProbability = 0

      for (const tier of tiers) {
        cumulativeProbability += tier.probability
        if (tierRandom <= cumulativeProbability) {
          selectedTier = tier
          break
        }
      }

      const baseRevenue = 300000 + Math.random() * 400000
      const revenue = Math.floor(
        baseRevenue * selectedTier!.multiplier * (0.8 + Math.random() * 0.4)
      )
      const dealsPerMonth = 2 + Math.floor(Math.random() * 8)
      const deals = dealsPerMonth * 12
      const commission = Math.floor(revenue * (0.08 + Math.random() * 0.04))

      // Higher tier partners tend to have better satisfaction and retention
      const tierBonus = tiers.indexOf(selectedTier) * 5
      const satisfactionScore = Math.min(100, 75 + tierBonus + Math.random() * 15)
      const retentionProbability = Math.min(100, 80 + tierBonus + Math.random() * 10)

      const partnerEntry: TopPartnerData = {
        // Explicitly type the object literal
        id: `partner-${name.toLowerCase().replace(/\s+/g, '-')}`,
        timestamp: new Date(),
        source: 'generated',
        name,
        revenue,
        deals,
        commission,
        tier: selectedTier!.name,
        satisfaction_score: Math.round(satisfactionScore * 100) / 100,
        retention_probability: Math.round(retentionProbability * 100) / 100,
        metadata: {
          revenue_per_deal: Math.floor(revenue / deals),
          commission_rate: Math.round((commission / revenue) * 10000) / 100,
          tier_multiplier: selectedTier!.multiplier,
          deals_per_month: dealsPerMonth,
        },
      }
      return partnerEntry
    })
    .sort((a, b) => b.revenue - a.revenue) // Sort by revenue descending
}
