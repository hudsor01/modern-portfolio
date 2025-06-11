'use client'

import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { FileDown } from 'lucide-react'
import { useToast } from '@/hooks/use-sonner-toast'
import { cn } from '@/lib/utils'

interface ResumeDownloadProps {
  className?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  label?: string
  fallbackToPDF?: boolean // This prop determines the download strategy
}

export function ResumeDownload({
  className,
  variant = 'default',
  size = 'default',
  label = 'Download Resume',
  fallbackToPDF = false, // Default to false, meaning try API first
}: ResumeDownloadProps) {
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

  const downloadResumeMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      // First try to use the API to get a fresh PDF
      if (!fallbackToPDF) {
        const response = await fetch('/api/generate-resume-pdf', {
          method: 'GET',
          // No 'Content-Type': 'application/json' header needed for a GET request expecting a blob
        })

        if (!response.ok) {
          const errorText = await response.text().catch(() => `HTTP error ${response.status}`)
          throw new Error(`Failed to generate PDF: ${response.statusText || errorText}`)
        }

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        downloadFile(url, 'Richard_Hudson_Resume.pdf')
        window.URL.revokeObjectURL(url)
        return; // Success
      }

      // Fallback to pre-built PDF
      const pdfPath = '/Richard Hudson - Resume.pdf'

      // Verify the file exists
      const checkResponse = await fetch(pdfPath, { method: 'HEAD' })
      if (!checkResponse.ok) {
        throw new Error('Resume file not found on server.')
      }

      downloadFile(pdfPath, 'Richard_Hudson_Resume.pdf')
      // No explicit return needed for success, absence of error implies success
    },
    onMutate: () => {
      // Show loading toast when mutation starts
      // The return value of onMutate is passed as the third argument (context) to onError and onSettled
      return showLoadingToast('Preparing your resume...');
    },
    onSuccess: (_data, _variables, contextToastId) => {
      // contextToastId is the ID returned from onMutate
      showSuccessToast('Resume downloaded successfully!', { id: contextToastId as string | number });
    },
    onError: (error: Error, _variables, contextToastId) => {
      console.error('Error downloading resume:', error);
      showErrorToast(error.message || 'Failed to download resume. Please try again or contact me directly.', {
        id: contextToastId as string | number,
      });
    },
  });

  const handleDownload = () => {
    downloadResumeMutation.mutate();
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn('group transform transition-all duration-300 hover:shadow-lg', className)}
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
