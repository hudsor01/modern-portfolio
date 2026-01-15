'use client'

import { Card, CardContent } from '@/components/ui/card'
import { GraduationCap, MapPin, Calendar } from 'lucide-react'
import type { ResumeEducation } from '@/types/resume'

interface EducationSectionProps {
  education: ResumeEducation[]
  className?: string
}

export function EducationSection({ education, className = '' }: EducationSectionProps) {
  return (
    <section className={className}>
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl lg:text-4xl font-semibold mb-4">
          Education
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Academic foundation in business and analytics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {education.map((edu, index) => (
          <EducationCard key={`${edu.institution}-${index}`} education={edu} />
        ))}
      </div>
    </section>
  )
}

interface EducationCardProps {
  education: ResumeEducation
}

function EducationCard({ education }: EducationCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const dateRange = `${formatDate(education.startDate)} - ${formatDate(education.endDate)}`

  return (
    <Card className="bg-card border border-border rounded-2xl hover:border-primary/50 hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-6">
        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Degree */}
        <h3 className="font-display text-xl font-semibold text-foreground text-center mb-2">
          {education.degree}
        </h3>

        {/* Institution */}
        <p className="text-lg font-medium text-muted-foreground text-center mb-4">
          {education.institution}
        </p>

        {/* Details */}
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{education.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{dateRange}</span>
          </div>
        </div>

        {/* Description */}
        {education.description && (
          <p className="text-sm text-muted-foreground text-center">
            {education.description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
