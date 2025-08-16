'use client'

import { motion } from 'framer-motion'
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

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
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
      <motion.div
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Impact & Experience
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Proven track record of driving revenue growth and operational excellence
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <ExperienceStatCard 
            key={stat.label}
            stat={stat}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}

interface ExperienceStatCardProps {
  stat: ExperienceStat
  index: number
}

function ExperienceStatCard({ stat, index }: ExperienceStatCardProps) {
  const IconComponent = iconMap[stat.icon as keyof typeof iconMap] || TrendingUp

  return (
    <motion.div
      initial={fadeInUp.initial}
      animate={fadeInUp.animate}
      transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <IconComponent className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            <AnimatedCounter 
              value={stat.value}
              duration={2000}
            />
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {stat.label}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}