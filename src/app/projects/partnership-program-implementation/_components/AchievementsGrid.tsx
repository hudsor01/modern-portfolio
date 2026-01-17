'use client'

import { TrendingUp, Users, Settings, BarChart } from 'lucide-react'

const achievements = [
  {
    metric: 'Partner Program',
    value: 'First Implementation',
    description:
      "Designed and built company's first-ever partnership program from concept to production",
    icon: <Users className="w-6 h-6" />,
  },
  {
    metric: 'System Integration',
    value: 'Full Production',
    description: 'Production-ready integrations with CRM, billing systems, and partner portals',
    icon: <Settings className="w-6 h-6" />,
  },
  {
    metric: 'Automation Level',
    value: '90%+',
    description: 'Automated partner onboarding, commission tracking, and performance reporting',
    icon: <BarChart className="w-6 h-6" />,
  },
  {
    metric: 'Business Impact',
    value: 'Strategic Success',
    description: 'Program became integral to company revenue strategy and growth',
    icon: <TrendingUp className="w-6 h-6" />,
  },
]

export function AchievementsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievements.map((achievement, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 ease-out"
          >
            <div className="text-primary mb-4">{achievement.icon}</div>
            <div className="space-y-2">
              <div className="text-xl font-semibold text-foreground">{achievement.value}</div>
              <div className="text-sm font-medium text-primary">{achievement.metric}</div>
              <div className="text-sm text-muted-foreground">{achievement.description}</div>
            </div>
          </div>
        ))}
    </div>
  )
}
