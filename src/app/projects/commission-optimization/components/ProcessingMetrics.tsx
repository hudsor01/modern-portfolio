'use client'

import { TrendingUp } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { commissionCalculationMetrics } from '../data/constants'

export function ProcessingMetrics() {
  return (
    <SectionCard
      title="Commission Processing & Automation Metrics"
      variant="glass"
      padding="lg"
      className="mb-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {commissionCalculationMetrics.map((metric, index) => (
          <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-sm text-muted-foreground mb-2">{metric.metric}</p>
            <p className="text-2xl font-semibold mb-1">{metric.value}</p>
            <p className="text-sm flex items-center gap-1 text-green-600 dark:text-green-400">
              <TrendingUp className="w-4 h-4" />
              {metric.improvement}
            </p>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
