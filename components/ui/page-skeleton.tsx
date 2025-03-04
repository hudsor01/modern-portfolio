'use client'

import { cn } from '@/lib/utils'
import { Skeleton } from './skeleton'
import React from 'react'

export interface PageSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string
	header?: boolean
	headerHeight?: string
	contentSections?: number
	sectionHeight?: string
	sidebar?: boolean
	sidebarWidth?: string
	sidebarPosition?: 'left' | 'right'
}

export function PageSkeleton({
	className,
	header = true,
	headerHeight = 'h-32',
	contentSections = 3,
	sectionHeight = 'h-40',
	sidebar = false,
	sidebarWidth = 'w-64',
	sidebarPosition = 'left',
	...props
}: PageSkeletonProps) {
	return (
		<div className={cn('w-full space-y-6', className)} {...props}>
			{header && <Skeleton className={cn('w-full', headerHeight)} />}

			<div
				className={cn(
					'flex w-full gap-6',
					sidebarPosition === 'right' ? 'flex-row-reverse' : 'flex-row'
				)}>
				{sidebar && <Skeleton className={cn('shrink-0', sidebarWidth, 'h-screen')} />}

				<div className='flex-1 space-y-6'>
					{Array.from({ length: contentSections }).map((_, i) => (
						<Skeleton key={`section-${i}`} className={cn('w-full', sectionHeight)} />
					))}
				</div>
			</div>
		</div>
	)
}
