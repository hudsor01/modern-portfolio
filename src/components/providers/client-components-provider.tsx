'use client'

import React from 'react'
import { TanStackQueryProvider } from '@/components/providers/tanstack-query-provider'

/**
 * Client Components Provider
 * Wraps TanStack Query for data fetching
 */
export function ClientComponentsProvider({ children }: { children: React.ReactNode }) {
  return (
    <TanStackQueryProvider showDevtools={false} showPerformance={false}>
      {children}
    </TanStackQueryProvider>
  )
}
