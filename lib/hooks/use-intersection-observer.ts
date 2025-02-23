"use client"

import { useEffect, useState, type RefObject } from "react"

interface UseIntersectionObserverProps {
  elementRef: RefObject<Element>
  threshold?: number
  root?: Element | null
  rootMargin?: string
  freezeOnceVisible?: boolean
}

export function useIntersectionObserver({
  elementRef,
  threshold = 0,
  root = null,
  rootMargin = "0%",
  freezeOnceVisible = false,
}: UseIntersectionObserverProps): boolean {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = elementRef?.current
    const frozen = freezeOnceVisible && isVisible

    if (!element || frozen) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold,
        root,
        rootMargin,
      },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [elementRef, threshold, root, rootMargin, freezeOnceVisible, isVisible])

  return isVisible
}

