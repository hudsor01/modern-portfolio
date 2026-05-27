'use client'

import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'

interface BlogFeaturedImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string
  /**
   * Post title — used to build the branded `/api/og?title=...` fallback
   * when the primary src 404s, errors, or is removed upstream (e.g. an
   * Unsplash photo gets yanked). Without this fallback, a removed photo
   * renders as a broken-image icon or Unsplash's grey placeholder until
   * a human notices and runs scripts/update-blog-featured-images.ts.
   */
  postTitle: string
  /** Optional category to pass to /api/og for richer fallback rendering. */
  postCategory?: string
}

/**
 * `next/image` wrapper for blog featured images with a branded fallback.
 *
 * If the upstream image fails to load (Unsplash deleted/rotated the
 * photo, CDN burp, host whitelist regression), we swap to the project's
 * own `/api/og` route which generates a branded card from the post
 * title. The user sees something cohesive instead of a broken icon.
 */
export function BlogFeaturedImage({
  src,
  postTitle,
  postCategory,
  alt,
  ...rest
}: BlogFeaturedImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)

  const fallback = () => {
    const params = new URLSearchParams({ title: postTitle })
    if (postCategory) params.set('category', postCategory)
    setCurrentSrc(`/api/og?${params.toString()}`)
  }

  return (
    <Image
      {...rest}
      src={currentSrc}
      alt={alt}
      onError={() => {
        // Guard against a fallback loop: if /api/og itself errors,
        // don't keep swapping.
        if (!currentSrc.startsWith('/api/og')) fallback()
      }}
    />
  )
}
