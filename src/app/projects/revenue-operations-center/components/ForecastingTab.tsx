'use client'

import dynamic from 'next/dynamic'
import { m as motion } from 'framer-motion'

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="glass rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300 mb-12"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Revenue Forecasting & Accuracy Analysis</h2>
        <p className="text-muted-foreground">Predictive revenue modeling with confidence intervals and scenario planning</p>
      </div>
      <ForecastAccuracyChart />
    </motion.div>
  )
}
