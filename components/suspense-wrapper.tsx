'use client'

import React, { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

interface SuspenseWrapperProps {
	children: React.ReactNode
	fallback?: React.ReactNode
}

export function SuspenseWrapper({ children, fallback }: SuspenseWrapperProps) {
	const defaultFallback = (
		<div className='flex items-center justify-center py-10'>
			<Loader2 className='text-primary/50 h-8 w-8 animate-spin' />
		</div>
	)

	return <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>
}
