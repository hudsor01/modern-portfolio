// @vitest-environment node
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import { CONTACT, mailtoHref, telHref } from '@/lib/contact-info'
import { REDIRECT_MAP } from '@/lib/redirects'
import { siteConfig } from '@/lib/site'

/**
 * Guard for CONTENT-02. The literals below are the independent oracle for
 * CONTACT. Static files that cannot import CONTACT (llms.txt, security.txt)
 * are pinned to it here; vercel.json no longer holds redirects, and the
 * profile redirects are pinned via REDIRECT_MAP.
 */
const ROOT = process.cwd()

const SKIPPED_DIRS = new Set(['__tests__', 'node_modules', '.next'])

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) {
      return SKIPPED_DIRS.has(name) ? [] : sourceFiles(path)
    }
    return /\.(ts|tsx|js|mjs)$/.test(name) ? [path] : []
  })
}

function scanFiles(roots: string[]): string[] {
  return roots.flatMap((root) => sourceFiles(join(ROOT, root)))
}

describe('CONTACT', () => {
  it('holds the owner contact details', () => {
    expect(CONTACT.email).toBe('hudsor01@icloud.com')
    expect(CONTACT.phone.international).toBe('+1-214-566-0279')
    expect(CONTACT.phone.display).toBe('214.566.0279')
    expect(CONTACT.location.city).toBe('Dallas')
    expect(CONTACT.location.region).toBe('TX')
    expect(CONTACT.location.country).toBe('US')
    expect(CONTACT.location.display).toBe('Dallas, TX')
    expect(CONTACT.linkedin.url).toBe('https://www.linkedin.com/in/hudsor01')
    expect(CONTACT.linkedin.display).toBe('linkedin.com/in/hudsor01')
    expect(CONTACT.github.url).toBe('https://github.com/hudsor01')
    expect(CONTACT.github.display).toBe('github.com/hudsor01')
    expect(CONTACT.twitter.url).toBe('https://twitter.com/hudsor01')
    expect(CONTACT.twitter.handle).toBe('@hudsor01')
    expect(CONTACT.github.username).toBe('hudsor01')
    expect(CONTACT.linkedin.username).toBe('hudsor01')
    expect(CONTACT.twitter.username).toBe('hudsor01')
  })

  it('derives mailto and tel hrefs', () => {
    expect(mailtoHref).toBe('mailto:hudsor01@icloud.com')
    expect(telHref).toBe('tel:+12145660279')
  })

  it('imports nothing', () => {
    const source = readFileSync(join(ROOT, 'src/lib/contact-info.ts'), 'utf8')
    expect(source).not.toMatch(/^\s*import\s/m)
  })

  it('feeds siteConfig', () => {
    expect(siteConfig.links.github).toBe(CONTACT.github.url)
    expect(siteConfig.links.linkedin).toBe(CONTACT.linkedin.url)
    expect(siteConfig.links.twitter).toBe(CONTACT.twitter.url)
    expect(siteConfig.author.email).toBe(CONTACT.email)
  })
})

describe('static files agree with CONTACT', () => {
  it('llms.txt lists the profile links', () => {
    const llms = readFileSync(join(ROOT, 'public/llms.txt'), 'utf8')
    expect(llms).toContain(CONTACT.linkedin.url)
    expect(llms).toContain(CONTACT.github.url)
  })

  it('llms.txt states the CONTACT location and no other base city', () => {
    const llms = readFileSync(join(ROOT, 'public/llms.txt'), 'utf8')
    const match = /based in ([A-Z][A-Za-z .]+, [A-Z]{2})\b/.exec(llms)
    expect(match?.[1]).toBe(CONTACT.location.display)
    expect(llms).not.toMatch(/\bPlano\b/)
  })

  it('profile redirects equal the CONTACT urls', () => {
    expect(REDIRECT_MAP.get('/github')).toBe(CONTACT.github.url)
    expect(REDIRECT_MAP.get('/linkedin')).toBe(CONTACT.linkedin.url)
    expect(REDIRECT_MAP.get('/twitter')).toBe(CONTACT.twitter.url)
  })

  it('vercel.json has no redirects', () => {
    const config = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8')) as object
    expect('redirects' in config).toBe(false)
  })

  it('security.txt contact is the mailto link', () => {
    const txt = readFileSync(join(ROOT, 'public/.well-known/security.txt'), 'utf8')
    expect(txt).toContain(`Contact: ${mailtoHref}`)
  })
})

describe('stale location', () => {
  it('no non-test source file mentions Plano', () => {
    const offenders = sourceFiles(join(ROOT, 'src'))
      .filter((file) => /\bPlano\b/.test(readFileSync(file, 'utf8')))
      .map((file) => relative(ROOT, file))
    expect(offenders).toEqual([])
  })
})

describe('contact details have one source', () => {
  const LITERALS = [
    'hudsor01@icloud.com',
    '+1-214-566-0279',
    '214.566.0279',
    '214-566-0279',
    'linkedin.com/in/hudsor01',
    'github.com/hudsor01',
    'twitter.com/hudsor01',
    "'@hudsor01'",
    'Based in Dallas',
    'Dallas, TX',
    "'hudsor01'",
    '"hudsor01"',
  ]

  it('no source file outside contact-info.ts repeats a contact or location literal', () => {
    const offenders = scanFiles(['src', 'drizzle', 'scripts'])
      .map((file) => relative(ROOT, file))
      .filter((file) => file !== join('src', 'lib', 'contact-info.ts'))
      .filter((file) => {
        const text = readFileSync(join(ROOT, file), 'utf8')
        return LITERALS.some((literal) => text.includes(literal))
      })
    expect(
      offenders,
      `import CONTACT from '@/lib/contact-info' (relative path in drizzle/ and scripts/) instead of repeating contact details in: ${offenders.join(', ')}`
    ).toEqual([])
  })
})
