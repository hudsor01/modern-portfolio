"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap } from "lucide-react"

const education = [
  {
    degree: "Master of Business Administration",
    specialization: "Business Analytics",
    institution: "University Name",
    year: "2018 - 2020",
    achievements: [
      "Graduated with Distinction",
      "Specialized in Data-Driven Decision Making",
      "Research focus on Revenue Operations",
    ],
    relevantCourses: ["Advanced Analytics", "Strategic Management", "Digital Transformation", "Business Intelligence"],
  },
  {
    degree: "Bachelor of Science",
    specialization: "Business Administration",
    institution: "University Name",
    year: "2014 - 2018",
    achievements: ["Dean's List all semesters", "Business Strategy Competition Winner", "Student Leadership Award"],
    relevantCourses: ["Business Analytics", "Operations Management", "Financial Analysis", "Project Management"],
  },
]

export function EducationHistory() {
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
          <h2 className="text-3xl font-bold">Education</h2>
          <p className="mt-2 text-muted-foreground">Academic background and qualifications</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{edu.degree}</CardTitle>
                      <p className="text-sm text-muted-foreground">{edu.specialization}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">{edu.institution}</p>
                    <p className="text-sm text-muted-foreground">{edu.year}</p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-medium">Key Achievements</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {edu.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-medium">Relevant Coursework</h4>
                    <div className="flex flex-wrap gap-2">
                      {edu.relevantCourses.map((course) => (
                        <Badge key={course} variant="secondary">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

