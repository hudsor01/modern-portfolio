import { chromium } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';

const BASE_URL = 'http://localhost:3002';
const SCREENSHOT_DIR = path.join(process.cwd(), 'screenshots', 'star-sections');

const projectSlugs = [
  'partnership-program-implementation',
  'commission-optimization',
  'multi-channel-attribution',
  'revenue-operations-center',
  'customer-lifetime-value',
  'partner-performance',
  'cac-unit-economics',
  'churn-retention',
  'deal-funnel',
  'lead-attribution',
  'revenue-kpi',
];

async function takeScreenshots() {
  // Ensure screenshot directory exists
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  console.log('📸 Starting screenshot capture...\n');

  for (let i = 0; i < projectSlugs.length; i++) {
    const slug = projectSlugs[i];
    const url = `${BASE_URL}/projects/${slug}`;
    const screenshotPath = path.join(
      SCREENSHOT_DIR,
      `${String(i + 1).padStart(2, '0')}-${slug}.png`
    );

    console.log(`${i + 1}/${projectSlugs.length} Capturing ${slug}...`);

    try {
      // Navigate to page
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      // Wait for STAR section to load
      await page.waitForSelector('text=STAR Impact Analysis', { timeout: 15000 });

      // Wait for charts to render
      await page.waitForTimeout(3000);

      // Scroll to STAR section
      await page.evaluate(() => {
        const headers = Array.from(document.querySelectorAll('h2'));
        const starSection = headers.find(h => h.textContent?.includes('STAR Impact Analysis'));
        if (starSection) {
          starSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });

      // Wait for smooth scroll
      await page.waitForTimeout(1000);

      // Take full page screenshot
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

      console.log(`   ✓ Saved to ${screenshotPath}`);
    } catch (error) {
      console.error(`   ✗ Error capturing ${slug}:`, error);
    }
  }

  await browser.close();
  console.log('\n✨ Screenshot capture complete!');
  console.log(`📁 Screenshots saved to: ${SCREENSHOT_DIR}`);
}

takeScreenshots().catch(console.error);
