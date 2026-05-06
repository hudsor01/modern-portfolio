'use client'

import dynamic from 'next/dynamic'
import { safeLazy } from '@/lib/safe-lazy'

function ChartLoadError() {
  return (
    <div className="h-[var(--chart-height-md)] w-full flex items-center justify-center bg-destructive/10 rounded-lg border border-destructive/20">
      <p className="text-destructive text-sm">Failed to load chart</p>
    </div>
  )
}

const RevenueOverviewChart = dynamic(
  safeLazy(() => import('./RevenueOverviewChart'), 'RevenueOverviewChart', ChartLoadError),
  {
    loading: () => (
      <div className="h-[var(--chart-height-md)] w-full animate-pulse bg-muted rounded-lg" />
    ),
    ssr: false,
  }
)

const OperationalMetricsChart = dynamic(
  safeLazy(() => import('./OperationalMetricsChart'), 'OperationalMetricsChart', ChartLoadError),
  {
    loading: () => (
      <div className="h-[var(--chart-height-md)] w-full animate-pulse bg-muted rounded-lg" />
    ),
    ssr: false,
  }
)

export function OverviewTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Revenue Overview */}
      <div className="glass rounded-2xl p-8 hover:bg-white/[0.07] transition-all duration-300 ease-out">
        <div className="mb-6">
          <h2 className="typography-h3 mb-2">Revenue Performance Overview</h2>
          <p className="typography-muted">
            Multi-channel revenue tracking with growth trends and target progress
          </p>
        </div>
        <RevenueOverviewChart />
      </div>

      {/* Operational Efficiency */}
      <div className="glass rounded-2xl p-8 hover:bg-white/[0.07] transition-all duration-300 ease-out">
        <div className="mb-6">
          <h2 className="typography-h3 mb-2">Operational Efficiency Metrics</h2>
          <p className="typography-muted">
            Key operational KPIs across sales, marketing, and partner channels
          </p>
        </div>
        <OperationalMetricsChart />
      </div>
    </div>
  )
}
