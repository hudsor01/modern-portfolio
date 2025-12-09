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

const CACBreakdownChart = dynamic(
  () => import('../CACBreakdownChart').catch(() => ({ default: ChartLoadError })),
  {
    loading: () => <div className="h-[250px] w-full animate-pulse bg-muted rounded-lg" />,
    ssr: true
  }
)

const UnitEconomicsChart = dynamic(
  () => import('../UnitEconomicsChart').catch(() => ({ default: ChartLoadError })),
  {
    loading: () => <div className="h-[250px] w-full animate-pulse bg-muted rounded-lg" />,
    ssr: true
  }
)

export function OverviewTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* CAC Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-1">Customer Acquisition Cost Breakdown by Channel</h2>
          <p className="text-sm text-muted-foreground">Strategic CAC analysis revealing certified partners deliver 70% lower acquisition costs ($98 vs $289) compared to direct sales channels</p>
        </div>
        <div className="h-[250px]">
          <CACBreakdownChart />
        </div>
      </motion.div>

      {/* Unit Economics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-1">Unit Economics Performance Dashboard</h2>
          <p className="text-sm text-muted-foreground">LTV:CAC ratio trending from 2.8:1 to 4.0:1 through systematic partner optimization and payback period reduction strategies</p>
        </div>
        <div className="h-[250px]">
          <UnitEconomicsChart />
        </div>
      </motion.div>
    </div>
  )
}
