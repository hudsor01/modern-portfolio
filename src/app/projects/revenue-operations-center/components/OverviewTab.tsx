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

const RevenueOverviewChart = dynamic(
  () => import('../RevenueOverviewChart').catch(() => ({ default: ChartLoadError })),
  {
    loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
    ssr: true
  }
)

const OperationalMetricsChart = dynamic(
  () => import('../OperationalMetricsChart').catch(() => ({ default: ChartLoadError })),
  {
    loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
    ssr: true
  }
)

export function OverviewTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Revenue Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="glass rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Revenue Performance Overview</h2>
          <p className="text-muted-foreground">Multi-channel revenue tracking with growth trends and target progress</p>
        </div>
        <RevenueOverviewChart />
      </motion.div>

      {/* Operational Efficiency */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="glass rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Operational Efficiency Metrics</h2>
          <p className="text-muted-foreground">Key operational KPIs across sales, marketing, and partner channels</p>
        </div>
        <OperationalMetricsChart />
      </motion.div>
    </div>
  )
}
