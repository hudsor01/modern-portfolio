// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { lowercasePathRedirect } from '@/lib/path-case'
import { RESUME_PDF_PATH } from '@/lib/resume-pdf'

describe('lowercasePathRedirect', () => {
  it.each([
    ['/About', '/about'],
    ['/Blog/Some-Post', '/blog/some-post'],
    ['/About/', '/about/'],
    ['/Tools/Pipeline-Coverage', '/tools/pipeline-coverage'],
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

  it.each([RESUME_PDF_PATH, '/Images/Hero.PNG', '/LLMS.txt', '/Favicon.ico'])(
    'never redirects file-like paths: %s',
    (input) => {
      expect(lowercasePathRedirect(input)).toBeNull()
    }
  )

  it.each(['/Caf%C3%A9', '/About%2FTeam'])('never redirects percent-encoded: %s', (input) => {
    expect(lowercasePathRedirect(input)).toBeNull()
  })

  it.each(['//Evil.com/Path', '//Evil.com', '/\\Evil.com/Path', '/About\\Team'])(
    'never emits a protocol-relative target: %s',
    (input) => {
      expect(lowercasePathRedirect(input)).toBeNull()
    }
  )

  it.each(['/About', '/Blog/Some-Post', '/About/', '/Tools/Pipeline-Coverage'])(
    'is idempotent (no loop): %s',
    (input) => {
      const once = lowercasePathRedirect(input)
      expect(once).not.toBeNull()
      expect(lowercasePathRedirect(once as string)).toBeNull()
    }
  )
})
