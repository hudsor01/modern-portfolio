'use client'

import dynamic from 'next/dynamic'
import { m as motion } from 'framer-motion'

const CommissionStructureChart = dynamic(() => import('../CommissionStructureChart'), {
  loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true
})

const ROIOptimizationChart = dynamic(() => import('../ROIOptimizationChart'), {
  loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true
})

export function OverviewTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Commission Structure */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-1">Commission Structure & Payout Analysis</h2>
          <p className="text-sm text-muted-foreground">Tier-based commission optimization with automated calculations and performance tracking</p>
        </div>
        <div className="h-[280px]">
          <CommissionStructureChart />
        </div>
      </motion.div>

      {/* ROI Optimization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-1">ROI Optimization & Performance Impact</h2>
          <p className="text-sm text-muted-foreground">Commission ROI analysis showing investment efficiency across partner tiers</p>
        </div>
        <div className="h-[280px]">
          <ROIOptimizationChart />
        </div>
      </motion.div>
    </div>
  )
}
