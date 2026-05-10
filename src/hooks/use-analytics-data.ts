'use client'

import { useCallback, useEffect, useState } from 'react'
import { analyticsDataService } from '@/lib/data-service/service'
import { handleHookError } from '@/lib/error-handling'
import type { AllAnalyticsDataBundle } from '@/types/analytics'

export function useAnalyticsData() {
  const [data, setData] = useState<AllAnalyticsDataBundle | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Memoize so the function identity is stable — without this, `useEffect`'s
  // `[fetchData]` dep would re-run on every render and fire an infinite loop
  // of network calls. (Pre-fix this hook re-fetched on every render.)
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
  }, [fetchData]) // Run only once on mount (fetchData identity is stable via useCallback)

  return {
    data,
    error,
    isLoading,
    refresh: fetchData,
  }
}
