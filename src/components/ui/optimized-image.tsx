'use client'

import { useState, useEffect, useCallback } from 'react'
import Image, { ImageProps } from 'next/image'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  aspectRatio?: number
  wrapperClassName?: string
  loadingClassName?: string
  fallbackSrc?: string
  blurUp?: boolean
  loadingComponent?: React.ReactNode
  lazy?: boolean
}

export function OptimizedImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  wrapperClassName,
  loadingClassName,
  aspectRatio,
  fallbackSrc = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center&q=80',
  blurUp = true,
  loadingComponent,
  lazy = true,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  // Reset loading state when src changes
  useEffect(() => {
    setIsLoading(true)
    setError(false)
    setCurrentSrc(src)
  }, [src])

  // Calculate aspect ratio styles if provided
  const aspectRatioStyle = aspectRatio
    ? {
        paddingBottom: `${(1 / aspectRatio) * 100}%`,
      }
    : undefined

  // Handle image load error
  const handleError = useCallback(() => {
    setError(true)
    setIsLoading(false)
    if (fallbackSrc && fallbackSrc !== currentSrc) {
      setCurrentSrc(fallbackSrc)
      setError(false)
      setIsLoading(true)
    }
  }, [fallbackSrc, currentSrc])

  // Handle image load success
  const handleLoad = useCallback(() => {
    setIsLoading(false)
    setError(false)
  }, [])

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        isLoading && !loadingComponent && 'bg-muted/20',
        aspectRatio ? 'w-full' : '',
        wrapperClassName
      )}
      style={aspectRatioStyle}
      data-loading={isLoading}
      data-error={error}
    >
      {isLoading && loadingComponent ? (
        loadingComponent
      ) : isLoading && (
        <div className={cn('absolute inset-0 z-10', loadingClassName)}>
          <Skeleton variant="image" className="h-full w-full" shimmer={blurUp} />
        </div>
      )}

      <Image
        src={currentSrc}
        alt={alt || ''}
        fill={fill || !!aspectRatio}
        width={!fill && !aspectRatio ? width : undefined}
        height={!fill && !aspectRatio ? height : undefined}
        className={cn(
          'object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        sizes={sizes}
        quality={quality}
        priority={priority}
        loading={priority ? undefined : (lazy ? 'lazy' : 'eager')}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      {isLoading && (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center bg-muted',
            loadingClassName
          )}
        >
          <svg
            className="w-8 h-8 text-muted-foreground animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
    </div>
  )
}
