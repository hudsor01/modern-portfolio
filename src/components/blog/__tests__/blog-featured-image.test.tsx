// @vitest-environment jsdom
import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/image', () => ({
  default: ({ src, onError }: { src: string; onError?: () => void }) => (
    // biome-ignore lint/performance/noImgElement: test stub
    <img alt="" src={src} onError={onError} />
  ),
}))

import { BlogFeaturedImage, withCoverVariant } from '../blog-featured-image'

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

  it('strips a stored brand suffix from the fallback card title', () => {
    const { container } = render(
      <BlogFeaturedImage
        src="/gone.jpg"
        alt="a"
        postTitle="Pipeline Coverage Basics | Richard Hudson"
        fill
      />
    )
    fireEvent.error(container.querySelector('img') as HTMLImageElement)
    const swapped = (container.querySelector('img') as HTMLImageElement).getAttribute('src') ?? ''
    expect(new URL(swapped, 'http://x').searchParams.get('title')).toBe('Pipeline Coverage Basics')
  })
})

describe('withCoverVariant', () => {
  it('adds the variant to a stored /api/og cover and keeps its other params', () => {
    const out = withCoverVariant('/api/og?title=Hi+there&category=Sales', 'card')
    const params = new URL(out, 'http://x').searchParams
    expect(params.get('title')).toBe('Hi there')
    expect(params.get('category')).toBe('Sales')
    expect(params.get('variant')).toBe('card')
  })

  it('leaves photos and the default (no variant) untouched', () => {
    expect(withCoverVariant('https://images.unsplash.com/x.jpg', 'card')).toBe(
      'https://images.unsplash.com/x.jpg'
    )
    expect(withCoverVariant('/api/og?title=A', undefined)).toBe('/api/og?title=A')
  })

  it('renders the card-variant src for a stored generated cover', () => {
    const { container } = render(
      <BlogFeaturedImage src="/api/og?title=A" alt="a" postTitle="A" fallbackVariant="card" fill />
    )
    expect((container.querySelector('img') as HTMLImageElement).getAttribute('src')).toContain(
      'variant=card'
    )
  })
})
