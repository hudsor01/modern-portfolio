import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'
import { getOnly } from './_helpers/settle'

/**
 * UX-01 hub contract: /tools layout at 390/768/1440, card click-through, icon
 * hover target, tool-page breadcrumbs and sitemap entries. Chromium-gated
 * (layout geometry is checked once) and GET-only.
 */

const SITE = 'https://richardwhudsonjr.com'

const TOOLS = [
  { slug: 'pipeline-coverage-calculator', name: 'Pipeline Coverage Calculator' },
  { slug: 'revops-maturity-scorecard', name: 'RevOps Maturity Scorecard' },
] as const

const toolDirs = readdirSync(join(process.cwd(), 'src/app/tools'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith('_'))
  .filter((d) => existsSync(join(process.cwd(), 'src/app/tools', d.name, 'page.tsx')))
  .map((d) => d.name)

async function jsonLd(page: import('@playwright/test').Page): Promise<unknown[]> {
  const raw = await page.locator('script[type="application/ld+json"]').allTextContents()
  return raw.map((t) => JSON.parse(t) as unknown)
}

test.describe('tools hub', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'layout geometry checked once, in Chromium')
    await getOnly(page)
  })

  test('every tool page on disk is in the TOOLS list', () => {
    expect([...toolDirs].sort()).toEqual(TOOLS.map((t) => t.slug).sort())
  })

  test('hub content, nav state, breadcrumb, footer and JSON-LD at 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/tools')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tools')
    await expect(page.locator('main ul > li')).toHaveCount(TOOLS.length)
    for (const tool of TOOLS) {
      await expect(page.getByRole('link', { name: `Open tool: ${tool.name}` })).toHaveAttribute(
        'href',
        `/tools/${tool.slug}`,
      )
    }
    const main = page.getByRole('navigation', { name: 'Main', exact: true })
    await expect(main.getByRole('link', { name: 'Tools' })).toHaveAttribute('aria-current', 'page')

    const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' })
    await expect(crumbs.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    await expect(crumbs.locator('[aria-current="page"]')).toHaveText('Tools')

    await expect(
      page.getByRole('navigation', { name: 'Explore' }).getByRole('link', { name: 'Tools' }),
    ).toHaveAttribute('href', '/tools')

    const lds = (await jsonLd(page)) as { '@type'?: string; itemListElement?: { name: string }[] }[]
    const bc = lds.find((d) => d['@type'] === 'BreadcrumbList')
    expect(bc?.itemListElement?.map((i) => i.name)).toEqual(['Home', 'Tools'])
  })

  test('one column at 390px, no horizontal scroll, tall buttons', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/tools')
    const articles = page.locator('main article')
    await expect(articles).toHaveCount(TOOLS.length)
    const boxes = await articles.evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect()
        return { left: r.left, width: r.width }
      }),
    )
    for (const b of boxes) {
      expect(Math.abs(b.width - 348)).toBeLessThanOrEqual(1)
      expect(Math.abs(b.left - boxes[0].left)).toBeLessThanOrEqual(1)
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(0)
    for (const tool of TOOLS) {
      const box = await page.getByRole('link', { name: `Open tool: ${tool.name}` }).boundingBox()
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44)
    }
  })

  test('two equal-height columns at 768px', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 })
    await page.goto('/tools')
    const articles = page.locator('main article')
    await expect(articles).toHaveCount(TOOLS.length)
    const boxes = await articles.evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect()
        return { top: r.top, left: r.left, width: r.width, height: r.height }
      }),
    )
    expect(Math.abs(boxes[0].top - boxes[1].top)).toBeLessThanOrEqual(1)
    expect(boxes[1].left).toBeGreaterThan(boxes[0].left)
    for (const b of boxes) expect(Math.abs(b.width - 352.5)).toBeLessThanOrEqual(1)
    expect(Math.abs(boxes[0].height - boxes[1].height)).toBeLessThanOrEqual(1)
  })

  test('icon tile is hoverable and the whole card is the link', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/tools')
    // Fails if the stretched link overlay intercepts the tile.
    await page.locator('[data-slot="tool-icon"]').first().hover({ trial: true })

    const summary = page.locator('main article p').first()
    await expect(summary).toBeVisible()
    const box = await summary.boundingBox()
    if (!box) throw new Error('summary box missing')
    // A locator click would be refused because the overlay covers the paragraph.
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
    await page.waitForURL(`**/tools/${TOOLS[0].slug}`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(TOOLS[0].name)
  })

  for (const tool of TOOLS) {
    test(`${tool.slug} breadcrumb at 1440px`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto(`/tools/${tool.slug}`)
      const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' })
      await expect(crumbs).toBeVisible()
      await expect(crumbs).toContainText('Home')
      await expect(crumbs).toContainText('Tools')
      await expect(crumbs.locator('[aria-current="page"]')).toHaveText(tool.name)
      await expect(crumbs.locator('li')).toHaveText(['Home', '›', 'Tools', '›', tool.name])

      const lds = (await jsonLd(page)) as {
        '@type'?: string
        itemListElement?: Record<string, unknown>[]
      }[]
      const bc = lds.find((d) => d['@type'] === 'BreadcrumbList')
      expect(bc?.itemListElement?.[1]).toEqual({
        '@type': 'ListItem',
        position: 2,
        name: 'Tools',
        item: `${SITE}/tools`,
      })

      await crumbs.getByRole('link', { name: 'Tools' }).click()
      await page.waitForURL('**/tools')
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tools')
    })
  }

  test('sitemap lists the hub and every tool', async ({ page }) => {
    const res = await page.request.get('/sitemap.xml')
    expect(res.status()).toBe(200)
    const body = await res.text()
    expect(body).toContain(`<loc>${SITE}/tools</loc>`)
    for (const tool of TOOLS) expect(body).toContain(`<loc>${SITE}/tools/${tool.slug}</loc>`)
  })
})
