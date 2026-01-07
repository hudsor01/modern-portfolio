'use client'

import { useEffect, useRef } from 'react'
import { handleUtilityError } from '@/lib/error-handling'

interface PageAnalyticsOptions {
  type: 'blog' | 'project'
  slug: string
  trackReadingTime?: boolean
  trackScrollDepth?: boolean
}

interface ViewTrackingData {
  type: string
  slug: string
  readingTime?: number
  scrollDepth?: number
  referrer?: string
}

/**
 * Hook to track page views and user engagement analytics
 * Automatically sends view tracking data to our analytics API
 */
export function usePageAnalytics({
  type,
  slug,
  trackReadingTime = true,
  trackScrollDepth = true,
}: PageAnalyticsOptions) {
  const startTimeRef = useRef<number>(Date.now())
  const maxScrollRef = useRef<number>(0)
  const trackedRef = useRef<boolean>(false)

  useEffect(() => {
    // Track page view immediately
    if (!trackedRef.current) {
      trackPageView({ type, slug })
      trackedRef.current = true
    }

    // Start reading time tracking
    if (trackReadingTime) {
      startTimeRef.current = Date.now()
    }

    // Set up scroll depth tracking
    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      if (!trackScrollDepth) return

      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        )

        if (scrollPercent > maxScrollRef.current) {
          maxScrollRef.current = Math.min(scrollPercent, 100)
        }
      }, 100)
    }

    if (trackScrollDepth) {
      window.addEventListener('scroll', handleScroll, { passive: true })
    }

    // Track reading time and scroll depth on page unload
    const handleBeforeUnload = () => {
      if (startTimeRef.current || maxScrollRef.current > 0) {
        const readingTime = startTimeRef.current
          ? Math.round((Date.now() - startTimeRef.current) / 1000)
          : undefined
        const scrollDepth = maxScrollRef.current > 0 ? maxScrollRef.current : undefined

        // Use sendBeacon for reliable tracking on page unload
        trackEngagement({
          type,
          slug,
          readingTime,
          scrollDepth,
          referrer: document.referrer,
        })
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      clearTimeout(scrollTimeout)
      if (trackScrollDepth) {
        window.removeEventListener('scroll', handleScroll)
      }
      window.removeEventListener('beforeunload', handleBeforeUnload)

      // Track final engagement metrics
      handleBeforeUnload()
    }
  }, [type, slug, trackReadingTime, trackScrollDepth])
}

/**
 * Track a page view with retry logic
 */
async function trackPageView(
  data: Omit<ViewTrackingData, 'readingTime' | 'scrollDepth'>,
  retryCount = 0
) {
  const maxRetries = 2

  try {
    const response = await fetch('/api/analytics/views', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        referrer: document.referrer,
      }),
    })

    if (!response.ok) {
      handleUtilityError(
        new Error(`Failed to track page view: ${response.statusText}`),
        {
          operation: 'trackPageView',
          component: 'PageAnalytics',
          metadata: { status: response.status, retryCount },
        },
        'return-default'
      )
    }
  } catch (error) {
    handleUtilityError(
      error,
      { operation: 'trackPageView', component: 'PageAnalytics', metadata: { retryCount } },
      'return-default'
    )

    // Retry on network errors
    if (retryCount < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, retryCount) * 100))
      return trackPageView(data, retryCount + 1)
    }
  }
}

/**
 * Track user engagement metrics
 */
function trackEngagement(data: ViewTrackingData) {
  try {
    // Use sendBeacon for reliable tracking
    if (navigator.sendBeacon) {
      const payload = JSON.stringify(data)
      navigator.sendBeacon('/api/analytics/views', payload)
    } else {
      // Fallback to fetch with keepalive
      fetch('/api/analytics/views', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        keepalive: true,
      }).catch(() => {
        // Ignore errors on page unload - use standardized error handling for consistency
        handleUtilityError(
          new Error('Engagement tracking failed on page unload'),
          { operation: 'trackEngagement', component: 'PageAnalytics' },
          'return-default'
        )
      })
    }
  } catch (error) {
    handleUtilityError(
      error,
      { operation: 'trackEngagement', component: 'PageAnalytics' },
      'return-default'
    )
  }
}

/**
 * Hook to get analytics data for a specific page
 */
export function usePageAnalyticsData(type: 'blog' | 'project', slug?: string) {
  const baseUrl =
    process.env.NODE_ENV === 'production' ? 'https://richardwhudsonjr.com' : 'http://localhost:3000'

  const params = new URLSearchParams({ type })
  if (slug) params.append('slug', slug)

  const url = `${baseUrl}/api/analytics/views?${params.toString()}`

  // This would typically use SWR or React Query for caching
  // For now, return the URL that can be fetched manually
  return { analyticsUrl: url }
}
