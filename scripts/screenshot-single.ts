import { chromium } from 'playwright';
import * as path from 'path';

const BASE_URL = 'http://localhost:3002';
const slug = 'churn-retention';
const url = `${BASE_URL}/projects/${slug}`;
const screenshotPath = path.join(
  process.cwd(),
  'screenshots',
  'star-sections',
  `08-${slug}.png`
);

async function captureScreenshot() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  console.log(`📸 Capturing ${slug}...`);

  try {
    // Navigate to page
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

    // Wait longer for page to load
    await page.waitForTimeout(5000);

    // Take full page screenshot (STAR section should be visible)
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });

    console.log(`✓ Saved to ${screenshotPath}`);
  } catch (error) {
    console.error(`✗ Error:`, error);
  }

  await browser.close();
}

captureScreenshot().catch(console.error);
