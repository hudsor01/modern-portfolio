// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { CONTACT } from '../contact-info'
import { buildRedirectTable } from '../redirect-table.mjs'
import { resolveSingleHop } from '../redirect-resolve'
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

  it.each([
    ['/a/', 'trailing-slash loop back to the source'],
    ['/a//', 'trailing-slash run'],
    ['/A', 'case-folding loop back to the source'],
    ['/About', 'uppercase destination'],
    ['/b/', 'trailing slash on a non-source'],
  ])('throws on a non-canonical destination %s (%s)', (destination) => {
    expect(() => build([{ source: '/a', destination }])).toThrow('/a')
  })

  it.each([
    ['//evil.com', 'protocol-relative'],
    ['//evil.com/x', 'protocol-relative with a path'],
    ['/\\evil.com', 'backslash'],
    ['/b\\c', 'inner backslash'],
    ['/b?x=1', 'query'],
    ['/b#top', 'fragment'],
    ['/b c', 'whitespace'],
    ['/b\tc', 'tab'],
    ['/b\nc', 'newline'],
    ['/x/../a', 'dot-dot segment that URL parsing folds back to the source'],
    ['/./a', 'dot segment'],
    ['/a/.', 'trailing dot segment'],
    ['/x/%2e%2e/a', 'percent-encoded dot-dot segment'],
    ['/b%2fc', 'percent-encoding'],
    ['/b.html', 'dot in a segment'],
  ])('throws on an unsafe path destination %j (%s)', (destination) => {
    expect(() => build([{ source: '/a', destination }])).toThrow('/a')
  })

  it.each([
    ['https://example.com/x?y=1', 'query'],
    ['https://example.com/x#y', 'fragment'],
    ['https://example.com/x y', 'whitespace'],
    ['https://', 'no host'],
    ['https://user:pass@example.com', 'credentials'],
  ])('throws on an unsafe external destination %j (%s)', (destination) => {
    expect(() => build([{ source: '/a', destination }])).toThrow('/a')
  })

  it.each([
    ['/blog/:slug', 'path-to-regexp param'],
    ['/blog/:path*', 'path-to-regexp wildcard'],
    ['/blog/(.*)', 'regex group'],
    ['/blog/*', 'star'],
    ['/old.html', 'dot'],
    ['/caf%c3%a9', 'percent-encoding'],
    ['/a//b', 'empty segment'],
    ['/a_b', 'underscore'],
    ['/', 'root'],
    ['', 'empty'],
  ])('throws on a non-literal source %j (%s)', (source) => {
    expect(() => build([{ source, destination: '/x' }])).toThrow(
      `Redirect source must be a literal lowercase path of a-z, 0-9, '-' and '/' with no trailing slash: ${source}`
    )
  })

  it.each(['/api', '/api/health'])(
    'throws on a source under the never-case-folded /api prefix %j',
    (source) => {
      expect(() => build([{ source, destination: '/x' }])).toThrow(
        `Redirect source must not be under /api: ${source}`
      )
    }
  )

  it.each(['/_next', '/_next/static'])(
    'rejects a /_next source through the source grammar %j',
    (source) => {
      expect(() => build([{ source, destination: '/x' }])).toThrow(
        `Redirect source must be a literal lowercase path of a-z, 0-9, '-' and '/' with no trailing slash: ${source}`
      )
    }
  )

  it('still accepts sources that merely start with the letters api', () => {
    expect(() => build([{ source: '/apis', destination: '/x' }])).not.toThrow()
  })

  it('accepts a canonical path, the root and a plain https URL', () => {
    expect(() =>
      build([
        { source: '/a', destination: '/b/c-d' },
        { source: '/b', destination: '/' },
        { source: '/c', destination: 'https://example.com/x' },
        { source: '/old-slug-', destination: '/new' },
      ])
    ).not.toThrow()
  })

  it('throws on a /blog destination, which would cost a second 308 for ?page=0', () => {
    expect(() => build([{ source: '/articles', destination: '/blog' }])).toThrow(
      'Redirect destination must not be /blog (its ?page canonicalization would add a second 308): /articles'
    )
    expect(() => build([{ source: '/articles', destination: '/blog/a-post' }])).not.toThrow()
  })

  it('makes every accepted path destination a fixed point of resolveSingleHop, as the proxy emits it', () => {
    const table = build([
      { source: '/a', destination: '/b/c-d' },
      { source: '/b', destination: '/' },
      { source: '/c', destination: '/blog/a-post' },
    ])
    const map = new Map(table.map(({ source, destination }) => [source, destination]))
    for (const { destination } of table) {
      // The proxy builds its Location with new URL(); resolve the destination
      // the same way so URL normalization cannot hide a loop.
      const emitted = new URL(destination, 'https://example.com').pathname
      expect(emitted, destination).toBe(destination)
      expect(resolveSingleHop(emitted, '', map), destination).toBeNull()
      // On Vercel an exact source is answered by the next.config redirect, which
      // forwards the query unchanged; the landing URL must still be final.
      expect(resolveSingleHop(emitted, '?page=0&ref=qa', map), `${destination}?page=0`).toBeNull()
    }
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
