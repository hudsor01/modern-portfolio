'use client'

import dynamic from 'next/dynamic'
import { m as motion } from 'framer-motion'

function ChartLoadError() {
  return (
    <div className="h-[250px] w-full flex items-center justify-center bg-destructive/10 rounded-lg border border-destructive/20">
      <p className="text-destructive text-sm">Failed to load chart</p>
    </div>
  )
}

const CLVPredictionChart = dynamic(
  () => import('../CLVPredictionChart').catch(() => ({ default: ChartLoadError })),
  {
    loading: () => <div className="h-[250px] w-full animate-pulse bg-muted rounded-lg" />,
    ssr: true
  }
)

const CLVTrendChart = dynamic(
  () => import('../CLVTrendChart').catch(() => ({ default: ChartLoadError })),
  {
    loading: () => <div className="h-[250px] w-full animate-pulse bg-muted rounded-lg" />,
    ssr: true
  }
)

export function OverviewTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* CLV Prediction Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-1">CLV Prediction vs Actual Performance</h2>
          <p className="text-sm text-muted-foreground">BTYD model accuracy analysis showing 94.3% prediction success rate across customer segments</p>
        </div>
        <div className="h-[250px]">
          <CLVPredictionChart />
        </div>
      </motion.div>

      {/* CLV Trend Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-1">CLV Trend Analysis & Forecasting</h2>
          <p className="text-sm text-muted-foreground">24-month predictive CLV trending with confidence intervals and seasonal adjustments</p>
        </div>
        <div className="h-[250px]">
          <CLVTrendChart />
        </div>
      </motion.div>
    </div>
  )
}
