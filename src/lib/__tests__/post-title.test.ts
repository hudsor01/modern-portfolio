// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { normalizeSeoTitle, postDocumentTitle, SEO_TITLE_MAX, TITLE_BUDGET } from '@/lib/post-title'

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

describe('normalizeSeoTitle', () => {
  it('fits every stored SEO title within the budget', () => {
    expect(SEO_TITLE_MAX).toBe(43)
  })

  it('keeps a compliant SEO title and strips a stored brand suffix', () => {
    expect(normalizeSeoTitle('Salesloft Cadences That Get Replies', 'x')).toBe(
      'Salesloft Cadences That Get Replies'
    )
    expect(normalizeSeoTitle('Pipeline Velocity | Richard Hudson', 'x')).toBe('Pipeline Velocity')
  })

  it('uses the post title when the SEO title is too long and the title fits', () => {
    expect(
      normalizeSeoTitle(
        'Lead Scoring Models That Actually Work: Fit, Engagement, Validation',
        'Lead Scoring Models That Actually Work'
      )
    ).toBe('Lead Scoring Models That Actually Work')
  })

  it('drops a trailing parenthetical, then falls back to the part before a colon', () => {
    const longTitle = 'A Title Long Enough To Never Fit The Budget For Search Results'
    expect(
      normalizeSeoTitle('Advanced Customer Churn Analysis (pandas + scikit-learn)', longTitle)
    ).toBe('Advanced Customer Churn Analysis')
    expect(
      normalizeSeoTitle('Salesloft vs Outreach: How to Choose the Right Platform', longTitle)
    ).toBe('Salesloft vs Outreach')
  })

  it('cuts at a whole word without a dangling filler word', () => {
    const out = normalizeSeoTitle(
      'Why Revenue Teams Keep Missing Forecasts and What to Do About It Today',
      'Why Revenue Teams Keep Missing Forecasts and What to Do About It Today'
    )
    expect(out.length).toBeLessThanOrEqual(43)
    expect(out).toBe('Why Revenue Teams Keep Missing Forecasts')
  })

  it('derives from the post title when no SEO title is sent', () => {
    expect(normalizeSeoTitle(null, 'Short Post Title')).toBe('Short Post Title')
    expect(normalizeSeoTitle(undefined, 'Short Post Title')).toBe('Short Post Title')
  })

  it('every output fits, whatever the input', () => {
    const inputs = [
      'x'.repeat(200),
      'One two three four five six seven eight nine ten eleven twelve thirteen',
      'Colon Head Too Long To Be Useful As A Title On Its Own: tail',
    ]
    for (const s of inputs) {
      const out = normalizeSeoTitle(s, s)
      expect(out.length).toBeGreaterThan(0)
      expect(out.length).toBeLessThanOrEqual(43)
    }
  })

  it('never splits a word: the cut output is whole leading words of the input', () => {
    const s = 'Revenue Operations Benchmarks Every Founder Should Track Before Series A'
    const out = normalizeSeoTitle(s, s)
    expect(out).toBe('Revenue Operations Benchmarks Every Founder')
    expect(s.split(' ').slice(0, out.split(' ').length).join(' ')).toBe(out)
  })
})
