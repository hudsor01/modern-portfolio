'use client'

import dynamic from 'next/dynamic'
import { ChartSkeleton } from '@/components/charts/chart-skeleton'
import { ChartLoadError } from '@/components/charts/chart-load-error'
import { safeLazy } from '@/lib/safe-lazy'

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
      <div className="mb-6">
        <h2 className="typography-h3 mb-2">Pipeline Health & Velocity Analysis</h2>
        <p className="typography-muted">
          Real-time pipeline tracking with stage progression and bottleneck identification
        </p>
      </div>
      <PipelineHealthChart />
    </div>
  )
}
