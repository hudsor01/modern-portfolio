'use client'

import { useSyncExternalStore } from 'react'

/**
 * Subscribe to scroll events
 */
function subscribe(callback: () => void): () => void {
  window.addEventListener('scroll', callback, { passive: true })
  return () => window.removeEventListener('scroll', callback)
}

/**
 * Get current scroll position
 */
function getSnapshot(): number {
  return window.scrollY
}

/**
 * Server snapshot - always 0
 */
function getServerSnapshot(): number {
  return 0
}

/**
 * Hook to track the vertical scroll position of the window
 * Uses useSyncExternalStore for tear-free reads
 */
export function useScrollPosition(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
