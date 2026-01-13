'use client'

import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils/data-formatters'

const top80PercentPartners = [
  { partner: 'TechFlow Solutions', revenue: 287650, deals: 89, winRate: 94.2, tier: 'Certified' },
  {
    partner: 'Digital Marketing Pro',
    revenue: 184320,
    deals: 67,
    winRate: 87.6,
    tier: 'Certified',
  },
  { partner: 'Revenue Boost Inc', revenue: 156780, deals: 54, winRate: 91.1, tier: 'Certified' },
  { partner: 'Growth Partners LLC', revenue: 142890, deals: 48, winRate: 85.4, tier: 'Legacy' },
  { partner: 'Channel Dynamics', revenue: 133247, deals: 45, winRate: 82.2, tier: 'Legacy' },
]

export function TopPerformersTab() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Top 80% Revenue Partners (Pareto Principle)</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Elite partner performance driving majority of channel revenue following the proven 80/20
        distribution rule
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {top80PercentPartners.map((partner, index) => (
          <div key={index} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-semibold">{partner.partner}</h4>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  partner.tier === 'Certified'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-secondary/20 text-secondary'
                }`}
              >
                {partner.tier}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Revenue:</span>
                <span className="font-medium">
                  {formatCurrency(partner.revenue, { compact: true })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deals:</span>
                <span className="font-medium">{formatNumber(partner.deals)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Win Rate:</span>
                <span className="font-medium">{formatPercentage(partner.winRate / 100)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
