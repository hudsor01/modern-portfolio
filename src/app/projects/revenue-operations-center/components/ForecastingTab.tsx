'use client'

import dynamic from 'next/dynamic'


function ChartLoadError() {
  return (
    <div className="h-[350px] w-full flex items-center justify-center bg-destructive/10 rounded-lg border border-destructive/20">
      <p className="text-destructive text-sm">Failed to load chart</p>
    </div>
  )
}

const ForecastAccuracyChart = dynamic(
  () => import('../ForecastAccuracyChart').catch(() => ({ default: ChartLoadError })),
  {
    loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
    ssr: true
  }
)

export function ForecastingTab() {
  return (
    <div
      className="glass rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300 mb-12"
    >
      <div className="mb-6">
        <h2 className="typography-h3 mb-2">Revenue Forecasting & Accuracy Analysis</h2>
        <p className="typography-muted">Predictive revenue modeling with confidence intervals and scenario planning</p>
      </div>
      <ForecastAccuracyChart />
    </div>
  )
}
