'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RevenuekpiPage() {
	const router = useRouter()

	useEffect(() => {
		// Redirect to project detail page
		router.push('/projects/revenue-kpi')
	}, [router])

	return (
		<div className='flex items-center justify-center py-20'>
			<p className='text-muted-foreground'>Redirecting...</p>
		</div>
	)
}
