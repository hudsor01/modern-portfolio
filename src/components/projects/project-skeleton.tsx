'use client'

import React from 'react'

interface ProjectSkeletonProps {
  count?: number
}

export const ProjectSkeleton: React.FC<ProjectSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-7xl mx-auto">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden h-full flex flex-col animate-pulse"
        >
          <div className="p-8 flex-1 flex flex-col">
            {/* Inner Container for Content */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 mb-6 flex-1 flex flex-col">
              {/* Project Header Skeleton */}
              <div className="mb-6">
                <div className="h-8 bg-white/10 rounded mb-3 w-3/4"></div>
                <div className="h-6 bg-white/10 rounded mb-2 w-full"></div>
                <div className="h-6 bg-white/10 rounded w-4/5"></div>
              </div>

              {/* Metrics Skeleton */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="text-center p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <div className="w-6 h-6 bg-white/10 rounded mx-auto mb-3"></div>
                    <div className="h-6 bg-white/10 rounded mb-1 w-12 mx-auto"></div>
                    <div className="h-4 bg-white/10 rounded w-16 mx-auto"></div>
                  </div>
                ))}
              </div>

              {/* Client Info Skeleton */}
              <div className="h-6 bg-white/10 rounded mb-8 w-1/2 mx-auto"></div>

              {/* Spacer */}
              <div className="flex-1"></div>
            </div>

            {/* Image Skeleton */}
            <div className="h-32 bg-white/10 rounded-xl mb-6"></div>

            {/* CTA Skeleton */}
            <div className="flex-1 flex items-center justify-center min-h-[60px]">
              <div className="h-12 bg-white/10 rounded-xl w-48"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}