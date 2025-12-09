import { chromium } from 'playwright'

async function takeScreenshot() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

  await page.goto('http://localhost:3000/blog', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000) // Wait for animations

  await page.screenshot({ path: 'screenshots/blog-page.png', fullPage: false })
  console.log('Screenshot saved to screenshots/blog-page.png')

  await browser.close()
}

takeScreenshot().catch(console.error)
