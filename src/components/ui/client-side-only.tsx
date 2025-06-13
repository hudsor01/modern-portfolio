'use client'

import { useState, useEffect, ReactNode } from 'react'

interface ClientSideOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * A wrapper component that ensures children are only rendered on the client side
 * to prevent hydration mismatches with animations and dynamic content
 */
export default function ClientSideOnly({ children, fallback }: ClientSideOnlyProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return fallback ? <>{fallback}</> : null
  }

  return <>{children}</>
}
