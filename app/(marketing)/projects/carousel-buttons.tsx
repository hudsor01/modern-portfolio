'use client'

import { useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface EmblaCarouselProps {
	embla: any
}

export function PrevButton({ embla }: EmblaCarouselProps) {
	const handleClick = useCallback(() => {
		if (!embla) return
		embla.scrollPrev()
	}, [embla])

	return (
		<button
			className='group hover:bg-primary/10 -ml-2 rounded-full p-2'
			onClick={handleClick}
			aria-label='Previous slide'>
			<ChevronLeft className='group-hover:text-primary h-5 w-5 transition-all' />
		</button>
	)
}

export function NextButton({ embla }: EmblaCarouselProps) {
	const handleClick = useCallback(() => {
		if (!embla) return
		embla.scrollNext()
	}, [embla])

	return (
		<button
			className='group hover:bg-primary/10 -mr-2 rounded-full p-2'
			onClick={handleClick}
			aria-label='Next slide'>
			<ChevronRight className='group-hover:text-primary h-5 w-5 transition-all' />
		</button>
	)
}

export function DotButton({ embla, index }: any) {
	const handleClick = useCallback(() => {
		if (!embla) return
		embla.scrollTo(index)
	}, [embla, index])

	return (
		<button
			className={`bg-primary/20 hover:bg-primary h-2 w-2 rounded-full transition-colors ${
				embla?.selectedScrollSnap() === index ? 'bg-primary' : ''
			}`}
			onClick={handleClick}
			aria-label={`Slide ${index + 1}`}
		/>
	)
}
