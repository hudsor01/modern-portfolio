'use client'

import dynamic from 'next/dynamic'
import { ChartContainer } from '@/components/ui/chart-container'
import { SectionCard } from '@/components/ui/section-card'
import { commissionTiers } from '../data/constants'
import { formatCurrency, formatPercentage } from '@/lib/data-formatters'

const CommissionTierChart = dynamic(() => import('./CommissionTierChart'), {
  loading: () => (
    <div className="h-[var(--chart-height-md)] w-full animate-pulse bg-muted rounded-lg" />
  ),
  ssr: false,
})

export function TiersTab() {
  return (
    <div className="space-y-8 mb-12">
      {/* Commission Tier Visualization */}
      <ChartContainer
        title="Commission Tier Performance & ROI Analysis"
        description="Multi-tier commission structure optimization with performance-based adjustments"
        variant="glass"
        padding="lg"
      >
        <CommissionTierChart />
      </ChartContainer>

      {/* Tier Details Table */}
      <SectionCard
        title="Partner Commission Tier Structure & Requirements"
        description="Detailed commission tier analysis with earnings, requirements, and ROI metrics"
        variant="glass"
        padding="lg"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">Tier</th>
                <th className="text-left py-3 px-4 font-semibold">Partners</th>
                <th className="text-left py-3 px-4 font-semibold">Commission Rate</th>
                <th className="text-left py-3 px-4 font-semibold">Total Earnings</th>
                <th className="text-left py-3 px-4 font-semibold">Avg Earnings</th>
                <th className="text-left py-3 px-4 font-semibold">ROI</th>
                <th className="text-left py-3 px-4 font-semibold">Requirements</th>
              </tr>
            </thead>
            <tbody>
              {commissionTiers.map((tier, index) => (
                <tr
                  key={index}
                  className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <td className="py-4 px-4 font-medium">{tier.tier}</td>
                  <td className="py-4 px-4">{tier.count}</td>
                  <td className="py-4 px-4">{formatPercentage(tier.commissionRate / 100)}</td>
                  <td className="py-4 px-4">{formatCurrency(tier.totalEarnings)}</td>
                  <td className="py-4 px-4">{formatCurrency(tier.avgEarnings)}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tier.roi >= 4
                          ? 'bg-success/10 text-success'
                          : tier.roi >= 3
                            ? 'bg-warning/10 text-warning'
                            : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {tier.roi.toFixed(1)}x
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">{tier.requirements}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}
