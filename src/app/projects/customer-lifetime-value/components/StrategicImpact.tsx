'use client'


import { clvMetrics } from '../data/constants'
import { formatCurrency } from '../utils'

export function StrategicImpact() {
  return (
    <div
      className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xs border border-emerald-500/20 rounded-xl p-6"
    >
      <h2 className="typography-h4 mb-4 text-emerald-400">Advanced CLV Analytics & Predictive Intelligence Impact</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-4 text-center">
          <div className="typography-h3 text-emerald-400 mb-1">94.3%</div>
          <div className="typography-small text-muted-foreground">Machine Learning Prediction Accuracy (Industry: 75-85%)</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="typography-h3 text-teal-400 mb-1">{formatCurrency(clvMetrics.revenueImpact / 1000)}K</div>
          <div className="typography-small text-muted-foreground">Predicted Revenue Impact (24-month forecast)</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="typography-h3 text-primary mb-1">5</div>
          <div className="typography-small text-muted-foreground">Customer Segments (RFM + Behavioral Analysis)</div>
        </div>
      </div>
    </div>
  )
}
