"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { motion } from "framer-motion"

interface LogEntry {
  date: Date
  title: string
  description: string
  tags: string[]
}

const logEntries: LogEntry[] = [
  {
    date: new Date("2024-02-20"),
    title: "Analytics Integration",
    description: "Implemented comprehensive analytics tracking using Google Analytics and Vercel Analytics.",
    tags: ["Analytics", "Performance", "Development"],
  },
  {
    date: new Date("2024-02-19"),
    title: "Media Optimization",
    description: "Added WebP conversion and lazy loading for improved image performance.",
    tags: ["Optimization", "Media", "Performance"],
  },
  // Add more log entries as needed
]

export function DevLog() {
  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Development Log</h2>
        <div className="max-w-2xl mx-auto space-y-6">
          {logEntries.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{entry.title}</CardTitle>
                    <time className="text-sm text-muted-foreground">{formatDate(entry.date)}</time>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{entry.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

