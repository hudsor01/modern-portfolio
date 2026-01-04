'use client'

import { useMutation } from '@tanstack/react-query'
import type { ResumeData } from '@/types/shared-api'
import { Button } from '@/components/ui/button'
import { FileDown } from 'lucide-react'
import { useToast } from '@/hooks/use-sonner-toast'
import { cn } from '@/lib/utils'
import { createContextLogger } from '@/lib/monitoring/logger'

const logger = createContextLogger('ResumeDownload')

interface ResumeDownloadProps {
  className?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  label?: string
  fallbackToPDF?: boolean
}

export function ResumeDownload({
  className,
  variant = 'default',
  size = 'default',
  label = 'Download Resume',
  fallbackToPDF = false, // Default to false, meaning try API first
}: Readonly<ResumeDownloadProps>) {
  const { success: showSuccessToast, error: showErrorToast, loading: showLoadingToast } = useToast()

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

  // Direct TanStack Query mutation usage
  const downloadResumeMutation = useMutation({
    mutationFn: async (): Promise<ResumeData> => {
      const response = await fetch('/api/generate-resume-pdf', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error('Resume generation failed')
      return response.json()
    },
    retry: 2,
  })

  const handleDownload = async () => {
    const toastId = showLoadingToast('Preparing your resume...')

    try {
      // First try to use the API to get a fresh PDF
      if (!fallbackToPDF) {
        await downloadResumeMutation.mutateAsync()
        showSuccessToast('Resume downloaded successfully!', { id: toastId })
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
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn('group transform transition-all duration-300 ease-out hover:shadow-lg', className)}
      onClick={handleDownload}
      disabled={downloadResumeMutation.isPending}
    >
      <FileDown className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
      <span className="transition-transform group-hover:translate-x-0.5">
        {downloadResumeMutation.isPending ? 'Downloading...' : label}
      </span>
    </Button>
  )
}
