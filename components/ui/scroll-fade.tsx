'use client'

import type React from 'react'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface ScrollFadeProps {
	children: React.ReactNode
	className?: string
	delay?: number
	direction?: 'up' | 'down' | 'left' | 'right'
	distance?: number
	duration?: number
	once?: boolean
	threshold?: number
}

export function ScrollFade({
	children,
	className,
	delay = 0,
	direction = 'up',
	distance = 8,
	duration = 700,
	once = true,
	threshold = 0.1,
}: ScrollFadeProps) {
	const ref = useRef(null)
	const isInView = useInView(ref, {
		once,
		margin: threshold !== 0.1 ? undefined : '0px 0px -100px 0px',
		amount: threshold !== 0.1 ? threshold : undefined,
	})

	// Calculate initial transform based on direction
	const getInitialTransform = () => {
		switch (direction) {
			case 'up':
				return `translateY(${distance}px)`
			case 'down':
				return `translateY(-${distance}px)`
			case 'left':
				return `translateX(${distance}px)`
			case 'right':
				return `translateX(-${distance}px)`
			default:
				return `translateY(${distance}px)`
		}
	}

	// Calculate visible transform
	const getVisibleTransform = () => {
		return 'translate(0, 0)'
	}

	return (
		<div
			ref={ref}
			className={cn('transition-all ease-out', className)}
			style={{
				transform: isInView ? getVisibleTransform() : getInitialTransform(),
				opacity: isInView ? 1 : 0,
				transitionDuration: `${duration}ms`,
				transitionDelay: `${delay}ms`,
			}}>
			{children}
		</div>
	)
}
