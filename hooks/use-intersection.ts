"use client"

import * as React from "react"

interface UseIntersectionOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

export function useIntersection(
  elementRef: React.RefObject<Element>,
  { threshold = 0, root = null, rootMargin = "0%", freezeOnceVisible = false }: UseIntersectionOptions,
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = React.useState<IntersectionObserverEntry>()

  const frozen = entry?.isIntersecting && freezeOnceVisible

  const updateEntry = React.useCallback(([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry)
  }, [])

  React.useEffect(() => {
    const node = elementRef?.current
    const hasIOSupport = !!window.IntersectionObserver

    if (!hasIOSupport || frozen || !node) return

    const observerParams = { threshold, root, rootMargin }
    const observer = new IntersectionObserver(updateEntry, observerParams)

    observer.observe(node)

    return () => observer.disconnect()
  }, [elementRef, threshold, root, rootMargin, frozen, updateEntry])

  return entry
}

