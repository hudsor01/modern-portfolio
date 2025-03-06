'use client'

import { Carousel } from '@/components/ui/carousel'
import type { CarouselImage } from '@/components/ui/carousel'

interface AutoplayCarouselProps {
	images: CarouselImage[]
	height?: number | string
	autoplayDelay?: number
	showNavigation?: boolean
	className?: string
}

export function AutoplayCarousel({
	images,
	height = 400,
	autoplayDelay = 3000,
	showNavigation = true,
	className,
}: AutoplayCarouselProps) {
	return (
		<Carousel
			images={images}
			autoplay={true}
			autoplayDelay={autoplayDelay}
			height={height}
			loop={true}
			showNavigation={showNavigation}
			className={className}
		/>
	)
}
