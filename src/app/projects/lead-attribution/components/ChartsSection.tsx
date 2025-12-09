'use client'

import dynamic from 'next/dynamic'
import { m as motion } from 'framer-motion'
import { leadConversionData } from '../data/constants'

function ChartLoadError() {
  return (
    <div className="h-[350px] w-full flex items-center justify-center bg-destructive/10 rounded-lg border border-destructive/20">
      <p className="text-destructive text-sm">Failed to load chart</p>
    </div>
  )
}

const LeadSourcePieChart = dynamic(
  () => import('../LeadSourcePieChart').catch(() => ({ default: ChartLoadError })),
  {
    loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
    ssr: true
  }
)

interface ChartsSectionProps {
  bestSource: typeof leadConversionData[0]
}

export function ChartsSection({ bestSource }: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Lead Source Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Lead Source Distribution</h2>
          <p className="text-muted-foreground">Breakdown of leads by acquisition channel</p>
        </div>
        <LeadSourcePieChart />
      </motion.div>

      {/* Channel Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="glass rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Channel Performance</h2>
          <p className="text-muted-foreground">Conversion rates by source</p>
        </div>
        <div className="space-y-4">
          {leadConversionData.map((source) => {
            const Icon = source.icon
            return (
              <div key={source.source} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{source.source}</p>
                    <p className="text-xs text-muted-foreground">{source.conversions} conversions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{(source.conversion_rate * 100).toFixed(1)}%</p>
                  {source.source === bestSource.source && (
                    <span className="text-xs text-success">Best Performer</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
