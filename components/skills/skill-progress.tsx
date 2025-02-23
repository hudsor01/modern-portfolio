"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { ScrollFade } from "@/components/animations/scroll-fade"

interface Skill {
  name: string
  level: number
  category: string
}

interface SkillProgressProps {
  skills: Skill[]
}

export function SkillProgress({ skills }: SkillProgressProps) {
  const categories = React.useMemo(() => {
    return Array.from(new Set(skills.map((skill) => skill.category)))
  }, [skills])

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {categories.map((category) => (
        <ScrollFade key={category}>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{category}</h3>
            <div className="space-y-6">
              {skills
                .filter((skill) => skill.category === category)
                .map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{skill.name}</span>
                      <span className="text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress value={0} className="h-2" asChild>
                      <motion.div animate={{ width: `${skill.level}%` }} transition={{ duration: 1, delay: 0.2 }} />
                    </Progress>
                  </div>
                ))}
            </div>
          </div>
        </ScrollFade>
      ))}
    </div>
  )
}

