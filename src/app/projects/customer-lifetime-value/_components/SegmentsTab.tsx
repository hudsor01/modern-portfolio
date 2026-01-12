'use client'

import dynamic from 'next/dynamic'

import { customerSegments } from '../data/constants'
import { formatCurrency, formatPercent } from '../utils'

function ChartLoadError() {
  return (
    <div className="h-[var(--chart-height-sm)] w-full flex items-center justify-center bg-destructive/10 rounded-lg border border-destructive/20">
      <p className="text-destructive text-sm">Failed to load chart</p>
    </div>
  )
}

const CustomerSegmentChart = dynamic(
  () => import('./CustomerSegmentChart').catch(() => ({ default: ChartLoadError })),
  {
    loading: () => <div className="h-[var(--chart-height-sm)] w-full animate-pulse bg-muted rounded-lg" />,
    ssr: true
  }
)

export function SegmentsTab() {
  return (
    <div className="space-y-6 mb-8">
      {/* Customer Segment Chart */}
      <div
        className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 ease-out"
      >
        <div className="mb-4">
          <h2 className="typography-h4 mb-1">Customer Segment Distribution & CLV Analysis</h2>
          <p className="typography-small text-muted-foreground">RFM-based customer segmentation with predictive CLV modeling across behavioral clusters</p>
        </div>
        <div className="h-[var(--chart-height-sm)]">
          <CustomerSegmentChart />
        </div>
      </div>

      {/* Segment Details Table */}
      <div
        className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 ease-out"
      >
        <div className="mb-4">
          <h2 className="typography-h4 mb-1">Customer Segment Intelligence & Behavioral Insights</h2>
          <p className="typography-small text-muted-foreground">Detailed segment analysis with CLV predictions and engagement probability scores</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 font-semibold">Segment</th>
                <th className="text-left py-3 px-4 font-semibold">Customers</th>
                <th className="text-left py-3 px-4 font-semibold">Avg CLV</th>
                <th className="text-left py-3 px-4 font-semibold">Engagement Prob.</th>
                <th className="text-left py-3 px-4 font-semibold">Characteristics</th>
              </tr>
            </thead>
            <tbody>
              {customerSegments.map((segment, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: segment.color }}
                      />
                      <span className="font-medium">{segment.segment}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">{segment.count.toLocaleString()}</td>
                  <td className="py-4 px-4">{formatCurrency(segment.clv)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      segment.probability >= 0.8 ? 'bg-success/20 text-success' :
                      segment.probability >= 0.6 ? 'bg-warning/20 text-warning' :
                      'bg-destructive/20 text-destructive'
                    }`}>
                      {formatPercent(segment.probability * 100)}
                    </span>
                  </td>
                  <td className="py-4 px-4 typography-small text-muted-foreground">{segment.characteristics}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
