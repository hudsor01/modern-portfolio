'use client'

import { useEffect, useRef } from 'react'
import { handleUtilityError } from '@/lib/error-handling'
import type { PageAnalyticsOptions, ViewTrackingData } from '@/types/hooks'

const ANALYTICS_ENDPOINT = '/api/analytics/views'
const SCROLL_DEBOUNCE_MS = 100
const MAX_RETRIES = 2

function handleAnalyticsError(error: unknown, operation: string, metadata?: Record<string, unknown>) {
  handleUtilityError(
    error,
    { operation, component: 'PageAnalytics', metadata },
    'return-default'
  )
}

function getReferrer(): string | undefined {
  return typeof document === 'undefined' ? undefined : document.referrer || undefined
}

function getScrollPercent(): number {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  if (maxScroll <= 0) return 0
  return Math.round((window.scrollY / maxScroll) * 100)
}

function buildEngagementPayload(
  data: Omit<ViewTrackingData, 'referrer'> & { referrer?: string }
): ViewTrackingData {
  return {
    ...data,
    referrer: data.referrer ?? getReferrer(),
  }
}

function postAnalytics(payload: ViewTrackingData, keepalive = false) {
  return fetch(ANALYTICS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    keepalive,
  })
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
        const scrollPercent = getScrollPercent()

        if (scrollPercent > maxScrollRef.current) {
          maxScrollRef.current = Math.min(scrollPercent, 100)
        }
      }, SCROLL_DEBOUNCE_MS)
    }

    if (trackScrollDepth) {
      window.addEventListener('scroll', handleScroll, { passive: true })
    }

    // Track reading time and scroll depth on page unload
    const handleBeforeUnload = () => {
      if (startTimeRef.current || maxScrollRef.current > 0) {
        const readingTime = trackReadingTime
          ? Math.round((Date.now() - startTimeRef.current) / 1000)
          : undefined
        const scrollDepth = trackScrollDepth && maxScrollRef.current > 0
          ? maxScrollRef.current
          : undefined

        // Use sendBeacon for reliable tracking on page unload
        trackEngagement({
          type,
          slug,
          readingTime,
          scrollDepth,
          referrer: getReferrer(),
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
  try {
    const response = await postAnalytics(buildEngagementPayload(data))

    if (!response.ok) {
      handleAnalyticsError(
        new Error(`Failed to track page view: ${response.statusText}`),
        'trackPageView',
        { status: response.status, retryCount }
      )
    }
  } catch (error) {
    handleAnalyticsError(error, 'trackPageView', { retryCount })

    // Retry on network errors
    if (retryCount < MAX_RETRIES) {
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
    const payload = buildEngagementPayload(data)
    // Use sendBeacon for reliable tracking
    if (navigator.sendBeacon) {
      const payloadString = JSON.stringify(payload)
      navigator.sendBeacon(ANALYTICS_ENDPOINT, payloadString)
    } else {
      // Fallback to fetch with keepalive
      postAnalytics(payload, true).catch(() => {
        // Ignore errors on page unload - use standardized error handling for consistency
        handleAnalyticsError(
          new Error('Engagement tracking failed on page unload'),
          'trackEngagement'
        )
      })
    }
  } catch (error) {
    handleAnalyticsError(error, 'trackEngagement')
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
