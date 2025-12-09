'use client'

import dynamic from 'next/dynamic'
import { m as motion } from 'framer-motion'
import type { FunnelStage } from '../data/constants'

function ChartLoadError() {
  return (
    <div className="h-[350px] w-full flex items-center justify-center bg-destructive/10 rounded-lg border border-destructive/20">
      <p className="text-destructive text-sm">Failed to load chart</p>
    </div>
  )
}

const DealStageFunnelChart = dynamic(
  () => import('../DealStageFunnelChart').catch(() => ({ default: ChartLoadError })),
  {
    loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
    ssr: true
  }
)

interface FunnelChartProps {
  stages: FunnelStage[]
  overallConversionRate: string
}

export function FunnelChart({ stages, overallConversionRate }: FunnelChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Sales Pipeline Funnel</h2>
          <p className="text-muted-foreground">Deal progression through stages</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Overall Conversion</p>
          <p className="text-2xl font-bold text-success">{overallConversionRate}%</p>
        </div>
      </div>
      <DealStageFunnelChart stages={stages} />
    </motion.div>
  )
}
