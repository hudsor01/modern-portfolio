/**
 * Rate Limit Indicator Component
 * Shows rate limit status to users with visual feedback
 * Simplified version using React Context instead of Jotai
 */

'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { AlertTriangle, Clock, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface RateLimitInfo {
  remaining?: number
  resetTime?: number
  retryAfter?: number
  blocked?: boolean
  limit?: number
}

// Rate limit context
interface RateLimitContextType {
  rateLimitInfo: RateLimitInfo | null
  isRateLimited: boolean
  setRateLimitInfo: (info: RateLimitInfo | null) => void
  setIsRateLimited: (limited: boolean) => void
}

const RateLimitContext = createContext<RateLimitContextType | undefined>(undefined)

// Rate limit provider component
export function RateLimitProvider({ children }: { children: React.ReactNode }) {
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(null)
  const [isRateLimited, setIsRateLimited] = useState(false)

  return (
    <RateLimitContext.Provider value={{
      rateLimitInfo,
      isRateLimited,
      setRateLimitInfo,
      setIsRateLimited,
    }}>
      {children}
    </RateLimitContext.Provider>
  )
}

// Hook to use rate limit context
function useRateLimit() {
  const context = useContext(RateLimitContext)
  if (context === undefined) {
    throw new Error('useRateLimit must be used within a RateLimitProvider')
  }
  return context
}

interface RateLimitIndicatorProps {
  className?: string
  showWhenOk?: boolean
  variant?: 'minimal' | 'detailed' | 'warning'
  position?: 'inline' | 'floating'
}

/**
 * Rate limit indicator component
 */
export function RateLimitIndicator({
  className,
  showWhenOk = false,
  variant = 'minimal',
  position = 'inline',
}: RateLimitIndicatorProps) {
  const { rateLimitInfo, isRateLimited } = useRateLimit()
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

  // Update time remaining for blocked state
  useEffect(() => {
      if (!rateLimitInfo?.resetTime) {
        setTimeRemaining(null)
        return
      }

      const interval = setInterval(() => {
        const now = Date.now()
        const remaining = Math.max(0, rateLimitInfo.resetTime! - now)
        setTimeRemaining(remaining)

        if (remaining === 0) {
          setTimeRemaining(null)
        }
      }, 1000)

      return () => clearInterval(interval)
    }, [rateLimitInfo?.resetTime])

    // Don't show anything if not rate limited and showWhenOk is false
    if (!isRateLimited && !showWhenOk) {
      return null
    }

    const formatTime = (ms: number) => {
      const seconds = Math.ceil(ms / 1000)
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60

      if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`
      }
      return `${seconds}s`
    }

    const getStatusIcon = () => {
      if (isRateLimited) return AlertTriangle
      if (rateLimitInfo?.remaining !== undefined && rateLimitInfo.remaining < 2) return Clock
      return Shield
    }

    const getStatusColor = () => {
      if (isRateLimited) return 'text-red-500'
      if (rateLimitInfo?.remaining !== undefined && rateLimitInfo.remaining < 2) return 'text-yellow-500'
      return 'text-green-500'
    }

    const getStatusText = () => {
      if (isRateLimited) {
        if (timeRemaining) {
          return `Rate limited - try again in ${formatTime(timeRemaining)}`
        }
        return 'Rate limited - please wait'
      }

      if (rateLimitInfo?.remaining !== undefined) {
        if (rateLimitInfo.remaining === 0) {
          return 'No requests remaining'
        }
        return `${rateLimitInfo.remaining} requests remaining`
      }

      return 'Rate limit OK'
    }

    const StatusIcon = getStatusIcon()

    if (variant === 'minimal') {
      return (
        <div className={cn(
          'flex items-center gap-1 text-xs',
          getStatusColor(),
          position === 'floating' && 'fixed top-4 right-4 bg-background/80 backdrop-blur-sm border rounded-md px-2 py-1',
          className
        )}>
          <StatusIcon className="h-3 w-3" />
          <span>{rateLimitInfo?.remaining || 0}</span>
        </div>
      )
    }

    if (variant === 'warning' && !isRateLimited) {
      return null
    }

    return (
      <div className={cn(
        'flex items-center gap-2 text-sm',
        getStatusColor(),
        position === 'floating' && 'fixed top-4 right-4 bg-background/90 backdrop-blur-sm border rounded-lg px-3 py-2 shadow-lg',
        className
      )}>
        <StatusIcon className="h-4 w-4" />
        <span>{getStatusText()}</span>
      </div>
    )
}

/**
 * Hook to update rate limit status
 */
export function useUpdateRateLimit() {
  const { setRateLimitInfo, setIsRateLimited } = useRateLimit()

  const updateFromResponse = (response: Response) => {
      const remaining = response.headers.get('x-ratelimit-remaining')
      const resetTime = response.headers.get('x-ratelimit-reset')
      const retryAfter = response.headers.get('retry-after')

      const info: RateLimitInfo = {
        remaining: remaining ? parseInt(remaining, 10) : undefined,
        resetTime: resetTime ? parseInt(resetTime, 10) * 1000 : undefined,
        retryAfter: retryAfter ? parseInt(retryAfter, 10) * 1000 + Date.now() : undefined,
        blocked: response.status === 429,
        limit: response.headers.get('x-ratelimit-limit') ? parseInt(response.headers.get('x-ratelimit-limit')!, 10) : undefined,
      }

      setRateLimitInfo(info)
      setIsRateLimited(response.status === 429)
    }

    const updateFromError = (error: unknown) => {
      if (error && typeof error === 'object' && 'status' in error && error.status === 429) {
        setIsRateLimited(true)
      }
    }

    const reset = () => {
      setRateLimitInfo(null)
      setIsRateLimited(false)
    }

    return {
      updateFromResponse,
      updateFromError,
      reset,
    }
}

/**
 * Enhanced rate limit status component
 */
export function RateLimitStatus({
  className,
}: {
  className?: string
}) {
  const { rateLimitInfo } = useRateLimit()

  if (!rateLimitInfo) {
    return null
  }

  return (
    <div className={cn(
      'rounded-lg border p-4 bg-card',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium">Rate Limit Status</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {rateLimitInfo.remaining !== undefined && (
              <span>Remaining: {rateLimitInfo.remaining}</span>
            )}
            {rateLimitInfo.limit !== undefined && (
              <span>Limit: {rateLimitInfo.limit}</span>
            )}
          </div>
        </div>
        <Shield className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  )
}