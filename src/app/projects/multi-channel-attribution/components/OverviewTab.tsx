'use client'

import dynamic from 'next/dynamic'
import { m as motion } from 'framer-motion'

const AttributionModelChart = dynamic(() => import('../AttributionModelChart'), {
  loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true
})

const ChannelROIChart = dynamic(() => import('../ChannelROIChart'), {
  loading: () => <div className="h-[350px] w-full animate-pulse bg-muted rounded-lg" />,
  ssr: true
})

export function OverviewTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Attribution Model Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-1">Attribution Model Performance Comparison</h2>
          <p className="text-sm text-muted-foreground">ML-driven data attribution vs traditional models showing 92.4% accuracy improvement</p>
        </div>
        <div className="h-[250px]">
          <AttributionModelChart />
        </div>
      </motion.div>

      {/* Channel ROI Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300"
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-1">Cross-Channel ROI & Attribution Analysis</h2>
          <p className="text-sm text-muted-foreground">Multi-touch attribution revealing true channel performance and investment optimization</p>
        </div>
        <div className="h-[250px]">
          <ChannelROIChart />
        </div>
      </motion.div>
    </div>
  )
}
