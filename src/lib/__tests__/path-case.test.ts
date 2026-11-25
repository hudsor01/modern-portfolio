// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { lowercasePathRedirect } from '@/lib/path-case'

describe('lowercasePathRedirect', () => {
  it.each([
    ['/About', '/about'],
    ['/Blog/Some-Post', '/blog/some-post'],
    ['/About/', '/about/'],
    ['/Tools/Pipeline-Coverage', '/tools/pipeline-coverage'],
    ['//Evil.com/Path', '//evil.com/path'],
  ])('lowercases %s to %s', (input, expected) => {
    expect(lowercasePathRedirect(input)).toBe(expected)
  })

  it.each(['/', '/about', '/blog/some-post'])('returns null without uppercase: %s', (input) => {
    expect(lowercasePathRedirect(input)).toBeNull()
  })

  it.each(['/api/Blog', '/API/blog', '/Api', '/_next/Static/x', '/_NEXT/data'])(
    'never redirects api or _next: %s',
    (input) => {
      expect(lowercasePathRedirect(input)).toBeNull()
    }
  )

  it.each([
    '/Richard_Hudson_Revenue_Operations.pdf',
    '/Images/Hero.PNG',
    '/LLMS.txt',
    '/Favicon.ico',
  ])('never redirects file-like paths: %s', (input) => {
    expect(lowercasePathRedirect(input)).toBeNull()
  })

  it.each(['/Caf%C3%A9', '/About%2FTeam'])('never redirects percent-encoded: %s', (input) => {
    expect(lowercasePathRedirect(input)).toBeNull()
  })

  it.each(['/About', '/Blog/Some-Post', '/About/', '/Tools/Pipeline-Coverage', '//Evil.com/Path'])(
    'is idempotent (no loop): %s',
    (input) => {
      const once = lowercasePathRedirect(input)
      expect(once).not.toBeNull()
      expect(lowercasePathRedirect(once as string)).toBeNull()
    }
  )
})
