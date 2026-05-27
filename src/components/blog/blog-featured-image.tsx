'use client'

import type { ImageProps } from 'next/image'
import { ImageWithFallback } from '@/components/ui/image-with-fallback'

interface BlogFeaturedImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string
  /**
   * Post title — used to build the branded `/api/og?title=…` fallback
   * URL when the primary src 404s or is removed upstream (Unsplash
   * yanks the photo, CDN burp, etc.).
   */
  postTitle: string
  /** Optional category for richer fallback rendering. */
  postCategory?: string
}

/**
 * Blog-flavoured wrapper over `<ImageWithFallback>`: builds the
 * `/api/og?…` fallback URL from the post's title + category. The
 * generic fallback machinery (key-reset on src change, swap-loop guard)
 * lives in `<ImageWithFallback>` so project cards and any other
 * external-image surface compose the same pattern.
 */
export function BlogFeaturedImage({
  postTitle,
  postCategory,
  alt,
  ...rest
}: BlogFeaturedImageProps) {
  const params = new URLSearchParams({ title: postTitle })
  if (postCategory) params.set('category', postCategory)
  return <ImageWithFallback {...rest} alt={alt} fallbackSrc={`/api/og?${params.toString()}`} />
}
