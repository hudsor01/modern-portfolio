'use client'

import dynamic from 'next/dynamic'
import { ChartSkeleton } from '@/components/charts/chart-skeleton'
import { ChartLoadError } from '@/components/charts/chart-load-error'
import { safeLazy } from '@/lib/safe-lazy'
import { ChartHeader } from '@/components/ui/chart-container'

const PipelineHealthChart = dynamic(
  safeLazy(
    () => import('./PipelineHealthChart'),
    'PipelineHealthChart',
    () => <ChartLoadError height="md" />
  ),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
)

export function PipelineTab() {
  return (
    <div className="glass rounded-2xl p-8 hover:bg-white/[0.07] transition-all duration-300 ease-out mb-12">
      <ChartHeader
        title="Pipeline Health & Velocity Analysis"
        description="Real-time pipeline tracking with stage progression and bottleneck identification"
        headingLevel={2}
        className="mb-6"
      />
      <PipelineHealthChart />
    </div>
  )
}
