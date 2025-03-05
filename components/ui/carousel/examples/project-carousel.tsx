'use client'

import { Carousel } from '@/components/ui/carousel/carousel'
import type { CarouselImage } from '@/components/ui/carousel/carousel'
import { Card, CardContent } from '@/components/ui/card'

interface ProjectCarouselProps {
	images: CarouselImage[]
	title: string
	description?: string
	height?: number | string
	autoplay?: boolean
	effect?: 'slide' | 'fade'
	className?: string
}

export function ProjectCarousel({
	images,
	title,
	description,
	height = 400,
	autoplay = true,
	effect = 'slide',
	className,
}: ProjectCarouselProps) {
	return (
		<Card className={className}>
			<Carousel
				images={images}
				effect={effect}
				autoplay={autoplay}
				autoplayDelay={5000}
				height={height}
				loop={true}
				showPagination={true}
				showNavigation={true}
			/>
			<CardContent className='pt-4'>
				<h3 className='text-xl font-semibold'>{title}</h3>
				{description && <p className='text-muted-foreground mt-2'>{description}</p>}
			</CardContent>
		</Card>
	)
}
