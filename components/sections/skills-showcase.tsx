"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FadeIn } from "@/components/ui/fade-in"

interface Skill {
  name: string
  level: number
  category: string
}

const skills: Skill[] = [
  { name: "Revenue Operations", level: 95, category: "Operations" },
  { name: "Process Optimization", level: 90, category: "Operations" },
  { name: "Data Analytics", level: 85, category: "Analytics" },
  { name: "Salesforce", level: 90, category: "Technology" },
  { name: "Power BI", level: 85, category: "Technology" },
  { name: "Python", level: 80, category: "Development" },
  { name: "React", level: 85, category: "Development" },
  { name: "Next.js", level: 80, category: "Development" },
]

const categories = Array.from(new Set(skills.map((skill) => skill.category)))

export function SkillsShowcase() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-20 bg-accent/5">
      <div className="container px-4">
        <FadeIn>
          <h2 className="text-3xl font-bold text-center mb-12">Skills & Expertise</h2>
        </FadeIn>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Skills Graph */}
          <Card className="p-6">
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Categories */}
          <div className="space-y-6">
            {categories.map((category) => (
              <Card key={category} className="p-6">
                <h3 className="font-semibold mb-4">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skills
                    .filter((skill) => skill.category === category)
                    .map((skill) => (
                      <Badge key={skill.name} variant="secondary">
                        {skill.name}
                      </Badge>
                    ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

