'use client'

import { memo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'

// Critical resources to preload
const CRITICAL_ROUTES = [
  '/projects',
  '/about',
  '/resume',
  '/contact'
] as const

const CRITICAL_IMAGES = [
  'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&crop=center&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&q=80'
] as const

// DNS prefetch domains
const DNS_PREFETCH_DOMAINS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'images.unsplash.com',
  'vercel.live',
  'va.vercel-scripts.com',
  'vitals.vercel-insights.com'
] as const

const PreloadManager = memo(() => {
  const router = useRouter()
  const queryClient = useQueryClient()

  useEffect(() => {
    // Preload critical routes
    CRITICAL_ROUTES.forEach(route => {
      router.prefetch(route)
    })

    // Preload critical images
    CRITICAL_IMAGES.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })

    // DNS prefetch for external domains
    DNS_PREFETCH_DOMAINS.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = `https://${domain}`
      document.head.appendChild(link)
    })

    // Preconnect to critical origins
    const preconnectLink = document.createElement('link')
    preconnectLink.rel = 'preconnect'
    preconnectLink.href = 'https://fonts.googleapis.com'
    preconnectLink.crossOrigin = 'anonymous'
    document.head.appendChild(preconnectLink)

    // Warm up critical queries
    const warmUpQueries = async () => {
      // Only warm up if queries aren't already cached
      const projectsQuery = queryClient.getQueryData(['projects'])
      if (!projectsQuery) {
        queryClient.prefetchQuery({
          queryKey: ['projects'],
          queryFn: () => fetch('/api/projects').then(res => res.json()),
          staleTime: 15 * 60 * 1000, // 15 minutes
        })
      }
    }

    // Delay query warming to not interfere with initial page load
    setTimeout(warmUpQueries, 2000)

    return () => {
      // Cleanup function to remove added elements if needed
      // Note: Generally not needed for preload/dns-prefetch links
    }
  }, [router, queryClient])

  return null // This component doesn't render anything
})

PreloadManager.displayName = 'PreloadManager'

export { PreloadManager }