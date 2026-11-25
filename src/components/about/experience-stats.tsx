'use client'

import { Card, CardContent } from '@/components/ui/card'
import { AnimatedCounter } from './animated-counter'
import {
  TrendingUp,
  Star,
  Briefcase,
  Clock,
  CheckCircle,
  DollarSign,
  Rocket,
  BarChart3,
} from 'lucide-react'
import type { StatKey } from '@/lib/stats'

interface ExperienceStat {
  label: string
  value: string
  icon: string
  statKey?: StatKey
}

interface ExperienceStatsProps {
  stats: ExperienceStat[]
  className?: string
}

const iconMap = {
  'trending-up': TrendingUp,
  star: Star,
  briefcase: Briefcase,
  clock: Clock,
  'check-circle': CheckCircle,
  'dollar-sign': DollarSign,
  rocket: Rocket,
  'bar-chart': BarChart3,
}

export function ExperienceStats({ stats, className = '' }: ExperienceStatsProps) {
  return (
    <section className={className}>
      <div className="text-center mb-12">
        <h2 className="mb-4">Impact & Experience</h2>
        <p className="max-w-3xl mx-auto">
          Proven track record of driving revenue growth and operational excellence
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 @container">
        {stats.map((stat) => (
          <ExperienceStatCard key={stat.statKey ?? stat.label} stat={stat} />
        ))}
      </div>
    </section>
  )
}

interface ExperienceStatCardProps {
  stat: ExperienceStat
}

function ExperienceStatCard({ stat }: ExperienceStatCardProps) {
  const IconComponent = iconMap[stat.icon as keyof typeof iconMap] || TrendingUp

  return (
    <Card className="bg-card border border-border rounded-2xl hover:border-primary/50 transition-all duration-300">
      <CardContent className="p-4 @sm:p-6 text-center">
        <div className="mb-4 flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <IconComponent className="h-6 w-6 @sm:h-8 @sm:w-8 text-primary" aria-hidden="true" />
          </div>
        </div>
        <div
          data-stat={stat.statKey}
          className="font-sans text-3xl font-semibold tabular-nums tracking-tight text-foreground mb-2"
        >
          <AnimatedCounter value={stat.value} duration={2000} />
        </div>
        <p
          data-stat-label={stat.statKey}
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          {stat.label}
        </p>
      </CardContent>
    </Card>
  )
}
