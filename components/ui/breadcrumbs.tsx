'use client'

import * as React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
	label: string
	href: string
}

interface BreadcrumbsProps {
	items: BreadcrumbItem[]
	className?: string
	separator?: React.ReactNode
}

export function Breadcrumbs({
	items,
	className,
	separator = <ChevronRight className='h-4 w-4' />,
}: BreadcrumbsProps) {
	return (
		<nav
			className={cn('text-muted-foreground flex items-center text-sm', className)}
			aria-label='Breadcrumbs'>
			<ol className='flex flex-wrap items-center gap-1.5'>
				{items.map((item, index) => {
					const isLast = index === items.length - 1

					return (
						<li key={item.href} className='flex items-center gap-1.5'>
							{!isLast ?
								<>
									<Link
										href={item.href}
										className='hover:text-foreground transition-colors'>
										{item.label}
									</Link>
									<span className='text-muted-foreground/50'>{separator}</span>
								</>
							:	<span className='text-foreground font-medium'>{item.label}</span>}
						</li>
					)
				})}
			</ol>
		</nav>
	)
}
