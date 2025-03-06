'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FileDown, ExternalLink } from 'lucide-react'
import { ResumeViewer } from './resume-viewer'

export default function ResumePage() {
	const [isDownloading, setIsDownloading] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')
  
  useEffect(() => {
    // Set the PDF URL once on client side
    setPdfUrl('/Richard Hudson - Resume.pdf')
  }, [])

	const handleDownloadResume = async () => {
		setIsDownloading(true)
    toast.loading('Preparing your resume...', { id: 'resume-download', duration: 3000 })

    try {
      // Direct download of the PDF file
      const a = document.createElement('a')
      a.href = '/Richard Hudson - Resume.pdf'
      a.download = 'Richard_Hudson_Resume.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()

      toast.success('Resume downloaded successfully!', { id: 'resume-download' })
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download resume. Please try again.', { id: 'resume-download' })
    } finally {
      setIsDownloading(false)
    }
	}

	return (
		<div className="container mx-auto max-w-6xl py-16 px-4">
			<div className="mb-12 text-center">
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.7 }}
					className="text-4xl font-bold mb-4"
				>
					My Resume
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.7 }}
					className="text-gray-600 dark:text-gray-300 mx-auto mt-4 max-w-2xl text-lg"
				>
					Take a look at my professional experience and qualifications
				</motion.p>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4, duration: 0.7 }}
					className="mt-6 flex justify-center gap-4"
				>
					<Button
						className="bg-[#0070f3] hover:bg-[#0070f3]/90 flex items-center gap-2"
						onClick={handleDownloadResume}
						disabled={isDownloading}
					>
						<FileDown className="h-4 w-4" />
						{isDownloading ? 'Downloading...' : 'Download Resume'}
					</Button>
					<Button variant="outline" asChild className="border-[#0070f3] text-[#0070f3]">
						<Link href="/contact" className="flex items-center gap-2">
							<ExternalLink className="h-4 w-4" />
							Contact Me
						</Link>
					</Button>
				</motion.div>
			</div>

			<div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {pdfUrl && (
          <ResumeViewer pdfUrl={pdfUrl} />
        )}
			</div>
		</div>
	)
}