/**
 * Reading Progress Utilities
 * Helper functions for reading progress calculation and management
 */

import { useEffect, useRef, useCallback } from 'react'
import { createContextLogger } from '@/lib/monitoring/logger'

const progressLogger = createContextLogger('ReadingProgress')

// Extend Window interface to include custom scroll tracking property
interface WindowWithScrollTracking extends Window {
  _lastScrollTop?: number
}

export interface ReadingProgressMetrics {
  scrollProgress: number
  scrollDirection: 'up' | 'down'
  isAtTop: boolean
  isAtBottom: boolean
  estimatedTimeRemaining: number
  readingSpeed: number // words per minute
}

export interface ReadingSession {
  startTime: number
  totalWords: number
  currentProgress: number
  averageReadingSpeed: number
  timeSpent: number
  isActive: boolean
}

/**
 * Calculate scroll progress with better accuracy
 */
export function calculateScrollProgress(container?: Element | HTMLElement): ReadingProgressMetrics {
  const scrollContainer = container || document.documentElement
  const scrollElement = container || document.documentElement

  const scrollTop = scrollContainer.scrollTop
  const scrollHeight = scrollElement.scrollHeight
  const clientHeight = scrollContainer.clientHeight

  // Handle edge cases
  if (scrollHeight <= clientHeight) {
    return {
      scrollProgress: 0,
      scrollDirection: 'down',
      isAtTop: true,
      isAtBottom: false,
      estimatedTimeRemaining: 0,
      readingSpeed: 200, // default WPM
    }
  }

  const totalScrollable = scrollHeight - clientHeight
  const scrollProgress = Math.min(Math.max((scrollTop / totalScrollable) * 100, 0), 100)

  // Determine scroll direction - use a more reliable method
  if (typeof window !== 'undefined') {
    const win = window as WindowWithScrollTracking
    const lastScrollTop = win._lastScrollTop || 0
    const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up'
    win._lastScrollTop = scrollTop

    // Calculate positions
    const isAtTop = scrollTop < 10
    const isAtBottom = scrollTop >= totalScrollable - 10

    // Estimate reading time (basic calculation)
    const remainingProgress = 100 - scrollProgress
    const averageWPM = 200 // Average reading speed
    const estimatedWordsRemaining = (remainingProgress / 100) * getEstimatedWordCount(scrollContainer)
    const estimatedTimeRemaining = (estimatedWordsRemaining / averageWPM) * 60 // seconds

    return {
      scrollProgress,
      scrollDirection,
      isAtTop,
      isAtBottom,
      estimatedTimeRemaining,
      readingSpeed: averageWPM,
    }
  }

  // Fallback for server-side
  return {
    scrollProgress: 0,
    scrollDirection: 'down',
    isAtTop: true,
    isAtBottom: false,
    estimatedTimeRemaining: 0,
    readingSpeed: 200,
  }
}

/**
 * Estimate word count in a container
 */
export function getEstimatedWordCount(element: Element | HTMLElement): number {
  try {
    const textContent =
      element.textContent || ('innerHTML' in element ? (element as HTMLElement).innerText : '') || ''
    const words = textContent
      .trim()
      .split(/\s+/)
      .filter((word: string) => word.length > 0)
    return words.length
  } catch (error) {
    progressLogger.warn('Error calculating word count', { error })
    return 1000 // fallback estimate
  }
}

/**
 * Track reading session
 * Node.js 24: Implements Disposable for automatic cleanup via 'using' keyword
 */
export class ReadingProgressTracker implements Disposable {
  private session: ReadingSession
  private progressHistory: number[] = []
  private lastUpdateTime: number = Date.now()
  private saveInterval: NodeJS.Timeout | null = null

  constructor(
    private containerSelector?: string,
    private storageKey: string = 'reading-progress'
  ) {
    if (typeof window !== 'undefined') {
      this.session = this.loadSession() || this.createNewSession()
      this.startTracking()
    } else {
      // In SSR, initialize with default values
      this.session = this.createNewSession()
    }
  }

  private createNewSession(): ReadingSession {
    const container = this.getContainer()
    const totalWords = getEstimatedWordCount(container)

    return {
      startTime: Date.now(),
      totalWords,
      currentProgress: 0,
      averageReadingSpeed: 200,
      timeSpent: 0,
      isActive: typeof window !== 'undefined', // Only active in browser environment
    }
  }

  private getContainer(): Element | HTMLElement {
    if (this.containerSelector && typeof window !== 'undefined') {
      try {
        const container = document.querySelector(this.containerSelector)
        if (container) return container as HTMLElement
      } catch (error) {
        progressLogger.warn('Error querying container selector', { error })
      }
    }
    return typeof window !== 'undefined' ? document.documentElement : {} as HTMLElement
  }

  private loadSession(): ReadingSession | null {
    if (typeof window === 'undefined') return null

    try {
      const saved = window.localStorage.getItem(this.storageKey)
      if (saved) {
        const session = JSON.parse(saved)
        // Only restore if session is recent (within 1 hour)
        if (Date.now() - session.startTime < 60 * 60 * 1000) {
          return { ...session, isActive: true }
        }
      }
    } catch (error) {
      progressLogger.warn('Error loading reading session', { error })
    }
    return null
  }

  private saveSession(): void {
    if (typeof window === 'undefined') return

    try {
      window.localStorage.setItem(this.storageKey, JSON.stringify(this.session))
    } catch (error) {
      progressLogger.warn('Error saving reading session', { error })
    }
  }

  private startTracking(): void {
    if (typeof window === 'undefined') return

    // Prevent duplicate intervals
    if (this.saveInterval) {
      return
    }

    // Save session every 10 seconds
    this.saveInterval = setInterval(() => {
      if (this.session.isActive) {
        try {
          this.saveSession()
        } catch (error) {
          progressLogger.warn('Failed to save reading session', { error })
        }
      }
    }, 10000)

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      this.stopTracking()
    })
  }

  public updateProgress(progress: number): void {
    if (!this.session.isActive) return

    const now = Date.now()
    const timeDiff = now - this.lastUpdateTime

    // Update session
    this.session.currentProgress = progress
    this.session.timeSpent += timeDiff

    // Track progress history for speed calculation
    this.progressHistory.push(progress)
    if (this.progressHistory.length > 20) {
      this.progressHistory.shift()
    }

    // Calculate reading speed if we have enough data
    if (this.progressHistory.length >= 5 && this.session.timeSpent > 10000) {
      const lastProgress = this.progressHistory[this.progressHistory.length - 1]
      const firstProgress = this.progressHistory[0]
      const progressDiff = Math.max((lastProgress ?? 0) - (firstProgress ?? 0), 1)
      const timeDiffMinutes = this.session.timeSpent / 60000
      const wordsRead = (progressDiff / 100) * this.session.totalWords

      if (timeDiffMinutes > 0 && wordsRead > 0) {
        this.session.averageReadingSpeed = Math.round(wordsRead / timeDiffMinutes)
      }
    }

    this.lastUpdateTime = now
  }

  public getEstimatedTimeRemaining(): number {
    const remainingProgress = 100 - this.session.currentProgress
    const remainingWords = (remainingProgress / 100) * this.session.totalWords
    return (remainingWords / this.session.averageReadingSpeed) * 60 // seconds
  }

  public getReadingStats() {
    return {
      progress: this.session.currentProgress,
      timeSpent: this.session.timeSpent,
      averageSpeed: this.session.averageReadingSpeed,
      estimatedTimeRemaining: this.getEstimatedTimeRemaining(),
      totalWords: this.session.totalWords,
    }
  }

  public pauseTracking(): void {
    this.session.isActive = false
    this.saveSession()
  }

  public resumeTracking(): void {
    this.session.isActive = true
  }

  public stopTracking(): void {
    this.session.isActive = false
    this.saveSession()

    if (this.saveInterval) {
      clearInterval(this.saveInterval)
      this.saveInterval = null
    }
  }

  // Node.js 24: Explicit Resource Management - called automatically with 'using' keyword
  [Symbol.dispose](): void {
    this.stopTracking()
  }

  public resetSession(): void {
    this.session = this.createNewSession()
    this.progressHistory = []
    this.saveSession()
  }
}

/**
 * Hook for reading progress tracking
 */
export function useReadingProgressTracker(containerSelector?: string, storageKey?: string) {
  const trackerRef = useRef<ReadingProgressTracker | undefined>(undefined)

  useEffect(() => {
    trackerRef.current = new ReadingProgressTracker(containerSelector, storageKey)

    return () => {
      trackerRef.current?.stopTracking()
    }
  }, [containerSelector, storageKey])

  const updateProgress = useCallback((progress: number) => {
    trackerRef.current?.updateProgress(progress)
  }, [])

  const getStats = useCallback(() => {
    return (
      trackerRef.current?.getReadingStats() || {
        progress: 0,
        timeSpent: 0,
        averageSpeed: 200,
        estimatedTimeRemaining: 0,
        totalWords: 0,
      }
    )
  }, [])

  return {
    updateProgress,
    getStats,
    pauseTracking: () => trackerRef.current?.pauseTracking(),
    resumeTracking: () => trackerRef.current?.resumeTracking(),
    resetSession: () => trackerRef.current?.resetSession(),
  }
}

/**
 * Page-specific reading progress utilities
 */
export const pageReadingConfig = {
  blog: {
    containerSelector: 'article, .blog-content, main',
    showThreshold: 5,
    hideThreshold: 95,
    estimatedWPM: 200,
  },
  projects: {
    containerSelector: '.project-content, main, article',
    showThreshold: 3,
    hideThreshold: 97,
    estimatedWPM: 180, // Slower for technical content
  },
  resume: {
    containerSelector: 'main, .resume-content',
    showThreshold: 2,
    hideThreshold: 98,
    estimatedWPM: 220, // Faster for structured content
  },
  about: {
    containerSelector: 'main, .about-content',
    showThreshold: 2,
    hideThreshold: 98,
    estimatedWPM: 200,
  },
}

/**
 * Get reading configuration for current page
 */
export function getPageReadingConfig() {
  if (typeof window === 'undefined') {
    // Return default config for server side
    return {
      containerSelector: 'main, article',
      showThreshold: 5,
      hideThreshold: 95,
      estimatedWPM: 200,
    }
  }

  const pathname = window.location.pathname

  if (pathname.includes('/blog/')) return pageReadingConfig.blog
  if (pathname.includes('/projects/')) return pageReadingConfig.projects
  if (pathname.includes('/resume')) return pageReadingConfig.resume
  if (pathname.includes('/about')) return pageReadingConfig.about

  // Default configuration
  return {
    containerSelector: 'main, article',
    showThreshold: 5,
    hideThreshold: 95,
    estimatedWPM: 200,
  }
}
