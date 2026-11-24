'use client'

import type React from 'react'
import { TrendingUp, BarChart3, Target, Zap } from 'lucide-react'
import {
  REVENUE_IMPACT,
  REVENUE_IMPACT_LABEL,
  TRANSACTION_GROWTH,
  TRANSACTION_GROWTH_LABEL,
  NETWORK_GROWTH,
  NETWORK_GROWTH_LABEL,
  type StatKey,
} from '@/lib/stats'

interface ProjectStatsProps {
  totalProjects: number
}

interface StatTile {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' }>
  value: string
  label: string
  statKey?: StatKey
}

const stats: StatTile[] = [
  {
    icon: TrendingUp,
    value: REVENUE_IMPACT,
    label: REVENUE_IMPACT_LABEL,
    statKey: 'revenue',
  },
  {
    icon: BarChart3,
    value: TRANSACTION_GROWTH,
    label: TRANSACTION_GROWTH_LABEL,
    statKey: 'transaction-growth',
  },
  {
    icon: Target,
    value: NETWORK_GROWTH,
    label: NETWORK_GROWTH_LABEL,
    statKey: 'network-growth',
  },
  {
    icon: Zap,
    // Placeholder; overridden at render with the live project count.
    value: '11+',
    label: 'Case Studies',
  },
]

export const ProjectStats: React.FC<ProjectStatsProps> = ({ totalProjects }) => {
  // Use actual project count for the last stat
  const displayStats = stats.map((stat, index) =>
    index === 3 ? { ...stat, value: `${totalProjects}+` } : stat
  )

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {displayStats.map((stat, index) => (
        <div
          key={index}
          className="group relative p-6 bg-card border border-border rounded-xl transition-all duration-300 ease-out hover:border-primary/20 hover:shadow-md hover:-translate-y-1"
        >
          {/* Icon */}
          <div className="w-10 h-10 flex items-center justify-center bg-primary/5 border border-border rounded-lg mb-4 transition-colors duration-300 ease-out group-hover:bg-primary/10 group-hover:border-primary/20">
            <stat.icon className="w-5 h-5 text-primary" aria-hidden="true" />
          </div>

          {/* Value */}
          <div
            data-stat={stat.statKey}
            className="font-sans text-2xl lg:text-3xl font-semibold tabular-nums tracking-tight text-foreground mb-1"
          >
            {stat.value}
          </div>

          {/* Label */}
          <div
            data-stat-label={stat.statKey}
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {stat.label}
          </div>

          {/* Subtle accent line */}
          <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-primary/0 group-hover:bg-primary/30 transition-colors duration-300 ease-out rounded-full" />
        </div>
      ))}
    </div>
  )
}
