'use client'
export const dynamic = 'force-static'

import { useEffect, useState, useRef } from 'react'

import { toast } from 'sonner'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ResumeViewer } from './resume-viewer'
import { createContextLogger } from '@/lib/monitoring/logger'
import { useInView } from '@/hooks/use-in-view'
import { HeroHeader } from './components/HeroHeader'
import { AboutSection } from './components/AboutSection'
import { ExperienceSection } from './components/ExperienceSection'
import { EducationCertifications } from './components/EducationCertifications'
import { SkillsSection } from './components/SkillsSection'

const logger = createContextLogger('ResumePage')

export default function ResumePage() {
  const [showPdf, setShowPdf] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')

  // Refs for scroll animations
  const heroRef = useRef(null)
  const contentRef = useRef(null)

  // In-view hooks
  const isHeroInView = useInView(heroRef, { once: true })
  const isContentInView = useInView(contentRef, { once: true })

  useEffect(() => {
    // Set the PDF URL once on client side with proper encoding
    setPdfUrl('/Richard%20Hudson%20-%20Resume.pdf')
  }, [])

  const handleDownloadResume = async () => {
    setIsDownloading(true)
    toast.loading('Preparing your resume...', { id: 'resume-download', duration: 3000 })

    try {
      // Direct download of the PDF file with proper encoding
      const a = document.createElement('a')
      a.href = '/Richard%20Hudson%20-%20Resume.pdf'
      a.download = 'Richard_Hudson_Resume.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()

      toast.success('Resume downloaded successfully!', { id: 'resume-download' })
    } catch (error) {
      logger.error('Download error', error instanceof Error ? error : new Error(String(error)))
      toast.error('Failed to download resume. Please try again.', { id: 'resume-download' })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleToggleView = () => {
    setShowPdf(!showPdf)
  }

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen bg-background overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-1/4 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-20 space-y-16">
          {/* Hero Header */}
          <div ref={heroRef}>
            <HeroHeader
              isHeroInView={isHeroInView}
              showPdf={showPdf}
              isDownloading={isDownloading}
              onDownloadResume={handleDownloadResume}
              onToggleView={handleToggleView}
            />
          </div>

          {showPdf ? (
            // PDF viewer
            <div className="bg-card border border-border rounded-2xl overflow-hidden animate-fade-in-up">
              {pdfUrl && <ResumeViewer pdfUrl={pdfUrl} />}
            </div>
          ) : (
            // Resume content
            <div
              ref={contentRef}
              className={`space-y-16 animate-fade-in-up ${isContentInView ? 'opacity-100' : 'opacity-0'}`}
            >
              <AboutSection />
              <ExperienceSection />
              <EducationCertifications />
              <SkillsSection />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
