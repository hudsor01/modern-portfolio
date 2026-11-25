import { expect, type Page, test } from '@playwright/test'
import { postCards } from './_helpers/blog'
import { databaseAvailable, NEEDS_DATABASE } from './_helpers/database'
import { getOnly, settlePage } from './_helpers/settle'

/**
 * A11Y-02: no rendered text below 12px on the 14 audited pages; Featured badge
 * text is white.
 * A11Y-03: running-text links are underlined; nav/footer/card links are not.
 * UI-03: footer headings are 12px/600/uppercase/Spline/muted on one line.
 * reducedMotion avoids mid-transition computed sizes. GET-only.
 */

test.use({ reducedMotion: 'reduce' })

const SKIP = 'computed-style checks run once, in Chromium'
const BLOG_POST = '__first_blog_post__'
const PAGES = [
  '/',
  '/about',
  '/projects',
  '/projects/revenue-kpi',
  '/projects/deal-funnel',
  '/blog',
  BLOG_POST,
  '/contact',
  '/resume',
  '/tools',
  '/tools/pipeline-coverage-calculator',
  '/tools/revops-maturity-scorecard',
  '/privacy',
  '/this-page-does-not-exist',
]

async function firstPost(page: Page): Promise<string> {
  await page.goto('/blog')
  await page.waitForLoadState('load')
  const href = (await postCards(page).first().getAttribute('href')) ?? ''
  expect(href).toMatch(/^\/blog\/[^/]+$/)
  return href
}

for (const path of PAGES) {
  for (const [width, height] of [
    [1440, 900],
    [390, 844],
  ] as const) {
    test(`no text below 12px: ${path} @${width}px`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'chromium', SKIP)
      await getOnly(page)
      await page.setViewportSize({ width, height })
      let target = path
      if (path === BLOG_POST) {
        test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)
        target = await firstPost(page)
      }
      await page.goto(target)
      await settlePage(page)

      const small = await page.evaluate(() => {
        const out: { tag: string; cls: string; text: string; size: number }[] = []
        const hasOwnText = (el: Element) =>
          Array.from(el.childNodes).some(
            (n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim() !== '',
          )
        for (const el of Array.from(document.body.querySelectorAll('*'))) {
          const isSvgText = el.tagName.toLowerCase() === 'text' || el.tagName.toLowerCase() === 'tspan'
          if (!isSvgText && !hasOwnText(el)) continue
          if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) continue
          const visible = (el as HTMLElement).checkVisibility?.() ?? true
          if (!visible && !el.classList.contains('sr-only')) continue
          const size = Number.parseFloat(getComputedStyle(el).fontSize)
          if (size < 12) {
            out.push({
              tag: el.tagName.toLowerCase(),
              cls: String(el.getAttribute('class') ?? '').slice(0, 80),
              text: (el.textContent ?? '').trim().slice(0, 40),
              size,
            })
          }
        }
        return out
      })
      expect(small, JSON.stringify(small, null, 1)).toEqual([])
    })
  }
}

test.describe('running-text links', () => {
  test('home mailto link is underlined; header/footer/card links are not', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', SKIP)
    await getOnly(page)
    await page.goto('/')
    await page.waitForLoadState('load')

    const mailto = page.locator('main p a[href^="mailto:"]')
    expect(await mailto.count()).toBeGreaterThan(0)
    for (const link of await mailto.all()) {
      expect(await link.evaluate((el) => getComputedStyle(el).textDecorationLine)).toContain(
        'underline',
      )
    }
  })

  test('home nav, footer and card links are not underlined', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', SKIP)
    await getOnly(page)
    await page.goto('/')
    await page.waitForLoadState('load')

    const offenders = await page.evaluate(() => {
      const bad: string[] = []
      const links = [
        ...Array.from(document.querySelectorAll('header a')),
        ...Array.from(document.querySelectorAll('footer a')),
        ...Array.from(document.querySelectorAll('main a')).filter((a) => a.querySelector('h1,h2,h3,h4')),
      ]
      for (const a of links) {
        const line = getComputedStyle(a).textDecorationLine
        if (line !== 'none') bad.push(`${a.getAttribute('href')}: ${line}`)
      }
      return bad
    })
    expect(offenders).toEqual([])
  })

  test('privacy running-text links are underlined', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', SKIP)
    await getOnly(page)
    await page.goto('/privacy')
    await page.waitForLoadState('load')

    const links = page.locator('main p a, main li a')
    expect(await links.count()).toBeGreaterThan(0)
    for (const link of await links.all()) {
      expect(await link.evaluate((el) => getComputedStyle(el).textDecorationLine)).toContain(
        'underline',
      )
    }
  })

  test('contact privacy link is underlined', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', SKIP)
    await getOnly(page)
    await page.goto('/contact')
    await page.waitForLoadState('load')

    const link = page.locator('main p a[href="/privacy"]').first()
    await expect(link).toBeVisible()
    expect(await link.evaluate((el) => getComputedStyle(el).textDecorationLine)).toContain(
      'underline',
    )
  })

  test('blog post body links are underlined and differ from body text colour', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', SKIP)
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)
    await getOnly(page)
    await page.goto(await firstPost(page))
    await page.waitForLoadState('load')

    const results = await page.evaluate(() => {
      const norm = (value: string) => {
        const ctx = document.createElement('canvas').getContext('2d')
        if (!ctx) throw new Error('2d canvas unavailable')
        ctx.fillStyle = '#000'
        ctx.fillStyle = value
        ctx.fillRect(0, 0, 1, 1)
        return Array.from(ctx.getImageData(0, 0, 1, 1).data).join(',')
      }
      return Array.from(document.querySelectorAll('.blog-content a')).map((a) => {
        const parent = a.parentElement ?? a
        return {
          href: a.getAttribute('href'),
          line: getComputedStyle(a).textDecorationLine,
          linkColour: norm(getComputedStyle(a).color),
          parentColour: norm(getComputedStyle(parent).color),
        }
      })
    })
    for (const r of results) {
      expect(r.line, `${r.href} underline`).toContain('underline')
      expect(r.linkColour, `${r.href} colour differs from paragraph`).not.toBe(r.parentColour)
    }
  })
})

test('Featured badge text is white', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', SKIP)
  await getOnly(page)
  await page.goto('/projects')
  await page.waitForLoadState('load')

  const badge = page.getByText('Featured', { exact: true }).first()
  await expect(badge).toBeVisible()
  const colour = await badge.evaluate((el) => {
    const ctx = document.createElement('canvas').getContext('2d')
    if (!ctx) throw new Error('2d canvas unavailable')
    ctx.fillStyle = '#000'
    ctx.fillStyle = getComputedStyle(el).color
    ctx.fillRect(0, 0, 1, 1)
    return Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)).join(',')
  })
  expect(colour).toBe('255,255,255')
})

for (const width of [320, 390, 768, 1440]) {
  test(`footer headings @${width}px`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', SKIP)
    await getOnly(page)
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await page.waitForLoadState('load')
    await page.evaluate(() => document.fonts.ready)

    const result = await page.evaluate(() => {
      const norm = (value: string) => {
        const ctx = document.createElement('canvas').getContext('2d')
        if (!ctx) throw new Error('2d canvas unavailable')
        ctx.fillStyle = '#000'
        ctx.fillStyle = value
        ctx.fillRect(0, 0, 1, 1)
        return Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)).join(',')
      }
      const linkEl = document.querySelector('footer nav ul a')
      const linkColour = linkEl ? norm(getComputedStyle(linkEl).color) : ''
      return Array.from(document.querySelectorAll('footer nav h2')).map((h) => {
        const cs = getComputedStyle(h)
        return {
          text: (h.textContent ?? '').trim(),
          size: cs.fontSize,
          weight: cs.fontWeight,
          transform: cs.textTransform,
          family: cs.fontFamily,
          lineHeight: cs.lineHeight,
          colour: norm(cs.color),
          linkColour,
          height: h.getBoundingClientRect().height,
        }
      })
    })

    expect(result).toHaveLength(3)
    for (const h of result) {
      expect(h.size, h.text).toBe('12px')
      expect(h.weight, h.text).toBe('600')
      expect(h.transform, h.text).toBe('uppercase')
      expect(h.family, h.text).toMatch(/spline/i)
      expect(h.colour, h.text).toBe(h.linkColour)
      expect(h.lineHeight, h.text).toBe('16px')
      expect(h.height, `${h.text} single line`).toBeLessThanOrEqual(Number.parseFloat(h.lineHeight) + 1)
    }
  })
}

// UI-09: every chart title on the project pages shares one header style.
// Pages converted in 12-06/12-07 pass only after those plans land.
test.describe('chart titles share one header style (UI-09)', () => {
  const routes = [
    '/projects/revenue-kpi',
    '/projects/deal-funnel',
    '/projects/lead-attribution',
    '/projects/customer-lifetime-value',
    '/projects/multi-channel-attribution',
    '/projects/revenue-operations-center',
  ]

  for (const route of routes) {
    test(`${route} chart titles`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'chromium', SKIP)
      await getOnly(page)
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto(route)
      await settlePage(page)
      // Charts are lazy chunks behind skeletons; read titles only once one has mounted.
      await expect(page.locator('[data-slot="chart-title"]').first()).toBeVisible()

      const titles = await page.locator('[data-slot="chart-title"]').evaluateAll((els) =>
        els
          .filter((el) => (el as HTMLElement).getClientRects().length > 0)
          .map((el) => {
            const cs = getComputedStyle(el)
            return {
              text: el.textContent ?? '',
              size: cs.fontSize,
              weight: cs.fontWeight,
              family: cs.fontFamily,
              align: cs.textAlign,
            }
          })
      )

      expect(titles.length, `${route} has chart titles`).toBeGreaterThan(0)
      for (const t of titles) {
        expect(t.size, t.text).toBe('15.75px')
        expect(t.weight, t.text).toBe('600')
        expect(t.family, t.text).toMatch(/spline/i)
        expect(['start', 'left'], t.text).toContain(t.align)
      }
    })
  }
})
