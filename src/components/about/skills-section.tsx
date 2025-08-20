'use client'

import { m as motion } from 'framer-motion'
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

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

export function SkillsSection({ skills, className = '' }: SkillsSectionProps) {
  return (
    <section className={className}>
      <motion.div
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Core Competencies
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Revenue operations expertise spanning analytics, automation, and strategic optimization
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skills.map((category, index) => (
          <SkillCategoryCard 
            key={category.category}
            category={category}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}

interface SkillCategoryCardProps {
  category: SkillCategory
  index: number
}

function SkillCategoryCard({ category, index }: SkillCategoryCardProps) {
  return (
    <motion.div
      initial={fadeInUp.initial}
      animate={fadeInUp.animate}
      transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
    >
      <Card className="h-full border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardHeader className="text-center pb-4">
          <div className="text-4xl mb-4">{category.icon}</div>
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
            {category.category}
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-300">
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
    </motion.div>
  )
}

interface SkillItemProps {
  skill: Skill
}

function SkillItem({ skill }: SkillItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-800 dark:text-white">
          {skill.name}
        </span>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {skill.years}y
          </Badge>
          <span className="text-sm text-gray-600 dark:text-gray-300">
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