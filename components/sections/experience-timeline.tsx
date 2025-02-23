"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TimelineItem {
  date: string
  title: string
  company: string
  description: string
  achievements: string[]
  technologies: string[]
}

const experiences: TimelineItem[] = [
  {
    date: "2023 - Present",
    title: "Senior Revenue Operations Manager",
    company: "Thryv",
    description: "Leading revenue optimization initiatives and digital transformation projects.",
    achievements: [
      "Drove $1.1M+ revenue growth through data-driven forecasting",
      "Scaled partner network by 2,200%",
      "Achieved 95% forecast accuracy across divisions",
      "Reduced processing time by 80%",
    ],
    technologies: ["Power BI", "Salesforce", "PartnerStack", "Python"],
  },
  {
    date: "2021 - 2023",
    title: "Revenue Operations Specialist",
    company: "Thryv",
    description: "Implemented data-driven solutions to optimize revenue streams.",
    achievements: [
      "Built automated KPI dashboards",
      "Improved forecast accuracy by 40%",
      "Automated commission management system",
      "Streamlined reporting processes",
    ],
    technologies: ["Data Analytics", "Process Automation", "Business Intelligence"],
  },
  {
    date: "2020 - 2021",
    title: "Channel Operations Lead",
    company: "Thryv",
    description: "Managed and scaled partner network operations.",
    achievements: [
      "Scaled network to 300+ active partners",
      "Reduced onboarding time by 45%",
      "Built scalable infrastructure",
      "Implemented real-time analytics",
    ],
    technologies: ["Partner Management", "Analytics", "Process Optimization"],
  },
]

export function ExperienceTimeline() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Professional Experience</h2>
        <div ref={ref} className="relative space-y-8">
          <div className="absolute left-[16px] top-3 h-[calc(100%-24px)] w-px bg-border md:left-1/2" />
          {experiences.map((experience, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <div className={`md:text-right ${index % 2 === 0 ? "md:pr-8" : "md:order-last md:pl-8"}`}>
                <time className="text-sm text-muted-foreground">{experience.date}</time>
              </div>
              <div className={index % 2 === 0 ? "md:pl-8" : "md:pr-8"}>
                <div className="absolute left-0 top-3 h-3 w-3 rounded-full border-2 border-primary bg-background md:left-1/2 md:-ml-1.5" />
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold leading-none">{experience.title}</h3>
                        <p className="text-sm text-muted-foreground">{experience.company}</p>
                      </div>
                      <p className="text-sm">{experience.description}</p>
                      <ul className="text-sm space-y-1">
                        {experience.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-1 pt-2">
                        {experience.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExperienceTimeline

