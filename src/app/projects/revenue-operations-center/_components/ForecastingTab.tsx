'use client'

import dynamic from 'next/dynamic'
import { ChartLoadError } from '@/components/charts/chart-load-error'
import { safeLazy } from '@/lib/safe-lazy'

const ForecastAccuracyChart = dynamic(
  safeLazy(
    () => import('./ForecastAccuracyChart'),
    'ForecastAccuracyChart',
    () => <ChartLoadError height="md" />
  ),
  {
    loading: () => (
      <div className="h-[var(--chart-height-md)] w-full animate-pulse bg-muted rounded-lg" />
    ),
    ssr: false,
  }
)

export function ForecastingTab() {
  return (
    <div className="glass rounded-2xl p-8 hover:bg-white/[0.07] transition-all duration-300 ease-out mb-12">
      <div className="mb-6">
        <h2 className="typography-h3 mb-2">Revenue Forecasting & Accuracy Analysis</h2>
        <p className="typography-muted">
          Predictive revenue modeling with confidence intervals and scenario planning
        </p>
      </div>
      <ForecastAccuracyChart />
    </div>
  )
}
