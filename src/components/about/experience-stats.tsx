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
      <div
        
        
        className="text-center mb-12"
      >
        <h2 className="typography-h1 text-xl mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Impact & Experience
        </h2>
        <p className="typography-lead dark:text-muted-foreground max-w-3xl mx-auto">
          Proven track record of driving revenue growth and operational excellence
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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
    <div
      
      
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-all duration-300 ease-out">
        <CardContent className="p-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="p-3 rounded-full bg-primary/10 dark:bg-primary-bg">
              <IconComponent className="h-8 w-8 text-primary dark:text-primary" />
            </div>
          </div>
          <div className="typography-h2 border-none pb-0 text-2xl text-foreground dark:text-white mb-2">
            <AnimatedCounter 
              value={stat.value}
              duration={2000}
            />
          </div>
          <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
            {stat.label}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}