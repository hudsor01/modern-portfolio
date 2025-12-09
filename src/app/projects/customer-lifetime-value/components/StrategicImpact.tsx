'use client'

import { m as motion } from 'framer-motion'
import { clvMetrics } from '../data/constants'
import { formatCurrency } from '../utils'

export function StrategicImpact() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-3xl p-6"
    >
      <h2 className="text-xl font-bold mb-4 text-emerald-400">Advanced CLV Analytics & Predictive Intelligence Impact</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400 mb-1">94.3%</div>
          <div className="text-xs text-muted-foreground">Machine Learning Prediction Accuracy (Industry: 75-85%)</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-teal-400 mb-1">{formatCurrency(clvMetrics.revenueImpact / 1000)}K</div>
          <div className="text-xs text-muted-foreground">Predicted Revenue Impact (24-month forecast)</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">5</div>
          <div className="text-xs text-muted-foreground">Customer Segments (RFM + Behavioral Analysis)</div>
        </div>
      </div>
    </motion.div>
  )
}
