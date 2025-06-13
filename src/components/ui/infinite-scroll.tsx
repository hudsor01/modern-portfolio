'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useInView } from 'react-intersection-observer'
import { LoadingSpinner } from '@/components/ui/spinner'

interface InfiniteScrollProps {
  children: ReactNode
  loadMoreAction: () => Promise<void>
  hasMore: boolean
  isLoading: boolean
}

export function InfiniteScroll({ children, loadMoreAction, hasMore, isLoading }: InfiniteScrollProps) {
  const loadMoreRef = useRef(loadMoreAction)
  const { ref, inView } = useInView({
    threshold: 0.5,
  })

  useEffect(() => {
    loadMoreRef.current = loadMoreAction
  }, [loadMoreAction])

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMoreRef.current()
    }
  }, [inView, hasMore, isLoading])

  return (
    <>
      {children}
      <div ref={ref} className="flex h-20 items-center justify-center">
        {isLoading && <LoadingSpinner />}
      </div>
    </>
  )
}
