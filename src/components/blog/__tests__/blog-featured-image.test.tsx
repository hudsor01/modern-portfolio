// @vitest-environment jsdom
import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/image', () => ({
  default: ({ src, onError }: { src: string; onError?: () => void }) => (
    // biome-ignore lint/performance/noImgElement: test stub
    <img alt="" src={src} onError={onError} />
  ),
}))

import { BlogFeaturedImage } from '../blog-featured-image'

describe('BlogFeaturedImage fallback', () => {
  afterEach(() => cleanup())

  it('swaps to the card-variant cover when asked', () => {
    const { container } = render(
      <BlogFeaturedImage
        src="/gone.jpg"
        alt="a"
        postTitle="T"
        postCategory="C"
        fallbackVariant="card"
        fill
      />
    )
    const img = container.querySelector('img') as HTMLImageElement
    fireEvent.error(img)
    const swapped = (container.querySelector('img') as HTMLImageElement).getAttribute('src') ?? ''
    expect(new URL(swapped, 'http://x').searchParams.get('variant')).toBe('card')
    expect(swapped).toContain('title=T')
  })

  it('keeps the default share card without a variant', () => {
    const { container } = render(<BlogFeaturedImage src="/gone.jpg" alt="a" postTitle="T" fill />)
    fireEvent.error(container.querySelector('img') as HTMLImageElement)
    const swapped = (container.querySelector('img') as HTMLImageElement).getAttribute('src') ?? ''
    expect(swapped).not.toContain('variant')
  })
})
