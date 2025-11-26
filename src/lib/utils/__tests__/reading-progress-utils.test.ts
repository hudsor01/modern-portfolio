/**
 * Reading Progress Utilities Tests
 * Integration tests for reading progress calculation and tracking
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  calculateScrollProgress,
  getEstimatedWordCount,
  ReadingProgressTracker,
  getPageReadingConfig,
  pageReadingConfig
} from '../reading-progress-utils'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    key: vi.fn(),
    length: 0
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock DOM elements
const mockElement = {
  scrollTop: 0,
  scrollHeight: 1000,
  clientHeight: 500,
  textContent: 'This is a sample text with several words for testing word count functionality.',
  innerText: 'This is a sample text with several words for testing word count functionality.'
}

Object.defineProperty(document, 'documentElement', {
  value: mockElement,
  writable: true
})

describe('calculateScrollProgress', () => {
  beforeEach(() => {
    mockElement.scrollTop = 0
    mockElement.scrollHeight = 1000
    mockElement.clientHeight = 500
    // Reset global scroll tracking
    ;(globalThis as { _lastScrollTop?: number })._lastScrollTop = 0
  })

  it('should calculate basic scroll progress correctly', () => {
    mockElement.scrollTop = 250 // 50% of scrollable area (500px)
    
    const result = calculateScrollProgress()
    
    expect(result.scrollProgress).toBe(50)
    expect(result.scrollDirection).toBe('down')
    expect(result.isAtTop).toBe(false)
    expect(result.isAtBottom).toBe(false)
  })

  it('should detect scroll direction', () => {
    // Initial position
    mockElement.scrollTop = 100
    calculateScrollProgress()
    
    // Scroll down
    mockElement.scrollTop = 200
    const downResult = calculateScrollProgress()
    expect(downResult.scrollDirection).toBe('down')
    
    // Scroll up
    mockElement.scrollTop = 150
    const upResult = calculateScrollProgress()
    expect(upResult.scrollDirection).toBe('up')
  })

  it('should detect top and bottom positions', () => {
    // At top
    mockElement.scrollTop = 5
    const topResult = calculateScrollProgress()
    expect(topResult.isAtTop).toBe(true)
    expect(topResult.isAtBottom).toBe(false)
    
    // At bottom
    mockElement.scrollTop = 495 // Close to bottom (500 - 5)
    const bottomResult = calculateScrollProgress()
    expect(bottomResult.isAtTop).toBe(false)
    expect(bottomResult.isAtBottom).toBe(true)
  })

  it('should handle edge cases', () => {
    // No scrollable content
    mockElement.scrollHeight = 500
    mockElement.clientHeight = 500
    
    const result = calculateScrollProgress()
    expect(result.scrollProgress).toBe(0)
    expect(result.isAtTop).toBe(true)
    expect(result.isAtBottom).toBe(false)
  })

  it('should calculate estimated reading time', () => {
    mockElement.scrollTop = 250 // 50% progress
    
    const result = calculateScrollProgress()
    
    expect(result.estimatedTimeRemaining).toBeGreaterThan(0)
    expect(result.readingSpeed).toBe(200) // Default WPM
  })

  it('should handle custom container', () => {
    const customContainer = {
      scrollTop: 100,
      scrollHeight: 600,
      clientHeight: 300,
      textContent: 'Custom container text content.'
    }
    
    const result = calculateScrollProgress(customContainer as Element & { scrollTop: number; scrollHeight: number; clientHeight: number; textContent: string })
    
    // 100 / (600 - 300) * 100 = 33.33%
    expect(Math.round(result.scrollProgress)).toBe(33)
  })
})

describe('getEstimatedWordCount', () => {
  it('should count words correctly', () => {
    const element = {
      textContent: 'This is a test sentence with exactly eight words.'
    }

    const wordCount = getEstimatedWordCount(element as Element & { textContent: string })
    expect(wordCount).toBe(9) // This is a test sentence with exactly eight words (9 words)
  })

  it('should handle empty content', () => {
    const element = { textContent: '' }
    
    const wordCount = getEstimatedWordCount(element as Element & { textContent: string })
    expect(wordCount).toBe(0)
  })

  it('should handle whitespace and punctuation', () => {
    const element = {
      textContent: '   Hello,   world!   This   has   extra   spaces.   '
    }
    
    const wordCount = getEstimatedWordCount(element as Element & { textContent: string })
    expect(wordCount).toBe(6) // Hello, world, This, has, extra, spaces
  })

  it('should fall back to innerText if textContent fails', () => {
    const element = {
      textContent: null,
      innerText: 'Fallback text content here.'
    }
    
    const wordCount = getEstimatedWordCount(element as Element & { textContent: string | null; innerText: string })
    expect(wordCount).toBe(4)
  })

  it('should handle errors gracefully', () => {
    const element = {
      get textContent() { throw new Error('Access error') },
      get innerText() { throw new Error('Access error') }
    }
    
    const wordCount = getEstimatedWordCount(element as Element & { textContent: string; innerText: string })
    expect(wordCount).toBe(1000) // Fallback value
  })
})

describe('ReadingProgressTracker', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllTimers()
    vi.useFakeTimers()
    
    // Mock querySelector
    vi.spyOn(document, 'querySelector').mockImplementation((selector) => {
      if (selector === '.custom-container') {
        return {
          textContent: 'Custom container with some test content for word counting.',
          scrollTop: 0,
          scrollHeight: 800,
          clientHeight: 400
        } as Element & { textContent: string; scrollTop: number; scrollHeight: number; clientHeight: number }
      }
      return null
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should create new session with correct initial values', () => {
    const tracker = new ReadingProgressTracker()
    const stats = tracker.getReadingStats()
    
    expect(stats.progress).toBe(0)
    expect(stats.timeSpent).toBe(0)
    expect(stats.averageSpeed).toBe(200)
    expect(stats.totalWords).toBeGreaterThan(0)
  })

  it('should track progress updates', () => {
    const tracker = new ReadingProgressTracker()
    
    tracker.updateProgress(25)
    vi.advanceTimersByTime(5000) // 5 seconds
    tracker.updateProgress(50)
    
    const stats = tracker.getReadingStats()
    expect(stats.progress).toBe(50)
    expect(stats.timeSpent).toBeGreaterThan(0)
  })

  it('should calculate reading speed over time', () => {
    const tracker = new ReadingProgressTracker()
    
    // Simulate reading progress over time
    tracker.updateProgress(10)
    vi.advanceTimersByTime(30000) // 30 seconds
    tracker.updateProgress(20)
    vi.advanceTimersByTime(30000) // Another 30 seconds
    tracker.updateProgress(40)
    
    const stats = tracker.getReadingStats()
    expect(stats.averageSpeed).toBeGreaterThan(0)
    expect(stats.timeSpent).toBeGreaterThan(50000) // More than 50 seconds
  })

  it('should save and restore sessions', () => {
    // Create initial tracker
    const tracker1 = new ReadingProgressTracker(undefined, 'test-session')
    tracker1.updateProgress(30)
    vi.advanceTimersByTime(10000) // 10 seconds
    
    // Manually save (simulating interval)
    tracker1.getReadingStats()
    
    // Create new tracker (simulating page reload)
    localStorageMock.setItem('test-session', JSON.stringify({
      startTime: Date.now() - 10000,
      totalWords: 1000,
      currentProgress: 30,
      averageReadingSpeed: 200,
      timeSpent: 10000,
      isActive: true
    }))
    
    const tracker2 = new ReadingProgressTracker(undefined, 'test-session')
    const stats2 = tracker2.getReadingStats()
    
    expect(stats2.progress).toBe(30)
  })

  it('should calculate estimated time remaining', () => {
    const tracker = new ReadingProgressTracker()
    tracker.updateProgress(25) // 25% complete
    
    const timeRemaining = tracker.getEstimatedTimeRemaining()
    expect(timeRemaining).toBeGreaterThan(0)
    
    // More progress should mean less time remaining
    tracker.updateProgress(75) // 75% complete
    const lessTimeRemaining = tracker.getEstimatedTimeRemaining()
    expect(lessTimeRemaining).toBeLessThan(timeRemaining)
  })

  it('should handle pause and resume', () => {
    const tracker = new ReadingProgressTracker()
    
    tracker.updateProgress(20)
    tracker.pauseTracking()
    
    // Progress updates should not affect time when paused
    const timeBeforePause = tracker.getReadingStats().timeSpent
    vi.advanceTimersByTime(5000)
    tracker.updateProgress(30)
    const timeAfterPause = tracker.getReadingStats().timeSpent
    
    expect(timeAfterPause).toBe(timeBeforePause)
    
    // Resume tracking
    tracker.resumeTracking()
    vi.advanceTimersByTime(5000)
    tracker.updateProgress(40)
    const timeAfterResume = tracker.getReadingStats().timeSpent
    
    expect(timeAfterResume).toBeGreaterThan(timeAfterPause)
  })

  it('should reset session correctly', () => {
    const tracker = new ReadingProgressTracker()

    // Make multiple updates to accumulate time
    tracker.updateProgress(25)
    vi.advanceTimersByTime(5000)
    tracker.updateProgress(50)
    vi.advanceTimersByTime(5000)

    const statsBeforeReset = tracker.getReadingStats()
    expect(statsBeforeReset.progress).toBe(50)
    // timeSpent accumulates on each updateProgress call based on time difference
    // With fake timers, we need at least 2 calls with time advancement

    tracker.resetSession()
    const statsAfterReset = tracker.getReadingStats()

    expect(statsAfterReset.progress).toBe(0)
    expect(statsAfterReset.timeSpent).toBe(0)
  })

  it('should use custom container selector', () => {
    const tracker = new ReadingProgressTracker('.custom-container')
    const stats = tracker.getReadingStats()
    
    expect(document.querySelector).toHaveBeenCalledWith('.custom-container')
    expect(stats.totalWords).toBeGreaterThan(0)
  })

  it('should handle old sessions gracefully', () => {
    // Mock old session (more than 1 hour old)
    const oldSession = {
      startTime: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
      totalWords: 1000,
      currentProgress: 50,
      averageReadingSpeed: 200,
      timeSpent: 30000,
      isActive: true
    }
    
    localStorageMock.setItem('old-session', JSON.stringify(oldSession))
    
    const tracker = new ReadingProgressTracker(undefined, 'old-session')
    const stats = tracker.getReadingStats()
    
    // Should start fresh, not use old session
    expect(stats.progress).toBe(0)
    expect(stats.timeSpent).toBe(0)
  })
})

describe('Page Reading Configuration', () => {
  it('should return correct config for blog pages', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/blog/test-post' },
      writable: true
    })
    
    const config = getPageReadingConfig()
    expect(config).toEqual(pageReadingConfig.blog)
    expect(config.estimatedWPM).toBe(200)
    expect(config.containerSelector).toContain('article')
  })

  it('should return correct config for project pages', () => {
    window.location.pathname = '/projects/revenue-kpi'
    
    const config = getPageReadingConfig()
    expect(config).toEqual(pageReadingConfig.projects)
    expect(config.estimatedWPM).toBe(180) // Slower for technical content
  })

  it('should return correct config for resume page', () => {
    window.location.pathname = '/resume'
    
    const config = getPageReadingConfig()
    expect(config).toEqual(pageReadingConfig.resume)
    expect(config.estimatedWPM).toBe(220) // Faster for structured content
  })

  it('should return default config for other pages', () => {
    window.location.pathname = '/some-other-page'
    
    const config = getPageReadingConfig()
    expect(config.estimatedWPM).toBe(200)
    expect(config.containerSelector).toContain('main')
  })
})

describe('Error Handling', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should handle localStorage errors gracefully', () => {
    const tracker = new ReadingProgressTracker()

    // Mock localStorage to throw errors after tracker is created
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded')
    })

    tracker.updateProgress(25)

    // Should not throw despite localStorage errors
    // Use advanceTimersByTime instead of runAllTimers to avoid infinite loop
    // from the setInterval in the tracker
    expect(() => {
      vi.advanceTimersByTime(11000) // Trigger one auto-save cycle
    }).not.toThrow()

    // Stop the tracker to clean up the interval
    tracker.stopTracking()

    // Clean up the mock
    localStorageMock.setItem.mockRestore()
  })

  it('should handle querySelector errors', () => {
    const querySelectorSpy = vi.spyOn(document, 'querySelector').mockImplementation(() => {
      throw new Error('Query error')
    })

    // Should fall back to document.documentElement without throwing
    let tracker: ReadingProgressTracker | undefined
    expect(() => {
      tracker = new ReadingProgressTracker('.problematic-selector')
    }).not.toThrow()

    expect(tracker).toBeDefined()

    // Clean up
    querySelectorSpy.mockRestore()
  })

  it('should handle window beforeunload cleanup', () => {
    const tracker = new ReadingProgressTracker()
    const stopTrackingSpy = vi.spyOn(tracker, 'stopTracking')
    
    // Simulate beforeunload event
    window.dispatchEvent(new Event('beforeunload'))
    
    expect(stopTrackingSpy).toHaveBeenCalled()
  })
})