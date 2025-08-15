'use client'

import React, { memo, useState, useCallback, useRef, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProgressiveImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  quality?: number
  lowQualitySrc?: string
  onLoadingComplete?: () => void
  threshold?: number // Intersection observer threshold
}

const ProgressiveImage = memo(({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  lowQualitySrc,
  onLoadingComplete,
  threshold = 0.1,
}: ProgressiveImageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(priority)
  const imgRef = useRef<HTMLDivElement>(null)

  // Generate low-quality placeholder if not provided
  const generateBlurDataURL = useCallback((w: number, h: number) => {
    const svg = `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0f172a;stop-opacity:0.8" />
            <stop offset="50%" style="stop-color:#1e293b;stop-opacity:0.6" />
            <stop offset="100%" style="stop-color:#334155;stop-opacity:0.4" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" />
        <rect x="20%" y="40%" width="60%" height="20%" fill="rgba(59, 130, 246, 0.3)" rx="4"/>
      </svg>
    `
    return `data:image/svg+xml;base64,${btoa(svg)}`
  }, [])

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || shouldLoad) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true)
            observer.disconnect()
          }
        })
      },
      { threshold, rootMargin: '50px' }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority, shouldLoad, threshold])

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false)
    onLoadingComplete?.()
  }, [onLoadingComplete])

  const handleError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
  }, [])

  const defaultBlurDataURL = width && height ? generateBlurDataURL(width, height) : undefined

  if (hasError) {
    return (
      <div 
        ref={imgRef}
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-gray-400 border border-gray-700 rounded-lg',
          className
        )}
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="text-2xl mb-2">📷</div>
          <span className="text-sm">Image unavailable</span>
        </div>
      </div>
    )
  }

  return (
    <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
      {/* Loading skeleton */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 animate-pulse"
          style={{ width, height }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600/20 to-transparent animate-shimmer" />
        </div>
      )}
      
      {shouldLoad && (
        <>
          {/* Low quality image first (if provided) */}
          {lowQualitySrc && isLoading && (
            <Image
              src={lowQualitySrc}
              alt={alt}
              width={width}
              height={height}
              quality={20}
              className="absolute inset-0 transition-opacity duration-300 blur-sm scale-110"
              onLoad={() => setIsLoading(false)}
              priority={priority}
            />
          )}
          
          {/* High quality image */}
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            placeholder={placeholder}
            blurDataURL={blurDataURL || defaultBlurDataURL}
            sizes={sizes}
            quality={quality}
            onLoad={handleLoadingComplete}
            onError={handleError}
            className={cn(
              'transition-all duration-500 ease-out',
              isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            )}
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </>
      )}
    </div>
  )
})

ProgressiveImage.displayName = 'ProgressiveImage'

export { ProgressiveImage }