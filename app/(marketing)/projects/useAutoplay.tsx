import { useState, useCallback, useEffect } from 'react'
import type { EmblaCarouselType as EmblaApi } from 'embla-carousel'

type UseAutoplayType = {
	autoplayIsPlaying: boolean
	toggleAutoplay: () => void
	onAutoplayButtonClick: (callbackFn: () => void) => void
}

export const useAutoplay = (emblaApi: EmblaApi): UseAutoplayType => {
	const [autoplayIsPlaying, setAutoplayIsPlaying] = useState(false)

	const getAutoplayPlugin = useCallback(() => {
		// Assuming emblaApi has an autoplay plugin
		return emblaApi.plugins.find(plugin => plugin.name === 'Autoplay')
	}, [emblaApi])

	const onAutoplayButtonClick = useCallback(
		(callbackFn: () => void) => {
			const autoplay = getAutoplayPlugin()
			if (!autoplay) {
				callbackFn()
				return
			}


const fallbackFn = () => {
				console.log('Fallback function called')
			}

			const resetOrStop =
				autoplay.options?.stopOnInteraction === false ? autoplay.reset : autoplay.stop

			if (typeof resetOrStop === 'function') {
				resetOrStop()
			}
			callbackFn()
		},
		[getAutoplayPlugin]
	)

	const toggleAutoplay = useCallback(() => {
		const autoplay = getAutoplayPlugin()
		if (!autoplay) return

		const isPlaying = autoplay.isPlaying()
		if (isPlaying) {
			autoplay.stop()
		} else {
			autoplay.play()
		}
		setAutoplayIsPlaying(!isPlaying)
	}, [getAutoplayPlugin, autoplayIsPlaying])

	useEffect(() => {
		if (!emblaApi) return

		const autoplay = getAutoplayPlugin()
		if (!autoplay) return

		const updateAutoplayState = () => {
			setAutoplayIsPlaying(autoplay.isPlaying())
		}

		const onPlay = () => setAutoplayIsPlaying(true)
		const onStop = () => setAutoplayIsPlaying(false)
		const onReInit = () => updateAutoplayState()

		emblaApi.on('autoplay:play', onPlay)
		emblaApi.on('autoplay:stop', onStop)
		emblaApi.on('reInit', onReInit)

		return () => {
			emblaApi.off('autoplay:play', onPlay)
			emblaApi.off('autoplay:stop', onStop)
			emblaApi.off('reInit', onReInit)
		}
	}, [emblaApi, getAutoplayPlugin])

	return {
		autoplayIsPlaying,
		toggleAutoplay,
		onAutoplayButtonClick,
	}
}
