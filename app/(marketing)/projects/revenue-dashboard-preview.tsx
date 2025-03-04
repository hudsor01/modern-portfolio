'use client'

import { Card } from '@/components/ui/card'

export function RevenueDashboardPreview() {
	// This could be a simplified version of your actual project component
	// Optimized for display in a small preview area
	return (
		<div className='from-primary/20 to-muted flex h-full w-full items-center justify-center bg-gradient-to-br p-4'>
			<Card className='w-full max-w-md p-3'>
				<div className='bg-primary/30 mb-3 h-6 w-24 rounded-md'></div>
				<div className='space-y-2'>
					<div className='bg-muted-foreground/10 h-24 rounded-md'></div>
					<div className='flex justify-between'>
						<div className='bg-primary/20 h-4 w-12 rounded-md'></div>
						<div className='bg-primary/20 h-4 w-12 rounded-md'></div>
						<div className='bg-primary/20 h-4 w-12 rounded-md'></div>
					</div>
				</div>
			</Card>
		</div>
	)
}
