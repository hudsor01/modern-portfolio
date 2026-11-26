// @vitest-environment node
import { getRelativeURL } from 'next/dist/shared/lib/router/utils/relativize-url'
import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'
import { CONTACT } from '@/lib/contact-info'
import { RESUME_PDF_PATH } from '@/lib/resume-pdf'
import { config, proxy } from '@/proxy'

const ORIGIN = 'https://richardwhudsonjr.com'
const run = (path: string) => proxy(new NextRequest(`${ORIGIN}${path}`))

const SAME_ORIGIN_REDIRECTS: Array<[string, string]> = [
  ['/About/', `${ORIGIN}/about`],
  ['/about/', `${ORIGIN}/about`],
  ['/About?x=Y', `${ORIGIN}/about?x=Y`],
  ['/About/?ref=QA', `${ORIGIN}/about?ref=QA`],
  ['/ABOUT', `${ORIGIN}/about`],
  ['/Blog/Some-Post', `${ORIGIN}/blog/some-post`],
  ['/blog/some-post/', `${ORIGIN}/blog/some-post`],
  ['/Home', `${ORIGIN}/`],
  ['/HOME/', `${ORIGIN}/`],
  ['/home/', `${ORIGIN}/`],
  ['/Blog?page=0', `${ORIGIN}/blog`],
  ['/blog/?page=0', `${ORIGIN}/blog`],
  ['/Blog/?page=abc&q=x', `${ORIGIN}/blog?q=x`],
  [
    '/blog/Revenue-Operations-Best-Practices-Complete-Guide/',
    `${ORIGIN}/blog/complete-guide-revenue-operations-strategy`,
  ],
  ['/api/health/', `${ORIGIN}/api/health`],
  ['/llms.txt/', `${ORIGIN}/llms.txt`],
]

const EXTERNAL_REDIRECTS: Array<[string, string]> = [
  ['/Github/', CONTACT.github.url],
  ['/github/', CONTACT.github.url],
  ['/Github?x=1', `${CONTACT.github.url}?x=1`],
  ['/Linkedin/', CONTACT.linkedin.url],
  ['/Twitter', CONTACT.twitter.url],
]

describe('proxy single-hop redirect', () => {
  it.each(SAME_ORIGIN_REDIRECTS)('308s %s to %s with no CSP', (path, location) => {
    const res = run(path)
    expect(res.status).toBe(308)
    expect(res.headers.get('location')).toBe(location)
    expect(res.headers.get('content-security-policy')).toBeNull()
  })

  it.each(EXTERNAL_REDIRECTS)('308s %s to the profile %s with no CSP', (path, location) => {
    const res = run(path)
    expect(res.status).toBe(308)
    expect(res.headers.get('location')).toBe(location)
    expect(res.headers.get('content-security-policy')).toBeNull()
  })

  // Following each Location once must not redirect again: a cloned nextUrl
  // re-appends the request's trailing slash, which would loop with
  // skipTrailingSlashRedirect on.
  it.each(SAME_ORIGIN_REDIRECTS)('does not loop: %s', (path) => {
    const location = run(path).headers.get('location') as string
    const followed = proxy(new NextRequest(location))
    expect(followed.headers.get('location')).toBeNull()
    expect(followed.headers.get('content-security-policy')).toBeTruthy()
  })

  it.each(['//Evil.com/Path?q=A', '/\\Evil.com/Path', '//evil.com/'])(
    'does not redirect a protocol-relative path: %s',
    (path) => {
      expect(run(path).headers.get('location')).toBeNull()
    }
  )

  // Next's router relativizes same-origin proxy redirects before sending
  // them (resolve-routes.js), so check the Location the browser actually gets.
  it.each(SAME_ORIGIN_REDIRECTS)(
    'stays on-site after Next relativizes the Location: %s',
    (path) => {
      const location = run(path).headers.get('location')
      expect(location).not.toBeNull()
      const sent = getRelativeURL(location as string, `${ORIGIN}${path}`)
      expect(sent.startsWith('//')).toBe(false)
      expect(new URL(sent, `${ORIGIN}/`).origin).toBe(ORIGIN)
    }
  )

  it('passes lowercase paths through with a CSP', () => {
    const res = run('/about')
    expect(res.headers.get('location')).toBeNull()
    expect(res.headers.get('content-security-policy')).toBeTruthy()
  })

  it.each([
    '/about',
    '/blog?page=2',
    '/API/Blog',
    '/api/Health-Check',
    '/_next/Foo',
    '/LLMS.txt',
    RESUME_PDF_PATH,
  ])('passes %s through', (path) => {
    expect(run(path).headers.get('location')).toBeNull()
  })

  it('keeps the original matcher', () => {
    expect(config.matcher).toEqual([
      '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)',
    ])
  })
})
