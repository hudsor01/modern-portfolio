'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, BarChart3, Users, Code } from 'lucide-react'
import type { Skill } from '@/types/resume'

interface SkillsBentoProps {
  skills: Skill[]
  className?: string
}

const categoryIconMap: Record<string, React.ElementType> = {
  'Revenue Operations': TrendingUp,
  'Data Analysis': BarChart3,
  'Partner Management': Users,
  'Technical Skills': Code,
}

export function SkillsBento({ skills, className = '' }: SkillsBentoProps) {
  return (
    <section className={className}>
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl lg:text-4xl font-semibold mb-4">
          Skills & Expertise
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive skill set spanning revenue operations, analytics, and partner management
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {skills.map((skillGroup, index) => (
          <SkillCard key={`${skillGroup.category}-${index}`} skillGroup={skillGroup} />
        ))}
      </div>
    </section>
  )
}

interface SkillCardProps {
  skillGroup: Skill
}

function SkillCard({ skillGroup }: SkillCardProps) {
  const Icon = categoryIconMap[skillGroup.category] || Code

  return (
    <Card className="bg-card border border-border rounded-2xl hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

      <CardContent className="relative p-6">
        {/* Icon and Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground">
            {skillGroup.category}
          </h3>
        </div>

        {/* Skills badges */}
        <div className="flex flex-wrap gap-2">
          {skillGroup.items.map((skill, idx) => (
            <Badge
              key={`${skill}-${idx}`}
              variant="secondary"
              className="text-xs font-medium"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
