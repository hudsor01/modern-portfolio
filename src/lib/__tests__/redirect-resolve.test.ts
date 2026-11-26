// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { CONTACT } from '@/lib/contact-info'
import { resolveSingleHop } from '@/lib/redirect-resolve'
import { REDIRECT_MAP, REDIRECTS } from '@/lib/redirects'
import { RESUME_PDF_PATH } from '@/lib/resume-pdf'

const resolve = (pathname: string, search = '') => resolveSingleHop(pathname, search, REDIRECT_MAP)

describe('resolveSingleHop', () => {
  it.each([
    ['/About/', '', '/about', ''],
    ['/about/', '', '/about', ''],
    ['/about//', '', '/about', ''],
    ['/ABOUT', '', '/about', ''],
    ['/About/', '?ref=QA', '/about', '?ref=QA'],
    ['/Home', '', '/', ''],
    ['/home/', '', '/', ''],
    ['/HOME/', '', '/', ''],
    ['/home', '?x=1', '/', '?x=1'],
    [
      '/blog/Revenue-Operations-Best-Practices-Complete-Guide/',
      '',
      '/blog/complete-guide-revenue-operations-strategy',
      '',
    ],
    ['/blog/some-post/', '', '/blog/some-post', ''],
    ['/Blog/Some-Post', '', '/blog/some-post', ''],
    ['/api/health/', '', '/api/health', ''],
    ['/api/Health-Check/', '', '/api/Health-Check', ''],
    ['/llms.txt/', '', '/llms.txt', ''],
    ['/Caf%C3%A9/', '', '/Caf%C3%A9', ''],
  ])('%s%s -> %s%s', (pathname, search, expectedPath, expectedSearch) => {
    expect(resolve(pathname, search)).toEqual({
      kind: 'internal',
      pathname: expectedPath,
      search: expectedSearch,
    })
  })

  it('splits /Blog?page=0 into path and empty search', () => {
    expect(resolve('/Blog', '?page=0')).toEqual({ kind: 'internal', pathname: '/blog', search: '' })
  })

  it.each([
    ['/blog/', '?page=0', ''],
    ['/blog/', '?page=abc&q=x', '?q=x'],
    ['/Blog/', '?page=abc&q=x', '?q=x'],
    ['/blog', '?page=1', ''],
    ['/blog', '?page=0&tag=a&tag=b', '?tag=a&tag=b'],
    ['/blog', '?page=2&page=3', ''],
  ])('canonicalizes the /blog page param: %s%s', (pathname, search, expectedSearch) => {
    expect(resolve(pathname, search)).toEqual({
      kind: 'internal',
      pathname: '/blog',
      search: expectedSearch,
    })
  })

  it('keeps a canonical page and only fixes the path: /Blog/?page=2', () => {
    expect(resolve('/Blog/', '?page=2')).toEqual({
      kind: 'internal',
      pathname: '/blog',
      search: '?page=2',
    })
  })

  it.each([
    ['/Github/', '', CONTACT.github.url],
    ['/github/', '', CONTACT.github.url],
    ['/Github', '', CONTACT.github.url],
    ['/github', '?x=1', `${CONTACT.github.url}?x=1`],
    ['/Linkedin/', '', CONTACT.linkedin.url],
    ['/Twitter', '', CONTACT.twitter.url],
  ])('sends %s%s to the external profile', (pathname, search, href) => {
    expect(resolve(pathname, search)).toEqual({ kind: 'external', href })
  })

  it.each([
    ['/', ''],
    ['/about', ''],
    ['/about', '?ref=QA'],
    ['/blog', ''],
    ['/blog', '?page=2'],
    ['/blog', '?q=x'],
    ['/blog/some-post', '?page=0'],
    ['/api/Health-Check', ''],
    ['/API/Blog', ''],
    ['/_next/Foo', ''],
    ['/LLMS.txt', ''],
    [RESUME_PDF_PATH, ''],
    ['/Caf%C3%A9', ''],
    ['//Evil.com/x', ''],
    ['//evil.com/', ''],
    ['/\\Evil.com', ''],
    ['/About\\Team/', ''],
  ])('leaves %s%s alone', (pathname, search) => {
    expect(resolve(pathname, search)).toBeNull()
  })

  it('makes every internal table destination a fixed point', () => {
    for (const { destination } of REDIRECTS) {
      if (destination.startsWith('https://')) continue
      expect(resolve(destination), destination).toBeNull()
    }
  })

  it('only ever returns a same-origin path or a table destination', () => {
    const externals = new Set(REDIRECTS.map(({ destination }) => destination))
    for (const path of ['/Github/', '/Linkedin', '/TWITTER/', '/About/', '/Blog/']) {
      const hit = resolve(path)
      expect(hit).not.toBeNull()
      if (hit?.kind === 'external') expect(externals.has(hit.href)).toBe(true)
      if (hit?.kind === 'internal') {
        expect(hit.pathname.startsWith('/')).toBe(true)
        expect(hit.pathname.startsWith('//')).toBe(false)
      }
    }
  })

  it('reaches a fixed point after one internal hop', () => {
    for (const path of ['/About/', '/HOME/', '/Blog/?page=abc&q=x', '/api/health/', '/llms.txt/']) {
      const [pathname, query = ''] = path.split('?')
      const hit = resolve(pathname, query ? `?${query}` : '')
      expect(hit?.kind).toBe('internal')
      if (hit?.kind === 'internal') expect(resolve(hit.pathname, hit.search)).toBeNull()
    }
  })
})
