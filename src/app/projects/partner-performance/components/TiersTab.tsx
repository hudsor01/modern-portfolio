'use client'

import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils/data-formatters'

const partnerTierPerformance = [
  {
    tier: 'Certified Partners',
    count: 12,
    revenue: 687420,
    avgDeal: 485,
    winRate: 89.4,
    cycleLength: 73,
    roi: 8.2,
  },
  {
    tier: 'Legacy Partners',
    count: 15,
    revenue: 216967,
    avgDeal: 298,
    winRate: 78.1,
    cycleLength: 89,
    roi: 3.1,
  },
  {
    tier: 'Inactive Partners',
    count: 7,
    revenue: 0,
    avgDeal: 0,
    winRate: 0,
    cycleLength: 126,
    roi: 0,
  },
  {
    tier: 'New Partners',
    count: 13,
    revenue: 183033,
    avgDeal: 267,
    winRate: 71.2,
    cycleLength: 105,
    roi: 2.4,
  },
]

export function TiersTab() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Partner Tier Intelligence & ROI Metrics</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Comprehensive partner performance analysis across certification levels and engagement tiers
      </p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold">Partner Tier</th>
              <th className="text-left py-3 px-4 font-semibold">Count</th>
              <th className="text-left py-3 px-4 font-semibold">Revenue</th>
              <th className="text-left py-3 px-4 font-semibold">Avg Deal</th>
              <th className="text-left py-3 px-4 font-semibold">Win Rate</th>
              <th className="text-left py-3 px-4 font-semibold">Cycle (Days)</th>
              <th className="text-left py-3 px-4 font-semibold">ROI</th>
            </tr>
          </thead>
          <tbody>
            {partnerTierPerformance.map((tier, index) => (
              <tr
                key={index}
                className="border-b border-border/50 hover:bg-muted/50 transition-colors"
              >
                <td className="py-4 px-4 font-medium">{tier.tier}</td>
                <td className="py-4 px-4">{formatNumber(tier.count)}</td>
                <td className="py-4 px-4">{formatCurrency(tier.revenue, { compact: true })}</td>
                <td className="py-4 px-4">{formatCurrency(tier.avgDeal)}</td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tier.winRate >= 85
                        ? 'bg-success/20 text-success'
                        : tier.winRate >= 70
                          ? 'bg-warning/20 text-warning'
                          : 'bg-destructive/20 text-destructive'
                    }`}
                  >
                    {formatPercentage(tier.winRate / 100)}
                  </span>
                </td>
                <td className="py-4 px-4">{formatNumber(tier.cycleLength)}</td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tier.roi >= 5
                        ? 'bg-success/20 text-success'
                        : tier.roi >= 3
                          ? 'bg-warning/20 text-warning'
                          : 'bg-destructive/20 text-destructive'
                    }`}
                  >
                    {tier.roi}x
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
