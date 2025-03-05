'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Swiper as SwiperType } from 'swiper'

interface UseSwiperAutoplayOptions {
	delay?: number
	disableOnInteraction?: boolean
	pauseOnMouseEnter?: boolean
}

export function useSwiperAutoplay(
	swiper: SwiperType | null,
	options: UseSwiperAutoplayOptions = {}
) {
	const [isPlaying, setIsPlaying] = useState(true)
	// Default options are extracted but currently unused in this implementation
	// They're kept for future enhancements
	// eslint-disable-next-line no-unused-vars
	const { delay = 3000, disableOnInteraction = false, pauseOnMouseEnter = true } = options

	const startAutoplay = useCallback(() => {
		if (!swiper) return

		swiper.autoplay.start()
		setIsPlaying(true)
	}, [swiper])

	const stopAutoplay = useCallback(() => {
		if (!swiper) return

		swiper.autoplay.stop()
		setIsPlaying(false)
	}, [swiper])

	const toggleAutoplay = useCallback(() => {
		if (isPlaying) {
			stopAutoplay()
		} else {
			startAutoplay()
		}
	}, [isPlaying, startAutoplay, stopAutoplay])

	useEffect(() => {
		if (!swiper || !swiper.autoplay) return

		// Start autoplay by default
		swiper.autoplay.start()

		// Cleanup
		return () => {
			swiper.autoplay.stop()
		}
	}, [swiper])

	return {
		isPlaying,
		startAutoplay,
		stopAutoplay,
		toggleAutoplay,
	}
}
