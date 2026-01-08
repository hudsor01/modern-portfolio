'use client'

import React, { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Download, FileText, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ResumeViewClient = React.memo(function ResumeViewClient() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = '/Richard%20Hudson%20-%20Resume.pdf'
    link.download = 'Richard Hudson - Revenue Operations Resume.pdf'
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
      <main className="relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-1/4 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-20">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Richard Hudson - Resume
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Revenue Operations Professional | Plano, TX
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={handleDownload}
                size="lg"
                className="h-14 px-8 text-base font-semibold"
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
                <a href="/resume" className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  View Web Version
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                asChild
                className="h-14 px-8 text-base font-semibold"
              >
                <a
                  href="/Richard%20Hudson%20-%20Resume.pdf"
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
                    <p className="text-muted-foreground">Loading PDF...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Unable to display PDF in browser</p>
                    <Button onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Instead
                    </Button>
                  </div>
                </div>
              )}

              {!error && (
                <iframe
                  src="/Richard%20Hudson%20-%20Resume.pdf"
                  className="w-full h-[800px] border-0 bg-white"
                  title="Richard Hudson Resume"
                  onLoad={handlePdfLoad}
                  onError={handlePdfError}
                  style={{ display: isLoading ? 'none' : 'block' }}
                />
              )}
            </div>

            {/* Mobile Fallback Message */}
            <div className="md:hidden mt-6 p-4 bg-muted/50 border border-border rounded-xl">
              <p className="text-sm text-muted-foreground text-center">
                For the best mobile experience, tap "Download PDF" or "Open in New Tab" above
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
})

export default ResumeViewClient