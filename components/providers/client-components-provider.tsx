'use client'

import React, { useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { WebVitals } from '@/components/ui/web-vitals'
import { createQueryClient } from '@/lib/query-config'

export function ClientComponentsProvider({ children }: { children: React.ReactNode }) {
  // Use optimized query client configuration
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <WebVitals />
      {/* React Query Devtools - development only with production-ready configuration */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          position="bottom-right"
          toggleButtonProps={{
            style: {
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 99999,
            }
          }}
        />
      )}
    </QueryClientProvider>
  )
}
