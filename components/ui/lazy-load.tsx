'use client'

import React, { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface LazyLoadProps {
  children: React.ReactNode
  className?: string
  placeholder?: React.ReactNode
  threshold?: number // Visibility threshold (0-1)
  rootMargin?: string // Root margin (CSS-like string)
  once?: boolean // Whether to load only once
  fallback?: React.ReactNode // Fallback for no IntersectionObserver support
}

export function LazyLoad({
  children,
  className,
  placeholder,
  threshold = 0.1,
  rootMargin = '200px 0px',
  once = true,
  fallback,
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const supportsIntersectionObserver = typeof IntersectionObserver !== 'undefined'

  useEffect(() => {
    if (!supportsIntersectionObserver) {
      setIsVisible(true)
      return
    }

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            if (once) {
              observer.unobserve(element)
            }
          } else if (!once) {
            setIsVisible(false)
          }
        })
      },
      {
        root: null, // viewport
        rootMargin,
        threshold,
      }
    )

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [once, rootMargin, threshold, supportsIntersectionObserver])

  // If IntersectionObserver is not supported and fallback is provided
  if (!supportsIntersectionObserver && fallback) {
    return <>{fallback}</>
  }

  return (
    <div ref={ref} className={cn('min-h-[20px]', className)}>
      {isVisible
        ? children
        : placeholder || (
            <div className="w-full h-full min-h-[100px] bg-muted animate-pulse rounded-md" />
          )}
    </div>
  )
}

export const MemoizedLazyLoad = React.memo(LazyLoad)
