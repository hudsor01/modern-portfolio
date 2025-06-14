'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'

export function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV === 'production') {
      const body = JSON.stringify({
        id: metric.id,
        name: metric.name,
        value: metric.value,
        rating: getRating(metric.name, metric.value),
        delta: metric.delta || 0,
        navigationType: metric.navigationType || '',
      })

      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/vitals', body)
      } else {
        fetch('/api/analytics/vitals', {
          body,
          method: 'POST',
          keepalive: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }).catch(() => {
          // Silently fail in production
        })
      }
    }
  })

  return <VercelAnalytics />
}

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