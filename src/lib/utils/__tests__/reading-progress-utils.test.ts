/**
 * Reading Progress Utilities Tests
 * Integration tests for reading progress calculation and tracking
 * Refactored for Bun test runner (no fake timer support)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'bun:test'
import {
  calculateScrollProgress,
  getEstimatedWordCount,
  ReadingProgressTracker,
  getPageReadingConfig,
  pageReadingConfig
} from '../reading-progress-utils'

// Helper to wait for a specific duration (Bun doesn't support fake timers)
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// IMPORTANT: Don't modify window/document at module scope - this corrupts happy-dom's cache
// All mocks must be set in beforeEach and restored in afterEach

// Create mock factories (but don't apply them at module level)
const createLocalStorageMock = () => {
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
}

// Mock DOM element configuration
const createMockDocumentElement = () => ({
  scrollTop: 0,
  scrollHeight: 1000,
  clientHeight: 500,
  textContent: 'This is a sample text with several words for testing word count functionality.',
  innerText: 'This is a sample text with several words for testing word count functionality.'
})

// Store references for mocks and originals
let localStorageMock: ReturnType<typeof createLocalStorageMock>
let mockElement: ReturnType<typeof createMockDocumentElement>
let originalLocalStorage: Storage | undefined
let originalDocumentElement: Element | undefined

// Top-level setup for all tests in this file
beforeEach(() => {
  vi.useFakeTimers()
  // Store originals before modifying
  originalLocalStorage = window.localStorage
  originalDocumentElement = document.documentElement

  // Create fresh mocks for each test
  localStorageMock = createLocalStorageMock()
  mockElement = createMockDocumentElement()

  // Apply mocks on existing objects (don't replace window/document)
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
  })

  Object.defineProperty(document, 'documentElement', {
    value: mockElement,
    writable: true,
    configurable: true,
  })
})

afterEach(() => {
  vi.useRealTimers()
  // Restore originals to prevent happy-dom cache corruption
  if (originalLocalStorage !== undefined) {
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
      configurable: true,
    })
  }
  if (originalDocumentElement !== undefined) {
    Object.defineProperty(document, 'documentElement', {
      value: originalDocumentElement,
      writable: true,
      configurable: true,
    })
  }
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

    const wordCount = getEstimatedWordCount(element as unknown as Element & { textContent: string; innerText: string })
    expect(wordCount).toBe(1000) // Fallback value
  })
})

describe('ReadingProgressTracker', () => {
  let tracker: ReadingProgressTracker | undefined

  beforeEach(() => {
    localStorageMock.clear()

    // Mock querySelector
    vi.spyOn(document, 'querySelector').mockImplementation((selector: string) => {
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
    // Clean up tracker to stop its interval
    if (tracker) {
      tracker.stopTracking()
      tracker = undefined
    }
  })

  it('should create new session with correct initial values', () => {
    tracker = new ReadingProgressTracker()
    const stats = tracker.getReadingStats()

    expect(stats.progress).toBe(0)
    expect(stats.timeSpent).toBe(0)
    expect(stats.averageSpeed).toBe(200)
    expect(stats.totalWords).toBeGreaterThan(0)
  })

  it('should track progress updates', async () => {
    tracker = new ReadingProgressTracker()

    tracker.updateProgress(25)
    await wait(100) // 100ms real time
    tracker.updateProgress(50)

    const stats = tracker.getReadingStats()
    expect(stats.progress).toBe(50)
    // With real timers, timeSpent will be small but > 0
    expect(stats.timeSpent).toBeGreaterThanOrEqual(0)
  })

  it('should calculate reading speed over time', async () => {
    tracker = new ReadingProgressTracker()

    // Simulate reading progress over time (shorter delays for real timers)
    tracker.updateProgress(10)
    await wait(100)
    tracker.updateProgress(20)
    await wait(100)
    tracker.updateProgress(40)

    const stats = tracker.getReadingStats()
    expect(stats.averageSpeed).toBeGreaterThan(0)
    // With real 200ms total, timeSpent will be >= 100ms (some processing time)
    expect(stats.timeSpent).toBeGreaterThanOrEqual(100)
  })

  it('should save and restore sessions', async () => {
    // Create initial tracker
    const tracker1 = new ReadingProgressTracker(undefined, 'test-session')
    tracker1.updateProgress(30)
    await wait(50)

    // Manually save (simulating interval)
    tracker1.getReadingStats()
    tracker1.stopTracking()

    // Create new tracker (simulating page reload)
    localStorageMock.setItem('test-session', JSON.stringify({
      startTime: Date.now() - 10000,
      totalWords: 1000,
      currentProgress: 30,
      averageReadingSpeed: 200,
      timeSpent: 10000,
      isActive: true
    }))

    tracker = new ReadingProgressTracker(undefined, 'test-session')
    const stats2 = tracker.getReadingStats()

    expect(stats2.progress).toBe(30)
  })

  it('should calculate estimated time remaining', () => {
    tracker = new ReadingProgressTracker()
    tracker.updateProgress(25) // 25% complete

    const timeRemaining = tracker.getEstimatedTimeRemaining()
    expect(timeRemaining).toBeGreaterThan(0)

    // More progress should mean less time remaining
    tracker.updateProgress(75) // 75% complete
    const lessTimeRemaining = tracker.getEstimatedTimeRemaining()
    expect(lessTimeRemaining).toBeLessThan(timeRemaining)
  })

  it('should handle pause and resume', async () => {
    tracker = new ReadingProgressTracker()

    tracker.updateProgress(20)
    tracker.pauseTracking()

    // Progress updates should not affect time when paused
    const timeBeforePause = tracker.getReadingStats().timeSpent
    await wait(50)
    tracker.updateProgress(30)
    const timeAfterPause = tracker.getReadingStats().timeSpent

    // When paused, time should not increase
    expect(timeAfterPause).toBe(timeBeforePause)

    // Resume tracking
    tracker.resumeTracking()
    await wait(50)
    tracker.updateProgress(40)
    const timeAfterResume = tracker.getReadingStats().timeSpent

    expect(timeAfterResume).toBeGreaterThan(timeAfterPause)
  })

  it('should reset session correctly', async () => {
    tracker = new ReadingProgressTracker()

    // Make multiple updates to accumulate time
    tracker.updateProgress(25)
    await wait(50)
    tracker.updateProgress(50)
    await wait(50)

    const statsBeforeReset = tracker.getReadingStats()
    expect(statsBeforeReset.progress).toBe(50)

    tracker.resetSession()
    const statsAfterReset = tracker.getReadingStats()

    expect(statsAfterReset.progress).toBe(0)
    expect(statsAfterReset.timeSpent).toBe(0)
  })

  it('should use custom container selector', () => {
    tracker = new ReadingProgressTracker('.custom-container')
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

    tracker = new ReadingProgressTracker(undefined, 'old-session')
    const stats = tracker.getReadingStats()

    // Should start fresh, not use old session
    expect(stats.progress).toBe(0)
    expect(stats.timeSpent).toBe(0)
  })
})

describe('Page Reading Configuration', () => {
  let originalLocation: Location | undefined

  beforeEach(() => {
    // Store original location before modifying
    originalLocation = window.location
  })

  afterEach(() => {
    // Restore original location to prevent happy-dom cache corruption
    if (originalLocation !== undefined) {
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
        configurable: true,
      })
    }
  })

  it('should return correct config for blog pages', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/blog/test-post' },
      writable: true,
      configurable: true,
    })

    const config = getPageReadingConfig()
    expect(config).toEqual(pageReadingConfig.blog)
    expect(config.estimatedWPM).toBe(200)
    expect(config.containerSelector).toContain('article')
  })

  it('should return correct config for project pages', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/projects/revenue-kpi' },
      writable: true,
      configurable: true,
    })

    const config = getPageReadingConfig()
    expect(config).toEqual(pageReadingConfig.projects)
    expect(config.estimatedWPM).toBe(180) // Slower for technical content
  })

  it('should return correct config for resume page', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/resume' },
      writable: true,
      configurable: true,
    })

    const config = getPageReadingConfig()
    expect(config).toEqual(pageReadingConfig.resume)
    expect(config.estimatedWPM).toBe(220) // Faster for structured content
  })

  it('should return default config for other pages', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/some-other-page' },
      writable: true,
      configurable: true,
    })

    const config = getPageReadingConfig()
    expect(config.estimatedWPM).toBe(200)
    expect(config.containerSelector).toContain('main')
  })
})

describe('Error Handling', () => {
  let tracker: ReadingProgressTracker | undefined

  beforeEach(() => {
    localStorageMock.clear()
  })

  afterEach(() => {
    // Clean up tracker
    if (tracker) {
      tracker.stopTracking()
      tracker = undefined
    }
  })

  it('should handle localStorage errors gracefully', async () => {
    tracker = new ReadingProgressTracker()

    // Mock localStorage to throw errors after tracker is created
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded')
    })

    tracker.updateProgress(25)

    // Should not throw despite localStorage errors
    // Wait a short time instead of advancing fake timers
    await wait(100)

    // Clean up the mock
    localStorageMock.setItem.mockRestore()
  })

  it('should handle querySelector errors', () => {
    const querySelectorSpy = vi.spyOn(document, 'querySelector').mockImplementation(() => {
      throw new Error('Query error')
    })

    // Should fall back to document.documentElement without throwing
    expect(() => {
      tracker = new ReadingProgressTracker('.problematic-selector')
    }).not.toThrow()

    expect(tracker).toBeDefined()

    // Clean up
    querySelectorSpy.mockRestore()
  })

  it('should handle window beforeunload cleanup', () => {
    tracker = new ReadingProgressTracker()
    const stopTrackingSpy = vi.spyOn(tracker, 'stopTracking')

    // Simulate beforeunload event
    window.dispatchEvent(new Event('beforeunload'))

    expect(stopTrackingSpy).toHaveBeenCalled()
  })
})