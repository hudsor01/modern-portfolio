// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { postDocumentTitle, TITLE_BUDGET } from '@/lib/post-title'

describe('postDocumentTitle', () => {
  it('keeps the SEO title when it fits with the brand', () => {
    expect(
      postDocumentTitle('Lead Scoring That Works', 'Lead Scoring Models That Actually Work')
    ).toBe('Lead Scoring That Works')
  })

  it('falls back to the post title when the branded SEO title would be truncated', () => {
    const seo = 'Lead Scoring Models That Actually Work: Fit, Engagement, Validation'
    const title = 'Lead Scoring Models That Actually Work'
    expect(`${seo} | Richard Hudson`.length).toBeGreaterThan(TITLE_BUDGET)
    expect(postDocumentTitle(seo, title)).toBe(title)
  })

  it('keeps the SEO title when the post title is no shorter', () => {
    const long = 'A Very Long Post Title That Goes On And On About Revenue Operations'
    expect(postDocumentTitle(`${long}: More`, `${long}: More Still`)).toBe(`${long}: More`)
  })

  it('strips a stored brand suffix and handles a missing metaTitle', () => {
    expect(postDocumentTitle('Pipeline Velocity | Richard Hudson', 'Pipeline')).toBe(
      'Pipeline Velocity'
    )
    expect(postDocumentTitle(null, 'Pipeline Velocity')).toBe('Pipeline Velocity')
    expect(postDocumentTitle('', '')).toBe('Blog')
  })
})
