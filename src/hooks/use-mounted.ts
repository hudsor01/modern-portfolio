'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to track component mount state
 * Useful for preventing hydration mismatch issues with themes
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}
