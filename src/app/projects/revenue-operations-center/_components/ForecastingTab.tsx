'use client'

import dynamic from 'next/dynamic'
import { ChartSkeleton } from '@/components/charts/chart-skeleton'
import { ChartLoadError } from '@/components/charts/chart-load-error'
import { safeLazy } from '@/lib/safe-lazy'
import { ChartHeader } from '@/components/ui/chart-container'

const ForecastAccuracyChart = dynamic(
  safeLazy(
    () => import('./ForecastAccuracyChart'),
    'ForecastAccuracyChart',
    () => <ChartLoadError height="md" />
  ),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
)

export function ForecastingTab() {
  return (
    <div className="glass rounded-2xl p-8 hover:bg-white/[0.07] transition-all duration-300 ease-out mb-12">
      <ChartHeader
        title="Revenue Forecasting & Accuracy Analysis"
        description="Predictive revenue modeling with confidence intervals and scenario planning"
        headingLevel={2}
        className="mb-6"
      />
      <ForecastAccuracyChart />
    </div>
  )
}
