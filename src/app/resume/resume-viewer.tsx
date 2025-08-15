'use client'

import { useState, useEffect } from 'react'

interface ResumeViewerProps {
  pdfUrl: string
}

export function ResumeViewer({ pdfUrl }: ResumeViewerProps) {
  const [height, setHeight] = useState('800px')

  useEffect(() => {
    // Update height based on viewport
    const updateHeight = () => {
      const windowHeight = window.innerHeight
      setHeight(`${windowHeight * 0.9}px`)
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)

    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  return (
    <div className="w-full">
      <iframe
        src={pdfUrl}
        style={{ height }}
        width="100%"
        title="Richard Hudson Resume"
        className="border border-slate-600 rounded-lg"
      >
        <p className="text-center text-white p-8">
          Your browser doesn't support PDF viewing. 
          <a 
            href={pdfUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline ml-2"
          >
            Open PDF in new tab
          </a>
        </p>
      </iframe>
    </div>
  )
}
