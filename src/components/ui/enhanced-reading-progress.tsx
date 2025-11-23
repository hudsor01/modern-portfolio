/**
 * Enhanced Reading Progress Indicator
 * Performance-optimized reading progress with accessibility and smooth animations
 */

'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { READING_PROGRESS } from '@/lib/constants/ui-thresholds'

interface EnhancedReadingProgressProps {
  /**
   * Position of the progress bar
   */
  position?: 'top' | 'bottom'
  /**
   * Height of the progress bar
   */
  height?: number
  /**
   * Whether to show percentage text
   */
  showPercentage?: boolean
  /**
   * Custom className
   */
  className?: string
  /**
   * Whether to show only on content pages
   */
  contentPagesOnly?: boolean
  /**
   * Minimum scroll percentage to show the bar
   */
  showThreshold?: number
  /**
   * Maximum scroll percentage to hide the bar
   */
  hideThreshold?: number
  /**
   * Custom container selector for progress calculation
   */
  containerSelector?: string
}

export function EnhancedReadingProgress({
  position = 'top',
  height = READING_PROGRESS.DEFAULT_HEIGHT,
  showPercentage = false,
  className,
  contentPagesOnly = false,
  showThreshold = READING_PROGRESS.SHOW_THRESHOLD,
  hideThreshold = READING_PROGRESS.HIDE_THRESHOLD,
  containerSelector
}: EnhancedReadingProgressProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [direction, setDirection] = useState<'up' | 'down'>('down')
  const rafRef = useRef<number | undefined>(undefined)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  // Check if we should show on current page
  const shouldShowOnPage = useCallback(() => {
    if (!contentPagesOnly) return true
    
    const pathname = window.location.pathname
    const contentPages = ['/blog', '/projects', '/resume', '/about']
    
    return contentPages.some(page => pathname.startsWith(page)) || pathname.includes('/blog/') || pathname.includes('/projects/')
  }, [contentPagesOnly])

  // Optimized scroll calculation
  const calculateProgress = useCallback(() => {
    try {
      let scrollContainer: Element | HTMLElement = document.documentElement
      let scrollElement: Element | HTMLElement = document.documentElement

      // Use custom container if specified
      if (containerSelector) {
        const customContainer = document.querySelector(containerSelector)
        if (customContainer) {
          scrollContainer = customContainer as HTMLElement
          scrollElement = customContainer as HTMLElement
        }
      }

      const scrollTop = scrollContainer.scrollTop || scrollElement.scrollTop
      const scrollHeight = scrollElement.scrollHeight || scrollContainer.scrollHeight
      const clientHeight = scrollContainer.clientHeight || scrollElement.clientHeight

      // Handle edge cases
      if (scrollHeight <= clientHeight) {
        setScrollProgress(0)
        setIsVisible(false)
        return
      }

      const totalScrollable = scrollHeight - clientHeight
      const currentProgress = Math.min(Math.max((scrollTop / totalScrollable) * 100, 0), 100)

      // Update scroll direction
      const currentScrollY = scrollTop
      if (currentScrollY > lastScrollY.current) {
        setDirection('down')
      } else if (currentScrollY < lastScrollY.current) {
        setDirection('up')
      }
      lastScrollY.current = currentScrollY

      // Update progress
      setScrollProgress(currentProgress)

      // Update visibility based on thresholds
      const shouldBeVisible = 
        shouldShowOnPage() && 
        currentProgress >= showThreshold && 
        currentProgress <= hideThreshold

      setIsVisible(shouldBeVisible)

    } catch (error) {
      console.warn('Error calculating scroll progress:', error)
    }
  }, [showThreshold, hideThreshold, containerSelector, shouldShowOnPage])

  // Throttled scroll handler using requestAnimationFrame
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      rafRef.current = requestAnimationFrame(() => {
        calculateProgress()
        ticking.current = false
      })
      ticking.current = true
    }
  }, [calculateProgress])

  // Handle resize events
  const handleResize = useCallback(() => {
    handleScroll()
  }, [handleScroll])

  useEffect(() => {
    // Initial calculation
    calculateProgress()

    // Add event listeners with passive option for better performance
    const scrollOptions = { passive: true }
    const resizeOptions = { passive: true }

    if (containerSelector) {
      const container = document.querySelector(containerSelector)
      if (container) {
        container.addEventListener('scroll', handleScroll, scrollOptions)
      }
    } else {
      window.addEventListener('scroll', handleScroll, scrollOptions)
    }
    
    window.addEventListener('resize', handleResize, resizeOptions)

    // Cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }

      if (containerSelector) {
        const container = document.querySelector(containerSelector)
        if (container) {
          container.removeEventListener('scroll', handleScroll)
        }
      } else {
        window.removeEventListener('scroll', handleScroll)
      }
      
      window.removeEventListener('resize', handleResize)
    }
  }, [handleScroll, handleResize, calculateProgress, containerSelector])

  // Don't render if not visible
  if (!isVisible) return null

  const progressPercentage = Math.round(scrollProgress)

  return (
    <>
      {/* Progress Bar */}
      <div
        className={cn(
          'fixed left-0 right-0 z-50 transition-all duration-300 ease-out',
          position === 'top' ? 'top-0' : 'bottom-0',
          className
        )}
        style={{ height: `${height}px` }}
        role="progressbar"
        aria-label="Reading progress"
        aria-valuenow={progressPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${progressPercentage}% read`}
      >
        {/* Background */}
        <div 
          className={cn(
            'absolute inset-0 bg-gradient-to-r transition-opacity duration-300',
            position === 'top' 
              ? 'from-slate-900/20 via-slate-800/30 to-slate-900/20' 
              : 'from-slate-800/30 via-slate-700/40 to-slate-800/30'
          )}
        />
        
        {/* Progress Fill */}
        <div
          className={cn(
            'relative h-full bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 transition-all duration-150 ease-out shadow-sm',
            // Add subtle animation based on scroll direction
            direction === 'down' 
              ? 'shadow-blue-500/40' 
              : 'shadow-indigo-500/40'
          )}
          style={{ 
            width: `${scrollProgress}%`,
            transition: 'width 0.15s ease-out, box-shadow 0.3s ease-out'
          }}
        >
          {/* Subtle glow effect */}
          <div 
            className={cn(
              'absolute inset-0 bg-gradient-to-r opacity-60 blur-sm transition-opacity duration-300',
              direction === 'down'
                ? 'from-blue-300 via-sky-300 to-indigo-400'
                : 'from-indigo-300 via-sky-300 to-blue-400'
            )}
          />
          
          {/* Leading edge highlight */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-1 bg-white/20 shadow-sm"
            style={{
              opacity: scrollProgress > 1 ? 1 : 0,
              transition: 'opacity 0.2s ease-out'
            }}
          />
        </div>
      </div>

      {/* Optional Percentage Display */}
      {showPercentage && scrollProgress > 5 && (
        <div
          className={cn(
            'fixed right-4 z-50 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 backdrop-blur-sm border',
            position === 'top' ? 'top-6' : 'bottom-6',
            'bg-white/10 text-white border-white/20 shadow-lg shadow-black/20'
          )}
          aria-hidden="true"
        >
          {progressPercentage}%
        </div>
      )}
    </>
  )
}

/**
 * Hook for reading progress functionality
 */
export function useReadingProgress(containerSelector?: string) {
  const [progress, setProgress] = useState(0)
  const [isReading, setIsReading] = useState(false)

  useEffect(() => {
    const calculateProgress = () => {
      let scrollContainer: Element | HTMLElement = document.documentElement
      let scrollElement: Element | HTMLElement = document.documentElement

      if (containerSelector) {
        const customContainer = document.querySelector(containerSelector)
        if (customContainer) {
          scrollContainer = customContainer as HTMLElement
          scrollElement = customContainer as HTMLElement
        }
      }

      const scrollTop = scrollContainer.scrollTop || scrollElement.scrollTop
      const scrollHeight = scrollElement.scrollHeight || scrollContainer.scrollHeight
      const clientHeight = scrollContainer.clientHeight || scrollElement.clientHeight

      if (scrollHeight <= clientHeight) {
        setProgress(0)
        setIsReading(false)
        return
      }

      const totalScrollable = scrollHeight - clientHeight
      const currentProgress = Math.min(Math.max((scrollTop / totalScrollable) * 100, 0), 100)

      setProgress(currentProgress)
      setIsReading(currentProgress > 1 && currentProgress < 99)
    }

    const handleScroll = () => {
      requestAnimationFrame(calculateProgress)
    }

    // Initial calculation
    calculateProgress()

    // Add listeners
    if (containerSelector) {
      const container = document.querySelector(containerSelector)
      if (container) {
        container.addEventListener('scroll', handleScroll, { passive: true })
        return () => container.removeEventListener('scroll', handleScroll)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [containerSelector])

  return { progress: Math.round(progress), isReading }
}

/**
 * Reading Progress for specific content types
 */
export function BlogReadingProgress(props: Omit<EnhancedReadingProgressProps, 'contentPagesOnly'>) {
  return (
    <EnhancedReadingProgress
      {...props}
      contentPagesOnly={true}
      containerSelector="article, main, .blog-content"
    />
  )
}

export function ProjectReadingProgress(props: Omit<EnhancedReadingProgressProps, 'contentPagesOnly'>) {
  return (
    <EnhancedReadingProgress
      {...props}
      contentPagesOnly={true}
      containerSelector=".project-content, main, article"
    />
  )
}