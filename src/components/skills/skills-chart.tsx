'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
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
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSkills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-card p-4 rounded-lg shadow-lg"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{skill.name}</h3>
              <span className="text-sm text-muted-foreground">{skill.proficiency}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <motion.div
                className="bg-blue-500 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${skill.proficiency}%` }}
                transition={{ duration: 0.8, delay: 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
