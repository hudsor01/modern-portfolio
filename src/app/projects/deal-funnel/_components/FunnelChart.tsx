'use client'

import DealStageFunnelChart from './DealStageFunnelChart'
import type { FunnelStage } from '../data/constants'
import { ChartHeader } from '@/components/ui/chart-container'

interface FunnelChartProps {
  stages: FunnelStage[]
  overallConversionRate: string
}

export function FunnelChart({ stages, overallConversionRate }: FunnelChartProps) {
  return (
    <div className="glass rounded-2xl p-8 hover:bg-white/[0.07] transition-all duration-300 ease-out mb-8">
      <div className="flex items-center justify-between mb-6">
        <ChartHeader
          title="Sales Pipeline Funnel"
          description="Deal progression through stages"
          headingLevel={2}
        />
        <div className="text-right">
          <p className="typography-small">Overall Conversion</p>
          <p className="typography-h3">{overallConversionRate}%</p>
        </div>
      </div>
      <DealStageFunnelChart stages={stages} />
    </div>
  )
}
