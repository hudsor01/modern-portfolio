'use client'

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
	className?: string
	text?: string
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
	// Map size to tailwind classes
	const sizeClasses = {
		xs: 'h-3 w-3',
		sm: 'h-4 w-4',
		md: 'h-6 w-6',
		lg: 'h-8 w-8',
		xl: 'h-12 w-12',
	}

	return (
		<div className={cn('flex items-center justify-center', className)}>
			<div className='flex flex-col items-center gap-2'>
				<Loader2 className={cn('text-muted-foreground animate-spin', sizeClasses[size])} />
				{text && <p className='text-muted-foreground text-sm'>{text}</p>}
			</div>
		</div>
	)
}
