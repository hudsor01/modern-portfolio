/**
 * Rate Limit Indicator Component Tests
 * Tests for rate limiting UI components with React Context
 */

import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  RateLimitIndicator,
  RateLimitProvider,
  useUpdateRateLimit,
  RateLimitStatus,
  type RateLimitInfo
} from '../rate-limit-indicator'

// Mock Lucide icons
interface IconProps {
  className?: string
}

vi.mock('lucide-react', () => ({
  AlertTriangle: ({ className }: IconProps) => <div className={className} data-testid="alert-triangle" />,
  Clock: ({ className }: IconProps) => <div className={className} data-testid="clock" />,
  Shield: ({ className }: IconProps) => <div className={className} data-testid="shield" />,
}))

// Test wrapper with RateLimitProvider
function TestWrapper({ 
  children, 
  initialRateLimitInfo = null,
  initialIsRateLimited = false
}: { 
  children: React.ReactNode
  initialRateLimitInfo?: RateLimitInfo | null
  initialIsRateLimited?: boolean
}) {
  return (
    <RateLimitProvider>
      <TestUpdater 
        rateLimitInfo={initialRateLimitInfo}
        isRateLimited={initialIsRateLimited}
      />
      {children}
    </RateLimitProvider>
  )
}

// Helper component to update context values for testing
function TestUpdater({ 
  rateLimitInfo, 
  isRateLimited 
}: { 
  rateLimitInfo: RateLimitInfo | null
  isRateLimited: boolean 
}) {
  const { updateFromResponse } = useUpdateRateLimit()
  
  // Update context on mount if initial values provided
  React.useEffect(() => {
    if (rateLimitInfo || isRateLimited) {
      const mockResponse = {
        status: isRateLimited ? 429 : 200,
        headers: {
          get: (key: string) => {
            switch (key) {
              case 'x-ratelimit-remaining':
                return rateLimitInfo?.remaining?.toString()
              case 'x-ratelimit-limit':
                return rateLimitInfo?.limit?.toString()
              case 'x-ratelimit-reset':
                return rateLimitInfo?.resetTime ? (rateLimitInfo.resetTime / 1000).toString() : undefined
              case 'retry-after':
                return rateLimitInfo?.retryAfter ? ((rateLimitInfo.retryAfter - Date.now()) / 1000).toString() : undefined
              default:
                return null
            }
          }
        }
      } as Response
      
      updateFromResponse(mockResponse)
    }
  }, [rateLimitInfo, isRateLimited, updateFromResponse])
  
  return null
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
        <TestWrapper initialRateLimitInfo={rateLimitInfo}>
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
        <TestWrapper initialRateLimitInfo={rateLimitInfo}>
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
          initialRateLimitInfo={rateLimitInfo}
          initialIsRateLimited={true}
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
        <TestWrapper initialRateLimitInfo={rateLimitInfo}>
          <RateLimitIndicator variant="minimal" />
        </TestWrapper>
      )

      expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('should not render warning variant when conditions are good', () => {
      const rateLimitInfo = {
        remaining: 8,
        limit: 10,
        resetTime: Date.now() + 60000
      }

      const { container } = render(
        <TestWrapper initialRateLimitInfo={rateLimitInfo}>
          <RateLimitIndicator variant="warning" />
        </TestWrapper>
      )

      expect(container.firstChild).toBeNull()
    })
  })

  describe('Time Formatting and Countdown', () => {
    it('should format time correctly', async () => {
      const rateLimitInfo = {
        remaining: 0,
        limit: 3,
        blocked: true,
        resetTime: Date.now() + (5 * 60 + 30) * 1000 // 5 minutes 30 seconds
      }

      render(
        <TestWrapper 
          initialRateLimitInfo={rateLimitInfo}
          initialIsRateLimited={true}
        >
          <RateLimitIndicator />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/5m 30s/)).toBeInTheDocument()
      })
    })

    it('should update countdown timer', async () => {
      const rateLimitInfo = {
        remaining: 0,
        limit: 3,
        blocked: true,
        resetTime: Date.now() + 61000 // 1 minute 1 second
      }

      render(
        <TestWrapper 
          initialRateLimitInfo={rateLimitInfo}
          initialIsRateLimited={true}
        >
          <RateLimitIndicator />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/1m 1s/)).toBeInTheDocument()
      })

      // Advance time by 1 second
      act(() => {
        vi.advanceTimersByTime(1000)
      })

      await waitFor(() => {
        expect(screen.getByText(/1m 0s/)).toBeInTheDocument()
      })
    })
  })

  describe('Status Messages', () => {
    it('should show correct message when blocked', async () => {
      const rateLimitInfo = {
        remaining: 0,
        limit: 3,
        blocked: true,
        resetTime: Date.now() + 60000
      }

      render(
        <TestWrapper 
          initialRateLimitInfo={rateLimitInfo}
          initialIsRateLimited={true}
        >
          <RateLimitIndicator />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/Rate limited - try again in/)).toBeInTheDocument()
      })
    })

    it('should show remaining requests when not at limit', async () => {
      const rateLimitInfo = {
        remaining: 5,
        limit: 10,
        resetTime: Date.now() + 60000
      }

      render(
        <TestWrapper initialRateLimitInfo={rateLimitInfo}>
          <RateLimitIndicator showWhenOk={true} />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('5 requests remaining')).toBeInTheDocument()
      })
    })
  })

  describe('Positioning', () => {
    it('should apply floating position classes', async () => {
      const rateLimitInfo = {
        remaining: 1,
        limit: 3,
        resetTime: Date.now() + 60000
      }

      render(
        <TestWrapper initialRateLimitInfo={rateLimitInfo}>
          <RateLimitIndicator position="floating" />
        </TestWrapper>
      )

      await waitFor(() => {
        const element = screen.getByTestId('clock').closest('div')
        expect(element).toHaveClass('fixed', 'top-4', 'right-4')
      })
    })
  })
})

describe('RateLimitStatus', () => {
  it('should not render when no rate limit info', () => {
    const { container } = render(
      <TestWrapper>
        <RateLimitStatus />
      </TestWrapper>
    )

    expect(container.firstChild).toBeNull()
  })

  it('should render rate limit status when info is available', async () => {
    const rateLimitInfo = {
      remaining: 5,
      limit: 10,
      resetTime: Date.now() + 60000
    }

    render(
      <TestWrapper initialRateLimitInfo={rateLimitInfo}>
        <RateLimitStatus />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Rate Limit Status')).toBeInTheDocument()
      expect(screen.getByText('Remaining: 5')).toBeInTheDocument()
      expect(screen.getByText('Limit: 10')).toBeInTheDocument()
    })
  })
})

describe('useUpdateRateLimit', () => {
  it('should update rate limit info from response headers', async () => {
    let updateFunction: ((response: Response) => void) | undefined

    function TestComponent() {
      const { updateFromResponse } = useUpdateRateLimit()
      updateFunction = updateFromResponse
      
      return <RateLimitIndicator showWhenOk />
    }

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    // Mock response with rate limit headers
    const mockResponse = {
      headers: {
        get: (key: string) => {
          switch (key) {
            case 'x-ratelimit-remaining': return '5'
            case 'x-ratelimit-limit': return '10'
            case 'x-ratelimit-reset': return ((Date.now() + 60000) / 1000).toString()
            default: return null
          }
        }
      },
      status: 200
    } as Response

    act(() => {
      updateFunction?.(mockResponse)
    })

    await waitFor(() => {
      expect(screen.getByText('5 requests remaining')).toBeInTheDocument()
    })
  })

  it('should handle 429 status code', async () => {
    let updateFunction: ((response: Response) => void) | undefined

    function TestComponent() {
      const { updateFromResponse } = useUpdateRateLimit()
      updateFunction = updateFromResponse
      
      return <RateLimitIndicator />
    }

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    const mockResponse = {
      headers: {
        get: (key: string) => {
          switch (key) {
            case 'x-ratelimit-remaining': return '0'
            case 'x-ratelimit-limit': return '3'
            default: return null
          }
        }
      },
      status: 429
    } as Response

    act(() => {
      updateFunction?.(mockResponse)
    })

    await waitFor(() => {
      expect(screen.getByTestId('alert-triangle')).toBeInTheDocument()
    })
  })
})