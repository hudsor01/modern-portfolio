// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  CONTENT_HEAD_CHARS,
  contentHeadOf,
  isBioBoilerplate,
  LEDE_MAX,
  resolveExcerpt,
  resolvePostLede,
  stripMarkdownToPlain,
} from '../blog-excerpt'

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
        metaDescription: 'x'.repeat(10) + ' meta description text here.',
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
