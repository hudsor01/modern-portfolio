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
      <div
        
        
        className="text-center mb-12"
      >
        <h2 className="typography-h1 text-xl mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Certifications & Recognition
        </h2>
        <p className="typography-lead dark:text-muted-foreground max-w-3xl mx-auto">
          Professional certifications validating expertise in revenue operations and analytics
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
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
    <div
      
      
    >
      <Card className="h-full border-0 shadow-lg bg-white/50 dark:bg-card/50 backdrop-blur-xs hover:shadow-xl transition-all duration-300 ease-out">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <CertificationBadge badge={certification.badge} name={certification.name} />
            <div className="flex-1">
              <CardTitle className="typography-large text-foreground dark:text-white mb-2">
                {certification.name}
              </CardTitle>
              <div className="flex items-center gap-2 typography-small text-muted-foreground dark:text-muted-foreground">
                <Award className="h-4 w-4" />
                <span>{certification.issuer}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground dark:text-muted-foreground mb-4">
            {certification.description}
          </p>
          <SkillTags skills={certification.skills} />
        </CardContent>
      </Card>
    </div>
  )
}

interface CertificationBadgeProps {
  badge: string
  name: string
}

function CertificationBadge({ badge, name }: CertificationBadgeProps) {
  return (
    <div className="flex-shrink-0 w-16 h-16 relative rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
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
          className="text-xs border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300"
        >
          {skill}
        </Badge>
      ))}
    </div>
  )
}