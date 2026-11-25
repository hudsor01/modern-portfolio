'use client'

import dynamic from 'next/dynamic'
import { CHART_BOX, ChartSkeleton } from '@/components/charts/chart-skeleton'

import { customerJourneyStages } from '../data/constants'
import { formatPercent } from '../utils'
import { ChartHeader } from '@/components/ui/chart-container'

const CustomerJourneyChart = dynamic(() => import('./CustomerJourneyChart'), {
  loading: () => <ChartSkeleton height="md" />,
  ssr: false,
})

export function JourneysTab() {
  return (
    <div className="space-y-6 mb-8">
      {/* Customer Journey Visualization */}
      <div className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 ease-out">
        <ChartHeader
          title="Customer Journey Stage Analysis"
          description="Multi-touchpoint customer journey mapping with conversion optimization insights"
          headingLevel={2}
          className="mb-4"
        />
        <div className={CHART_BOX.md}>
          <CustomerJourneyChart />
        </div>
      </div>

      {/* Journey Stages Details */}
      <div className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 ease-out">
        <ChartHeader
          title="Journey Stage Performance Metrics"
          description="Detailed conversion funnel analysis with touchpoint optimization opportunities"
          headingLevel={2}
          className="mb-4"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customerJourneyStages.map((stage, index) => (
            <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="mb-3">{stage.stage}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="typography-muted">Touchpoints:</span>
                  <span className="font-medium">{stage.touchpoints.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="typography-muted">Channels:</span>
                  <span className="font-medium">{stage.channels}</span>
                </div>
                <div className="flex justify-between">
                  <span className="typography-muted">Avg Time:</span>
                  <span className="font-medium">{stage.avgTime} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="typography-muted">Conversion:</span>
                  <span className="font-medium">{formatPercent(stage.conversionRate)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
