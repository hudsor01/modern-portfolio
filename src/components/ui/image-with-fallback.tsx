'use client'

import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'
import { OG_CARD_BACKGROUND } from '@/lib/og-card'

interface ImageWithFallbackProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string
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
 * featured images, anything pulling from Unsplash or
 * other rotating CDNs) handles upstream removals gracefully — the user
 * sees a branded card instead of a broken-image icon or the CDN's
 * placeholder.
 *
 * State-reset strategy: when the parent passes a new `src`, this outer
 * component re-renders with a new `key` on the inner stateful child,
 * which forces React to remount it with a fresh `useState(false)`. This
 * is the React-recommended pattern for state derived from props (see
 * "Resetting state with a key" in the React docs). The
 * `useState(src) + useEffect([src])` alternative is explicitly called
 * out as "🔴 Avoid: Resetting state on prop change in an Effect."
 */
export function ImageWithFallback({ src, fallbackSrc, ...rest }: ImageWithFallbackProps) {
  return <FallbackImage key={src} src={src} fallbackSrc={fallbackSrc} {...rest} />
}

function FallbackImage({ src, fallbackSrc, ...rest }: ImageWithFallbackProps) {
  const [errored, setErrored] = useState(false)
  const current = errored ? fallbackSrc : src
  // `/_next/image` rejects local srcs carrying a query string (400) unless
  // `images.localPatterns` allows them, and `/api/og` is already a rendered image.
  const isOgCard = current.startsWith('/api/og')
  const unoptimized = rest.unoptimized || isOgCard
  // An /api/og card is a 1200x630 text layout: letterbox it on its own
  // OG_CARD_BACKGROUND ground so frames of another aspect never crop its title. Inline
  // style so it beats a caller's object-cover class. The cover's text sits on the left, so
  // the card is anchored there; real photos keep the caller's own object-position.
  const style = isOgCard
    ? {
        ...rest.style,
        objectFit: 'contain' as const,
        objectPosition: 'left center',
        backgroundColor: OG_CARD_BACKGROUND,
      }
    : rest.style
  return (
    <Image
      {...rest}
      style={style}
      unoptimized={unoptimized}
      src={current}
      onError={() => {
        // Stop swapping if the fallback itself failed to load.
        if (!errored) setErrored(true)
      }}
    />
  )
}
