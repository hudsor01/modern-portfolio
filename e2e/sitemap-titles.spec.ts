import { expect, test } from '@playwright/test'
import { databaseAvailable } from './_helpers/database'

/**
 * BUG-04 guard: every sitemap URL's <title> carries the brand exactly once.
 * The one exception (src/lib/post-title.ts): a blog post or category title
 * that fits the 60-char budget only without " | Richard Hudson" renders whole
 * and unbranded, so a search result never shows a word-cut title.
 */
const TITLE_BUDGET = 60
const BRAND_SUFFIX_LENGTH = ' | Richard Hudson'.length
const BLOG_TITLE_PATH = /^\/blog\/(?:category\/)?[^/]+$/

function isFullUnbrandedTitle(path: string, title: string): boolean {
  return (
    BLOG_TITLE_PATH.test(path) &&
    !title.includes(' | ') &&
    title.length <= TITLE_BUDGET &&
    title.length + BRAND_SUFFIX_LENGTH > TITLE_BUDGET
  )
}

const BRAND = 'Richard Hudson'
const HOME_TITLE = 'Richard Hudson | RevOps Professional in Dallas-Fort Worth'

function decode(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
}

test('every sitemap URL has a single-brand title', async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'crawl runs once, on chromium')
  test.setTimeout(120_000)

  const xml = await (await request.get('/sitemap.xml')).text()
  const paths = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1] ?? '').pathname)
  expect(paths.length).toBeGreaterThan(0)
  if (await databaseAvailable(request)) {
    expect(
      paths.some((p) => p.startsWith('/blog/')),
      'DB is up but sitemap lists no /blog/ path'
    ).toBe(true)
  }

  const failures: string[] = []
  for (const path of paths) {
    const response = await request.get(path)
    if (response.status() !== 200) {
      failures.push(`${path}: status ${response.status()}`)
      continue
    }
    const match = (await response.text()).match(/<title[^>]*>([\s\S]*?)<\/title>/)
    const title = decode((match?.[1] ?? '').trim())
    const brandCount = title.split(BRAND).length - 1
    if (brandCount === 0 && isFullUnbrandedTitle(path, title)) continue
    if (brandCount !== 1) failures.push(`${path}: brand x${brandCount} in "${title}"`)
    if (path === '/') {
      if (title !== HOME_TITLE) failures.push(`/: title "${title}" != "${HOME_TITLE}"`)
    } else if (!title.endsWith(` | ${BRAND}`)) {
      failures.push(`${path}: bad shape "${title}"`)
    }
  }
  expect(failures, failures.join('\n')).toEqual([])
})
