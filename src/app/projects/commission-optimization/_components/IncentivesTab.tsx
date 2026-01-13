'use client'

import dynamic from 'next/dynamic'
import { TrendingUp } from 'lucide-react'
import { ChartContainer } from '@/components/ui/chart-container'
import { SectionCard } from '@/components/ui/section-card'
import { incentivePrograms } from '../data/constants'
import { formatCurrency, formatPercentage } from '@/lib/utils/data-formatters'

const PerformanceIncentiveChart = dynamic(() => import('./PerformanceIncentiveChart'), {
  loading: () => <div className="h-[var(--chart-height-md)] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true,
})

export function IncentivesTab() {
  return (
    <div className="space-y-8 mb-12">
      {/* Performance Incentive Chart */}
      <ChartContainer
        title="Performance Incentive Program Effectiveness"
        description="Targeted incentive programs driving partner performance with ROI-optimized bonus structures"
        variant="glass"
        padding="lg"
      >
        <PerformanceIncentiveChart />
      </ChartContainer>

      {/* Incentive Programs Table */}
      <SectionCard
        title="Incentive Program Performance & ROI Analysis"
        description="Comprehensive incentive program analysis with effectiveness metrics and performance impact"
        variant="glass"
        padding="lg"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
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
                <tr
                  key={index}
                  className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <td className="py-4 px-4 font-medium">{program.program}</td>
                  <td className="py-4 px-4">{program.participants}</td>
                  <td className="py-4 px-4">{formatCurrency(program.budget)}</td>
                  <td className="py-4 px-4">{formatCurrency(program.payout)}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        program.effectiveness >= 85
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                          : program.effectiveness >= 75
                            ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                      }`}
                    >
                      {formatPercentage(program.effectiveness / 100)}
                    </span>
                  </td>
                  <td className="py-4 px-4">{formatCurrency(program.avgBonus)}</td>
                  <td className="py-4 px-4 text-green-600 dark:text-green-400 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />+
                    {formatPercentage(program.performanceLift / 100)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}
