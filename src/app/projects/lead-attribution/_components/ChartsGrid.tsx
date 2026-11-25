'use client'

import type { ComponentType, SVGProps } from 'react'
import { ChartSkeleton } from '@/components/charts/chart-skeleton'
import { ChartLoadError } from '@/components/charts/chart-load-error'
import dynamic from 'next/dynamic'
import { safeLazy } from '@/lib/safe-lazy'
import { ChartHeader } from '@/components/ui/chart-container'

const LeadSourcePieChart = dynamic(
  safeLazy(
    () => import('./LeadSourcePieChart'),
    'LeadSourcePieChart',
    () => <ChartLoadError height="md" />
  ),
  {
    loading: () => <ChartSkeleton height="lg" />,
    ssr: false,
  }
)

/** Icon component type that accepts className */
type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

interface ChartsGridProps {
  leadSources: Array<{ name: string; value: number; growth?: string; color?: string }>
  conversionSources: Array<{
    source: string
    conversions: number
    conversion_rate: number
    icon: IconComponent
  }>
  bestSource: { source: string }
}

export function ChartsGrid({ bestSource, leadSources, conversionSources }: ChartsGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Lead Source Distribution */}
      <div className="glass rounded-2xl p-8 hover:bg-white/[0.07] transition-all duration-300 ease-out">
        <ChartHeader
          title="Lead Source Distribution"
          description="Breakdown of leads by acquisition channel"
          headingLevel={2}
          className="mb-6"
        />
        <LeadSourcePieChart data={leadSources} />
      </div>

      {/* Channel Performance */}
      <div className="glass rounded-2xl p-8 hover:bg-white/[0.07] transition-all duration-300 ease-out">
        <ChartHeader
          title="Channel Performance"
          description="Conversion rates by source"
          headingLevel={2}
          className="mb-6"
        />
        <div className="space-y-4">
          {conversionSources.map((source) => {
            const Icon = source.icon
            return (
              <div
                key={source.source}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 ease-out"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p>{source.source}</p>
                    <p className="typography-small">{source.conversions} conversions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="typography-large">{(source.conversion_rate * 100).toFixed(1)}%</p>
                  {source.source === bestSource.source && (
                    <span className="text-xs text-success">Best Performer</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
