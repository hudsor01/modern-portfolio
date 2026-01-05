'use client'


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface Skill {
  name: string
  level: number
  years: number
}

interface SkillCategory {
  category: string
  icon: string
  description: string
  skills: Skill[]
}

interface SkillsSectionProps {
  skills: SkillCategory[]
  className?: string
}


export function SkillsSection({ skills, className = '' }: SkillsSectionProps) {
  return (
    <section className={className}>
      <div className="text-center mb-12">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
          Core Competencies
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Revenue operations expertise spanning analytics, automation, and strategic optimization
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 @container">
        {skills.map((category) => (
          <SkillCategoryCard
            key={category.category}
            category={category}
          />
        ))}
      </div>
    </section>
  )
}

interface SkillCategoryCardProps {
  category: SkillCategory
}

function SkillCategoryCard({ category }: SkillCategoryCardProps) {
  return (
    <Card className="h-full bg-card border border-border rounded-2xl hover:border-primary/50 transition-all duration-300">
      <CardHeader className="text-center pb-4">
        <div className="text-2xl mb-4">{category.icon}</div>
        <CardTitle className="font-display text-xl font-semibold text-foreground">
          {category.category}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {category.description}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {category.skills.map((skill) => (
            <SkillItem key={skill.name} skill={skill} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface SkillItemProps {
  skill: Skill
}

function SkillItem({ skill }: SkillItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          {skill.name}
        </span>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {skill.years}y
          </Badge>
          <span className="text-xs text-muted-foreground">
            {skill.level}%
          </span>
        </div>
      </div>
      <Progress
        value={skill.level}
        className="h-2"
        aria-label={`${skill.name} proficiency: ${skill.level}%`}
      />
    </div>
  )
}