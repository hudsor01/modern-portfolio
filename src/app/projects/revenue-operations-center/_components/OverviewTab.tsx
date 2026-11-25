'use client'

import dynamic from 'next/dynamic'
import { ChartSkeleton } from '@/components/charts/chart-skeleton'
import { ChartLoadError } from '@/components/charts/chart-load-error'
import { safeLazy } from '@/lib/safe-lazy'
import { ChartHeader } from '@/components/ui/chart-container'

const RevenueOverviewChart = dynamic(
  safeLazy(
    () => import('./RevenueOverviewChart'),
    'RevenueOverviewChart',
    () => <ChartLoadError height="md" />
  ),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
)

const OperationalMetricsChart = dynamic(
  safeLazy(
    () => import('./OperationalMetricsChart'),
    'OperationalMetricsChart',
    () => <ChartLoadError height="md" />
  ),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
)

export function OverviewTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Revenue Overview */}
      <div className="glass rounded-2xl p-8 hover:bg-white/[0.07] transition-all duration-300 ease-out">
        <ChartHeader
          title="Revenue Performance Overview"
          description="Multi-channel revenue tracking with growth trends and target progress"
          headingLevel={2}
          className="mb-6"
        />
        <RevenueOverviewChart />
      </div>

      {/* Operational Efficiency */}
      <div className="glass rounded-2xl p-8 hover:bg-white/[0.07] transition-all duration-300 ease-out">
        <ChartHeader
          title="Operational Efficiency Metrics"
          description="Key operational KPIs across sales, marketing, and partner channels"
          headingLevel={2}
          className="mb-6"
        />
        <OperationalMetricsChart />
      </div>
    </div>
  )
}
