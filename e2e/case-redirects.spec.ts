import { expect, test } from '@playwright/test'
import { RESUME_PDF_PATH } from '../src/lib/resume-pdf'

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

  for (const path of ['/api/Health-Check', '/_next/Foo', '/LLMS.txt']) {
    test(`${path} is not redirected`, async ({ request }) => {
      const res = await request.get(path, { maxRedirects: 0 })
      expect(res.status()).not.toBe(308)
      expect(res.headers().location).toBeUndefined()
    })
  }
})
