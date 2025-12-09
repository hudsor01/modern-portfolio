'use client'

import { m as motion } from 'framer-motion'
import { attributionMetrics } from '../data/constants'
import { formatCurrency } from '../utils'

export function StrategicImpact() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm border border-orange-500/20 rounded-3xl p-6"
    >
      <h2 className="text-xl font-bold mb-4 text-orange-400">Multi-Channel Attribution Intelligence & Marketing ROI Impact</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-400 mb-1">92.4%</div>
          <div className="text-xs text-muted-foreground">ML Attribution Accuracy (Traditional: 65-75%)</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-destructive mb-1">{formatCurrency(attributionMetrics.totalROI)}</div>
          <div className="text-xs text-muted-foreground">Marketing ROI Optimization Value</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-pink-400 mb-1">+47.8%</div>
          <div className="text-xs text-muted-foreground">Conversion Lift Through Attribution Insights</div>
        </div>
      </div>
    </motion.div>
  )
}
