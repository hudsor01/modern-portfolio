import { test, expect, type Page } from '@playwright/test'
import { RESUME_PDF_PATH } from '../src/lib/resume-pdf'

/**
 * /resume print stylesheet E2E Tests
 *
 * The résumé PDF is page.pdf() of /resume in print media, so the print
 * stylesheet is the résumé layout. This spec pins what it guarantees:
 *   - Screen media is unchanged: site chrome and the action buttons show, the
 *     print-only contact line does not
 *   - Print media hides the chrome (navbar, footer, skip link, buttons) and shows
 *     the contact line rendered from CONTACT, the Experience heading and every role
 *   - With the PDF preview open, print media still prints the résumé and hides
 *     the embedded viewer
 *   - No printed text computes below the 12px floor
 *   - The page prints to at most two US Letter pages
 *   - The résumé PDF asset keeps its carve-out headers (SAMEORIGIN, noindex, no CSP)
 *
 * Print emulation and page.pdf() are Chromium-only, so every test skips on the
 * other browser projects. The authoritative page count is pdfinfo in the PDF
 * generator; the count here is a regression tripwire.
 */

const ROLE_TITLES = [
  'Data Analyst',
  'Revenue Operations Consultant',
  'Channel Operations Lead & Sales Operations Analyst',
  'Business Systems Specialist',
  'Digital Marketing Associate',
  'Information Technology Specialist (25B)',
]

function chrome(page: Page) {
  return {
    header: page.locator('header').first(),
    footer: page.locator('footer').first(),
    download: page.locator('button', { hasText: 'Download PDF' }),
    preview: page.locator('button', { hasText: 'Preview PDF' }),
    connect: page.locator('a', { hasText: "Let's Connect" }),
    skipLink: page.locator('a[href="#main-content"]'),
    printContact: page.locator('[data-print-contact]'),
  }
}

async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 400) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 50))
    }
    window.scrollTo(0, 0)
  })
  await page.evaluate(() => document.fonts.ready)
}

test.describe('résumé print stylesheet', () => {
  test.beforeEach(async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'print emulation and page.pdf are Chromium-only')
    await page.goto('/resume')
    await page.waitForLoadState('networkidle')
  })

  test('screen media is unchanged', async ({ page }) => {
    const c = chrome(page)
    await expect(c.header).toBeVisible()
    await expect(c.footer).toBeVisible()
    await expect(c.download).toBeVisible()
    await expect(c.preview).toBeVisible()
    await expect(c.connect).toBeVisible()
    await expect(c.printContact).toBeHidden()
  })

  test('print media hides chrome and shows the contact header', async ({ page }) => {
    await page.emulateMedia({ media: 'print' })
    const c = chrome(page)
    await expect(c.header).toBeHidden()
    await expect(c.footer).toBeHidden()
    await expect(c.download).toBeHidden()
    await expect(c.preview).toBeHidden()
    await expect(c.connect).toBeHidden()
    expect(await c.skipLink.evaluate((el) => getComputedStyle(el).display)).toBe('none')

    await expect(c.printContact).toBeVisible()
    for (const value of ['Dallas, TX', '214.566.0279', 'hudsor01@icloud.com', 'linkedin.com/in/hudsor01']) {
      await expect(c.printContact).toContainText(value)
    }

    await expect(page.getByRole('heading', { level: 2, name: 'Experience' })).toBeVisible()
    for (const title of ROLE_TITLES) {
      await expect(page.getByRole('heading', { level: 3, name: title, exact: true })).toBeVisible()
    }
  })

  test('printing with the preview open prints the résumé, not the viewer', async ({ page }) => {
    const c = chrome(page)
    const experience = page.getByRole('heading', { level: 2, name: 'Experience' })
    const viewer = page.locator('object[type="application/pdf"]')
    await c.preview.click()
    await expect(viewer).toHaveCount(1)
    await expect(experience).toBeHidden()

    await page.emulateMedia({ media: 'print' })
    await expect(viewer).toBeHidden()
    await expect(c.printContact).toBeVisible()
    await expect(experience).toBeVisible()
    for (const title of ROLE_TITLES) {
      await expect(page.getByRole('heading', { level: 3, name: title, exact: true })).toBeVisible()
    }

    await page.emulateMedia({ media: 'screen' })
    await expect(experience).toBeHidden()
  })

  test('no printed text is below 12px', async ({ page }) => {
    await page.emulateMedia({ media: 'print' })
    await scrollThrough(page)
    const small = await page.evaluate(() => {
      const found: Array<{ tag: string; px: number; text: string }> = []
      for (const el of document.querySelectorAll('main *')) {
        const ownText = [...el.childNodes].some(
          (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim()
        )
        if (!ownText) continue
        const style = getComputedStyle(el)
        const rect = el.getBoundingClientRect()
        // display:contents has no box of its own, but its text still renders.
        if (style.display !== 'contents' && (rect.width === 0 || rect.height === 0)) continue
        const px = Number.parseFloat(style.fontSize)
        if (px < 12) found.push({ tag: el.tagName, px, text: (el.textContent ?? '').trim().slice(0, 60) })
      }
      return found
    })
    expect(small).toEqual([])
  })

  test('prints to at most two Letter pages', async ({ page }) => {
    await page.emulateMedia({ media: 'print' })
    await scrollThrough(page)
    const pdf = await page.pdf({ format: 'Letter', preferCSSPageSize: true, printBackground: true })
    const m = pdf.toString('latin1').match(/\/Type\s*\/Pages\b[^>]*?\/Count\s+(\d+)/)
    expect(
      m,
      'page-tree /Count not found (compressed object stream?): check the page count with pdfinfo'
    ).not.toBeNull()
    const pages = Number(m?.[1])
    expect(pages).toBeGreaterThanOrEqual(1)
    expect(pages).toBeLessThanOrEqual(2)
  })

  test('the résumé PDF keeps its headers', async ({ request }) => {
    const response = await request.get(RESUME_PDF_PATH)
    expect(response.status()).toBe(200)
    expect(response.headers()['x-frame-options']).toBe('SAMEORIGIN')
    expect(response.headers()['x-robots-tag']).toBe('noindex')
    expect(response.headers()['content-security-policy']).toBeUndefined()
  })
})
