"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, ExternalLink } from "lucide-react"
import Link from "next/link"

const certifications = [
  {
    name: "Professional Revenue Operations Certification",
    issuer: "RevOps Institute",
    date: "2023",
    credentialId: "ROC-2023-1234",
    skills: ["Revenue Strategy", "Process Optimization", "Change Management"],
    link: "#",
  },
  {
    name: "Advanced Analytics Certification",
    issuer: "Data Analytics Association",
    date: "2022",
    credentialId: "AAC-2022-5678",
    skills: ["Data Analysis", "Business Intelligence", "Predictive Analytics"],
    link: "#",
  },
  {
    name: "Project Management Professional (PMP)",
    issuer: "Project Management Institute",
    date: "2021",
    credentialId: "PMP-2021-9012",
    skills: ["Project Management", "Risk Management", "Team Leadership"],
    link: "#",
  },
]

export function Certifications() {
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
          <h2 className="text-3xl font-bold">Certifications</h2>
          <p className="mt-2 text-muted-foreground">Professional certifications and achievements</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, index) => (
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
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{cert.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {cert.issuer} • {cert.date}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Credential ID: {cert.credentialId}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cert.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div>
                    <Link
                      href={cert.link}
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      View Certificate
                      <ExternalLink className="h-4 w-4" />
                    </Link>
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

