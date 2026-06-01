'use client'

import dynamic from 'next/dynamic'
import { ChartSkeleton } from '@/components/charts/chart-skeleton'
import { ChartLoadError } from '@/components/charts/chart-load-error'
import { safeLazy } from '@/lib/safe-lazy'

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
        <div className="mb-4">
          <h2 className="typography-h4 mb-1">CLV Prediction vs Actual Performance</h2>
          <p className="typography-small text-muted-foreground">
            BTYD model accuracy analysis showing 94.3% prediction success rate across customer
            segments
          </p>
        </div>
        <div className="h-[var(--chart-height-sm)]">
          <CLVPredictionChart />
        </div>
      </div>

      {/* CLV Trend Analysis */}
      <div className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 ease-out">
        <div className="mb-4">
          <h2 className="typography-h4 mb-1">CLV Trend Analysis & Forecasting</h2>
          <p className="typography-small text-muted-foreground">
            24-month predictive CLV trending with confidence intervals and seasonal adjustments
          </p>
        </div>
        <div className="h-[var(--chart-height-sm)]">
          <CLVTrendChart />
        </div>
      </div>
    </div>
  )
}
