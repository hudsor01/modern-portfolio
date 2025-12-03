'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function BlogPostSkeleton() {
  return (
    <div className="glass rounded-3xl overflow-hidden h-full">
      {/* Featured Image Skeleton */}
      <div className="relative aspect-video overflow-hidden bg-muted dark:bg-card">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content Skeleton */}
      <div className="p-6">
        {/* Tags Skeleton */}
        <div className="flex flex-wrap gap-1 mb-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-14" />
        </div>

        {/* Title Skeleton */}
        <Skeleton className="h-6 w-3/4 mb-3" />

        {/* Excerpt Skeleton */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Author and Meta Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}
