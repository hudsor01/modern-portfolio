'use client'

import { m as motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { commissionCalculationMetrics } from '../data/constants'

export function ProcessingMetrics() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass rounded-3xl p-6 mb-12"
    >
      <h3 className="text-lg font-semibold mb-6">Commission Processing & Automation Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {commissionCalculationMetrics.map((metric, index) => (
          <div key={index} className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className="text-sm text-muted-foreground mb-2">{metric.metric}</p>
            <p className="text-2xl font-bold mb-1">{metric.value}</p>
            <p className="text-sm flex items-center gap-1 text-success">
              <TrendingUp className="w-4 h-4" />
              {metric.improvement}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
