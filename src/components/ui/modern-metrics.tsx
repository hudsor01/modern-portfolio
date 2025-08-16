import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModernMetricProps {
  icon: LucideIcon
  value: string
  label: string
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export function ModernMetric({ 
  icon: Icon, 
  value, 
  label, 
  trend = 'neutral',
  className 
}: ModernMetricProps) {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-cyan-400'
  }

  return (
    <div className={cn(
      "p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl hover:border-cyan-500/50 transition-all duration-300 text-center",
      className
    )}>
      <div className={cn("mb-2 flex justify-center", trendColors[trend])}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  )
}

interface ModernMetricsGridProps {
  metrics: Array<{
    icon: LucideIcon
    value: string
    label: string
    trend?: 'up' | 'down' | 'neutral'
  }>
  className?: string
}

export function ModernMetricsGrid({ metrics, className }: ModernMetricsGridProps) {
  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
      className
    )}>
      {metrics.map((metric, index) => (
        <ModernMetric
          key={index}
          icon={metric.icon}
          value={metric.value}
          label={metric.label}
          trend={metric.trend}
        />
      ))}
    </div>
  )
}