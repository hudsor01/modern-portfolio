'use client'


import { Zap } from 'lucide-react'
import type { PartnerConversion } from '../data/constants'

interface VelocityChartProps {
  partnerConversion: PartnerConversion[]
}

export function VelocityChart({ partnerConversion }: VelocityChartProps) {
  const colors = ['bg-primary', 'bg-secondary', 'bg-accent']

  return (
    <div
      className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 ease-out"
    >
      <h2 className="typography-h3 mb-6">Sales Velocity by Segment</h2>
      <div className="space-y-6">
        {partnerConversion.map((partner, index) => {
          return (
            <div key={partner.group}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{partner.group}</span>
                <span className="typography-small text-muted-foreground">{partner.avg_sales_cycle_days} days</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className={`${colors[index % colors.length]} h-3 rounded-full`}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-primary">Quick Win</h3>
        </div>
        <p className="typography-small text-muted-foreground">
          SMB deals close 47% faster than Enterprise. Consider segment-specific sales strategies.
        </p>
      </div>
    </div>
  )
}
