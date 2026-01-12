'use client'

import { SectionCard } from '@/components/ui/section-card'
import { channelPerformance } from '../data/constants'
import { formatCurrency } from '@/lib/utils/data-formatters'

export function ChannelsTab() {
  return (
    <SectionCard
      title="Partner Channel ROI & Acquisition Efficiency Analysis"
      description="Data-driven partner channel optimization revealing certified partners achieve 7:1 LTV:CAC efficiency vs 1.8:1 for direct sales"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold">Channel</th>
              <th className="text-left py-3 px-4 font-semibold">CAC</th>
              <th className="text-left py-3 px-4 font-semibold">LTV</th>
              <th className="text-left py-3 px-4 font-semibold">Customers</th>
              <th className="text-left py-3 px-4 font-semibold">Efficiency</th>
            </tr>
          </thead>
          <tbody>
            {channelPerformance.map((channel, index) => (
              <tr
                key={index}
                className="border-b border-border/50 hover:bg-muted/50 transition-colors"
              >
                <td className="py-4 px-4 font-medium">{channel.channel}</td>
                <td className="py-4 px-4">{formatCurrency(channel.cac)}</td>
                <td className="py-4 px-4">{formatCurrency(channel.ltv)}</td>
                <td className="py-4 px-4">{channel.customers.toLocaleString()}</td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      channel.efficiency >= 5
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : channel.efficiency >= 3
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                    }`}
                  >
                    {channel.efficiency.toFixed(1)}:1
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  )
}
