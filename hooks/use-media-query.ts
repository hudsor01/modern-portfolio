'use client'

import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  
  useEffect(() => {
    // Set initial value on mount
    const media = window.matchMedia(query)
    setMatches(media.matches)
    
    // Create a handler to track changes
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }
    
    // Add the listener
    media.addEventListener('change', listener)
    
    // Cleanup on unmount
    return () => {
      media.removeEventListener('change', listener)
    }
  }, [query])
  
  return matches
}
