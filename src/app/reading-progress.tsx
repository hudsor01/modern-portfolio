'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const rafRef = useRef<number | undefined>(undefined)

  const updateProgress = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    const scrollable = scrollHeight - clientHeight
    const current = (scrollTop / scrollable) * 100
    setProgress(Math.min(Math.max(current, 0), 100))
    setVisible(current >= 5 && current <= 95)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(updateProgress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [updateProgress])

  if (!visible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1">
      <div
        className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
