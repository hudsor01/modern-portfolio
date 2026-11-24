'use client'

import { chartColors } from '@/lib/charts'
import { formatNumber } from '@/lib/data-formatters'

interface FunnelStage {
  name: string
  count: number
  avg_deal_size: number
}

interface DealStageFunnelChartProps {
  stages: FunnelStage[]
}

// Fills are dark enough for white text (>= 4.5:1).
const FUNNEL_COLORS = [
  chartColors.primary, // Working
  chartColors.secondary, // Closed Won
  chartColors.destructive, // Closed Lost
  chartColors.chart4,
  chartColors.chart5,
]

/** Share of all opportunities (not a stage-to-stage rate: the stages are outcomes, not steps). */
export function stageShares(stages: FunnelStage[]) {
  const total = stages.reduce((sum, stage) => sum + stage.count, 0)
  return stages.map((stage) => ({
    stage: stage.name,
    count: stage.count,
    share: `${((stage.count / Math.max(total, 1)) * 100).toFixed(1)}%`,
  }))
}

/**
 * Funnel drawn in HTML, not an SVG viewBox, so its text keeps real pixel sizes
 * at every width (a scaled SVG shrank the labels to ~8px at 390). The bars
 * narrow stage by stage and size to their content, with no reserved empty box.
 */
export default function DealStageFunnelChart({ stages }: DealStageFunnelChartProps) {
  const data = stageShares(stages)
  if (data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center">
        <p className="typography-muted">No data available</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <ol
        className="mx-auto flex w-full max-w-3xl flex-col items-center gap-1"
        data-testid="funnel"
      >
        {data.map((stage, index) => {
          const width = 100 - index * (60 / Math.max(data.length, 2))
          return (
            <li key={stage.stage} className="flex w-full justify-center" data-testid="funnel-stage">
              <div
                className="funnel-stage flex min-h-16 flex-col items-center justify-center py-2 text-white"
                style={{
                  width: `${width}%`,
                  backgroundColor: FUNNEL_COLORS[index % FUNNEL_COLORS.length],
                }}
              >
                <span className="typography-h4">{formatNumber(stage.count)}</span>
                <span className="text-xs">deals</span>
              </div>
            </li>
          )
        })}
      </ol>

      {/* Stage legend */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {data.map((stage, index) => (
          <div
            key={stage.stage}
            className="glass rounded-2xl p-4 transition-all duration-300 ease-out hover:bg-white/10"
          >
            <div className="mb-3 flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: FUNNEL_COLORS[index % FUNNEL_COLORS.length] }}
              />
              <p>{stage.stage}</p>
            </div>
            <p className="typography-h4">{stage.share}</p>
            <p className="typography-small">{formatNumber(stage.count)} deals</p>
          </div>
        ))}
      </div>
    </div>
  )
}
