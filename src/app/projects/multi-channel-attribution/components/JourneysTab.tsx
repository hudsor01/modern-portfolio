'use client'

import dynamic from 'next/dynamic'
import { m as motion } from 'framer-motion'
import { customerJourneyStages } from '../data/constants'
import { formatPercent } from '../utils'

const CustomerJourneyChart = dynamic(() => import('../CustomerJourneyChart'), {
  loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true
})

export function JourneysTab() {
  return (
    <div className="space-y-6 mb-8">
      {/* Customer Journey Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-1">Customer Journey Stage Analysis</h2>
          <p className="text-sm text-muted-foreground">Multi-touchpoint customer journey mapping with conversion optimization insights</p>
        </div>
        <div className="h-[250px]">
          <CustomerJourneyChart />
        </div>
      </motion.div>

      {/* Journey Stages Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-1">Journey Stage Performance Metrics</h2>
          <p className="text-sm text-muted-foreground">Detailed conversion funnel analysis with touchpoint optimization opportunities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customerJourneyStages.map((stage, index) => (
            <div key={index} className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <h3 className="text-base font-semibold mb-3">{stage.stage}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Touchpoints:</span>
                  <span className="font-medium">{stage.touchpoints.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Channels:</span>
                  <span className="font-medium">{stage.channels}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Time:</span>
                  <span className="font-medium">{stage.avgTime} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Conversion:</span>
                  <span className="font-medium">{formatPercent(stage.conversionRate)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
