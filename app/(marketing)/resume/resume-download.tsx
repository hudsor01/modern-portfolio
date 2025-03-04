'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileDown } from 'lucide-react'

interface ResumeDownloadProps {
	className?: string
	variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
	size?: 'default' | 'sm' | 'lg' | 'icon'
	label?: string
}

export function ResumeDownload({
	className,
	variant = 'default',
	size = 'default',
	label = 'Download Resume',
}: ResumeDownloadProps) {
	const [isDownloading, setIsDownloading] = useState(false)

	const handleDownload = async () => {
		setIsDownloading(true)

		try {
			// Simple download from public folder
			// In a real implementation, you might fetch from an API
			const link = document.createElement('a')
			link.href = '/resume.pdf' // Path to resume in public folder
			link.download = 'Richard_Hudson_Resume.pdf'
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		} catch (error) {
			console.error('Error downloading resume:', error)
		} finally {
			setTimeout(() => setIsDownloading(false), 1000)
		}
	}

	return (
		<Button
			variant={variant}
			size={size}
			className={className}
			onClick={handleDownload}
			disabled={isDownloading}>
			<FileDown className='mr-2 h-4 w-4' />
			{isDownloading ? 'Downloading...' : label}
		</Button>
	)
}
