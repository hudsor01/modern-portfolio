'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileDown } from 'lucide-react'
import { useToast } from '@/hooks/use-sonner-toast'
import { cn } from '@/lib/utils'
import { createContextLogger } from '@/lib/logger'

const logger = createContextLogger('ResumeDownload')

interface ResumeDownloadProps {
  className?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  label?: string
  fallbackToPDF?: boolean
}

/**
 * Official Next.js 16 / React 19 Pattern: Native State Management
 *
 * No TanStack Query needed - just useState and fetch for mutations.
 * Simpler, lighter, and follows React 19 best practices.
 */
export function ResumeDownload({
  className,
  variant = 'default',
  size = 'default',
  label = 'Download Resume',
  fallbackToPDF = false,
}: Readonly<ResumeDownloadProps>) {
  const { success: showSuccessToast, error: showErrorToast, loading: showLoadingToast } = useToast()
  const [isDownloading, setIsDownloading] = useState(false)

  // Helper function for downloading files
  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.rel = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownload = async () => {
    if (isDownloading) return

    setIsDownloading(true)
    const toastId = showLoadingToast('Preparing your resume...')

    try {
      // First try to use the API to get a fresh PDF
      if (!fallbackToPDF) {
        const response = await fetch('/api/generate-resume-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) throw new Error('Resume generation failed')

        await response.json()
        showSuccessToast('Resume downloaded successfully!', { id: toastId })
        setIsDownloading(false)
        return
      }

      // Fallback to pre-built PDF
      const pdfPath = '/Richard Hudson - Resume.pdf'

      // Verify the file exists
      const checkResponse = await fetch(pdfPath, { method: 'HEAD' })
      if (!checkResponse.ok) {
        throw new Error('Resume file not found on server.')
      }

      downloadFile(pdfPath, 'Richard_Hudson_Resume.pdf')
      showSuccessToast('Resume downloaded successfully!', { id: toastId })
    } catch (error) {
      logger.error('Error downloading resume', error instanceof Error ? error : new Error(String(error)))
      const errorMessage = error instanceof Error ? error.message : 'Failed to download resume'
      showErrorToast(errorMessage, { id: toastId })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      variant={variant}
      size={size}
      className={cn('gap-2', className)}
    >
      <FileDown className="h-4 w-4" />
      {isDownloading ? 'Downloading...' : label}
    </Button>
  )
}
