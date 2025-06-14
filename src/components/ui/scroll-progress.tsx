'use client'

import { useEffect, useState } from 'react'

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = scrollPx / winHeightPx * 100
      setScrollProgress(scrolled)
    }

    window.addEventListener('scroll', updateScrollProgress)
    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-1.5 z-50 bg-white/5">
      <div 
        className="h-full bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 shadow-lg shadow-blue-500/60 transition-all duration-300 ease-out relative"
        style={{ width: `${scrollProgress}%` }}
      >
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-sky-300 to-indigo-400 blur-sm opacity-60" />
      </div>
    </div>
  )
}