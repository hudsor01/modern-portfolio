'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error('Unhandled error:', error)
	}, [error])

	return (
		<div className='flex min-h-[70vh] flex-col items-center justify-center px-4 text-center'>
			<div className='bg-destructive/10 mb-6 rounded-full p-4'>
				<AlertCircle className='text-destructive h-12 w-12' />
			</div>

			<h1 className='mb-2 text-3xl font-bold'>Something went wrong</h1>

			<p className='text-muted-foreground mb-8 max-w-md'>
				We apologize for the inconvenience. The page you were trying to access encountered
				an error.
			</p>

			{error.digest && (
				<p className='text-muted-foreground mb-6 text-xs'>Error ID: {error.digest}</p>
			)}

			<div className='flex flex-wrap justify-center gap-4'>
				<Button variant='default' onClick={reset}>
					<RefreshCw className='mr-2 h-4 w-4' />
					Try again
				</Button>

				<Button variant='outline' asChild>
					<Link href='/'>
						<Home className='mr-2 h-4 w-4' />
						Return home
					</Link>
				</Button>
			</div>
		</div>
	)
}
