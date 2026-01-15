'use client'

import { useEffect, useState } from 'react'
import { analyticsDataService } from '@/lib/data-service'
import { handleHookError } from '@/lib/error-handling'
import type { AllAnalyticsDataBundle } from '@/types/analytics'

export function useAnalyticsData() {
  const [data, setData] = useState<AllAnalyticsDataBundle | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
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
  }

  useEffect(() => {
    void fetchData()
  }, []) // Run only once on mount

  return {
    data,
    error,
    isLoading,
    refresh: fetchData,
  }
}
