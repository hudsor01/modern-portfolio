'use client'

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
      <section className="relative min-h-screen bg-background text-foreground overflow-hidden pt-20">
        <div className="w-full px-4 mx-auto max-w-6xl py-16 space-y-16">
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
            <div className="glass rounded-2xl overflow-hidden animate-fade-in-up">
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
      </section>

      {/* Footer */}
      <Footer />
    </>
  )
}
