'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'

/**
 * WebVitals Component
 *
 * Combines Vercel Analytics with Web Vitals reporting.
 * This component should be used in the app layout.
 */
export function WebVitals() {
  // Use Next.js built-in web vitals reporting
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Web Vital: ${metric.name}`, metric.value)
    }

    // In production, send to our API endpoint
    if (process.env.NODE_ENV === 'production') {
      const body = {
        id: metric.id,
        name: metric.name,
        value: metric.value,
        rating: getRating(metric.name, metric.value),
        delta: metric.delta || 0,
        navigationType: metric.navigationType || '',
      }

      // Use sendBeacon if available, otherwise use fetch
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/vitals', JSON.stringify(body))
      } else {
        fetch('/api/analytics/vitals', {
          body: JSON.stringify(body),
          method: 'POST',
          keepalive: true,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }
    }
  })

  // Include Vercel Analytics
  return <VercelAnalytics />
}

// Helper function to determine rating based on metric name and value
function getRating(name: string, value: number): string {
  switch (name) {
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor'
    case 'FID':
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor'
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor'
    case 'FCP':
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor'
    case 'TTFB':
      return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor'
    case 'INP':
      return value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor'
    default:
      return 'unknown'
  }
}
