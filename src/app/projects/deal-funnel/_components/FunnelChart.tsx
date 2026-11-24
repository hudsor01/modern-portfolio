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
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <ChartHeader
          title="Sales Pipeline Funnel"
          description="Share of all opportunities in each stage"
          headingLevel={2}
        />
        <div className="text-right">
          <p className="typography-small">Win Rate (of closed deals)</p>
          <p className="typography-h3">{overallConversionRate}%</p>
        </div>
      </div>
      <DealStageFunnelChart stages={stages} />
    </div>
  )
}
