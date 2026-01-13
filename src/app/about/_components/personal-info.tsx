'use client'


import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Mail, 
  MapPin, 
  ArrowRight 
} from 'lucide-react'
import Image from 'next/image'

interface PersonalInfo {
  name: string
  title: string
  location: string
  email: string
  bio: string
  highlights: string[]
}

interface PersonalInfoProps {
  personalInfo: PersonalInfo
  onContactClick?: () => void
  className?: string
}


export function PersonalInfo({ 
  personalInfo, 
  onContactClick,
  className = '' 
}: PersonalInfoProps) {
  return (
    <section className={className}>
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div
          
          
          className="space-y-8"
        >
          <div>
            <h1
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground"
            >
              {personalInfo.name}
            </h1>

            <h2
              className="text-xl lg:text-2xl font-semibold text-primary mb-6"
            >
              {personalInfo.title}
            </h2>
            
            <ContactInfo personalInfo={personalInfo} />
          </div>

          <p 
            className="text-xl leading-relaxed text-muted-foreground dark:text-muted-foreground"
          >
            {personalInfo.bio}
          </p>

          {onContactClick && (
            <div className="pt-4">
              <Button
                onClick={onContactClick}
                size="lg"
                className="h-14 px-8 text-base font-semibold"
              >
                Let's Connect
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        <ProfileImage />
      </div>
    </section>
  )
}

interface ContactInfoProps {
  personalInfo: PersonalInfo
}

function ContactInfo({ personalInfo }: ContactInfoProps) {
  return (
    <div className="flex flex-wrap items-center gap-6 text-muted-foreground dark:text-muted-foreground">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        <span>{personalInfo.location}</span>
      </div>
      <div className="flex items-center gap-2">
        <Mail className="h-5 w-5 text-primary" />
        <a 
          href={`mailto:${personalInfo.email}`}
          className="hover:text-primary transition-colors"
        >
          {personalInfo.email}
        </a>
      </div>
    </div>
  )
}


function ProfileImage() {
  return (
    <div className="relative @container">
      <Card className="bg-card border border-border rounded-2xl overflow-hidden">
        <CardContent className="p-6 @md:p-8">
          <div className="relative mx-auto w-64 h-64 @md:w-80 @md:h-80 rounded-full overflow-hidden bg-muted">
            <Image
              src="/images/richard.jpg"
              alt="Richard Hudson - Revenue Operations Professional"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 256px, 320px"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}