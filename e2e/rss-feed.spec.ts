import { test, expect } from '@playwright/test'
import { databaseAvailable, NEEDS_DATABASE } from './_helpers/database'

const RFC_822 = /^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT$/

test.describe('RSS feed', () => {
  test('home page autodiscovery link points at the feed', async ({ page }) => {
    await page.goto('/')
    const link = page.locator('link[rel="alternate"][type="application/rss+xml"]')
    await expect(link).toHaveAttribute('href', '/api/blog/rss')
  })

  test('served feed is well-formed RSS 2.0 and JSON stays at ?format=json', async ({ page }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)

    const res = await page.request.get('/api/blog/rss')
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('application/rss+xml')
    const body = await res.text()
    expect(body.startsWith('<?xml')).toBe(true)
    expect(body).toContain(
      '<atom:link href="https://richardwhudsonjr.com/api/blog/rss" rel="self"'
    )
    expect(body).not.toContain('<![CDATA[')

    const parserErrors = await page.evaluate(
      (xml) =>
        new DOMParser().parseFromString(xml, 'application/xml').getElementsByTagName('parsererror')
          .length,
      body
    )
    expect(parserErrors).toBe(0)

    const dates = [...body.matchAll(/<pubDate>([^<]*)<\/pubDate>/g)].map((m) => m[1] ?? '')
    for (const d of dates) expect(d).toMatch(RFC_822)

    const json = await page.request.get('/api/blog/rss?format=json')
    expect(json.status()).toBe(200)
    const data = await json.json()
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data.posts)).toBe(true)
  })
})
