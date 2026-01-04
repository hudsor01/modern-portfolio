'use client'

import { useSyncExternalStore } from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * Subscribe to window resize for mobile detection
 */
function subscribe(callback: () => void): () => void {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

/**
 * Get current mobile state from window
 */
function getSnapshot(): boolean {
  return window.innerWidth < MOBILE_BREAKPOINT
}

/**
 * Server snapshot - assume desktop to avoid layout shift on mobile
 * Components should handle this gracefully
 */
function getServerSnapshot(): boolean {
  return false
}

/**
 * Hook to detect mobile viewport with proper SSR handling
 * Uses useSyncExternalStore for tear-free reads and consistent hydration
 */
export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
