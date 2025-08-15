'use client'

import React, { useEffect, useRef } from 'react'

interface LiveRegionProps {
  message: string
  level?: 'polite' | 'assertive' | 'off'
  atomic?: boolean
  relevant?: 'additions' | 'removals' | 'text' | 'all'
}

export function LiveRegion({ 
  message, 
  level = 'polite', 
  atomic = true,
  relevant = 'all'
}: LiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (regionRef.current && message) {
      // Clear and set the message to ensure it's announced
      regionRef.current.textContent = ''
      setTimeout(() => {
        if (regionRef.current) {
          regionRef.current.textContent = message
        }
      }, 10)
    }
  }, [message])

  return (
    <div
      ref={regionRef}
      className="sr-only"
      aria-live={level}
      aria-atomic={atomic}
      aria-relevant={relevant}
      role="status"
    />
  )
}