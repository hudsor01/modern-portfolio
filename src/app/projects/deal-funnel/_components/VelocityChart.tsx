'use client'

import type { PartnerConversion } from '../data/constants'
import { ChartHeader } from '@/components/ui/chart-container'

interface VelocityChartProps {
  partnerConversion: PartnerConversion[]
}

export function VelocityChart({ partnerConversion }: VelocityChartProps) {
  const colors = ['bg-primary', 'bg-secondary', 'bg-accent']
  const longest = Math.max(1, ...partnerConversion.map((p) => p.median_days_to_close))

  return (
    <div className="h-full">
      <ChartHeader
        title="Sales Velocity by Partner Tier"
        description="Median days from deal creation to close, per partner tier"
        headingLevel={2}
        className="mb-6"
      />
      <div className="space-y-6">
        {partnerConversion.map((partner, index) => {
          return (
            <div key={partner.group}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{partner.group}</span>
                <span className="typography-small text-muted-foreground">
                  {partner.median_days_to_close} days
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className={`${colors[index % colors.length]} h-3 rounded-full`}
                  style={{ width: `${(partner.median_days_to_close / longest) * 100}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
