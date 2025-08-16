'use client'

import { useState, useEffect } from 'react'

/**
 * Hook to handle client-side only rendering
 * Prevents hydration mismatches for components that should only render on client
 * Eliminates duplicate mount pattern across 5+ components
 * 
 * @returns {boolean} Whether the component is mounted on client
 * 
 * @example
 * ```tsx
 * const isClient = useClientOnly()
 * 
 * if (!isClient) {
 *   return <Skeleton />
 * }
 * 
 * return <ClientOnlyComponent />
 * ```
 */
export function useClientOnly(): boolean {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted
}

/**
 * Hook with custom loading component
 * 
 * @param loader - Component to show while mounting
 * @returns {Object} Mount state and loader component
 * 
 * @example
 * ```tsx
 * const { isClient, Loader } = useClientOnlyWithLoader(() => <MyLoader />)
 * 
 * if (!isClient) {
 *   return <Loader />
 * }
 * ```
 */
export function useClientOnlyWithLoader(
  loader: () => React.ReactNode
): {
  isClient: boolean
  Loader: () => React.ReactNode
} {
  const isClient = useClientOnly()

  return {
    isClient,
    Loader: loader,
  }
}