// @vitest-environment node
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import { CONTACT, mailtoHref, SERVICE_AREA, telHref } from '@/lib/contact-info'
import { REDIRECT_MAP } from '@/lib/redirects'
import { siteConfig } from '@/lib/site'

/**
 * Guard for CONTENT-02. The literals below are the independent oracle for
 * CONTACT. Static files that cannot import CONTACT (llms.txt, security.txt)
 * are pinned to it here; vercel.json no longer holds redirects, and the
 * profile redirects are pinned via REDIRECT_MAP.
 */
const ROOT = process.cwd()

/**
 * What the one-source scan reads, decided deliberately:
 * - Roots: src/, drizzle/, scripts/ and the root next.config.js. Every file
 *   there can import CONTACT (or is data that must not repeat it).
 * - Types: .ts .tsx .js .mjs .json .css .md .txt. Binary assets (fonts,
 *   images, the résumé PDF) are never read.
 * - Skipped dirs: __tests__ (test files hold the oracle literals on purpose),
 *   node_modules and .next.
 * - Not scanned at all: public/ (llms.txt and security.txt cannot import
 *   CONTACT and are pinned to it by the 'static files agree' tests; the rest is
 *   binary), e2e/ (Playwright specs assert rendered output against literals,
 *   like __tests__), README.md, SECURITY.md, CLAUDE.md and .planning/ (prose
 *   docs outside the build).
 * - Allowed file: src/lib/contact-info.ts (the source itself).
 * - src/data/redirects.json is scanned with only its three profile
 *   destinations removed: JSON cannot import CONTACT, and 'profile redirects
 *   equal the CONTACT urls' pins those values. Any other literal in it (a
 *   "why" string, a new entry) is still caught.
 */
const SCAN_ROOTS = ['src', 'drizzle', 'scripts', 'next.config.js']
const SCANNED_TYPES = /\.(ts|tsx|js|mjs|json|css|md|txt)$/
const SKIPPED_DIRS = new Set(['__tests__', 'node_modules', '.next'])
const ALLOWED_FILES = new Set([join('src', 'lib', 'contact-info.ts')])
const REDIRECTS_JSON = join('src', 'data', 'redirects.json')
const PINNED_PROFILE_URLS = [CONTACT.github.url, CONTACT.linkedin.url, CONTACT.twitter.url]

/** File text as the scan sees it: redirects.json minus its CONTACT-pinned destinations. */
function scannedText(file: string, text = readFileSync(join(ROOT, file), 'utf8')): string {
  if (file !== REDIRECTS_JSON) return text
  return PINNED_PROFILE_URLS.reduce(
    (rest, url) => rest.replaceAll(`"destination": "${url}"`, '"destination": ""'),
    text
  )
}

function sourceFiles(path: string): string[] {
  if (!statSync(path).isDirectory()) return SCANNED_TYPES.test(path) ? [path] : []
  return readdirSync(path).flatMap((name) =>
    SKIPPED_DIRS.has(name) ? [] : sourceFiles(join(path, name))
  )
}

function scanFiles(roots: string[]): string[] {
  return roots.flatMap((root) => sourceFiles(join(ROOT, root)))
}

/** Collapses newlines and indentation, so JSX text wrapped by Biome still matches. */
const normalizeSpace = (text: string) => text.replace(/\s+/g, ' ')

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

  it('llms.txt states the CONTACT location in every location sentence', () => {
    const llms = normalizeSpace(readFileSync(join(ROOT, 'public/llms.txt'), 'utf8'))
    const stated = [...llms.matchAll(/\b(?:based|located) in ([A-Z][A-Za-z .]+, [A-Z]{2})\b/gi)]
    expect(stated.length).toBeGreaterThan(0)
    for (const [, location] of stated) expect(location).toBe(CONTACT.location.display)
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
  // Matched case-insensitively after whitespace is collapsed.
  const LITERALS = [
    'hudsor01@icloud.com',
    'linkedin.com/in/hudsor01',
    'github.com/hudsor01',
    'twitter.com/hudsor01',
    '@hudsor01',
    'Based in Dallas',
    'Dallas, TX',
    "'hudsor01'",
    '"hudsor01"',
    '`hudsor01`',
  ].map((literal) => literal.toLowerCase())

  // Every phone form reduces to these digits: +1-214-566-0279, +12145660279,
  // (214) 566-0279, 214.566.0279, 214-566-0279, 214 566 0279, 2145660279.
  const PHONE_DIGITS = '2145660279'
  const PHONE_LIKE = /\+?\(?\d[\d().\s-]{8,}\d/g

  const repeatsPhone = (text: string) =>
    [...text.matchAll(PHONE_LIKE)].some(([run]) => run.replace(/\D/g, '').includes(PHONE_DIGITS))

  const repeatsContact = (raw: string) => {
    const text = normalizeSpace(raw)
    const lower = text.toLowerCase()
    return LITERALS.some((literal) => lower.includes(literal)) || repeatsPhone(text)
  }

  it.each([
    ['wrapped JSX text', '<p>\n  Based in\n                Dallas, serving\n</p>'],
    ['the tel form', "href: 'tel:+12145660279'"],
    ['the international form', '+1-214-566-0279'],
    ['a parenthesised form', 'Call (214) 566-0279'],
    ['a dotted form', '214.566.0279'],
    ['a dashed form', '214-566-0279'],
    ['a spaced form', '214 566 0279'],
    ['a digits-only form', 'phone: 2145660279,'],
    ['an uppercase email', 'HUDSOR01@iCloud.com'],
    ['a mixed-case profile URL', 'https://GitHub.com/Hudsor01'],
  ])('detects %s', (_label, text) => {
    expect(repeatsContact(text)).toBe(true)
  })

  it.each([
    ['other numbers', 'const years = [2014, 2015, 2016] // 566 0279x'],
    ['CONTACT references', 'Based in {CONTACT.location.city}, {CONTACT.phone.display}'],
  ])('does not flag %s', (_label, text) => {
    expect(repeatsContact(text)).toBe(false)
  })

  it('no scanned file outside the allowed ones repeats a contact or location literal', () => {
    const files = scanFiles(SCAN_ROOTS).map((file) => relative(ROOT, file))
    expect(files).toContain('next.config.js')
    expect(files).toContain(join('src', 'app', 'globals.css'))
    expect(files).toContain(REDIRECTS_JSON)
    const offenders = files
      .filter((file) => !ALLOWED_FILES.has(file))
      .filter((file) => repeatsContact(scannedText(file)))
    expect(
      offenders,
      `import CONTACT from '@/lib/contact-info' (relative path in drizzle/ and scripts/) instead of repeating contact details in: ${offenders.join(', ')}`
    ).toEqual([])
  })
})

describe('redirects.json scan', () => {
  it('removes only the CONTACT-pinned profile destinations', () => {
    const text = scannedText(REDIRECTS_JSON)
    for (const url of PINNED_PROFILE_URLS) expect(text).not.toContain(url)
    expect(text).toContain('"source": "/github"')
  })

  it('keeps every other value, so a contact literal in a "why" string is still scanned', () => {
    const json = `[{ "source": "/github", "destination": "${CONTACT.github.url}", "why": "see github.com/hudsor01" }]`
    const text = scannedText(REDIRECTS_JSON, json)
    expect(text).not.toContain(`"destination": "${CONTACT.github.url}"`)
    expect(text).toContain('see github.com/hudsor01')
  })
})

describe('service area', () => {
  // SERVICE_AREA is a literal fact, not derived from the city, so a city change
  // that leaves the area list behind fails here instead of rendering copy that
  // contradicts itself on /contact.
  it('starts at the CONTACT city and names a region that contains it', () => {
    expect(SERVICE_AREA.startsWith(`${CONTACT.location.city}, `)).toBe(true)
    expect(SERVICE_AREA).toMatch(new RegExp(`the broader ${CONTACT.location.city}\\b[^,]*$`))
    expect(`Based in ${CONTACT.location.city}, serving ${SERVICE_AREA}`).toBe(
      'Based in Dallas, serving Dallas, Fort Worth, Frisco, and the broader Dallas-Fort Worth Metroplex'
    )
  })

  it('is what the contact page renders, not a hardcoded city list', () => {
    const source = normalizeSpace(
      readFileSync(join(ROOT, 'src/app/contact/contact-client.tsx'), 'utf8')
    )
    expect(source).toContain('Based in {CONTACT.location.city}, serving {SERVICE_AREA} — remote')
    expect(source).not.toMatch(/Fort Worth|Frisco|Metroplex/)
  })
})
