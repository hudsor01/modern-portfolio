'use client'


import { clvMetrics } from '../data/constants'
import { formatCurrency } from '../utils'

export function StrategicImpact() {
  return (
    <div
      className="bg-secondary/10 border border-secondary/20 rounded-xl p-6"
    >
      <h2 className="typography-h4 mb-4 text-secondary">Advanced CLV Analytics & Predictive Intelligence Impact</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <div className="typography-h3 text-secondary mb-1">94.3%</div>
          <div className="typography-small text-muted-foreground">Machine Learning Prediction Accuracy (Industry: 75-85%)</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <div className="typography-h3 text-accent mb-1">{formatCurrency(clvMetrics.revenueImpact / 1000)}K</div>
          <div className="typography-small text-muted-foreground">Predicted Revenue Impact (24-month forecast)</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <div className="typography-h3 text-primary mb-1">5</div>
          <div className="typography-small text-muted-foreground">Customer Segments (RFM + Behavioral Analysis)</div>
        </div>
      </div>
    </div>
  )
}
