'use client'

import React, { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Download, FileText, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DecorativeBlob } from '@/components/ui/decorative-blob'
import Link from 'next/link'
import { CONTACT } from '@/lib/contact-info'
import { headline } from '../data/constants'

const ResumeViewClient = React.memo(function ResumeViewClient() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = '/Richard_Hudson_Revenue_Operations.pdf'
    link.download = 'Richard_Hudson_Resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePdfLoad = () => {
    setIsLoading(false)
  }

  const handlePdfError = () => {
    setIsLoading(false)
    setError(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="relative overflow-x-clip">
        {/* Decorative background elements */}
        <DecorativeBlob position="top-right" />
        <DecorativeBlob position="bottom-left" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-20">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4">Richard Hudson - Resume</h1>
            <p className="mb-8">
              {headline} | {CONTACT.location.display}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                data-track="Resume Download"
                data-track-location="resume-view"
                data-track-target="/Richard_Hudson_Revenue_Operations.pdf"
                onClick={handleDownload}
                size="lg"
                className="h-14 px-8 text-base font-medium"
              >
                <Download className="mr-2 h-5 w-5" />
                Download PDF
              </Button>

              <Button
                variant="outline"
                size="lg"
                asChild
                className="h-14 px-8 text-base font-semibold"
              >
                <Link href="/resume" className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  View Web Version
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                asChild
                className="h-14 px-8 text-base font-semibold"
              >
                <a
                  data-track="Resume Open"
                  data-track-location="resume-view"
                  href="/Richard_Hudson_Revenue_Operations.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Open in New Tab
                </a>
              </Button>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {isLoading && (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading PDF...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="mb-4">Unable to display PDF in browser</p>
                    <Button
                      data-track="Resume Download"
                      data-track-location="resume-view-fallback"
                      data-track-target="/Richard_Hudson_Revenue_Operations.pdf"
                      onClick={handleDownload}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Instead
                    </Button>
                  </div>
                </div>
              )}

              {!error && (
                <object
                  data="/Richard_Hudson_Revenue_Operations.pdf"
                  type="application/pdf"
                  className="w-full h-[800px] border-0 bg-white"
                  aria-label="Richard Hudson Resume"
                  onLoad={handlePdfLoad}
                  onError={handlePdfError}
                  style={{ display: isLoading ? 'none' : 'block' }}
                >
                  <p className="text-center p-8">
                    Your browser can't display PDFs inline.{' '}
                    <a
                      data-track="Resume Open"
                      data-track-location="resume-view-fallback"
                      href="/Richard_Hudson_Revenue_Operations.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link"
                    >
                      Open PDF in new tab
                    </a>
                  </p>
                </object>
              )}
            </div>

            {/* Mobile Fallback Message */}
            <div className="md:hidden mt-6 p-4 bg-muted/50 border border-border rounded-xl">
              <p className="text-center">
                For the best mobile experience, tap "Download PDF" or "Open in New Tab" above
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
})

export default ResumeViewClient
