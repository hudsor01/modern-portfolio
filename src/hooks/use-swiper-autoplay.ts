'use client'

import { useState, useEffect, useRef } from 'react'
import type { Swiper } from 'swiper'

interface UseSwiperAutoplayOptions {
  delay?: number
  disableOnInteraction?: boolean
  pauseOnMouseEnter?: boolean
}

export function useSwiperAutoplay(
  swiper?: Swiper,
  options: UseSwiperAutoplayOptions = {}
) {
  const [isPlaying, setIsPlaying] = useState(true)
  const { delay = 3000, disableOnInteraction = false, pauseOnMouseEnter: _pauseOnMouseEnter = true } = options

  // Ref to store a timeout ID for delayed autoplay restart
  const delayTimeoutRef = useRef<number | null>(null)

  const startAutoplay = () => {
    if (!swiper?.autoplay) return
    swiper.autoplay.start()
    setIsPlaying(true)
  }

  const stopAutoplay = () => {
    if (!swiper?.autoplay) return
    swiper.autoplay.stop()
    setIsPlaying(false)
  }

  const toggleAutoplay = () => {
    if (isPlaying) {
      stopAutoplay()
    } else {
      startAutoplay()
    }
  }

  useEffect(() => {
    if (!swiper?.autoplay) return
    swiper.autoplay.start()
    return () => {
      if (swiper?.autoplay) {
        swiper.autoplay.stop()
      }
    }
  }, [swiper])

  useEffect(() => {
    if (!swiper || !disableOnInteraction) return

    const handleInteraction = () => {
      stopAutoplay()
    }

    // Attach swiper event for touch start
    swiper.on('touchStart', handleInteraction)

    // For pointer events, attach directly to the swiper's DOM element
    if (swiper.el) {
      swiper.el.addEventListener('pointerdown', handleInteraction)
    }

    return () => {
      swiper.off('touchStart', handleInteraction)
      if (swiper.el) {
        swiper.el.removeEventListener('pointerdown', handleInteraction)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swiper, disableOnInteraction])

  const handleMouseEnter = () => {
    if (_pauseOnMouseEnter) {
      // Clear any pending delay timeout
      if (delayTimeoutRef.current !== null) {
        clearTimeout(delayTimeoutRef.current)
        delayTimeoutRef.current = null
      }
      stopAutoplay()
    }
  }

  const handleMouseLeave = () => {
    if (_pauseOnMouseEnter) {
      // Restart autoplay after a specified delay
      delayTimeoutRef.current = window.setTimeout(() => {
        startAutoplay()
      }, delay)
    }
  }

  return {
    isPlaying,
    startAutoplay,
    stopAutoplay,
    toggleAutoplay,
    handleMouseEnter,
    handleMouseLeave,
  }
}
