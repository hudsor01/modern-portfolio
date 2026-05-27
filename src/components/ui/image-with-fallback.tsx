'use client'

import Image, { type ImageProps } from 'next/image'
import { useEffect, useState } from 'react'

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  /**
   * URL to swap to if the primary `src` fails to load. Typically a
   * branded fallback like `/api/og?title=…`. If the fallback itself
   * errors, the component stops swapping (no loop).
   */
  fallbackSrc: string
}

/**
 * `next/image` wrapper that swaps to `fallbackSrc` on load error.
 * Centralises the pattern so every external-image surface (blog
 * featured images, project cards, anything pulling from Unsplash or
 * other rotating CDNs) handles upstream removals gracefully — the user
 * sees a branded card instead of a broken-image icon or the CDN's
 * placeholder.
 *
 * Implementation notes:
 *   - `useState(src)` seeds the displayed URL from the prop.
 *   - `useEffect([src])` resyncs when the parent passes a new src so a
 *     filter/transition that keeps the component instance alive doesn't
 *     freeze on the previous URL or stay stuck on a stale fallback.
 *   - `onError` guard prevents an infinite swap loop if `fallbackSrc`
 *     itself fails to load.
 */
export function ImageWithFallback({ src, fallbackSrc, ...rest }: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState(src)

  useEffect(() => {
    setCurrentSrc(src)
  }, [src])

  return (
    <Image
      {...rest}
      src={currentSrc}
      onError={() => {
        if (currentSrc === fallbackSrc) return
        setCurrentSrc(fallbackSrc)
      }}
    />
  )
}
