'use client'

import { Carousel } from '@/components/ui/carousel'
import type { CarouselImage } from '@/components/ui/carousel'

interface FadeCarouselProps {
	images: CarouselImage[]
	height?: number | string
	autoplay?: boolean
	autoplayDelay?: number
	className?: string
}

export function FadeCarousel({
	images,
	height = 400,
	autoplay = false,
	autoplayDelay = 5000,
	className,
}: FadeCarouselProps) {
	return (
		<Carousel
			images={images}
			effect='fade'
			autoplay={autoplay}
			autoplayDelay={autoplayDelay}
			height={height}
			loop={true}
			className={className}
		/>
	)
}
