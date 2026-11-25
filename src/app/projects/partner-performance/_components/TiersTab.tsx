'use client'

import { formatCurrency, formatNumber, formatPercentage } from '@/lib/data-formatters'
import { partnerProgramMetrics } from '@/data/partner-program-metrics'

// Real figures, derived from the 2024 partner-platform export by
// scripts/derive-partner-metrics.ts. Only tiers with recorded transaction
// activity are shown; the rest are $0 rows that say nothing.
//
// The previous hard-coded array carried an "ROI" column. That is not derivable
// from this export — it has no cost data — so the column is gone rather than
// estimated. Win rate and cycle length ARE derivable (deals carry partner_id
// plus created/close dates) and are now real.
const partnerTierPerformance = partnerProgramMetrics.partnerTiers
  .filter((t) => t.revenueUsd > 0)
  .map((t) => ({
    tier: t.tier,
    count: t.count,
    revenue: t.revenueUsd,
    avgDeal: t.avgTransactionUsd,
    winRate: t.winRatePct,
    cycleLength: t.medianDaysToClose,
  }))
  .sort((a, b) => b.revenue - a.revenue)

export function TiersTab() {
  return (
    <div>
      <h3 className="mb-4">Partner Tier Intelligence & ROI Metrics</h3>
      <p className="mb-6">
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
              <th className="text-left py-3 px-4 font-semibold">Median Days to Close</th>
            </tr>
          </thead>
          <tbody>
            {partnerTierPerformance.map((tier, index) => (
              <tr
                key={index}
                className="border-b border-border hover:bg-muted/50 transition-colors"
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
                          ? 'bg-warning/20 text-warning-text'
                          : 'bg-destructive/20 text-destructive'
                    }`}
                  >
                    {formatPercentage(tier.winRate / 100)}
                  </span>
                </td>
                <td className="py-4 px-4">{formatNumber(tier.cycleLength)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
