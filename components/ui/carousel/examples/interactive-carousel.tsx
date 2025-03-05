'use client'

import { useState } from 'react'
import { Carousel, type TransitionEffect } from '@/components/ui/carousel/carousel'
import type { CarouselImage } from '@/components/ui/carousel/carousel'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface InteractiveCarouselProps {
	images: CarouselImage[]
	initialEffect?: TransitionEffect
	className?: string
}

export function InteractiveCarousel({
	images,
	initialEffect = 'slide',
	className,
}: InteractiveCarouselProps) {
	// State for customization options
	const [effect, setEffect] = useState<TransitionEffect>(initialEffect)
	const [autoplay, setAutoplay] = useState(true)
	const [autoplayDelay, setAutoplayDelay] = useState(3000)
	const [loop, setLoop] = useState(true)
	const [showNavigation, setShowNavigation] = useState(true)
	const [showPagination, setShowPagination] = useState(true)
	const [height, setHeight] = useState(400)

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>Interactive Carousel Demo</CardTitle>
			</CardHeader>
			<CardContent className='space-y-8'>
				<Carousel
					images={images}
					effect={effect}
					autoplay={autoplay}
					autoplayDelay={autoplayDelay}
					loop={loop}
					showNavigation={showNavigation}
					showPagination={showPagination}
					height={height}
				/>

				<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
					<div className='space-y-2'>
						<Label htmlFor='effect'>Transition Effect</Label>
						<Select
							value={effect}
							onValueChange={value => setEffect(value as TransitionEffect)}>
							<SelectTrigger id='effect'>
								<SelectValue placeholder='Select effect' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='slide'>Slide</SelectItem>
								<SelectItem value='fade'>Fade</SelectItem>
								<SelectItem value='cube'>Cube</SelectItem>
								<SelectItem value='flip'>Flip</SelectItem>
								<SelectItem value='cards'>Cards</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className='flex items-center space-x-2'>
						<Switch id='autoplay' checked={autoplay} onCheckedChange={setAutoplay} />
						<Label htmlFor='autoplay'>Autoplay</Label>
					</div>

					{autoplay && (
						<div className='space-y-2'>
							<Label htmlFor='autoplayDelay'>Autoplay Delay: {autoplayDelay}ms</Label>
							<Slider
								id='autoplayDelay'
								min={1000}
								max={5000}
								step={500}
								value={[autoplayDelay]}
								onValueChange={value => setAutoplayDelay(value[0])}
							/>
						</div>
					)}

					<div className='flex items-center space-x-2'>
						<Switch id='loop' checked={loop} onCheckedChange={setLoop} />
						<Label htmlFor='loop'>Loop</Label>
					</div>

					<div className='flex items-center space-x-2'>
						<Switch
							id='showNavigation'
							checked={showNavigation}
							onCheckedChange={setShowNavigation}
						/>
						<Label htmlFor='showNavigation'>Show Navigation</Label>
					</div>

					<div className='flex items-center space-x-2'>
						<Switch
							id='showPagination'
							checked={showPagination}
							onCheckedChange={setShowPagination}
						/>
						<Label htmlFor='showPagination'>Show Pagination</Label>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='height'>Height: {height}px</Label>
						<Slider
							id='height'
							min={200}
							max={600}
							step={50}
							value={[height]}
							onValueChange={value => setHeight(value[0])}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
