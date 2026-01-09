'use client'

import { Check } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { formatCurrency, formatPercentage } from '@/lib/utils/data-formatters'

interface Pillar {
  title: string
  description: string
  achievements: string[]
}

interface PillarsGridProps {
  pillars: Pillar[]
}

export function PillarsGrid({ pillars }: PillarsGridProps) {
  return (
    <>
      {/* Implementation Pillars */}
      <SectionCard
        title="Implementation Pillars"
        description="Core components of the sales enablement platform"
        className="mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
            >
              <h3 className="text-lg font-semibold mb-3">{pillar.title}</h3>
              <p className="text-muted-foreground mb-4">{pillar.description}</p>
              <ul className="space-y-2">
                {pillar.achievements.map((achievement, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Business Impact */}
      <SectionCard
        title="Business Impact"
        description="Measurable improvements in sales performance and team effectiveness"
        variant="gradient"
        className="mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-secondary mb-2">{formatPercentage(0.34)}</div>
            <p className="text-muted-foreground">
              Increase in deal win rates across all sales teams
            </p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-primary mb-2">{formatPercentage(0.45)}</div>
            <p className="text-muted-foreground">
              Reduction in new hire ramp time to full productivity
            </p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-secondary mb-2">{formatPercentage(0.82)}</div>
            <p className="text-muted-foreground">
              Adoption rate for coaching materials within 3 months
            </p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-primary mb-2">
              {formatCurrency(3200000, { compact: true })}
            </div>
            <p className="text-muted-foreground">
              Additional revenue attributed to improved sales skills
            </p>
          </div>
        </div>
      </SectionCard>
    </>
  )
}
