'use client'

import DealStageFunnelChart from './DealStageFunnelChart'
import type { FunnelStage } from '../data/constants'

interface FunnelChartProps {
  stages: FunnelStage[]
  overallConversionRate: string
}

export function FunnelChart({ stages, overallConversionRate }: FunnelChartProps) {
  return (
    <div className="glass rounded-2xl p-8 hover:bg-white/[0.07] transition-all duration-300 ease-out mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="typography-h3 mb-2">Sales Pipeline Funnel</h2>
          <p className="typography-muted">Deal progression through stages</p>
        </div>
        <div className="text-right">
          <p className="typography-small text-muted-foreground">Overall Conversion</p>
          <p className="typography-h3 text-success">{overallConversionRate}%</p>
        </div>
      </div>
      <DealStageFunnelChart stages={stages} />
    </div>
  )
}
