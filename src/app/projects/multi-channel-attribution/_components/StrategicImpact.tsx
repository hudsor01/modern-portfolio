'use client'


import { attributionMetrics } from '../data/constants'
import { formatCurrency } from '../utils'

export function StrategicImpact() {
  return (
    <div
      className="bg-accent/10 border border-accent/20 rounded-xl p-6"
    >
      <h2 className="typography-h4 mb-4 text-accent">Multi-Channel Attribution Intelligence & Marketing ROI Impact</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <div className="typography-h3 text-accent mb-1">92.4%</div>
          <div className="typography-small text-muted-foreground">ML Attribution Accuracy (Traditional: 65-75%)</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <div className="typography-h3 text-primary mb-1">{formatCurrency(attributionMetrics.totalROI)}</div>
          <div className="typography-small text-muted-foreground">Marketing ROI Optimization Value</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <div className="typography-h3 text-secondary mb-1">+47.8%</div>
          <div className="typography-small text-muted-foreground">Conversion Lift Through Attribution Insights</div>
        </div>
      </div>
    </div>
  )
}
