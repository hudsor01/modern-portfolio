'use client'

import React from 'react'
import { TrendingUp, BarChart3, Target, Zap } from 'lucide-react'

interface ProjectStatsProps {
  totalProjects: number
  isLoading?: boolean
}

const stats = [
  {
    icon: TrendingUp,
    value: '$4.8M+',
    label: 'Revenue Optimized',
  },
  {
    icon: BarChart3,
    value: '432%',
    label: 'Average Growth',
  },
  {
    icon: Target,
    value: '2,217%',
    label: 'Network Expansion',
  },
  {
    icon: Zap,
    value: '11+',
    label: 'Case Studies',
  },
]

export const ProjectStats: React.FC<ProjectStatsProps> = ({ totalProjects, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 bg-card border border-border rounded-xl animate-pulse">
            <div className="w-10 h-10 bg-muted rounded-lg mb-4" />
            <div className="h-8 bg-muted rounded w-20 mb-2" />
            <div className="h-4 bg-muted rounded w-24" />
          </div>
        ))}
      </div>
    )
  }

  // Use actual project count for the last stat
  const displayStats = stats.map((stat, index) =>
    index === 3 ? { ...stat, value: `${totalProjects}+` } : stat
  )

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {displayStats.map((stat, index) => (
        <div
          key={index}
          className="group relative p-6 bg-card border border-border rounded-xl transition-all duration-400 ease-out hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5"
        >
          {/* Icon */}
          <div className="w-10 h-10 flex items-center justify-center bg-primary/5 border border-primary/10 rounded-lg mb-4 transition-colors duration-300 group-hover:bg-primary/10 group-hover:border-primary/20">
            <stat.icon className="w-5 h-5 text-primary" />
          </div>

          {/* Value */}
          <div className="font-mono text-2xl lg:text-3xl font-bold text-foreground mb-1 tracking-tight">
            {stat.value}
          </div>

          {/* Label */}
          <div className="text-sm text-muted-foreground">
            {stat.label}
          </div>

          {/* Subtle accent line */}
          <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-primary/0 group-hover:bg-primary/30 transition-colors duration-400 rounded-full" />
        </div>
      ))}
    </div>
  )
}
