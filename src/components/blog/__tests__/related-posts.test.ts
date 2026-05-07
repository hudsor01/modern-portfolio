import { describe, it, expect } from 'vitest'
import { selectRelatedPosts, type RelatedPostInput } from '../related-posts-utils'

describe('selectRelatedPosts', () => {
  const allPosts: RelatedPostInput[] = [
    { slug: 'a', title: 'A', tags: ['revops', 'salesforce'], publishedAt: '2026-01-01' },
    { slug: 'b', title: 'B', tags: ['revops', 'hubspot'], publishedAt: '2026-02-01' },
    { slug: 'c', title: 'C', tags: ['marketing'], publishedAt: '2026-03-01' },
    { slug: 'd', title: 'D', tags: ['salesforce', 'commission'], publishedAt: '2026-04-01' },
  ]

  it('excludes the current post', () => {
    const current = allPosts[0]
    if (!current) throw new Error('test fixture missing')
    const result = selectRelatedPosts(allPosts, current, 3)
    expect(result.find((p) => p.slug === 'a')).toBeUndefined()
  })

  it('prioritizes posts that share at least one tag', () => {
    const current = allPosts[0]
    if (!current) throw new Error('test fixture missing')
    const result = selectRelatedPosts(allPosts, current, 2)
    // a has revops+salesforce — b shares revops, d shares salesforce
    expect(result.map((p) => p.slug).sort()).toEqual(['b', 'd'])
  })

  it('falls back to most-recent posts if no tag overlap', () => {
    const isolated: RelatedPostInput = {
      slug: 'x',
      title: 'X',
      tags: ['novel'],
      publishedAt: '2026-05-01',
    }
    const result = selectRelatedPosts(allPosts, isolated, 2)
    // Most recent first: d (Apr), c (Mar)
    expect(result.map((p) => p.slug)).toEqual(['d', 'c'])
  })

  it('respects the limit', () => {
    const current = allPosts[0]
    if (!current) throw new Error('test fixture missing')
    const result = selectRelatedPosts(allPosts, current, 1)
    expect(result.length).toBe(1)
  })
})
