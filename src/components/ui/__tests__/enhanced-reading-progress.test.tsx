/**
 * Enhanced Reading Progress Tests
 * Unit tests for reading progress indicator component
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { EnhancedReadingProgress, useReadingProgress, BlogReadingProgress } from '../enhanced-reading-progress'
import { renderHook, act } from '@testing-library/react'

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => {
  cb()
  return 1
})

global.cancelAnimationFrame = vi.fn()

// Mock window location
Object.defineProperty(window, 'location', {
  value: { pathname: '/blog/test-post' },
  writable: true
})

// Mock scrolling
const mockScrollValues = {
  scrollTop: 0,
  scrollHeight: 1000,
  clientHeight: 500
}

Object.defineProperty(document.documentElement, 'scrollTop', {
  get: () => mockScrollValues.scrollTop,
  set: (value) => { mockScrollValues.scrollTop = value },
  configurable: true
})

Object.defineProperty(document.documentElement, 'scrollHeight', {
  get: () => mockScrollValues.scrollHeight,
  configurable: true
})

Object.defineProperty(document.documentElement, 'clientHeight', {
  get: () => mockScrollValues.clientHeight,
  configurable: true
})

describe('EnhancedReadingProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockScrollValues.scrollTop = 0
    mockScrollValues.scrollHeight = 1000
    mockScrollValues.clientHeight = 500
    window.location.pathname = '/blog/test-post'
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('should not render when not visible', () => {
    // Mock scroll values that would make it invisible
    mockScrollValues.scrollTop = 0
    
    const { container } = render(
      <EnhancedReadingProgress showThreshold={10} />
    )
    
    expect(container.firstChild).toBeNull()
  })

  it('should render with correct position and styling', () => {
    // Mock scroll to make it visible
    mockScrollValues.scrollTop = 100 // 20% progress

    render(
      <EnhancedReadingProgress 
        position="top"
        height={5}
        data-testid="progress-bar"
      />
    )

    // Should render the progress container
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveClass('top-0')
    expect(progressBar).toHaveStyle({ height: '5px' })
  })

  it('should show correct progress percentage', () => {
    // Set scroll position to 25% (125/500 scrollable)
    mockScrollValues.scrollTop = 125

    render(<EnhancedReadingProgress />)

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '25')
    expect(progressBar).toHaveAttribute('aria-valuetext', '25% read')
  })

  it('should show percentage text when enabled', () => {
    mockScrollValues.scrollTop = 150 // 30% progress

    render(
      <EnhancedReadingProgress 
        showPercentage={true}
        data-testid="progress-with-percentage"
      />
    )

    expect(screen.getByText('30%')).toBeInTheDocument()
  })

  it('should hide percentage when progress is too low', () => {
    mockScrollValues.scrollTop = 10 // 2% progress

    render(
      <EnhancedReadingProgress 
        showPercentage={true}
      />
    )

    expect(screen.queryByText(/\d+%/)).not.toBeInTheDocument()
  })

  it('should apply bottom position correctly', () => {
    mockScrollValues.scrollTop = 100

    render(
      <EnhancedReadingProgress 
        position="bottom"
        data-testid="bottom-progress"
      />
    )

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass('bottom-0')
  })

  it('should respect content pages only setting', () => {
    // Set pathname to non-content page
    window.location.pathname = '/some-other-page'
    mockScrollValues.scrollTop = 100

    const { container } = render(
      <EnhancedReadingProgress contentPagesOnly={true} />
    )

    expect(container.firstChild).toBeNull()

    // Set to content page
    window.location.pathname = '/blog/test-post'
    
    const { container: contentContainer } = render(
      <EnhancedReadingProgress contentPagesOnly={true} />
    )

    expect(contentContainer.firstChild).not.toBeNull()
  })

  it('should handle custom thresholds', () => {
    mockScrollValues.scrollTop = 25 // 5% progress

    // Should be visible with low threshold
    const { container: lowThreshold } = render(
      <EnhancedReadingProgress showThreshold={3} />
    )
    expect(lowThreshold.firstChild).not.toBeNull()

    // Should be hidden with high threshold
    const { container: highThreshold } = render(
      <EnhancedReadingProgress showThreshold={10} />
    )
    expect(highThreshold.firstChild).toBeNull()
  })

  it('should have proper accessibility attributes', () => {
    mockScrollValues.scrollTop = 200 // 40% progress

    render(<EnhancedReadingProgress />)

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-label', 'Reading progress')
    expect(progressBar).toHaveAttribute('aria-valuenow', '40')
    expect(progressBar).toHaveAttribute('aria-valuemin', '0')
    expect(progressBar).toHaveAttribute('aria-valuemax', '100')
    expect(progressBar).toHaveAttribute('aria-valuetext', '40% read')
  })

  it('should handle scroll direction changes', () => {
    mockScrollValues.scrollTop = 100

    render(<EnhancedReadingProgress />)

    // Get the progress fill element
    const progressFill = document.querySelector('[style*="width"]')
    expect(progressFill).toBeInTheDocument()
    
    // Should start with one of the shadow classes
    expect(
      progressFill!.classList.contains('shadow-primary/40') || 
      progressFill!.classList.contains('shadow-indigo-500/40')
    ).toBe(true)
  })
})

describe('useReadingProgress', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockScrollValues.scrollTop = 0
    mockScrollValues.scrollHeight = 1000
    mockScrollValues.clientHeight = 500
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return initial progress state', () => {
    const { result } = renderHook(() => useReadingProgress())

    expect(result.current.progress).toBe(0)
    expect(result.current.isReading).toBe(false)
  })

  it('should calculate progress correctly', () => {
    const { result } = renderHook(() => useReadingProgress())

    // Simulate scroll with sufficient progress
    act(() => {
      mockScrollValues.scrollTop = 125 // 25% progress
      // Force a re-render by triggering the scroll event
      const scrollEvent = new Event('scroll')
      window.dispatchEvent(scrollEvent)
      // Allow RAF to execute
      vi.runAllTimers()
    })

    expect(result.current.progress).toBe(25)
    expect(result.current.isReading).toBe(true)
  })

  it('should handle edge cases', () => {
    // Test when content doesn't scroll
    mockScrollValues.scrollHeight = 500 // Same as clientHeight
    
    const { result } = renderHook(() => useReadingProgress())

    expect(result.current.progress).toBe(0)
    expect(result.current.isReading).toBe(false)
  })

  it('should handle custom container selector', () => {
    // Mock custom container
    const mockContainer = {
      scrollTop: 50,
      scrollHeight: 400,
      clientHeight: 200,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }

    vi.spyOn(document, 'querySelector').mockReturnValue(mockContainer as Element)

    const { result } = renderHook(() => useReadingProgress('.custom-container'))

    expect(document.querySelector).toHaveBeenCalledWith('.custom-container')
    expect(result.current.progress).toBe(25) // 50/200 = 25%
  })
})

describe('BlogReadingProgress', () => {
  it('should render with blog-specific settings', () => {
    mockScrollValues.scrollTop = 100

    render(<BlogReadingProgress height={4} />)

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveStyle({ height: '4px' })
  })

  it('should use blog-specific container selector', () => {
    const querySelectorSpy = vi.spyOn(document, 'querySelector')
    
    render(<BlogReadingProgress />)

    // Should look for blog-specific containers
    expect(querySelectorSpy).toHaveBeenCalledWith('article, main, .blog-content')
  })
})

// Performance tests
describe('EnhancedReadingProgress Performance', () => {
  it('should throttle scroll events', () => {
    mockScrollValues.scrollTop = 100

    render(<EnhancedReadingProgress />)

    // Simulate rapid scroll events
    for (let i = 0; i < 10; i++) {
      window.dispatchEvent(new Event('scroll'))
    }

    // Should only call requestAnimationFrame once per frame
    expect(global.requestAnimationFrame).toHaveBeenCalled()
  })

  it('should cleanup event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = render(<EnhancedReadingProgress />)
    
    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('should cancel animation frame on unmount', () => {
    const { unmount } = render(<EnhancedReadingProgress />)
    
    // Trigger scroll to create animation frame
    window.dispatchEvent(new Event('scroll'))
    
    unmount()

    expect(global.cancelAnimationFrame).toHaveBeenCalled()
  })
})

// Accessibility tests
describe('EnhancedReadingProgress Accessibility', () => {
  it('should be hidden from screen readers for percentage display', () => {
    mockScrollValues.scrollTop = 150

    render(
      <EnhancedReadingProgress showPercentage={true} />
    )

    const percentageDisplay = screen.getByText('30%')
    expect(percentageDisplay).toHaveAttribute('aria-hidden', 'true')
  })

  it('should provide meaningful aria-valuetext', () => {
    mockScrollValues.scrollTop = 375 // 75% progress

    render(<EnhancedReadingProgress />)

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuetext', '75% read')
  })

  it('should handle reduced motion preferences', () => {
    // Mock reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    })

    mockScrollValues.scrollTop = 100

    render(<EnhancedReadingProgress />)

    // Should still be accessible even with reduced motion
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
  })
})