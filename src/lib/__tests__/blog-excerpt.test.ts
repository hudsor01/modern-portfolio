// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  CONTENT_HEAD_CHARS,
  contentHeadOf,
  fitKeywords,
  fitStoredText,
  isBioBoilerplate,
  LEDE_MAX,
  resolveExcerpt,
  normalizeStoredSeoText,
  resolvePostLede,
  STORED_TEXT_LIMITS,
  stripMarkdownToPlain,
} from '../blog-excerpt'
import { blogPosts } from '@/db/schema'

const BIO =
  'I spent six years in the Texas Army National Guard before moving into revenue operations and never looked back.'

describe('isBioBoilerplate', () => {
  it('flags the author-bio opener', () => {
    expect(isBioBoilerplate(BIO)).toBe(true)
    expect(isBioBoilerplate('I served in the National Guard for six years')).toBe(true)
  })

  it('flags a mention inside the first 160 chars', () => {
    expect(isBioBoilerplate('Lessons from the Texas Army National Guard apply to pipelines.')).toBe(
      true
    )
  })

  it('does not flag a late mention', () => {
    const text = `Pipeline reviews fail when ${'x'.repeat(200)} Texas Army National Guard`
    expect(isBioBoilerplate(text)).toBe(false)
  })

  it('treats empty input as replaceable', () => {
    expect(isBioBoilerplate('')).toBe(true)
    expect(isBioBoilerplate(null)).toBe(true)
    expect(isBioBoilerplate(undefined)).toBe(true)
    expect(isBioBoilerplate('   ')).toBe(true)
  })

  it('does not flag normal excerpts', () => {
    expect(isBioBoilerplate('Forecasts miss because stages are fiction.')).toBe(false)
  })
})

describe('stripMarkdownToPlain', () => {
  it('strips inline markdown and collapses whitespace', () => {
    expect(stripMarkdownToPlain('**a** __b__ *c* _d_ `e` [f](g) ![h](i) \\*j')).toBe(
      'a b c d e f *j'
    )
  })

  it('decodes HTML entities', () => {
    expect(stripMarkdownToPlain('Tom &amp; Jerry')).toBe('Tom & Jerry')
  })
})

describe('resolveExcerpt', () => {
  it('returns a real excerpt unchanged', () => {
    expect(resolveExcerpt({ excerpt: 'Forecasts miss because…', content: 'anything' })).toBe(
      'Forecasts miss because…'
    )
  })

  it('derives the first real paragraph, skipping non-prose blocks', () => {
    const content =
      '# Heading\n\n> quote\n\n- list item\n\n```ts\nconst a = 1\n\n```\n\n| a | b |\n\n![img](x.png)\n\n---\n\n<div>html</div>\n\nShort.\n\nYour **pipeline** is [lying](https://x.y) to you, and `CRM` hygiene is only half the story here.'
    expect(resolveExcerpt({ excerpt: BIO, content })).toBe(
      'Your pipeline is lying to you, and CRM hygiene is only half the story here.'
    )
  })

  it('truncates long paragraphs at a word boundary with an ellipsis', () => {
    const para = 'word, '.repeat(50).trim()
    const out = resolveExcerpt({ excerpt: null, content: para })
    expect(out.endsWith('…')).toBe(true)
    expect(out.length).toBeLessThanOrEqual(160)
    expect(out).not.toMatch(/[,;:.\-–—]…$/)
  })

  it('returns a 120-char paragraph whole', () => {
    const para = `${'a'.repeat(59)} ${'b'.repeat(60)}`
    expect(para.length).toBe(120)
    expect(resolveExcerpt({ excerpt: null, content: para })).toBe(para)
  })

  it('returns empty when nothing qualifies', () => {
    expect(resolveExcerpt({ excerpt: BIO, content: null })).toBe('')
    expect(resolveExcerpt({ excerpt: BIO, content: '' })).toBe('')
    expect(resolveExcerpt({ excerpt: BIO, content: '# One\n\n## Two' })).toBe('')
  })
  // Real shape from production posts: the body opens with the same bio
  // paragraph as the excerpt, so the replacement must skip it.
  it('skips a body paragraph that is itself the bio boilerplate', () => {
    const content = [
      '# Re-engagement Campaigns: Bringing Dead Opportunities Back to Life',
      'I spent six years in the Texas Army National Guard as an Information Technology Specialist, including a deployment to Iraq. I learned quickly that when equipment fails in the field, you fix it.',
      'Sales pipelines are no different.',
      'I see too many sales organizations treat "closed-lost" deals as final. They archive them in Salesforce and move on.',
    ].join('\n\n')
    const out = resolveExcerpt({ excerpt: BIO, content })
    expect(out).not.toMatch(/National Guard/)
    expect(out.startsWith('I see too many sales organizations')).toBe(true)
  })

  it('returns empty when the only prose is bio boilerplate', () => {
    const content = `# Title\n\n${BIO} That service included a deployment to Iraq.`
    expect(resolveExcerpt({ excerpt: BIO, content })).toBe('')
  })
})

describe('resolveExcerpt keeps real excerpts as plain text', () => {
  it('strips markdown and decodes entities in a kept excerpt', () => {
    const out = resolveExcerpt({
      excerpt: 'Why **pipeline** reviews fail &amp; what to do about [forecasts](https://x.test).',
      content: '',
    })
    expect(out).toBe('Why pipeline reviews fail & what to do about forecasts.')
  })

  it('truncates a kept excerpt longer than 160 characters', () => {
    const out = resolveExcerpt({
      excerpt: `${'Forecast accuracy matters. '.repeat(20)}`,
      content: '',
    })
    expect(out.length).toBeLessThanOrEqual(160)
    expect(out.endsWith('matters.')).toBe(true)
  })

  it('leaves a clean short excerpt unchanged', () => {
    expect(resolveExcerpt({ excerpt: 'A clean short excerpt.', content: '' })).toBe(
      'A clean short excerpt.'
    )
  })
  it('falls back to the body when a stored excerpt strips to nothing', () => {
    const content = 'A real opening paragraph that is long enough to qualify as an excerpt.'
    expect(resolveExcerpt({ excerpt: '![cover](https://x.test/a.png)', content })).toBe(content)
  })
})

describe('contentHeadOf', () => {
  it('returns short content unchanged and empty for null/undefined', () => {
    expect(contentHeadOf('short')).toBe('short')
    expect(contentHeadOf(null)).toBe('')
    expect(contentHeadOf(undefined)).toBe('')
  })

  it('cuts at CONTENT_HEAD_CHARS code points without splitting a surrogate pair', () => {
    expect(CONTENT_HEAD_CHARS).toBe(4000)
    const emoji = '😀'.repeat(4010)
    const head = contentHeadOf(emoji)
    expect(Array.from(head)).toHaveLength(4000)
    expect(head).toBe('😀'.repeat(4000))
    expect(contentHeadOf('a'.repeat(4000))).toBe('a'.repeat(4000))
    expect(contentHeadOf('a'.repeat(4001))).toBe('a'.repeat(4000))
  })
})

describe('resolvePostLede', () => {
  const PARA =
    'Forecast accuracy depends on clean pipeline stages and honest close dates across every region.'

  it('uses the excerpt, else the body prefix, else the meta description, at LEDE_MAX', () => {
    expect(
      resolvePostLede({
        excerpt: 'A perfectly good summary of the post.',
        content: '',
        metaDescription: null,
      })
    ).toBe('A perfectly good summary of the post.')
    expect(
      resolvePostLede({ excerpt: null, content: `# H\n\n${PARA}`, metaDescription: null })
    ).toBe(PARA)
    expect(
      resolvePostLede({
        excerpt: null,
        content: '',
        metaDescription: `${'x'.repeat(10)} meta description text here.`,
      })
    ).toBe('xxxxxxxxxx meta description text here.')
    const long = `${'word '.repeat(100)}end.`
    expect(
      resolvePostLede({ excerpt: long, content: null, metaDescription: null }).length
    ).toBeLessThanOrEqual(LEDE_MAX)
  })

  it('matches resolveExcerpt over the prefix at LEDE_MAX', () => {
    const content = `# H\n\n${PARA}`
    expect(resolvePostLede({ excerpt: null, content, metaDescription: null })).toBe(
      resolveExcerpt({ excerpt: null, content: contentHeadOf(content) }, { maxLength: LEDE_MAX })
    )
  })

  it('is identical for a full body and its 4000-code-point prefix (page vs feed)', () => {
    const late = `${'filler words\n\n'.repeat(400)}${PARA}\n\nMore.`
    const emoji = `${'😀 '.repeat(50)}\n\n${'x'.repeat(3850)}\n\n${PARA}`
    for (const body of [late, emoji]) {
      const prefix = Array.from(body).slice(0, 4000).join('')
      const page = resolvePostLede({
        excerpt: null,
        content: body,
        metaDescription: 'Meta description fallback text here.',
      })
      const feed = resolvePostLede({
        excerpt: null,
        content: prefix,
        metaDescription: 'Meta description fallback text here.',
      })
      expect(page).toBe(feed)
    }
  })
})

describe('STORED_TEXT_LIMITS', () => {
  it('never exceeds the varchar column bounds', () => {
    expect(STORED_TEXT_LIMITS.ogDescription).toBeLessThanOrEqual(
      (blogPosts.ogDescription as unknown as { length: number }).length
    )
    expect(STORED_TEXT_LIMITS.twitterDescription).toBeLessThanOrEqual(
      (blogPosts.twitterDescription as unknown as { length: number }).length
    )
  })
})

describe('fitStoredText', () => {
  const long = 'Revenue operations keeps the pipeline honest. '.repeat(40)

  it('returns undefined and null as sent', () => {
    expect(fitStoredText(undefined, 100)).toBeUndefined()
    expect(fitStoredText(null, 100)).toBeNull()
  })

  it('returns a value within the limit exactly as sent', () => {
    expect(fitStoredText('**Keep** me', 100)).toBe('**Keep** me')
  })

  it('cuts a longer value within the limit on a sentence or one ellipsis', () => {
    for (const max of [100, 200, 300]) {
      const out = fitStoredText(long, max) as string
      expect(out.length).toBeLessThanOrEqual(max)
      expect(out.endsWith('.') || out.endsWith('…')).toBe(true)
    }
    const words = fitStoredText('word '.repeat(100), 100) as string
    expect(words.endsWith('…')).toBe(true)
    expect(words.match(/…/g)).toHaveLength(1)
  })

  it('returns null for a longer value with no text', () => {
    expect(fitStoredText('-'.repeat(600), 100)).toBeNull()
  })
})

describe('fitKeywords', () => {
  it('trims, drops empties, cuts long items on a word and caps at 10', () => {
    const phrase = 'revenue operations strategy '.repeat(5)
    const out = fitKeywords([
      ' a ',
      '',
      '   ',
      'x'.repeat(60),
      phrase,
      ...Array.from({ length: 15 }, (_, i) => `kw${i}`),
    ])
    expect(out).toHaveLength(10)
    expect(out[0]).toBe('a')
    expect(out[1]).toBe('x'.repeat(50))
    expect(out[2]).toBe('revenue operations strategy revenue operations')
    expect(out.every((k) => k.length >= 1 && k.length <= 50)).toBe(true)
  })
})

describe('normalizeStoredSeoText excerpt fit', () => {
  it('fits a non-bio excerpt over 500 and derives meta from it', () => {
    const excerpt = 'Pipeline hygiene matters for forecast accuracy. '.repeat(40)
    const out = normalizeStoredSeoText({
      excerpt,
      metaDescription: undefined,
      content: 'body',
    })
    expect((out.excerpt as string).length).toBeLessThanOrEqual(STORED_TEXT_LIMITS.excerpt)
    expect(out.excerpt).toBe(fitStoredText(excerpt, STORED_TEXT_LIMITS.excerpt))
  })
})
