'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Award, ExternalLink, Calendar } from 'lucide-react'
import type { Certification } from '@/types/resume'

interface CertificationsShowcaseProps {
  certifications: Certification[]
  className?: string
}

export function CertificationsShowcase({ certifications, className = '' }: CertificationsShowcaseProps) {
  return (
    <section className={className}>
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl lg:text-4xl font-semibold mb-4">
          Certifications
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Continuous learning and professional development
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert, index) => (
          <CertificationCard key={`${cert.name}-${index}`} certification={cert} />
        ))}
      </div>
    </section>
  )
}

interface CertificationCardProps {
  certification: Certification
}

function CertificationCard({ certification }: CertificationCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  return (
    <Card className="bg-card border border-border rounded-2xl hover:border-primary/50 hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-6">
        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <Award className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Certification Name */}
        <h3 className="font-display text-lg font-semibold text-foreground text-center mb-2">
          {certification.name}
        </h3>

        {/* Issuer */}
        <div className="flex items-center justify-center gap-1 mb-3">
          <Award className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">
            {certification.issuer}
          </p>
        </div>

        {/* Date */}
        <div className="flex items-center justify-center gap-1 mb-4">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            {formatDate(certification.date)}
          </p>
        </div>

        {/* Link */}
        {certification.url && (
          <div className="flex justify-center">
            <a
              href={certification.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
            >
              View Credential
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
