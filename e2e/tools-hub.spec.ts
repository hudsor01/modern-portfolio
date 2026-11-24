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

test.describe('scorecard geometry', () => {
  const URL = '/tools/revops-maturity-scorecard'

  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'layout geometry checked once, in Chromium')
    await getOnly(page)
  })

  for (const width of [390, 1440]) {
    test(`legends sit inside their card borders at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(URL)
      await expect(page.locator('fieldset').first()).toBeVisible()
      const rows = await page.locator('fieldset').evaluateAll((els) =>
        els.map((fs) => {
          const f = fs.getBoundingClientRect()
          const l = (fs.querySelector(':scope > legend') as HTMLElement).getBoundingClientRect()
          const bw = Number.parseFloat(getComputedStyle(fs).borderTopWidth)
          return {
            gap: l.top - (f.top + bw),
            left: l.left - f.left,
            right: f.right - l.right,
            bottom: f.bottom - l.bottom,
          }
        }),
      )
      expect(rows.length).toBeGreaterThan(0)
      for (const r of rows) {
        expect(r.gap).toBeGreaterThanOrEqual(0)
        expect(r.left).toBeGreaterThanOrEqual(0)
        expect(r.right).toBeGreaterThanOrEqual(0)
        expect(r.bottom).toBeGreaterThan(0)
      }
    })
  }

  test('rating options fit at 390px with full accessible names', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(URL)
    await expect(page.locator('fieldset').first()).toBeVisible()
    const opts = await page.locator('fieldset label').evaluateAll((els) =>
      els.map((el) => {
        const lh = Number.parseFloat(getComputedStyle(el).lineHeight) || 16
        return {
          overflow: el.scrollWidth - el.clientWidth,
          lines: Math.max(
            ...Array.from(el.children).map(
              (c) => (c as HTMLElement).getBoundingClientRect().height / lh,
            ),
          ),
          word: Array.from(el.children).some(
            (c) => (c as HTMLElement).offsetParent !== null && /[a-z]/i.test(c.textContent ?? ''),
          ),
        }
      }),
    )
    expect(opts.length).toBeGreaterThan(0)
    for (const o of opts) {
      expect(o.overflow).toBeLessThanOrEqual(0)
      expect(o.lines).toBeLessThanOrEqual(2)
      expect(o.word).toBe(false)
    }
    await expect(page.getByRole('radio', { name: '1 Not at all' }).first()).toBeAttached()
    await expect(page.getByRole('radio', { name: '3 Somewhat' }).first()).toBeAttached()
  })

  test('rating options show the word label at 640px and up', async ({ page }) => {
    for (const width of [640, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(URL)
      const first = page.locator('fieldset label').first()
      await expect(first.getByText('Not at all')).toBeVisible()
    }
  })

  test('open mobile menu panel is fully opaque at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(URL)
    await page.getByRole('button', { name: 'Open menu' }).click()
    const menu = page.locator('#mobile-menu')
    await expect(menu).toBeVisible()
    const bg = await menu.evaluate((el) => getComputedStyle(el).backgroundColor)
    expect(bg).not.toMatch(/\/\s*0?\.\d+\)|rgba\(.*,\s*0?\.\d+\)/)
    const filter = await menu.evaluate((el) => getComputedStyle(el).backdropFilter)
    expect(filter === 'none' || filter === '').toBe(true)
  })
})
