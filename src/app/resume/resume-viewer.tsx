'use client'

import { useState, useEffect } from 'react'

interface ResumeViewerProps {
  pdfUrl: string
}

export function ResumeViewer({ pdfUrl }: ResumeViewerProps) {
  const [height, setHeight] = useState('800px')
  const [loadError, setLoadError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Update height based on viewport
    const updateHeight = () => {
      const windowHeight = window.innerHeight
      setHeight(`${windowHeight * 0.85}px`)
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)

    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  // Handle iframe load
  const handleLoad = () => {
    setIsLoading(false)
  }

  // Handle iframe error
  const handleError = () => {
    setLoadError(true)
    setIsLoading(false)
  }

  // If PDF fails to load, show fallback
  if (loadError) {
    return (
      <div className="w-full p-12 text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="typography-h3 text-foreground">PDF Viewer Unavailable</h3>
          <p className="text-muted-foreground">
            Your browser doesn't support inline PDF viewing. Please use one of the options below:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Open in New Tab
            </a>
            <a
              href={pdfUrl}
              download="Richard_Hudson_Resume.pdf"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary/10 text-foreground border border-border rounded-xl hover:bg-secondary/20 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download PDF
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card z-10">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-sm text-muted-foreground">Loading PDF...</p>
          </div>
        </div>
      )}
      <iframe
        src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
        style={{ height }}
        width="100%"
        title="Richard Hudson Resume"
        className="border border-border rounded-lg"
        onLoad={handleLoad}
        onError={handleError}
      >
        <p className="text-center text-foreground p-8">
          Your browser doesn't support PDF viewing.{' '}
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/70 underline ml-2"
          >
            Open PDF in new tab
          </a>
        </p>
      </iframe>
    </div>
  )
}
