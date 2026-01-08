'use client'

import { useCallback, useEffect, useState } from 'react'
import { analyticsDataService } from '@/lib/analytics/data-service'
import { handleHookError } from '@/lib/error-handling'
import type { AllAnalyticsDataBundle } from '@/types/analytics'

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
      handleHookError(
        err,
        { operation: 'fetchAnalyticsData', component: 'useAnalyticsData' },
        setError
      )
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
