// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { CONTACT } from '../contact-info'
import { buildRedirectTable } from '../redirect-table.mjs'
import retired from '@/data/blog-retired-slugs.json'
import renames from '@/data/blog-slug-renames.json'
import { REDIRECT_MAP, REDIRECTED_BLOG_SLUGS, REDIRECTS } from '../redirects'

const build = (
  handWritten: { source: string; destination: string }[],
  r: Record<string, string> = {},
  t: Record<string, string> = {}
) => buildRedirectTable({ handWritten, renames: r, retired: t })

describe('buildRedirectTable', () => {
  it('prefixes renames and retired with /blog/ and keeps hand-written as is', () => {
    const table = build([{ source: '/home', destination: '/' }], { a: 'b' }, { c: 'd' })
    expect(table).toEqual([
      { source: '/home', destination: '/' },
      { source: '/blog/a', destination: '/blog/b' },
      { source: '/blog/c', destination: '/blog/d' },
    ])
    expect(Object.isFrozen(table)).toBe(true)
    expect(Object.isFrozen(table[0])).toBe(true)
  })

  it('throws on a duplicate source', () => {
    expect(() => build([{ source: '/blog/a', destination: '/x' }], { a: 'b' })).toThrow('/blog/a')
  })

  it('throws on an uppercase source', () => {
    expect(() => build([{ source: '/Home', destination: '/' }])).toThrow('/Home')
  })

  it('throws on a trailing slash source', () => {
    expect(() => build([{ source: '/home/', destination: '/' }])).toThrow('/home/')
  })

  it('throws on a source without a leading slash', () => {
    expect(() => build([{ source: 'home', destination: '/' }])).toThrow('home')
  })

  it('throws when a destination is itself a source', () => {
    expect(() => build([], { a: 'b', b: 'c' })).toThrow('/blog/a')
    expect(() => build([], { a: 'a' })).toThrow('/blog/a')
  })

  it('throws on a destination that is neither a path nor an https URL', () => {
    expect(() => build([{ source: '/x', destination: 'http://example.com' }])).toThrow('/x')
    expect(() => build([{ source: '/y', destination: 'javascript:alert(1)' }])).toThrow('/y')
    expect(() => build([{ source: '/z', destination: 'example.com' }])).toThrow('/z')
  })
})

describe('REDIRECTS', () => {
  it('has one entry per hand-written, rename and retired source', () => {
    const handWrittenCount =
      REDIRECTS.length - Object.keys(renames).length - Object.keys(retired).length
    expect(handWrittenCount).toBe(9)
  })

  it('resolves /home to the root', () => {
    expect(REDIRECT_MAP.get('/home')).toBe('/')
  })

  it('sends profile shortcuts to the CONTACT urls exactly', () => {
    expect(REDIRECT_MAP.get('/linkedin')).toBe(CONTACT.linkedin.url)
    expect(REDIRECT_MAP.get('/github')).toBe(CONTACT.github.url)
    expect(REDIRECT_MAP.get('/twitter')).toBe(CONTACT.twitter.url)
  })

  it('lists every redirected blog slug', () => {
    expect(REDIRECTED_BLOG_SLUGS.has('revenue-operations-best-practices-complete-guide')).toBe(true)
    expect(
      REDIRECTED_BLOG_SLUGS.has(
        'stop-guessing-how-we-crushed-forecasting-errors-by-34-in-one-quarter'
      )
    ).toBe(true)
    expect(
      REDIRECTED_BLOG_SLUGS.has('stop-guessing-how-to-slash-forecast-variance-by-60-in-90-days')
    ).toBe(true)
    expect(
      REDIRECTED_BLOG_SLUGS.has(
        'the-4-2m-you-left-on-the-table-why-your-closed-lost-deals-are-actually-sleeping-'
      )
    ).toBe(true)
    expect(
      REDIRECTED_BLOG_SLUGS.has(
        'stop-ignoring-your-dead-opportunities-how-we-revived-4-2m-in-lost-revenue-with-o'
      )
    ).toBe(true)
    for (const slug of [...Object.keys(renames), ...Object.keys(retired)]) {
      expect(REDIRECTED_BLOG_SLUGS.has(slug)).toBe(true)
    }
  })
})
