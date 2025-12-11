'use client'

import dynamic from 'next/dynamic'

import { TrendingUp } from 'lucide-react'
import { incentivePrograms } from '../data/constants'
import { formatCurrency, formatPercent } from '../utils'

const PerformanceIncentiveChart = dynamic(() => import('../PerformanceIncentiveChart'), {
  loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true
})

export function IncentivesTab() {
  return (
    <div className="space-y-8 mb-12">
      {/* Performance Incentive Chart */}
      <div
        className="glass rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-6">
          <h2 className="typography-h3 mb-2">Performance Incentive Program Effectiveness</h2>
          <p className="typography-muted">Targeted incentive programs driving partner performance with ROI-optimized bonus structures</p>
        </div>
        <PerformanceIncentiveChart />
      </div>

      {/* Incentive Programs Table */}
      <div
        className="glass rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-6">
          <h2 className="typography-h3 mb-2">Incentive Program Performance & ROI Analysis</h2>
          <p className="typography-muted">Comprehensive incentive program analysis with effectiveness metrics and performance impact</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 font-semibold">Program</th>
                <th className="text-left py-3 px-4 font-semibold">Participants</th>
                <th className="text-left py-3 px-4 font-semibold">Budget</th>
                <th className="text-left py-3 px-4 font-semibold">Payout</th>
                <th className="text-left py-3 px-4 font-semibold">Effectiveness</th>
                <th className="text-left py-3 px-4 font-semibold">Avg Bonus</th>
                <th className="text-left py-3 px-4 font-semibold">Performance Lift</th>
              </tr>
            </thead>
            <tbody>
              {incentivePrograms.map((program, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-medium">{program.program}</td>
                  <td className="py-4 px-4">{program.participants}</td>
                  <td className="py-4 px-4">{formatCurrency(program.budget)}</td>
                  <td className="py-4 px-4">{formatCurrency(program.payout)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      program.effectiveness >= 85 ? 'bg-success/20 text-success' :
                      program.effectiveness >= 75 ? 'bg-warning/20 text-warning' :
                      'bg-destructive/20 text-destructive'
                    }`}>
                      {formatPercent(program.effectiveness)}
                    </span>
                  </td>
                  <td className="py-4 px-4">{formatCurrency(program.avgBonus)}</td>
                  <td className="py-4 px-4 text-success flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +{formatPercent(program.performanceLift)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
