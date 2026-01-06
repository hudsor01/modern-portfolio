'use client'

import { useCallback, useEffect, useState } from 'react'
import { analyticsDataService, type AllAnalyticsDataBundle } from '@/lib/analytics/data-service'

export function useAnalyticsData() {
  const [data, setData] = useState<AllAnalyticsDataBundle | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await analyticsDataService.getAllAnalyticsData()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load analytics data'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  return {
    data,
    error,
    isLoading,
    refresh: fetchData,
  }
}
