'use client'

import { m as motion } from 'framer-motion'
import { kpiAlerts, alertTypeStyles } from '../data/constants'

export function KPIAlerts() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass rounded-3xl p-6 mb-12"
    >
      <h3 className="text-lg font-semibold mb-4">Real-Time Revenue Operations Alerts</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kpiAlerts.map((alert, index) => {
          const IconComponent = alert.icon
          return (
            <div key={index} className={`flex items-center gap-3 p-4 rounded-xl border ${alertTypeStyles[alert.type as keyof typeof alertTypeStyles]}`}>
              <IconComponent className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{alert.message}</span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
