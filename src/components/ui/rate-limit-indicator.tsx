/**
 * Rate Limit Indicator Component
 * Shows rate limit status to users with visual feedback
 */

'use client'

import { useState, useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { AlertTriangle, Clock, Shield, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface RateLimitInfo {
  remaining?: number
  resetTime?: number
  retryAfter?: number
  blocked?: boolean
  limit?: number
}

// Jotai atoms for rate limiting state
export const rateLimitInfoAtom = atom<RateLimitInfo | null>(null)
export const isRateLimitedAtom = atom(false)

interface RateLimitIndicatorProps {
  className?: string
  showWhenOk?: boolean
  variant?: 'minimal' | 'detailed' | 'warning'
  position?: 'inline' | 'floating'
}

export function RateLimitIndicator({
  className,
  showWhenOk = false,
  variant = 'minimal',
  position = 'inline'
}: RateLimitIndicatorProps) {
  const [rateLimitInfo] = useAtom(rateLimitInfoAtom)
  const [isRateLimited] = useAtom(isRateLimitedAtom)
  const [timeToReset, setTimeToReset] = useState<number | null>(null)
  const [timeToRetry, setTimeToRetry] = useState<number | null>(null)

  // Update countdown timers
  useEffect(() => {
    if (!rateLimitInfo) return

    const updateTimers = () => {
      const now = Date.now()
      
      if (rateLimitInfo.resetTime) {
        const resetMs = rateLimitInfo.resetTime - now
        setTimeToReset(resetMs > 0 ? resetMs : null)
      }
      
      if (rateLimitInfo.retryAfter) {
        const retryMs = rateLimitInfo.retryAfter - now
        setTimeToRetry(retryMs > 0 ? retryMs : null)
      }
    }

    updateTimers()
    const interval = setInterval(updateTimers, 1000)

    return () => clearInterval(interval)
  }, [rateLimitInfo])

  // Don't render if no rate limit info and not showing when OK
  if (!rateLimitInfo && !showWhenOk) return null

  // Don't render if not rate limited and not showing when OK
  if (!isRateLimited && !showWhenOk) return null

  const getRemainingPercentage = () => {
    if (!rateLimitInfo?.remaining || !rateLimitInfo?.limit) return 100
    return Math.round((rateLimitInfo.remaining / rateLimitInfo.limit) * 100)
  }

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  const getStatusIcon = () => {
    if (rateLimitInfo?.blocked || isRateLimited) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
    
    const remaining = getRemainingPercentage()
    if (remaining <= 20) {
      return <Clock className="h-4 w-4 text-yellow-500" />
    }
    
    return <Shield className="h-4 w-4 text-green-500" />
  }

  const getStatusColor = () => {
    if (rateLimitInfo?.blocked || isRateLimited) return 'border-red-200 bg-red-50 text-red-800'
    
    const remaining = getRemainingPercentage()
    if (remaining <= 20) return 'border-yellow-200 bg-yellow-50 text-yellow-800'
    
    return 'border-green-200 bg-green-50 text-green-800'
  }

  const getStatusMessage = () => {
    if (rateLimitInfo?.blocked) {
      return timeToRetry ? `Blocked for ${formatTime(timeToRetry)}` : 'Temporarily blocked'
    }
    
    if (isRateLimited) {
      return timeToReset ? `Rate limited - resets in ${formatTime(timeToReset)}` : 'Rate limited'
    }
    
    const remaining = rateLimitInfo?.remaining || 0
    const limit = rateLimitInfo?.limit || 0
    
    if (remaining === 0) {
      return timeToReset ? `No requests left - resets in ${formatTime(timeToReset)}` : 'No requests remaining'
    }
    
    return `${remaining}/${limit} requests remaining`
  }

  if (variant === 'minimal') {
    return (
      <div className={cn(
        'flex items-center gap-2 text-sm',
        position === 'floating' && 'fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border p-3',
        className
      )}>
        {getStatusIcon()}
        {(isRateLimited || rateLimitInfo?.blocked || (rateLimitInfo?.remaining || 0) <= 2) && (
          <span className="text-xs opacity-75">
            {rateLimitInfo?.remaining || 0}/{rateLimitInfo?.limit || 0}
          </span>
        )}
      </div>
    )
  }

  if (variant === 'warning' && !isRateLimited && !rateLimitInfo?.blocked && getRemainingPercentage() > 20) {
    return null
  }

  return (
    <div className={cn(
      'flex items-center gap-3 rounded-lg border p-3 text-sm',
      getStatusColor(),
      position === 'floating' && 'fixed bottom-4 right-4 shadow-lg',
      className
    )}>
      {getStatusIcon()}
      
      <div className="flex-1">
        <div className="font-medium">
          {getStatusMessage()}
        </div>
        
        {variant === 'detailed' && rateLimitInfo && (
          <div className="mt-1 space-y-1 text-xs opacity-75">
            {rateLimitInfo.resetTime && (
              <div className="flex justify-between">
                <span>Resets in:</span>
                <span>{timeToReset ? formatTime(timeToReset) : 'Soon'}</span>
              </div>
            )}
            
            {rateLimitInfo.retryAfter && (
              <div className="flex justify-between">
                <span>Retry after:</span>
                <span>{timeToRetry ? formatTime(timeToRetry) : 'Soon'}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span>Limit:</span>
              <span>{rateLimitInfo.limit || 'Unknown'} requests</span>
            </div>
          </div>
        )}
      </div>

      {variant === 'detailed' && rateLimitInfo?.remaining !== undefined && rateLimitInfo?.limit && (
        <div className="flex flex-col items-end gap-1">
          <div className="text-xs opacity-75">
            {rateLimitInfo.remaining}/{rateLimitInfo.limit}
          </div>
          <div className="w-16 h-2 bg-black/10 rounded-full overflow-hidden">
            <div 
              className={cn(
                'h-full transition-all duration-300',
                getRemainingPercentage() <= 20 ? 'bg-red-500' : 
                getRemainingPercentage() <= 50 ? 'bg-yellow-500' : 'bg-green-500'
              )}
              style={{ width: `${getRemainingPercentage()}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Hook to update rate limit info from API responses
 */
export function useRateLimitInfo() {
  const [, setRateLimitInfo] = useAtom(rateLimitInfoAtom)
  const [, setIsRateLimited] = useAtom(isRateLimitedAtom)

  const updateRateLimitInfo = (
    response: Response,
    responseData?: { rateLimitInfo?: RateLimitInfo }
  ) => {
    const remaining = response.headers.get('X-RateLimit-Remaining')
    const limit = response.headers.get('X-RateLimit-Limit')
    const reset = response.headers.get('X-RateLimit-Reset')
    const retryAfter = response.headers.get('Retry-After')

    const info: RateLimitInfo = {
      remaining: remaining ? parseInt(remaining) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      resetTime: reset ? parseInt(reset) : undefined,
      retryAfter: retryAfter ? Date.now() + (parseInt(retryAfter) * 1000) : undefined,
      blocked: response.status === 429,
      ...responseData?.rateLimitInfo
    }

    setRateLimitInfo(info)
    setIsRateLimited(response.status === 429)
  }

  const clearRateLimitInfo = () => {
    setRateLimitInfo(null)
    setIsRateLimited(false)
  }

  return {
    updateRateLimitInfo,
    clearRateLimitInfo
  }
}

/**
 * Global rate limit status display component
 */
export function GlobalRateLimitStatus() {
  return (
    <RateLimitIndicator
      variant="warning"
      position="floating"
      className="max-w-xs"
    />
  )
}

/**
 * Contact form specific rate limit indicator
 */
interface ContactRateLimitIndicatorProps {
  className?: string
}

export function ContactRateLimitIndicator({ className }: ContactRateLimitIndicatorProps) {
  const [rateLimitInfo] = useAtom(rateLimitInfoAtom)
  
  // Show for contact forms with lower thresholds
  const shouldShow = rateLimitInfo && (
    rateLimitInfo.blocked || 
    (rateLimitInfo.remaining !== undefined && rateLimitInfo.remaining <= 1)
  )

  if (!shouldShow) return null

  return (
    <div className={cn(
      'rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800',
      className
    )}>
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
        <div>
          <div className="font-medium">
            Rate limit notice
          </div>
          <div className="mt-1 text-xs">
            {rateLimitInfo.blocked 
              ? 'Contact form temporarily blocked due to excessive attempts.'
              : `You have ${rateLimitInfo.remaining} contact form submission${rateLimitInfo.remaining === 1 ? '' : 's'} remaining.`
            }
          </div>
          {rateLimitInfo.resetTime && (
            <div className="mt-1 text-xs opacity-75">
              Limit resets at {new Date(rateLimitInfo.resetTime).toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}