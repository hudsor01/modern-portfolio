'use client'

import { useSyncExternalStore } from 'react'

/**
 * Subscribe to media query changes
 */
function subscribe(query: string, callback: () => void): () => void {
  const mediaQuery = window.matchMedia(query)
  mediaQuery.addEventListener('change', callback)
  return () => mediaQuery.removeEventListener('change', callback)
}

/**
 * Get current media query match state
 */
function getSnapshot(query: string): boolean {
  return window.matchMedia(query).matches
}

/**
 * Server snapshot always returns false to avoid hydration mismatch
 * Components should handle undefined/false state appropriately
 */
function getServerSnapshot(): boolean {
  return false
}

/**
 * Hook to track media query state with proper SSR handling
 * Uses useSyncExternalStore for tear-free reads
 */
export function useMediaQuery(query: string): boolean {
  const matches = useSyncExternalStore(
    (callback) => subscribe(query, callback),
    () => getSnapshot(query),
    () => getServerSnapshot()
  )

  return matches
}
