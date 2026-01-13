'use client'

import dynamic from 'next/dynamic'
import { ChartContainer } from '@/components/ui/chart-container'

function ChartLoadError() {
  return (
    <div className="h-[var(--chart-height-sm)] w-full flex items-center justify-center bg-destructive/10 rounded-lg border border-destructive/20">
      <p className="text-destructive text-sm">Failed to load chart</p>
    </div>
  )
}

const CACBreakdownChart = dynamic(
  () => import('./CACBreakdownChart').catch(() => ({ default: ChartLoadError })),
  {
    loading: () => <div className="h-[var(--chart-height-sm)] w-full animate-pulse bg-muted rounded-lg" />,
    ssr: true,
  }
)

const UnitEconomicsChart = dynamic(
  () => import('./UnitEconomicsChart').catch(() => ({ default: ChartLoadError })),
  {
    loading: () => <div className="h-[var(--chart-height-sm)] w-full animate-pulse bg-muted rounded-lg" />,
    ssr: true,
  }
)

export function OverviewTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* CAC Breakdown using standardized ChartContainer */}
      <ChartContainer
        title="Customer Acquisition Cost Breakdown by Channel"
        description="Strategic CAC analysis revealing certified partners deliver 70% lower acquisition costs ($98 vs $289) compared to direct sales channels"
        height={250}
      >
        <CACBreakdownChart />
      </ChartContainer>

      {/* Unit Economics using standardized ChartContainer */}
      <ChartContainer
        title="Unit Economics Performance Dashboard"
        description="LTV:CAC ratio trending from 2.8:1 to 4.0:1 through systematic partner optimization and payback period reduction strategies"
        height={250}
      >
        <UnitEconomicsChart />
      </ChartContainer>
    </div>
  )
}
