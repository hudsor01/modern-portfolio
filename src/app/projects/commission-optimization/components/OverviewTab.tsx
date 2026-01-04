'use client'

import dynamic from 'next/dynamic'
import { ChartContainer } from '@/components/ui/chart-container'

const CommissionStructureChart = dynamic(() => import('../CommissionStructureChart'), {
  loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true,
})

const ROIOptimizationChart = dynamic(() => import('../ROIOptimizationChart'), {
  loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true,
})

export function OverviewTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Commission Structure */}
      <ChartContainer
        title="Commission Structure & Payout Analysis"
        description="Tier-based commission optimization with automated calculations and performance tracking"
        height={280}
        variant="glass"
      >
        <CommissionStructureChart />
      </ChartContainer>

      {/* ROI Optimization */}
      <ChartContainer
        title="ROI Optimization & Performance Impact"
        description="Commission ROI analysis showing investment efficiency across partner tiers"
        height={280}
        variant="glass"
      >
        <ROIOptimizationChart />
      </ChartContainer>
    </div>
  )
}
