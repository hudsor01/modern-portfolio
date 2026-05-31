'use client'

import type React from 'react'
import { TrendingUp, BarChart3, Target, Zap } from 'lucide-react'
import { REVENUE_IMPACT, TRANSACTION_GROWTH, NETWORK_GROWTH } from '@/lib/stats'

interface ProjectStatsProps {
  totalProjects: number
}

const stats = [
  {
    icon: TrendingUp,
    value: REVENUE_IMPACT,
    label: 'Revenue Optimized',
  },
  {
    icon: BarChart3,
    value: TRANSACTION_GROWTH,
    label: 'Average Growth',
  },
  {
    icon: Target,
    value: NETWORK_GROWTH,
    label: 'Network Expansion',
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
          <div className="w-10 h-10 flex items-center justify-center bg-primary/5 border border-primary/10 rounded-lg mb-4 transition-colors duration-300 ease-out group-hover:bg-primary/10 group-hover:border-primary/20">
            <stat.icon className="w-5 h-5 text-primary" />
          </div>

          {/* Value */}
          <div className="font-mono text-2xl lg:text-3xl font-bold text-foreground mb-1 tracking-tight">
            {stat.value}
          </div>

          {/* Label */}
          <div className="text-sm text-muted-foreground">{stat.label}</div>

          {/* Subtle accent line */}
          <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-primary/0 group-hover:bg-primary/30 transition-colors duration-300 ease-out rounded-full" />
        </div>
      ))}
    </div>
  )
}
