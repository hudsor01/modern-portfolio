'use client'

import React from 'react'
import { TanStackQueryProvider } from '@/components/providers/tanstack-query-provider'
import { WebVitals } from '@/components/providers/web-vitals'

/**
 * ULTIMATE Client Components Provider
 * Uses the maximized TanStack Query implementation
 */
export function ClientComponentsProvider({ children }: { children: React.ReactNode }) {
  return (
    <TanStackQueryProvider showDevtools={true} showPerformance={true}>
      {children}
      <WebVitals />
    </TanStackQueryProvider>
  )
}
