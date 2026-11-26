import { expect, test } from '@playwright/test'
import { CONTACT } from '../src/lib/contact-info'
import { RESUME_PDF_PATH } from '../src/lib/resume-pdf'

// One 308 straight to the final URL, then the target answers 200 with no
// further redirect. The local server matches config redirects
// case-insensitively and Vercel does not, so these pass locally either way;
// src/lib/__tests__/redirect-hops.test.ts is the Vercel-model guard.
const SINGLE_HOP: Array<[string, string]> = [
  ['/Home', '/'],
  ['/home/', '/'],
  ['/HOME/', '/'],
  ['/About/', '/about'],
  ['/About/?ref=QA', '/about?ref=QA'],
  ['/about/', '/about'],
  [
    '/blog/Revenue-Operations-Best-Practices-Complete-Guide/',
    '/blog/complete-guide-revenue-operations-strategy',
  ],
  ['/api/health/', '/api/health'],
  ['/llms.txt/', '/llms.txt'],
]

const EXTERNAL: Array<[string, string]> = [
  ['/Github/', CONTACT.github.url],
  ['/Linkedin/', CONTACT.linkedin.url],
]

test.describe('mixed-case path redirects', () => {
  test('/About 308s to /about and keeps the query', async ({ request, baseURL }) => {
    const res = await request.get('/About?ref=QA', { maxRedirects: 0 })
    expect(res.status()).toBe(308)
    const target = new URL(res.headers().location ?? '', baseURL)
    expect(target.pathname).toBe('/about')
    expect(target.search).toBe('?ref=QA')
  })

  test('/About lands on the about page', async ({ page }) => {
    const res = await page.goto('/About')
    expect(res?.status()).toBe(200)
    expect(page.url().endsWith('/about')).toBe(true)
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
  })

  test('/Blog/Some-Post 308s to lowercase without looping', async ({ request, baseURL }) => {
    const res = await request.get('/Blog/Some-Post', { maxRedirects: 0 })
    expect(res.status()).toBe(308)
    expect(new URL(res.headers().location ?? '', baseURL).pathname).toBe('/blog/some-post')

    const followed = await request.get('/Blog/Some-Post')
    expect(followed.url().endsWith('/blog/some-post')).toBe(true)
    expect(followed.status()).not.toBe(308)
  })

  test('the resume PDF is never redirected', async ({ request }) => {
    const res = await request.get(RESUME_PDF_PATH)
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('application/pdf')
  })

  for (const [path, expected] of SINGLE_HOP) {
    test(`${path} 308s to ${expected} in one hop`, async ({ request, baseURL }) => {
      const res = await request.get(path, { maxRedirects: 0 })
      expect(res.status()).toBe(308)
      const target = new URL(res.headers().location ?? '', baseURL)
      expect(`${target.pathname}${target.search}`).toBe(expected)

      const landed = await request.get(`${target.pathname}${target.search}`, { maxRedirects: 0 })
      expect(landed.status()).toBe(200)
      expect(landed.headers().location).toBeUndefined()
    })
  }

  for (const [path, expected] of EXTERNAL) {
    test(`${path} 308s straight to ${expected}`, async ({ request }) => {
      const res = await request.get(path, { maxRedirects: 0 })
      expect(res.status()).toBe(308)
      expect(res.headers().location).toBe(expected)
    })
  }

  for (const path of ['/api/Health-Check', '/_next/Foo', '/LLMS.txt']) {
    test(`${path} is not redirected`, async ({ request }) => {
      const res = await request.get(path, { maxRedirects: 0 })
      expect(res.status()).not.toBe(308)
      expect(res.headers().location).toBeUndefined()
    })
  }
})
