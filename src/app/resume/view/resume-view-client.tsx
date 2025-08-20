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
    link.href = '/Richard Hudson - Resume.pdf'
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
    <div>
      <Navbar />
      <main className="min-h-screen bg-slate-950 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Richard Hudson - Resume
            </h1>
            <p className="text-gray-300 text-lg mb-6">
              Revenue Operations Professional | Plano, TX
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={handleDownload}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="mr-2 h-5 w-5" />
                Download PDF
              </Button>
              
              <Button
                variant="outline"
                asChild
                className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-6 py-3 rounded-lg transition-all duration-300"
              >
                <a href="/resume" className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  View Web Version
                </a>
              </Button>
              
              <Button
                variant="outline"
                asChild
                className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-6 py-3 rounded-lg transition-all duration-300"
              >
                <a 
                  href="/Richard Hudson - Resume.pdf" 
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
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
              {isLoading && (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading PDF...</p>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Unable to display PDF in browser</p>
                    <Button onClick={handleDownload} className="bg-cyan-500 hover:bg-cyan-600">
                      <Download className="mr-2 h-4 w-4" />
                      Download Instead
                    </Button>
                  </div>
                </div>
              )}
              
              {!error && (
                <iframe
                  src="/Richard Hudson - Resume.pdf"
                  className="w-full h-[800px] border-0"
                  title="Richard Hudson Resume"
                  onLoad={handlePdfLoad}
                  onError={handlePdfError}
                  style={{ display: isLoading ? 'none' : 'block' }}
                />
              )}
            </div>
            
            {/* Mobile Fallback Message */}
            <div className="md:hidden mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-300 text-sm text-center">
                💡 For the best mobile experience, tap "Download PDF" or "Open in New Tab" above
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