import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ImageWithFallback } from '../image-with-fallback'

describe('ImageWithFallback', () => {
  it('serves /api/og srcs directly, not through /_next/image', () => {
    const { container } = render(
      <ImageWithFallback
        src="/api/og?title=A&category=B"
        fallbackSrc="/api/og?title=A"
        alt=""
        width={640}
        height={336}
      />
    )
    const src = container.querySelector('img')?.getAttribute('src') ?? ''
    expect(src).not.toContain('/_next/image')
    expect(src).toContain('/api/og?title=A')
  })

  it('still optimizes ordinary remote srcs', () => {
    const { container } = render(
      <ImageWithFallback
        src="https://images.unsplash.com/photo-1"
        fallbackSrc="/api/og?title=A"
        alt=""
        width={640}
        height={336}
      />
    )
    expect(container.querySelector('img')?.getAttribute('src')).toContain('/_next/image')
  })
})
