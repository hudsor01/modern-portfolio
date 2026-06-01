'use client'

import { FeatureListGrid } from '@/components/projects/shared/feature-list-grid'
import { formatCurrency, formatPercentage } from '@/lib/data-formatters'

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
    <FeatureListGrid
      featureTitle="Implementation Pillars"
      featureDescription="Core components of the sales enablement platform"
      items={pillars.map((p) => ({
        title: p.title,
        description: p.description,
        bullets: p.achievements,
      }))}
      impactTitle="Business Impact"
      impactDescription="Measurable improvements in sales performance and team effectiveness"
      impactStats={[
        {
          value: formatPercentage(0.34),
          label: 'Increase in deal win rates across all sales teams',
          variant: 'secondary',
        },
        {
          value: formatPercentage(0.45),
          label: 'Reduction in new hire ramp time to full productivity',
          variant: 'primary',
        },
        {
          value: formatPercentage(0.82),
          label: 'Adoption rate for coaching materials within 3 months',
          variant: 'secondary',
        },
        {
          value: formatCurrency(3200000, { compact: true }),
          label: 'Additional revenue attributed to improved sales skills',
          variant: 'primary',
        },
      ]}
    />
  )
}
