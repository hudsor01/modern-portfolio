'use client'

import { formatPercentage } from '@/lib/data-formatters'
import { SectionCard } from '@/components/ui/section-card'

interface StrategicInsightsProps {
  winRate: number
  quickRatio: number
}

export function StrategicInsights({ winRate, quickRatio }: StrategicInsightsProps) {
  return (
    <SectionCard
      title="Partner Intelligence & Strategic Impact"
      description="Key performance indicators and strategic insights"
      className="mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold text-primary mb-1">
            {formatPercentage(winRate / 100)}
          </div>
          <div className="text-sm text-muted-foreground">
            Partner Channel Win Rate (Industry: 65-75%)
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold text-secondary mb-1">{quickRatio}x</div>
          <div className="text-sm text-muted-foreground">
            SaaS Quick Ratio (Benchmark: &gt;4.0x)
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold text-primary mb-1">80/20</div>
          <div className="text-sm text-muted-foreground">
            Partner Revenue Distribution (Pareto Optimized)
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
