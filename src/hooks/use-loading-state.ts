'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { TIMING } from '@/lib/constants/spacing'

/**
 * Safe loading state hook with automatic cleanup
 * Prevents memory leaks from setTimeout on unmount
 */
export function useLoadingState(initialDelay = TIMING.LOADING_STATE_RESET) {
  const [isLoading, setIsLoading] = useState(true)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Initial loading state reset
  useEffect(() => {
    timeoutRef.current = setTimeout(() => setIsLoading(false), initialDelay)
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [initialDelay])

  // Safe refresh function with cleanup
  const handleRefresh = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsLoading(true)
    timeoutRef.current = setTimeout(() => setIsLoading(false), initialDelay)
  }, [initialDelay])

  return { isLoading, handleRefresh, setIsLoading }
}
