import { cn } from '@/lib/utils'
import * as React from 'react'

function Skeleton({ className, ...props }: React.ComponentProps<'div'> & { variant?: string }) {
	return (
		<div
			data-slot='skeleton'
			className={cn('bg-primary/10 animate-pulse rounded-md', className)}
			{...props}
		/>
	)
}

export { Skeleton }
