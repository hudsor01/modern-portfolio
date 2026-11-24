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
  /**
   * `card` swaps the fallback for the large-type 16:10 cover built for /blog card
   * thumbnails; the default is the 1200x630 share card.
   */
  fallbackVariant?: 'card'
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
  fallbackVariant,
  alt,
  ...rest
}: BlogFeaturedImageProps) {
  const params = new URLSearchParams({ title: postTitle })
  if (postCategory) params.set('category', postCategory)
  if (fallbackVariant) params.set('variant', fallbackVariant)
  return <ImageWithFallback {...rest} alt={alt} fallbackSrc={`/api/og?${params.toString()}`} />
}
