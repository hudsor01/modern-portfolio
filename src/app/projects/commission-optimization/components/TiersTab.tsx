'use client'

import dynamic from 'next/dynamic'

import { commissionTiers } from '../data/constants'
import { formatCurrency, formatPercent } from '../utils'

const CommissionTierChart = dynamic(() => import('../CommissionTierChart'), {
  loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true
})

export function TiersTab() {
  return (
    <div className="space-y-8 mb-12">
      {/* Commission Tier Visualization */}
      <div
        className="glass rounded-2xl p-8 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-6">
          <h2 className="typography-h3 mb-2">Commission Tier Performance & ROI Analysis</h2>
          <p className="typography-muted">Multi-tier commission structure optimization with performance-based adjustments</p>
        </div>
        <CommissionTierChart />
      </div>

      {/* Tier Details Table */}
      <div
        className="glass rounded-2xl p-8 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-6">
          <h2 className="typography-h3 mb-2">Partner Commission Tier Structure & Requirements</h2>
          <p className="typography-muted">Detailed commission tier analysis with earnings, requirements, and ROI metrics</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
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
                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-medium">{tier.tier}</td>
                  <td className="py-4 px-4">{tier.count}</td>
                  <td className="py-4 px-4">{formatPercent(tier.commissionRate)}</td>
                  <td className="py-4 px-4">{formatCurrency(tier.totalEarnings)}</td>
                  <td className="py-4 px-4">{formatCurrency(tier.avgEarnings)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tier.roi >= 4 ? 'bg-success/20 text-success' :
                      tier.roi >= 3 ? 'bg-warning/20 text-warning' :
                      'bg-destructive/20 text-destructive'
                    }`}>
                      {tier.roi.toFixed(1)}x
                    </span>
                  </td>
                  <td className="py-4 px-4 typography-small text-muted-foreground">{tier.requirements}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
