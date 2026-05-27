'use client'

import type { ImageProps } from 'next/image'
import { ImageWithFallback } from '@/components/ui/image-with-fallback'

interface ProjectFeaturedImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string
  /**
   * Project title — used to build the branded `/api/og?title=…` fallback
   * URL when the primary src 404s or is removed upstream (Unsplash yanks
   * the photo, CDN burp, etc.). Mirrors the BlogFeaturedImage wrapper
   * shape so the two domains share one composition pattern, and the
   * `/api/og?title=…` URL has exactly one source of truth per surface.
   */
  projectTitle: string
}

/**
 * Project-flavoured wrapper over `<ImageWithFallback>`. Used by both
 * the project card grid and the detail page so the OG fallback URL
 * shape stays consistent — if the contract ever needs to change (add
 * subtitle, switch endpoint, color-by-category), it's one file edit
 * instead of two.
 */
export function ProjectFeaturedImage({ projectTitle, alt, ...rest }: ProjectFeaturedImageProps) {
  return (
    <ImageWithFallback
      {...rest}
      alt={alt}
      fallbackSrc={`/api/og?${new URLSearchParams({ title: projectTitle }).toString()}`}
    />
  )
}
