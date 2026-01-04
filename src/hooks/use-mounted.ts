'use client'

import { useSyncExternalStore } from 'react'

/**
 * Hook to track component mount state using useSyncExternalStore
 * This avoids hydration mismatch by using proper server/client snapshots
 *
 * Useful for:
 * - Preventing hydration mismatch with theme-dependent rendering
 * - Delaying client-only features until after hydration
 * - Entry animations that should only run on client
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {}, // No-op subscribe - mount state doesn't change
    () => true, // Client snapshot: always mounted
    () => false // Server snapshot: never mounted
  )
}
