'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skill } from '@/data/skills'

interface SkillsChartProps {
  skills: Skill[]
}

export function SkillsChart({ skills }: Readonly<SkillsChartProps>) {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const categories = [
    { id: 'all', name: 'All Skills' },
    { id: 'data', name: 'Data Skills' },
    { id: 'tools', name: 'Tools & Software' },
    { id: 'business', name: 'Business Skills' },
    { id: 'technical', name: 'Technical Skills' },
  ]

  const filteredSkills = activeCategory === 'all'
    ? skills
    : skills.filter(skill => skill.category === activeCategory)

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setActiveCategory(category.id)}
            className="rounded-full"
          >
            {category.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSkills.map((skill) => (
          <div
            key={skill.name}
            className="bg-card p-4 rounded-lg shadow-lg"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{skill.name}</h3>
              <span className="typography-small text-muted-foreground">{skill.proficiency}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
