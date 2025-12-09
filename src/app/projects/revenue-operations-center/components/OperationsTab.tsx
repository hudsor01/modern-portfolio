'use client'

import { m as motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { departmentMetrics } from '../data/constants'

export function OperationsTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="space-y-8 mb-12"
    >
      {departmentMetrics.map((dept, index) => (
        <div key={index} className="glass rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300">
          <h3 className="text-xl font-bold mb-6">{dept.department} Operations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dept.metrics.map((metric, metricIndex) => (
              <div key={metricIndex} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <p className="text-sm text-muted-foreground mb-2">{metric.name}</p>
                <p className="text-2xl font-bold mb-1">{metric.value}</p>
                <p className={`text-sm flex items-center gap-1 ${
                  metric.positive ? 'text-success' : 'text-destructive'
                }`}>
                  {metric.positive ?
                    <TrendingUp className="w-4 h-4" /> :
                    <TrendingDown className="w-4 h-4" />
                  }
                  {metric.change}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  )
}
