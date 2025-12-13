'use client'

import dynamic from 'next/dynamic'

import { channelPerformance } from '../data/constants'
import { formatCurrency, formatPercent } from '../utils'

const TouchpointAnalysisChart = dynamic(() => import('../TouchpointAnalysisChart'), {
  loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true
})

export function ChannelsTab() {
  return (
    <div className="space-y-6 mb-8">
      {/* Touchpoint Analysis */}
      <div
        className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-4">
          <h2 className="typography-h4 mb-1">Multi-Touch Attribution & Channel Performance</h2>
          <p className="typography-small text-muted-foreground">Advanced touchpoint analysis revealing true cross-channel contribution and ROI optimization</p>
        </div>
        <div className="h-[250px]">
          <TouchpointAnalysisChart />
        </div>
      </div>

      {/* Channel Performance Table */}
      <div
        className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-4">
          <h2 className="typography-h4 mb-1">Channel Attribution & ROI Performance</h2>
          <p className="typography-small text-muted-foreground">Comprehensive channel analysis with multi-touch attribution insights and investment optimization</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 font-semibold">Channel</th>
                <th className="text-left py-3 px-4 font-semibold">Touchpoints</th>
                <th className="text-left py-3 px-4 font-semibold">Conversions</th>
                <th className="text-left py-3 px-4 font-semibold">Cost</th>
                <th className="text-left py-3 px-4 font-semibold">Revenue</th>
                <th className="text-left py-3 px-4 font-semibold">ROI</th>
                <th className="text-left py-3 px-4 font-semibold">Attribution %</th>
              </tr>
            </thead>
            <tbody>
              {channelPerformance.map((channel, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-medium">{channel.channel}</td>
                  <td className="py-4 px-4">{channel.touchpoints.toLocaleString()}</td>
                  <td className="py-4 px-4">{channel.conversions.toLocaleString()}</td>
                  <td className="py-4 px-4">{formatCurrency(channel.cost)}</td>
                  <td className="py-4 px-4">{formatCurrency(channel.revenue)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      channel.roi >= 20 ? 'bg-success/20 text-success' :
                      channel.roi >= 10 ? 'bg-warning/20 text-warning' :
                      'bg-destructive/20 text-destructive'
                    }`}>
                      {channel.roi === 999 ? '∞' : `${channel.roi.toFixed(1)}x`}
                    </span>
                  </td>
                  <td className="py-4 px-4">{formatPercent(channel.attribution)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
