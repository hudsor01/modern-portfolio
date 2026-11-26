'use client'

import { useEffect, useState, useRef } from 'react'

import { useToast } from '@/hooks/use-sonner-toast'
import { Navbar } from '@/components/layout/navbar'
import { ResumeViewer } from '../resume-viewer'
import { createContextLogger } from '@/lib/logger'
import { useInView } from '@/hooks/use-in-view'
import { HeroHeader } from './HeroHeader'
import { AboutSection } from './AboutSection'
import { ExperienceSection } from './ExperienceSection'
import { EducationCertifications } from './EducationCertifications'
import { SkillsSection } from './SkillsSection'
import { DecorativeBlob } from '@/components/ui/decorative-blob'

const logger = createContextLogger('ResumePage')

export default function ResumePageContent() {
  const { loading: showLoadingToast, success: showSuccessToast, error: showErrorToast } = useToast()
  const [showPdf, setShowPdf] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')

  // Refs for scroll animations (hero is above-the-fold; no in-view gate)
  const contentRef = useRef(null)

  // In-view hooks
  const isContentInView = useInView(contentRef, { once: true })

  useEffect(() => {
    // Set the PDF URL once on client side with proper encoding
    setPdfUrl('/Richard_Hudson_Revenue_Operations.pdf')
  }, [])

  const handleDownloadResume = async () => {
    setIsDownloading(true)
    const toastId = showLoadingToast('Preparing your resume...', { duration: 3000 })

    try {
      const a = document.createElement('a')
      a.href = '/Richard_Hudson_Revenue_Operations.pdf'
      a.download = 'Richard_Hudson_Resume.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()

      showSuccessToast('Resume downloaded successfully!', { id: toastId })
    } catch (error) {
      logger.error('Download error', error instanceof Error ? error : new Error(String(error)))
      showErrorToast('Failed to download resume. Please try again.', { id: toastId })
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
      <main
        id="main-content"
        tabIndex={-1}
        className="relative min-h-screen bg-background overflow-x-clip print:min-h-0 print:bg-transparent"
      >
        {/* Decorative background elements */}
        <DecorativeBlob position="top-right" />
        <DecorativeBlob position="bottom-left" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-20 space-y-16 print:max-w-none print:p-0 print:space-y-5">
          {/* Hero Header */}
          <div>
            <HeroHeader
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
              className={`space-y-16 animate-fade-in-up print:opacity-100 print:animate-none! print:space-y-5 ${isContentInView ? 'opacity-100' : 'opacity-0'}`}
            >
              <AboutSection />
              <ExperienceSection />
              <EducationCertifications />
              <SkillsSection />
            </div>
          )}
        </div>
      </main>
    </>
  )
}
