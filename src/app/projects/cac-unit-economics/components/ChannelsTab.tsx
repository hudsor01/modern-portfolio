'use client'


import { channelPerformance } from '../data/constants'
import { formatCurrency } from '../utils'

export function ChannelsTab() {
  return (
    <div
      className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300 mb-8"
    >
      <div className="mb-4">
        <h2 className="typography-h4 mb-1">Partner Channel ROI & Acquisition Efficiency Analysis</h2>
        <p className="typography-small text-muted-foreground">Data-driven partner channel optimization revealing certified partners achieve 7:1 LTV:CAC efficiency vs 1.8:1 for direct sales</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 font-semibold">Channel</th>
              <th className="text-left py-3 px-4 font-semibold">CAC</th>
              <th className="text-left py-3 px-4 font-semibold">LTV</th>
              <th className="text-left py-3 px-4 font-semibold">Customers</th>
              <th className="text-left py-3 px-4 font-semibold">Efficiency</th>
            </tr>
          </thead>
          <tbody>
            {channelPerformance.map((channel, index) => (
              <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-4 px-4 font-medium">{channel.channel}</td>
                <td className="py-4 px-4">{formatCurrency(channel.cac)}</td>
                <td className="py-4 px-4">{formatCurrency(channel.ltv)}</td>
                <td className="py-4 px-4">{channel.customers.toLocaleString()}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    channel.efficiency >= 5 ? 'bg-success/20 text-success' :
                    channel.efficiency >= 3 ? 'bg-warning/20 text-warning' :
                    'bg-destructive/20 text-destructive'
                  }`}>
                    {channel.efficiency.toFixed(1)}:1
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
