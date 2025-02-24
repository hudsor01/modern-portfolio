"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { useInView } from "react-intersection-observer"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface InfiniteScrollProps {
  children: ReactNode
  loadMore: () => Promise<void>
  hasMore: boolean
  isLoading: boolean
}

export function InfiniteScroll({ children, loadMore, hasMore, isLoading }: InfiniteScrollProps) {
  const loadMoreRef = useRef(loadMore)
  const { ref, inView } = useInView({
    threshold: 0.5,
  })

  useEffect(() => {
    loadMoreRef.current = loadMore
  }, [loadMore])

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMoreRef.current()
    }
  }, [inView, hasMore, isLoading])

  return (
    <>
      {children}
      <div ref={ref} className="h-20 flex items-center justify-center">
        {isLoading && <LoadingSpinner />}
      </div>
    </>
  )
}

