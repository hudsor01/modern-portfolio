'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to track the vertical scroll position of the window
 */
export function useScrollPosition(): number {
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const updatePosition = (): void => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener('scroll', updatePosition)
    updatePosition()

    return () => window.removeEventListener('scroll', updatePosition)
  }, [])

  return scrollPosition
}
