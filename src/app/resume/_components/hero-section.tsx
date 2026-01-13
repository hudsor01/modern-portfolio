'use client'

import { Button } from '@/components/ui/button'
import { ResumeDownload } from '../resume-download'
import { Eye, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'
import type { ResumeData } from '@/types/resume'

interface HeroSectionProps {
  resume: ResumeData
  showPdf: boolean
  onTogglePdf: () => void
  className?: string
}

export function HeroSection({ resume, showPdf, onTogglePdf, className = '' }: HeroSectionProps) {
  return (
    <section className={className}>
      <div className="text-center space-y-6">
        {/* Name */}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
          {resume.name}
        </h1>

        {/* Title */}
        <p className="text-xl md:text-2xl text-muted-foreground font-medium">
          {resume.title}
        </p>

        {/* Location */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <MapPin className="h-5 w-5" />
          <span className="text-base">{resume.location}</span>
        </div>

        {/* Summary */}
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {resume.summary}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {/* Download Resume Button - using existing component */}
          <ResumeDownload
            variant="default"
            size="lg"
            label="Download Resume"
            fallbackToPDF={true}
          />

          {/* Toggle PDF View Button */}
          <Button
            variant="outline"
            size="lg"
            onClick={onTogglePdf}
            className="gap-2"
          >
            <Eye className="h-5 w-5" />
            {showPdf ? 'View Resume' : 'View PDF'}
          </Button>

          {/* Contact Button */}
          <Button
            variant="outline"
            size="lg"
            asChild
            className="gap-2"
          >
            <Link href="/contact">
              <Mail className="h-5 w-5" />
              Contact Me
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
