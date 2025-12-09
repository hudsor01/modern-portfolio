'use client'

import { m as motion } from 'framer-motion'

export function StrategicImpact() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.9 }}
      className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-sm border border-violet-500/20 rounded-3xl p-8"
    >
      <h2 className="text-2xl font-bold mb-6 text-violet-400">Revenue Operations Excellence & Strategic Impact</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-violet-400 mb-2">96.8%</div>
          <div className="text-sm text-muted-foreground">Revenue Forecast Accuracy (Industry: 75-85%)</div>
        </div>
        <div className="glass rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">+34.2%</div>
          <div className="text-sm text-muted-foreground">YoY Revenue Growth (Target: 25%)</div>
        </div>
        <div className="glass rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-secondary mb-2">89.7%</div>
          <div className="text-sm text-muted-foreground">Operational Efficiency Score</div>
        </div>
      </div>
    </motion.div>
  )
}
