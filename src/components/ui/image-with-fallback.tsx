'use client'

import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'

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
 * featured images, project cards, anything pulling from Unsplash or
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
  return (
    <Image
      {...rest}
      src={errored ? fallbackSrc : src}
      onError={() => {
        // Stop swapping if the fallback itself failed to load.
        if (!errored) setErrored(true)
      }}
    />
  )
}
