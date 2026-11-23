'use client'

import dynamic from 'next/dynamic'
import { CHART_BOX, ChartSkeleton } from '@/components/charts/chart-skeleton'
import { ChartLoadError } from '@/components/charts/chart-load-error'
import { safeLazy } from '@/lib/safe-lazy'
import { ChartHeader } from '@/components/ui/chart-container'

const CLVPredictionChart = dynamic(
  safeLazy(() => import('./CLVPredictionChart'), 'CLVPredictionChart', ChartLoadError),
  {
    loading: () => <ChartSkeleton height="sm" />,
    ssr: false,
  }
)

const CLVTrendChart = dynamic(
  safeLazy(() => import('./CLVTrendChart'), 'CLVTrendChart', ChartLoadError),
  {
    loading: () => <ChartSkeleton height="sm" />,
    ssr: false,
  }
)

export function OverviewTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* CLV Prediction Chart */}
      <div className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 ease-out">
        <ChartHeader
          title="CLV Prediction vs Actual Performance"
          description="BTYD model accuracy analysis showing 94.3% prediction success rate across customer segments"
          headingLevel={2}
          className="mb-4"
        />
        <div className={CHART_BOX.sm}>
          <CLVPredictionChart />
        </div>
      </div>

      {/* CLV Trend Analysis */}
      <div className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 ease-out">
        <ChartHeader
          title="CLV Trend Analysis & Forecasting"
          description="24-month predictive CLV trending with confidence intervals and seasonal adjustments"
          headingLevel={2}
          className="mb-4"
        />
        <div className={CHART_BOX.sm}>
          <CLVTrendChart />
        </div>
      </div>
    </div>
  )
}
