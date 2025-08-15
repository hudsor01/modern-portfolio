/**
 * Rate Limit Indicator Component Tests
 * Tests for rate limiting UI components and user feedback
 */

import { render, screen, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { Provider } from 'jotai'
import {
  RateLimitIndicator,
  ContactRateLimitIndicator,
  GlobalRateLimitStatus,
  useRateLimitInfo,
  rateLimitInfoAtom,
  isRateLimitedAtom
} from '../rate-limit-indicator'
import { useAtom } from 'jotai'

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  AlertTriangle: ({ className }: any) => <div className={className} data-testid="alert-triangle" />,
  Clock: ({ className }: any) => <div className={className} data-testid="clock" />,
  Shield: ({ className }: any) => <div className={className} data-testid="shield" />,
  CheckCircle2: ({ className }: any) => <div className={className} data-testid="check-circle" />
}))

// Test wrapper with Jotai provider
function TestWrapper({ children, initialValues = [] }: { 
  children: React.ReactNode
  initialValues?: Array<[any, any]>
}) {
  return <Provider initialValues={initialValues}>{children}</Provider>
}

describe('RateLimitIndicator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Basic Rendering', () => {
    it('should not render when no rate limit info and showWhenOk is false', () => {
      render(
        <TestWrapper>
          <RateLimitIndicator />
        </TestWrapper>
      )

      expect(screen.queryByTestId('alert-triangle')).not.toBeInTheDocument()
      expect(screen.queryByTestId('clock')).not.toBeInTheDocument()
      expect(screen.queryByTestId('shield')).not.toBeInTheDocument()
    })

    it('should render shield icon when showWhenOk is true and not rate limited', () => {
      const rateLimitInfo = {
        remaining: 8,
        limit: 10,
        resetTime: Date.now() + 60000
      }

      render(
        <TestWrapper 
          initialValues={[
            [rateLimitInfoAtom, rateLimitInfo],
            [isRateLimitedAtom, false]
          ]}
        >
          <RateLimitIndicator showWhenOk={true} />
        </TestWrapper>
      )

      expect(screen.getByTestId('shield')).toBeInTheDocument()
    })

    it('should render clock icon when remaining requests are low', () => {
      const rateLimitInfo = {
        remaining: 1,
        limit: 10,
        resetTime: Date.now() + 60000
      }

      render(
        <TestWrapper 
          initialValues={[
            [rateLimitInfoAtom, rateLimitInfo],
            [isRateLimitedAtom, false]
          ]}
        >
          <RateLimitIndicator showWhenOk={true} />
        </TestWrapper>
      )

      expect(screen.getByTestId('clock')).toBeInTheDocument()
    })

    it('should render alert icon when blocked', () => {
      const rateLimitInfo = {
        remaining: 0,
        limit: 3,
        blocked: true,
        retryAfter: Date.now() + 300000 // 5 minutes
      }

      render(
        <TestWrapper 
          initialValues={[
            [rateLimitInfoAtom, rateLimitInfo],
            [isRateLimitedAtom, true]
          ]}
        >
          <RateLimitIndicator />
        </TestWrapper>
      )

      expect(screen.getByTestId('alert-triangle')).toBeInTheDocument()
    })
  })

  describe('Variants', () => {
    it('should render minimal variant correctly', () => {
      const rateLimitInfo = {
        remaining: 2,
        limit: 3,
        resetTime: Date.now() + 60000
      }

      render(
        <TestWrapper 
          initialValues={[
            [rateLimitInfoAtom, rateLimitInfo],
            [isRateLimitedAtom, false]
          ]}
        >
          <RateLimitIndicator variant="minimal" />
        </TestWrapper>
      )

      expect(screen.getByText('2/3')).toBeInTheDocument()
    })

    it('should render detailed variant with progress bar', () => {
      const rateLimitInfo = {
        remaining: 5,
        limit: 10,
        resetTime: Date.now() + 60000
      }

      render(
        <TestWrapper 
          initialValues={[
            [rateLimitInfoAtom, rateLimitInfo],
            [isRateLimitedAtom, false]
          ]}
        >
          <RateLimitIndicator variant="detailed" showWhenOk={true} />
        </TestWrapper>
      )

      expect(screen.getByText('5/10 requests remaining')).toBeInTheDocument()
      expect(screen.getByText('5/10')).toBeInTheDocument() // In details section
      expect(screen.getByText('10 requests')).toBeInTheDocument()
    })

    it('should not render warning variant when conditions are good', () => {
      const rateLimitInfo = {
        remaining: 8,
        limit: 10,
        resetTime: Date.now() + 60000
      }

      const { container } = render(
        <TestWrapper 
          initialValues={[
            [rateLimitInfoAtom, rateLimitInfo],
            [isRateLimitedAtom, false]
          ]}
        >
          <RateLimitIndicator variant="warning" />
        </TestWrapper>
      )

      expect(container.firstChild).toBeNull()
    })
  })

  describe('Time Formatting and Countdown', () => {
    it('should format time correctly', () => {
      const rateLimitInfo = {
        remaining: 0,
        limit: 3,
        blocked: true,
        retryAfter: Date.now() + (5 * 60 + 30) * 1000 // 5 minutes 30 seconds
      }

      render(
        <TestWrapper 
          initialValues={[
            [rateLimitInfoAtom, rateLimitInfo],
            [isRateLimitedAtom, true]
          ]}
        >
          <RateLimitIndicator variant="detailed" />
        </TestWrapper>
      )

      expect(screen.getByText(/Blocked for 5m 30s/)).toBeInTheDocument()
    })

    it('should format hours correctly', () => {
      const rateLimitInfo = {
        remaining: 0,
        limit: 3,
        resetTime: Date.now() + (2 * 60 * 60 + 15 * 60) * 1000 // 2 hours 15 minutes
      }

      render(
        <TestWrapper 
          initialValues={[
            [rateLimitInfoAtom, rateLimitInfo],
            [isRateLimitedAtom, true]
          ]}
        >
          <RateLimitIndicator variant="detailed" />
        </TestWrapper>
      )

      expect(screen.getByText(/resets in 2h 15m/)).toBeInTheDocument()
    })

    it('should update countdown timer', async () => {
      const rateLimitInfo = {
        remaining: 0,
        limit: 3,
        blocked: true,
        retryAfter: Date.now() + 61000 // 1 minute 1 second
      }

      render(
        <TestWrapper 
          initialValues={[
            [rateLimitInfoAtom, rateLimitInfo],
            [isRateLimitedAtom, true]
          ]}
        >
          <RateLimitIndicator variant="detailed" />
        </TestWrapper>
      )

      expect(screen.getByText(/Blocked for 1m 1s/)).toBeInTheDocument()

      // Advance time by 1 second
      act(() => {
        vi.advanceTimersByTime(1000)
      })

      await waitFor(() => {
        expect(screen.getByText(/Blocked for 1m 0s/)).toBeInTheDocument()
      })
    })
  })

  describe('Status Messages', () => {
    it('should show correct message when blocked', () => {
      const rateLimitInfo = {
        remaining: 0,
        limit: 3,
        blocked: true,
        retryAfter: Date.now() + 60000
      }

      render(
        <TestWrapper 
          initialValues={[
            [rateLimitInfoAtom, rateLimitInfo],
            [isRateLimitedAtom, true]
          ]}
        >
          <RateLimitIndicator />
        </TestWrapper>
      )

      expect(screen.getByText(/Blocked for/)).toBeInTheDocument()
    })

    it('should show correct message when rate limited but not blocked', () => {
      const rateLimitInfo = {
        remaining: 0,
        limit: 3,
        resetTime: Date.now() + 60000
      }

      render(
        <TestWrapper 
          initialValues={[
            [rateLimitInfoAtom, rateLimitInfo],
            [isRateLimitedAtom, true]
          ]}
        >
          <RateLimitIndicator />
        </TestWrapper>
      )

      expect(screen.getByText(/No requests left/)).toBeInTheDocument()
    })

    it('should show remaining requests when not at limit', () => {
      const rateLimitInfo = {
        remaining: 5,
        limit: 10,
        resetTime: Date.now() + 60000
      }

      render(
        <TestWrapper 
          initialValues={[
            [rateLimitInfoAtom, rateLimitInfo],
            [isRateLimitedAtom, false]
          ]}
        >
          <RateLimitIndicator showWhenOk={true} />
        </TestWrapper>
      )

      expect(screen.getByText('5/10 requests remaining')).toBeInTheDocument()
    })
  })

  describe('Progress Bar', () => {
    it('should show correct progress bar color for good status', () => {
      const rateLimitInfo = {
        remaining: 8,
        limit: 10,
        resetTime: Date.now() + 60000
      }

      const { container } = render(
        <TestWrapper 
          initialValues={[
            [rateLimitInfoAtom, rateLimitInfo],
            [isRateLimitedAtom, false]
          ]}
        >
          <RateLimitIndicator variant="detailed" showWhenOk={true} />
        </TestWrapper>
      )

      // 80% remaining should show green
      const progressBar = container.querySelector('[style*="width: 80%"]')
      expect(progressBar).toHaveClass('bg-green-500')
    })

    it('should show correct progress bar color for warning status', () => {
      const rateLimitInfo = {
        remaining: 3,
        limit: 10,
        resetTime: Date.now() + 60000
      }

      const { container } = render(
        <TestWrapper 
          initialValues={[
            [rateLimitInfoAtom, rateLimitInfo],
            [isRateLimitedAtom, false]
          ]}
        >
          <RateLimitIndicator variant="detailed" showWhenOk={true} />
        </TestWrapper>
      )

      // 30% remaining should show yellow
      const progressBar = container.querySelector('[style*="width: 30%"]')
      expect(progressBar).toHaveClass('bg-yellow-500')
    })

    it('should show correct progress bar color for critical status', () => {
      const rateLimitInfo = {
        remaining: 1,
        limit: 10,
        resetTime: Date.now() + 60000
      }

      const { container } = render(
        <TestWrapper 
          initialValues={[
            [rateLimitInfoAtom, rateLimitInfo],
            [isRateLimitedAtom, false]
          ]}
        >
          <RateLimitIndicator variant="detailed" showWhenOk={true} />
        </TestWrapper>
      )

      // 10% remaining should show red
      const progressBar = container.querySelector('[style*="width: 10%"]')
      expect(progressBar).toHaveClass('bg-red-500')
    })
  })

  describe('Positioning', () => {
    it('should apply floating position classes', () => {
      const rateLimitInfo = {
        remaining: 1,
        limit: 3,
        resetTime: Date.now() + 60000
      }

      render(
        <TestWrapper 
          initialValues={[
            [rateLimitInfoAtom, rateLimitInfo],
            [isRateLimitedAtom, false]
          ]}
        >
          <RateLimitIndicator position="floating" />
        </TestWrapper>
      )

      const element = screen.getByTestId('clock').closest('div')
      expect(element).toHaveClass('fixed', 'bottom-4', 'right-4')
    })

    it('should not apply floating classes for inline position', () => {
      const rateLimitInfo = {
        remaining: 1,
        limit: 3,
        resetTime: Date.now() + 60000
      }

      render(
        <TestWrapper 
          initialValues={[
            [rateLimitInfoAtom, rateLimitInfo],
            [isRateLimitedAtom, false]
          ]}
        >
          <RateLimitIndicator position="inline" />
        </TestWrapper>
      )

      const element = screen.getByTestId('clock').closest('div')
      expect(element).not.toHaveClass('fixed')
    })
  })
})

describe('ContactRateLimitIndicator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not render when not blocked and remaining > 1', () => {
    const rateLimitInfo = {
      remaining: 2,
      limit: 3,
      resetTime: Date.now() + 60000
    }

    const { container } = render(
      <TestWrapper 
        initialValues={[
          [rateLimitInfoAtom, rateLimitInfo],
          [isRateLimitedAtom, false]
        ]}
      >
        <ContactRateLimitIndicator />
      </TestWrapper>
    )

    expect(container.firstChild).toBeNull()
  })

  it('should render when remaining is 1', () => {
    const rateLimitInfo = {
      remaining: 1,
      limit: 3,
      resetTime: Date.now() + 60000
    }

    render(
      <TestWrapper 
        initialValues={[
          [rateLimitInfoAtom, rateLimitInfo],
          [isRateLimitedAtom, false]
        ]}
      >
        <ContactRateLimitIndicator />
      </TestWrapper>
    )

    expect(screen.getByText('Rate limit notice')).toBeInTheDocument()
    expect(screen.getByText(/You have 1 contact form submission remaining/)).toBeInTheDocument()
  })

  it('should render when blocked', () => {
    const rateLimitInfo = {
      remaining: 0,
      limit: 3,
      blocked: true,
      retryAfter: Date.now() + 300000
    }

    render(
      <TestWrapper 
        initialValues={[
          [rateLimitInfoAtom, rateLimitInfo],
          [isRateLimitedAtom, true]
        ]}
      >
        <ContactRateLimitIndicator />
      </TestWrapper>
    )

    expect(screen.getByText('Rate limit notice')).toBeInTheDocument()
    expect(screen.getByText(/Contact form temporarily blocked/)).toBeInTheDocument()
  })

  it('should show reset time', () => {
    const resetTime = Date.now() + 3600000 // 1 hour from now
    const rateLimitInfo = {
      remaining: 1,
      limit: 3,
      resetTime
    }

    render(
      <TestWrapper 
        initialValues={[
          [rateLimitInfoAtom, rateLimitInfo],
          [isRateLimitedAtom, false]
        ]}
      >
        <ContactRateLimitIndicator />
      </TestWrapper>
    )

    expect(screen.getByText(/Limit resets at/)).toBeInTheDocument()
  })
})

describe('useRateLimitInfo Hook', () => {
  it('should update rate limit info from response headers', () => {
    let updateFunction: any
    let clearFunction: any

    function TestComponent() {
      const { updateRateLimitInfo, clearRateLimitInfo } = useRateLimitInfo()
      updateFunction = updateRateLimitInfo
      clearFunction = clearRateLimitInfo
      
      const [rateLimitInfo] = useAtom(rateLimitInfoAtom)
      const [isRateLimited] = useAtom(isRateLimitedAtom)

      return (
        <div>
          <span data-testid="remaining">{rateLimitInfo?.remaining || 'none'}</span>
          <span data-testid="limited">{isRateLimited ? 'true' : 'false'}</span>
        </div>
      )
    }

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    expect(screen.getByTestId('remaining')).toHaveTextContent('none')
    expect(screen.getByTestId('limited')).toHaveTextContent('false')

    // Mock response with rate limit headers
    const mockResponse = {
      headers: new Map([
        ['X-RateLimit-Remaining', '5'],
        ['X-RateLimit-Limit', '10'],
        ['X-RateLimit-Reset', (Date.now() + 60000).toString()],
        ['Retry-After', '60']
      ]),
      status: 200
    } as any

    mockResponse.headers.get = (key: string) => mockResponse.headers.get(key)

    act(() => {
      updateFunction(mockResponse, {
        rateLimitInfo: { blocked: false }
      })
    })

    expect(screen.getByTestId('remaining')).toHaveTextContent('5')
    expect(screen.getByTestId('limited')).toHaveTextContent('false')
  })

  it('should handle 429 status code', () => {
    let updateFunction: any

    function TestComponent() {
      const { updateRateLimitInfo } = useRateLimitInfo()
      updateFunction = updateRateLimitInfo
      
      const [isRateLimited] = useAtom(isRateLimitedAtom)

      return <span data-testid="limited">{isRateLimited ? 'true' : 'false'}</span>
    }

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    const mockResponse = {
      headers: new Map([
        ['X-RateLimit-Remaining', '0'],
        ['X-RateLimit-Limit', '3']
      ]),
      status: 429
    } as any

    mockResponse.headers.get = (key: string) => mockResponse.headers.get(key)

    act(() => {
      updateFunction(mockResponse)
    })

    expect(screen.getByTestId('limited')).toHaveTextContent('true')
  })

  it('should clear rate limit info', () => {
    let clearFunction: any

    function TestComponent() {
      const { clearRateLimitInfo } = useRateLimitInfo()
      clearFunction = clearRateLimitInfo
      
      const [rateLimitInfo] = useAtom(rateLimitInfoAtom)
      const [isRateLimited] = useAtom(isRateLimitedAtom)

      return (
        <div>
          <span data-testid="info">{rateLimitInfo ? 'present' : 'null'}</span>
          <span data-testid="limited">{isRateLimited ? 'true' : 'false'}</span>
        </div>
      )
    }

    render(
      <TestWrapper 
        initialValues={[
          [rateLimitInfoAtom, { remaining: 5, limit: 10 }],
          [isRateLimitedAtom, true]
        ]}
      >
        <TestComponent />
      </TestWrapper>
    )

    expect(screen.getByTestId('info')).toHaveTextContent('present')
    expect(screen.getByTestId('limited')).toHaveTextContent('true')

    act(() => {
      clearFunction()
    })

    expect(screen.getByTestId('info')).toHaveTextContent('null')
    expect(screen.getByTestId('limited')).toHaveTextContent('false')
  })
})