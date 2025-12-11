'use client'

import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <main className="min-h-screen animate-fade-in-up">
      {children}
    </main>
  )
}

export function SimplePageTransition({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-in-up">
      {children}
    </div>
  )
}
