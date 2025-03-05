import { useCallback, useEffect, useState } from 'react'
import { EmblaCarouselType } from 'embla-carousel'

type UseAutoplayType = {
  autoplayIsPlaying: boolean
  toggleAutoplay: () => void
  onAutoplayButtonClick: () => void
}

export const useAutoplay = (
  emblaApi: EmblaCarouselType | undefined
<<<<<<< tabby-0JGyeP
): UseAutoplayType => {
>>>>>>> tabby-0JGyeP [.]
  const [autoplayIsPlaying, setAutoplayIsPlaying] = useState(false)

      try {
        const resetOrStop =
          autoplay.options?.stopOnInteraction === false
            ? autoplay.reset
            : autoplay.stop

        if (typeof resetOrStop === 'function') {
          resetOrStop()
        }
        callbackFn()
      } catch (error) {
        console.error("Error in onAutoplayButtonClick:", error)
        callbackFn()
      }
    },
    [emblaApi]
  )

  const toggleAutoplay = useCallback(() => {
    try {
      const autoplay = emblaApi?.plugins()?.autoplay
      if (!autoplay) return

      const playOrStop = autoplay.isPlaying() ? autoplay.stop : autoplay.play
      if (typeof playOrStop === 'function') {
        playOrStop()
      }
    } catch (error) {
      console.error("Error in toggleAutoplay:", error)
    }
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    try {
      const autoplay = emblaApi.plugins()?.autoplay
      if (!autoplay) return

      const updateAutoplayState = () => {
        try {
          setAutoplayIsPlaying(autoplay.isPlaying())
        } catch (error) {
          console.error("Error updating autoplay state:", error)
        }
      }

      updateAutoplayState()

      const onPlay = () => setAutoplayIsPlaying(true)
      const onStop = () => setAutoplayIsPlaying(false)
      const onReInit = () => updateAutoplayState()

      emblaApi
        .on('autoplay:play', onPlay)
        .on('autoplay:stop', onStop)
        .on('reInit', onReInit)

      return () => {
        emblaApi
          .off('autoplay:play', onPlay)
          .off('autoplay:stop', onStop)
          .off('reInit', onReInit)
      }
    } catch (error) {
      console.error("Error setting up autoplay event listeners:", error)
    }
  }, [emblaApi])

return {
  autoplayIsPlaying,
  toggleAutoplay,
  onAutoplayButtonClick: useCallback(() => {
    const autoplay = emblaApi?.plugins()?.autoplay
    if (!autoplay) {
      return
    }

    try {
      const resetOrStop =
        autoplay.options?.stopOnInteraction === false
          ? autoplay.reset
          : autoplay.stop

      if (typeof resetOrStop === 'function') {
        resetOrStop()
      }
    } catch (error) {
      console.error("Error in onAutoplayButtonClick:", error)
    }
  }, [emblaApi])
}
}

// Re-export the hook and type for convenience
export type { UseAutoplayType }
