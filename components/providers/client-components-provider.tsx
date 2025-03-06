'use client'

import dynamic from 'next/dynamic'
import { ReactNode } from 'react'

// Dynamic imports with ssr: false settings
const ScrollIndicator = dynamic(() => import('@/components/scroll-indicator'), { 
  ssr: false 
})

const ScrollToTop = dynamic(() => import('@/components/scroll-to-top'), { 
  ssr: false 
})

export default function ClientComponentsProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollIndicator />
      <ScrollToTop />
      {children}
    </>
  )
}
