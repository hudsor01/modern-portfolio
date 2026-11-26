// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { brandTitle } from '@/lib/brand'
import { displayPostTitle, normalizeSeoTitle, SEO_TITLE_MAX, TITLE_BUDGET } from '@/lib/post-title'

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

  describe('hard cut of a single over-long word', () => {
    const isWellFormed = (text: string) => !/\p{Cs}/u.test(text)
    const graphemes = (text: string) =>
      [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text)].map(
        ({ segment }) => segment
      )

    it('never splits a surrogate pair', () => {
      // 30 × '😀' is 60 UTF-16 units; a slice(0, 43) would end in a lone high surrogate.
      const out = normalizeSeoTitle(null, '😀'.repeat(30))
      expect(isWellFormed(out)).toBe(true)
      expect(out).toBe('😀'.repeat(21))
      expect(out.length).toBeLessThanOrEqual(SEO_TITLE_MAX)
    })

    it('never splits an emoji at an odd cut point', () => {
      // 'x' + 30 × '😀': unit 43 is the high half of the 22nd emoji.
      const out = normalizeSeoTitle(null, `x${'😀'.repeat(30)}`)
      expect(isWellFormed(out)).toBe(true)
      expect(out).toBe(`x${'😀'.repeat(21)}`)
    })

    it('never splits a ZWJ emoji sequence', () => {
      const family = '👨‍👩‍👧' // 8 UTF-16 units, one grapheme
      const out = normalizeSeoTitle(null, family.repeat(10))
      expect(out).toBe(family.repeat(5))
      expect(graphemes(out).every((g) => g === family)).toBe(true)
    })

    it('keeps a combining mark with its base letter', () => {
      const out = normalizeSeoTitle(null, `${'a'.repeat(42)}e\u0301tail`)
      expect(out).toBe('a'.repeat(42))
    })

    it('cuts a long ASCII word at exactly the budget', () => {
      const url = `https://example.com/${'x'.repeat(60)}`
      expect(normalizeSeoTitle(null, url)).toBe(url.slice(0, SEO_TITLE_MAX))
    })

    it('stays within the brand budget with an emoji at the cut', () => {
      const out = normalizeSeoTitle(`${'😀'.repeat(30)} tail`, 'x'.repeat(50))
      expect(isWellFormed(out)).toBe(true)
      expect(brandTitle(out).length).toBeLessThanOrEqual(TITLE_BUDGET)
    })
  })
})

describe('displayPostTitle', () => {
  it('drops a stored brand suffix and keeps the full length', () => {
    const long = `${'Forecast accuracy starts with data hygiene and stage mapping '.repeat(2).trim()}`
    expect(displayPostTitle(`${long} | Richard Hudson`)).toBe(long)
    expect(displayPostTitle('Pipeline Velocity – Richard Hudson')).toBe('Pipeline Velocity')
    expect(displayPostTitle('  Pipeline Velocity  ')).toBe('Pipeline Velocity')
  })

  it('keeps a title that only ends with the name', () => {
    expect(displayPostTitle('Interview with Richard Hudson')).toBe('Interview with Richard Hudson')
  })

  it('never returns empty for a title that is only the brand', () => {
    expect(displayPostTitle('| Richard Hudson')).toBe('| Richard Hudson')
  })
})
