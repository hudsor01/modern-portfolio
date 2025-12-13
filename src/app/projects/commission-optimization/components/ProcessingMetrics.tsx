'use client'


import { TrendingUp } from 'lucide-react'
import { commissionCalculationMetrics } from '../data/constants'

export function ProcessingMetrics() {
  return (
    <div
      className="glass rounded-2xl p-6 mb-12"
    >
      <h3 className="typography-large mb-6">Commission Processing & Automation Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {commissionCalculationMetrics.map((metric, index) => (
          <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="typography-small text-muted-foreground mb-2">{metric.metric}</p>
            <p className="typography-h3 mb-1">{metric.value}</p>
            <p className="text-sm flex items-center gap-1 text-success">
              <TrendingUp className="w-4 h-4" />
              {metric.improvement}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
