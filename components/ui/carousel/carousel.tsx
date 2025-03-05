'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import {
	Navigation,
	Pagination,
	Autoplay,
	EffectFade,
	EffectCube,
	EffectFlip,
	EffectCards,
} from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import 'swiper/css/effect-cube'
import 'swiper/css/effect-flip'
import 'swiper/css/effect-cards'

export type CarouselImage = {
	src: string
	alt: string
}

export type TransitionEffect = 'slide' | 'fade' | 'cube' | 'flip' | 'cards'

export interface CarouselProps {
	images: CarouselImage[]
	effect?: TransitionEffect
	autoplay?: boolean
	autoplayDelay?: number
	loop?: boolean
	showNavigation?: boolean
	showPagination?: boolean
	className?: string
	imageClassName?: string
	height?: number | string
	width?: number | string
}

export function Carousel({
	images,
	effect = 'slide',
	autoplay = false,
	autoplayDelay = 3000,
	loop = true,
	showNavigation = true,
	showPagination = true,
	className,
	imageClassName,
	height = 400,
	width = '100%',
}: CarouselProps) {
	const [mounted, setMounted] = useState(false)
	const navigationPrevRef = useRef<HTMLDivElement>(null)
	const navigationNextRef = useRef<HTMLDivElement>(null)
	const swiperRef = useRef<SwiperType | null>(null)

	useEffect(() => {
		setMounted(true)
	}, [])

	// Get the appropriate modules based on the effect
	const getModules = () => {
		const modules = []

		if (showNavigation) modules.push(Navigation)
		if (showPagination) modules.push(Pagination)
		if (autoplay) modules.push(Autoplay)

		switch (effect) {
			case 'fade':
				modules.push(EffectFade)
				break
			case 'cube':
				modules.push(EffectCube)
				break
			case 'flip':
				modules.push(EffectFlip)
				break
			case 'cards':
				modules.push(EffectCards)
				break
			default:
				break
		}

		return modules
	}

	if (!mounted) {
		return null
	}

	if (!images || images.length === 0) {
		return (
			<div
				className='bg-muted flex items-center justify-center rounded-md'
				style={{ height }}>
				<p className='text-muted-foreground'>No images to display</p>
			</div>
		)
	}

	return (
		<div className={cn('relative', className)} style={{ width }}>
			<Swiper
				modules={getModules()}
				effect={effect === 'slide' ? undefined : effect}
				slidesPerView={1}
				loop={loop}
				autoplay={autoplay ? { delay: autoplayDelay, disableOnInteraction: false } : false}
				pagination={showPagination ? { clickable: true } : false}
				navigation={
					showNavigation ?
						{
							prevEl: navigationPrevRef.current,
							nextEl: navigationNextRef.current,
						}
					:	false
				}
				onBeforeInit={swiper => {
					swiperRef.current = swiper
					if (showNavigation) {
						// @ts-ignore
						swiper.params.navigation.prevEl = navigationPrevRef.current
						// @ts-ignore
						swiper.params.navigation.nextEl = navigationNextRef.current
					}
				}}
				className='w-full rounded-md'>
				{images.map((image, index) => (
					<SwiperSlide key={index}>
						<div
							className={cn(
								'relative w-full overflow-hidden rounded-md',
								imageClassName
							)}
							style={{ height: typeof height === 'number' ? `${height}px` : height }}>
							<Image
								src={image.src || '/placeholder.svg'}
								alt={image.alt}
								fill
								className='object-cover'
								priority={index === 0}
								sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw'
							/>
						</div>
					</SwiperSlide>
				))}
			</Swiper>

			{showNavigation && (
				<>
					<div
						ref={navigationPrevRef}
						className='bg-background/80 hover:bg-background absolute top-1/2 left-2 z-10 -translate-y-1/2 cursor-pointer rounded-full p-2 shadow-md transition-all'>
						<ChevronLeft className='h-6 w-6' />
					</div>
					<div
						ref={navigationNextRef}
						className='bg-background/80 hover:bg-background absolute top-1/2 right-2 z-10 -translate-y-1/2 cursor-pointer rounded-full p-2 shadow-md transition-all'>
						<ChevronRight className='h-6 w-6' />
					</div>
				</>
			)}
		</div>
	)
}
