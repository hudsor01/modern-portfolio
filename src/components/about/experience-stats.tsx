'use client'


import { Card, CardContent } from '@/components/ui/card'
import { AnimatedCounter } from './animated-counter'
import { 
  TrendingUp, 
  Star, 
  Briefcase, 
  Clock 
} from 'lucide-react'

interface ExperienceStat {
  label: string
  value: string
  icon: string
}

interface ExperienceStatsProps {
  stats: ExperienceStat[]
  className?: string
}


const iconMap = {
  'trending-up': TrendingUp,
  'star': Star,
  'briefcase': Briefcase,
  'clock': Clock,
}

export function ExperienceStats({ stats, className = '' }: ExperienceStatsProps) {
  return (
    <section className={className}>
      <div className="text-center mb-12">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
          Impact & Experience
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Proven track record of driving revenue growth and operational excellence
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 @container">
        {stats.map((stat) => (
          <ExperienceStatCard
            key={stat.label}
            stat={stat}
          />
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
            <IconComponent className="h-6 w-6 @sm:h-8 @sm:w-8 text-primary" />
          </div>
        </div>
        <div className="font-display text-xl @sm:text-2xl font-bold text-foreground mb-2">
          <AnimatedCounter
            value={stat.value}
            duration={2000}
          />
        </div>
        <p className="text-xs @sm:text-sm font-medium text-muted-foreground">
          {stat.label}
        </p>
      </CardContent>
    </Card>
  )
}