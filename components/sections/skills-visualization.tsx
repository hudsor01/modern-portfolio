"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const skills = {
  "Technical Skills": [
    { name: "Next.js", level: 90 },
    { name: "React", level: 95 },
    { name: "TypeScript", level: 85 },
    { name: "Node.js", level: 80 },
    { name: "SQL", level: 75 },
  ],
  "Revenue Operations": [
    { name: "Strategic Planning", level: 95 },
    { name: "Process Optimization", level: 90 },
    { name: "Data Analysis", level: 85 },
    { name: "Sales Operations", level: 90 },
    { name: "Marketing Operations", level: 85 },
  ],
  Leadership: [
    { name: "Team Management", level: 95 },
    { name: "Project Management", level: 90 },
    { name: "Change Management", level: 85 },
    { name: "Stakeholder Management", level: 90 },
    { name: "Strategic Leadership", level: 95 },
  ],
}

export function SkillsVisualization() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-12">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold">Skills & Expertise</h2>
          <p className="mt-2 text-muted-foreground">
            A comprehensive overview of my technical and professional capabilities
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(skills).map(([category, skillList], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{category}</CardTitle>
                  <CardDescription>Proficiency levels in {category.toLowerCase()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {skillList.map((skill, index) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{skill.name}</span>
                        <span className="text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress value={0} className="h-2" animate={inView ? skill.level : 0} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

