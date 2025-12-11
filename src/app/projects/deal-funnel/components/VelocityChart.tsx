'use client'


import { Zap } from 'lucide-react'
import type { PartnerConversion } from '../data/constants'

interface VelocityChartProps {
  partnerConversion: PartnerConversion[]
}

export function VelocityChart({ partnerConversion }: VelocityChartProps) {
  const colors = ['bg-primary', 'bg-success', 'bg-amber-500']

  return (
    <div
      className="glass rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300"
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
              <div className="w-full bg-white/10 rounded-full h-3">
                <div
                  className={`${colors[index]} h-3 rounded-full`}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-6 p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm border border-primary/20 rounded-2xl">
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
