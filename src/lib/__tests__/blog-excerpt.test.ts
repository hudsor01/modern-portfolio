// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { isBioBoilerplate, resolveExcerpt, stripMarkdownToPlain } from '../blog-excerpt'

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
    expect(out.length).toBeLessThanOrEqual(161)
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
