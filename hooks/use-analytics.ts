"use client"

import { useEffect, useState } from "react"
import { useWebAnalytics } from "@vercel/analytics/react"

type AnalyticsData = {
  visitors: number
  pageViews: number
  avgSession: number
  bounceRate: number
  topPages: Array<{
    path: string
    views: number
    uniqueVisitors: number
  }>
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { trackEvent, trackPageView } = useWebAnalytics()

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch("/api/analytics")
        const analyticsData = await response.json()
        setData(analyticsData)
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
    // Refresh every 5 minutes
    const interval = setInterval(fetchAnalytics, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return { data, isLoading, trackEvent, trackPageView }
}

