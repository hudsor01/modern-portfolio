'use client'

import { Card, CardContent } from '@/components/ui/card'
import { AnimatedCounter } from './animated-counter'
import {
  TrendingUp,
  Briefcase,
  CheckCircle,
  DollarSign,
} from 'lucide-react'

interface CareerMetric {
  label: string
  value: string
  subtitle: string
  icon: string
}

interface CareerImpactMetricsProps {
  stats: CareerMetric[]
  className?: string
}

const iconMap = {
  'trending-up': TrendingUp,
  'briefcase': Briefcase,
  'check-circle': CheckCircle,
  'dollar-sign': DollarSign,
}

export function CareerImpactMetrics({ stats, className = '' }: CareerImpactMetricsProps) {
  return (
    <section className={className}>
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl lg:text-4xl font-semibold mb-4">
          Career Impact
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Proven track record of driving revenue growth and operational excellence through data-driven decision making
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <CareerMetricCard
            key={stat.label}
            stat={stat}
          />
        ))}
      </div>
    </section>
  )
}

interface CareerMetricCardProps {
  stat: CareerMetric
}

function CareerMetricCard({ stat }: CareerMetricCardProps) {
  const IconComponent = iconMap[stat.icon as keyof typeof iconMap] || TrendingUp

  return (
    <Card className="bg-card border border-border rounded-2xl hover:border-primary/50 hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-6 text-center">
        <div className="mb-4 flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <IconComponent className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="font-display text-3xl font-bold text-foreground mb-2">
          <AnimatedCounter
            value={stat.value}
            duration={2000}
          />
        </div>
        <p className="text-sm font-semibold text-foreground mb-1">
          {stat.label}
        </p>
        <p className="text-xs text-muted-foreground">
          {stat.subtitle}
        </p>
      </CardContent>
    </Card>
  )
}
