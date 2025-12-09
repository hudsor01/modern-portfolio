'use client'

import dynamic from 'next/dynamic'
import { m as motion } from 'framer-motion'
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="glass rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Commission Tier Performance & ROI Analysis</h2>
          <p className="text-muted-foreground">Multi-tier commission structure optimization with performance-based adjustments</p>
        </div>
        <CommissionTierChart />
      </motion.div>

      {/* Tier Details Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="glass rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Partner Commission Tier Structure & Requirements</h2>
          <p className="text-muted-foreground">Detailed commission tier analysis with earnings, requirements, and ROI metrics</p>
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
                  <td className="py-4 px-4 text-sm text-muted-foreground">{tier.requirements}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
