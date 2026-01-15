'use client'

import React from 'react'

/**
 * Client Components Provider
 * Placeholder for future client-side providers (e.g., theme, toast, etc.)
 * Currently just passes through children - no TanStack Query needed.
 */
export function ClientComponentsProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
