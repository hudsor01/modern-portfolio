'use client'


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award } from 'lucide-react'
import Image from 'next/image'

interface Certification {
  name: string
  issuer: string
  badge: string
  description: string
  skills: string[]
}

interface CertificationsSectionProps {
  certifications: Certification[]
  className?: string
}


export function CertificationsSection({
  certifications,
  className = ''
}: CertificationsSectionProps) {
  return (
    <section className={className}>
      <div className="text-center mb-12">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
          Certifications & Recognition
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Professional certifications validating expertise in revenue operations and analytics
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 @container">
        {certifications.map((cert) => (
          <CertificationCard
            key={cert.name}
            certification={cert}
          />
        ))}
      </div>
    </section>
  )
}

interface CertificationCardProps {
  certification: Certification
}

function CertificationCard({ certification }: CertificationCardProps) {
  return (
    <Card className="h-full bg-card border border-border rounded-2xl hover:border-primary/50 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <CertificationBadge badge={certification.badge} name={certification.name} />
          <div className="flex-1">
            <CardTitle className="font-display text-lg font-semibold text-foreground mb-2">
              {certification.name}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="h-4 w-4 text-primary" />
              <span>{certification.issuer}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {certification.description}
        </p>
        <SkillTags skills={certification.skills} />
      </CardContent>
    </Card>
  )
}

interface CertificationBadgeProps {
  badge: string
  name: string
}

function CertificationBadge({ badge, name }: CertificationBadgeProps) {
  return (
    <div className="shrink-0 w-16 h-16 relative rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center">
      {badge.startsWith('/') ? (
        <Image
          src={badge}
          alt={`${name} certification badge`}
          fill
          className="object-contain p-2"
          sizes="64px"
        />
      ) : (
        <span className="text-xl">{badge}</span>
      )}
    </div>
  )
}

interface SkillTagsProps {
  skills: string[]
}

function SkillTags({ skills }: SkillTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <Badge
          key={skill}
          variant="outline"
          className="text-xs border-border text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
        >
          {skill}
        </Badge>
      ))}
    </div>
  )
}