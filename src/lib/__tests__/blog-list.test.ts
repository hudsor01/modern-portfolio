// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  buildOgCoverUrl,
  DEFAULT_CHIP_LABEL,
  getCategoryChipLabel,
  resolveListCovers,
} from '../blog-list'

describe('getCategoryChipLabel', () => {
  it('prefers the category', () => {
    expect(getCategoryChipLabel({ categoryName: 'Forecasting', tags: [{ name: 'X' }] })).toBe(
      'Forecasting'
    )
  })

  it('falls back to the first tag', () => {
    expect(getCategoryChipLabel({ categoryName: null, tags: [{ name: 'Pipeline' }] })).toBe(
      'Pipeline'
    )
    expect(getCategoryChipLabel({ categoryName: '', tags: [{ name: 'Pipeline' }] })).toBe(
      'Pipeline'
    )
  })

  it('falls back to the default label', () => {
    expect(DEFAULT_CHIP_LABEL).toBe('Revenue Operations')
    expect(getCategoryChipLabel({ categoryName: null, tags: [] })).toBe('Revenue Operations')
  })
})

describe('buildOgCoverUrl', () => {
  it('encodes with URLSearchParams', () => {
    expect(buildOgCoverUrl('A & B: "Q"?', 'Revenue Operations')).toBe(
      `/api/og?${new URLSearchParams({ title: 'A & B: "Q"?', category: 'Revenue Operations' }).toString()}`
    )
  })
})

type P = { title: string; featuredImage: string | null }
const cat = () => 'Cat'

describe('resolveListCovers', () => {
  it('replaces second and later duplicates only', () => {
    const posts: P[] = [
      { title: 'A', featuredImage: 'url1' },
      { title: 'B', featuredImage: 'url1' },
      { title: 'C', featuredImage: 'url2' },
      { title: 'D', featuredImage: null },
      { title: 'E', featuredImage: 'url1' },
    ]
    const snapshot = JSON.parse(JSON.stringify(posts))
    const out = resolveListCovers(posts, cat)
    expect(out.map((p) => p.featuredImage)).toEqual([
      'url1',
      buildOgCoverUrl('B', 'Cat'),
      'url2',
      null,
      buildOgCoverUrl('E', 'Cat'),
    ])
    expect(out.map((p) => p.title)).toEqual(['A', 'B', 'C', 'D', 'E'])
    expect(posts).toEqual(snapshot)
    expect(out[1]).not.toBe(posts[1])
  })

  it('leaves unique covers untouched', () => {
    const posts: P[] = [
      { title: 'A', featuredImage: 'u1' },
      { title: 'B', featuredImage: 'u2' },
    ]
    expect(resolveListCovers(posts, cat).map((p) => p.featuredImage)).toEqual(['u1', 'u2'])
  })

  it('is deterministic for identical titles', () => {
    const posts: P[] = [
      { title: 'Same', featuredImage: 'u' },
      { title: 'Same', featuredImage: 'u' },
      { title: 'Same', featuredImage: 'u' },
    ]
    const out = resolveListCovers(posts, cat)
    expect(out[0]?.featuredImage).toBe('u')
    expect(out[1]?.featuredImage).toBe(out[2]?.featuredImage)
    expect(out[1]?.featuredImage).toBe(buildOgCoverUrl('Same', 'Cat'))
  })
  // Production covers reuse one Unsplash photo with a different &sig= value.
  it('treats the same image with different query strings as a duplicate', () => {
    const photo = 'https://images.unsplash.com/photo-1552664730-d307ca884978'
    const posts: P[] = [
      { title: 'A', featuredImage: `${photo}?w=1200&h=630&fit=crop&q=80&sig=ezlp5i` },
      { title: 'B', featuredImage: `${photo}?w=1200&h=630&fit=crop&q=80&sig=14g10si` },
      {
        title: 'C',
        featuredImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200',
      },
    ]
    const out = resolveListCovers(posts, cat).map((p) => p.featuredImage)
    expect(out[0]).toBe(posts[0]?.featuredImage)
    expect(out[1]).toBe(buildOgCoverUrl('B', 'Cat'))
    expect(out[2]).toBe(posts[2]?.featuredImage)
  })
})
