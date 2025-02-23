"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

interface Skill {
  name: string
  level: number
  category: string
}

interface SkillsProgressProps {
  skills: Skill[]
}

export function SkillsProgress({ skills }: SkillsProgressProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <div ref={ref} className="space-y-8">
      {Object.entries(
        skills.reduce(
          (acc, skill) => {
            if (!acc[skill.category]) {
              acc[skill.category] = []
            }
            acc[skill.category].push(skill)
            return acc
          },
          {} as Record<string, Skill[]>,
        ),
      ).map(([category, categorySkills]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold">{category}</h3>
          <div className="space-y-2">
            {categorySkills.map((skill) => (
              <div key={skill.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{skill.name}</span>
                  <span>{skill.level}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

