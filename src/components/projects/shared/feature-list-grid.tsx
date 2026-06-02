'use client'

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'

interface FeatureListItem {
  /** Card heading. */
  title: string
  /** Supporting paragraph under the heading. */
  description: string
  /** Bulleted achievements/outcomes rendered with a Check icon. */
  bullets: string[]
}

interface ImpactStat {
  /** Large stat value (pre-formatted string or node). */
  value: ReactNode
  /** Label under the stat. */
  label: string
  /** Stat color — alternates primary/secondary in the source designs. */
  variant?: 'primary' | 'secondary'
}

export interface FeatureListGridProps {
  /** "Feature grid" SectionCard. */
  featureTitle: string
  featureDescription: string
  items: FeatureListItem[]
  /** Optional icon shown beside each feature-card title. */
  itemIcon?: LucideIcon
  /** "Impact grid" SectionCard (rendered with the gradient variant). */
  impactTitle: string
  impactDescription: string
  impactStats: ImpactStat[]
}

/**
 * Shared two-section scaffold used by several project pages: a feature/pillar
 * grid (cards with a title, description, and a Check-bulleted list) followed by
 * a gradient "impact" grid of large stats. Extracted from the near-identical
 * IntelligenceModulesGrid / PillarsGrid / AlgorithmicApproachesGrid. Pages with
 * additional, project-unique sections render those separately alongside this.
 */
export function FeatureListGrid({
  featureTitle,
  featureDescription,
  items,
  itemIcon: Icon,
  impactTitle,
  impactDescription,
  impactStats,
}: FeatureListGridProps) {
  return (
    <>
      <SectionCard title={featureTitle} description={featureDescription} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
            >
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                {Icon && <Icon className="h-5 w-5 text-primary" />}
                {item.title}
              </h3>
              <p className="text-muted-foreground mb-4">{item.description}</p>
              <ul className="space-y-2">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title={impactTitle}
        description={impactDescription}
        variant="gradient"
        className="mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {impactStats.map((stat) => (
            <div key={stat.label} className="text-center p-4">
              <div
                className={`text-3xl font-bold mb-2 ${
                  stat.variant === 'primary' ? 'text-primary' : 'text-secondary'
                }`}
              >
                {stat.value}
              </div>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  )
}
