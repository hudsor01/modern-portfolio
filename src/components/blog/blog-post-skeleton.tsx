'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface BlogPostSkeletonProps {
  variant?: 'default' | 'compact' | 'detailed' | 'hero'
  className?: string
  showImage?: boolean
  showCategory?: boolean
  showTags?: boolean
  showAuthor?: boolean
  showMetadata?: boolean
}

export function BlogPostSkeleton({
  variant = 'default',
  className,
  showImage = true,
  showCategory = true,
  showTags = true,
  showAuthor = true,
  showMetadata = true
}: BlogPostSkeletonProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, staggerChildren: 0.05 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  // Hero variant for featured posts
  if (variant === 'hero') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn('space-y-6', className)}
      >
        {showImage && (
          <motion.div variants={itemVariants}>
            <Skeleton className="aspect-video w-full rounded-2xl" />
          </motion.div>
        )}
        <motion.div variants={itemVariants} className="space-y-4">
          {showCategory && (
            <Skeleton className="h-6 w-24 rounded-full" />
          )}
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-3/4 rounded-lg" />
          <Skeleton className="h-6 w-full rounded" />
          <Skeleton className="h-6 w-2/3 rounded" />
        </motion.div>
        {showAuthor && (
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-3 w-32 rounded" />
            </div>
          </motion.div>
        )}
      </motion.div>
    )
  }

  // Compact variant for list view
  if (variant === 'compact') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className={cn('bg-white/5 backdrop-blur border border-white/10 rounded-3xl', className)}>
          <CardContent className="p-6">
            <div className="flex gap-4">
              {showImage && (
                <motion.div variants={itemVariants}>
                  <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
                </motion.div>
              )}
              <div className="flex-1 space-y-3">
                <motion.div variants={itemVariants} className="space-y-2">
                  {showCategory && showMetadata && (
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20 rounded-full" />
                      <Skeleton className="h-4 w-16 rounded" />
                    </div>
                  )}
                  <Skeleton className="h-6 w-full rounded" />
                  <Skeleton className="h-6 w-3/4 rounded" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-2/3 rounded mt-1" />
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-center gap-4">
                  {showAuthor && (
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-4 w-16 rounded" />
                    </div>
                  )}
                  {showMetadata && (
                    <Skeleton className="h-4 w-20 rounded" />
                  )}
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Detailed variant with more elements
  if (variant === 'detailed') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className={cn('bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden', className)}>
          <CardHeader className="p-0">
            {showImage && (
              <motion.div variants={itemVariants}>
                <Skeleton className="aspect-video w-full rounded-t-3xl" />
                <div className="absolute top-4 left-4">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="absolute top-4 right-4">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </motion.div>
            )}
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <motion.div variants={itemVariants} className="space-y-3">
              {showCategory && showMetadata && (
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-4 w-20 rounded" />
                </div>
              )}
              <Skeleton className="h-7 w-full rounded" />
              <Skeleton className="h-7 w-4/5 rounded" />
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
            </motion.div>

            {showTags && (
              <motion.div variants={itemVariants} className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="flex items-center gap-4">
              {showAuthor && (
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20 rounded" />
                    <Skeleton className="h-3 w-16 rounded" />
                  </div>
                </div>
              )}
              {showMetadata && (
                <div className="flex items-center gap-3 ml-auto">
                  <Skeleton className="h-4 w-12 rounded" />
                  <Skeleton className="h-4 w-16 rounded" />
                </div>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Default variant
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className={cn('bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden', className)}>
        <CardHeader className="p-0">
          {showImage && (
            <motion.div variants={itemVariants} className="relative">
              <Skeleton className="aspect-video w-full rounded-t-3xl" />
              {showCategory && (
                <div className="absolute top-3 right-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              )}
            </motion.div>
          )}
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {/* Category & Date */}
          {showCategory && showMetadata && (
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-16 rounded" />
            </motion.div>
          )}

          {/* Title */}
          <motion.div variants={itemVariants} className="space-y-2">
            <Skeleton className="h-6 w-full rounded" />
            <Skeleton className="h-6 w-3/4 rounded" />
          </motion.div>

          {/* Excerpt */}
          <motion.div variants={itemVariants} className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </motion.div>

          {/* Tags */}
          {showTags && (
            <motion.div variants={itemVariants} className="flex gap-2">
              <Skeleton className="h-5 w-12 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-10 rounded-full" />
            </motion.div>
          )}

          {/* Reading Time */}
          {showMetadata && (
            <motion.div variants={itemVariants}>
              <Skeleton className="h-4 w-20 rounded" />
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Skeleton for blog post detail page
export function BlogPostDetailSkeleton({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('max-w-4xl mx-auto space-y-8', className)}
    >
      {/* Featured Image */}
      <Skeleton className="aspect-video w-full rounded-2xl" />
      
      {/* Title */}
      <div className="space-y-4">
        <Skeleton className="h-12 w-full rounded" />
        <Skeleton className="h-12 w-3/4 rounded" />
      </div>
      
      {/* Excerpt */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-full rounded" />
        <Skeleton className="h-6 w-2/3 rounded" />
      </div>
      
      {/* Metadata */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        </div>
        <Skeleton className="h-px w-12 bg-gray-300" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      </div>
      
      {/* Tags */}
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      
      {/* Content */}
      <div className="space-y-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// Grid skeleton for multiple posts
export function BlogPostGridSkeleton({ 
  count = 6, 
  variant = 'default',
  className 
}: { 
  count?: number
  variant?: 'default' | 'compact'
  className?: string 
}) {
  return (
    <div className={cn(
      'grid gap-6',
      variant === 'compact' 
        ? 'grid-cols-1' 
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      className
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <BlogPostSkeleton key={i} variant={variant} />
      ))}
    </div>
  )
}