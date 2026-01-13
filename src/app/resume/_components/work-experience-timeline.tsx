'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, Briefcase } from 'lucide-react'
import type { WorkExperience } from '@/types/resume'

interface WorkExperienceTimelineProps {
  experience: WorkExperience[]
  className?: string
}

export function WorkExperienceTimeline({ experience, className = '' }: WorkExperienceTimelineProps) {
  return (
    <section className={className}>
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl lg:text-4xl font-semibold mb-4">
          Professional Experience
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Building high-performing revenue operations and partner programs
        </p>
      </div>

      <div className="relative border-l-2 border-primary/20 pl-8 space-y-12">
        {experience.map((job, index) => (
          <WorkExperienceCard key={`${job.company}-${index}`} job={job} />
        ))}
      </div>
    </section>
  )
}

interface WorkExperienceCardProps {
  job: WorkExperience
}

function WorkExperienceCard({ job }: WorkExperienceCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const dateRange = `${formatDate(job.startDate)} - ${
    job.endDate ? formatDate(job.endDate) : 'Present'
  }`

  return (
    <div className="relative">
      {/* Timeline dot */}
      <div className="absolute -left-[41px] w-4 h-4 rounded-full bg-primary border-4 border-background" />

      <Card className="bg-card border border-border rounded-2xl hover:border-primary/50 hover:-translate-y-1 transition-all duration-300">
        <CardContent className="p-6">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
              <h3 className="font-display text-xl lg:text-2xl font-semibold text-foreground">
                {job.title}
              </h3>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {dateRange}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span className="font-medium">{job.company}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <ul className="space-y-2 mb-4">
            {job.descriptions.map((desc, idx) => (
              <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                <span className="text-primary mt-1.5">•</span>
                <span>{desc}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
