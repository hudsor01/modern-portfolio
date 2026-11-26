// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { brandTitle } from '@/app/shared-metadata'
import { normalizeSeoTitle, SEO_TITLE_MAX, TITLE_BUDGET } from '@/lib/post-title'

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

  it('renders the legacy 60-char forecast metaTitle as a whole-word 59-char branded title', () => {
    const out = normalizeSeoTitle(
      'Forecast Accuracy Starts With Data Hygiene: Stage mapping an',
      'Forecast Accuracy Starts With Data Hygiene: Stage mapping and duplicate rules'
    )
    expect(out).toBe('Forecast Accuracy Starts With Data Hygiene')
    expect(brandTitle(out)).toHaveLength(59)
  })

  it('keeps every branded result within the budget for generated inputs', () => {
    const words = 'alpha beta gamma delta epsilon zeta eta theta iota kappa lambda'.split(' ')
    const make = (n: number) => {
      let out = ''
      for (let i = 0; out.length < n; i++) out += `${out ? ' ' : ''}${words[i % words.length]}`
      return out.slice(0, n)
    }
    const metas: (string | null)[] = [null, '', ...[10, 43, 44, 60, 120].map(make)]
    metas.push(`${make(30)}: ${make(40)}`, `${make(30)} (with a long trailing note)`)
    metas.push('Pipeline Velocity | Richard Hudson')
    for (const m of metas) {
      for (const t of [
        make(20),
        make(43),
        make(44),
        make(60),
        make(120),
        `${make(25)}: ${make(60)}`,
      ]) {
        expect(brandTitle(normalizeSeoTitle(m, t)).length).toBeLessThanOrEqual(TITLE_BUDGET)
      }
    }
  })
})
