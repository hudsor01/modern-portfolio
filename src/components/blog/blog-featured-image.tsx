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
/**
 * Most stored covers are already `/api/og?title=…` URLs (the pipeline writes the
 * generated card as the post's featured image), so the variant has to be applied
 * to the primary src too, not just to the error fallback. Anything else is kept.
 */
export function withCoverVariant(src: string, variant?: 'card'): string {
  if (!variant || !src.startsWith('/api/og?')) return src
  const params = new URLSearchParams(src.slice('/api/og?'.length))
  params.set('variant', variant)
  return `/api/og?${params.toString()}`
}

export function BlogFeaturedImage({
  postTitle,
  postCategory,
  fallbackVariant,
  alt,
  src,
  ...rest
}: BlogFeaturedImageProps) {
  const params = new URLSearchParams({ title: postTitle })
  if (postCategory) params.set('category', postCategory)
  if (fallbackVariant) params.set('variant', fallbackVariant)
  return (
    <ImageWithFallback
      {...rest}
      src={withCoverVariant(src, fallbackVariant)}
      alt={alt}
      fallbackSrc={`/api/og?${params.toString()}`}
    />
  )
}
