'use client'

import dynamic from 'next/dynamic'
import { CHART_BOX, ChartSkeleton } from '@/components/charts/chart-skeleton'
import { ChartHeader } from '@/components/ui/chart-container'

const AttributionModelChart = dynamic(() => import('./AttributionModelChart'), {
  loading: () => <ChartSkeleton height="md" />,
  ssr: false,
})

const ChannelROIChart = dynamic(() => import('./ChannelROIChart'), {
  loading: () => <ChartSkeleton height="md" />,
  ssr: false,
})

export function OverviewTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Attribution Model Comparison */}
      <div className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 ease-out">
        <ChartHeader
          title="Attribution Model Performance Comparison"
          description="ML-driven data attribution vs traditional models, reaching 92.4% accuracy"
          headingLevel={2}
          className="mb-4"
        />
        <div className={CHART_BOX.md}>
          <AttributionModelChart />
        </div>
      </div>

      {/* Channel ROI Analysis */}
      <div className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 ease-out">
        <ChartHeader
          title="Cross-Channel ROI & Attribution Analysis"
          description="Multi-touch attribution revealing true channel performance and investment optimization"
          headingLevel={2}
          className="mb-4"
        />
        <div className={CHART_BOX.md}>
          <ChannelROIChart />
        </div>
      </div>
    </div>
  )
}
