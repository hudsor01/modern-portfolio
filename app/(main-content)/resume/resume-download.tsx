'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface ResumeDownloadProps {
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  label?: string;
  fallbackToPDF?: boolean;
}

export function ResumeDownload({
  className,
  variant = 'default',
  size = 'default',
  label = 'Download Resume',
  fallbackToPDF = false,
}: ResumeDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    const toastId = toast.loading('Preparing your resume...');

    try {
      // First try to use the API to get a fresh PDF
      if (!fallbackToPDF) {
        const response = await fetch('/api/generate-resume-pdf', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to generate PDF: ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        downloadFile(url, 'Richard_Hudson_Resume.pdf');
        window.URL.revokeObjectURL(url);
        toast.success('Resume downloaded successfully!', { id: toastId });
        return;
      }

      // Fallback to pre-built PDF
      const pdfPath = '/Richard Hudson - Resume.pdf';

      // Verify the file exists
      const checkResponse = await fetch(pdfPath, { method: 'HEAD' });
      if (!checkResponse.ok) {
        throw new Error('Resume file not found');
      }

      downloadFile(pdfPath, 'Richard_Hudson_Resume.pdf');
      toast.success('Resume downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error('Failed to download resume. Please try again or contact me directly.', {
        id: toastId,
      });
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  // Helper function for downloading files
  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn('group transform transition-all duration-300 hover:shadow-lg', className)}
      onClick={handleDownload}
      disabled={isDownloading}
    >
      <FileDown className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
      <span className="transition-transform group-hover:translate-x-0.5">
        {isDownloading ? 'Downloading...' : label}
      </span>
    </Button>
  );
}
