import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function takeScreenshots() {
  // Create screenshots directory if it doesn't exist
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Base URL
  const baseUrl = 'http://localhost:3000';

  // Pages to screenshot
  const pages = [
    { path: '/projects', name: 'projects-main' },
    { path: '/projects/commission-optimization', name: 'commission-optimization' },
    { path: '/projects/multi-channel-attribution', name: 'multi-channel-attribution' },
    { path: '/projects/revenue-operations-center', name: 'revenue-operations-center' },
    { path: '/projects/customer-lifetime-value', name: 'customer-lifetime-value' },
    { path: '/projects/partner-performance', name: 'partner-performance' },
    { path: '/projects/cac-unit-economics', name: 'cac-unit-economics' },
    { path: '/projects/churn-retention', name: 'churn-retention' },
    { path: '/projects/deal-funnel', name: 'deal-funnel' },
    { path: '/projects/lead-attribution', name: 'lead-attribution' },
    { path: '/projects/revenue-kpi', name: 'revenue-kpi' }
  ];

  console.log('Taking screenshots of enhanced project pages...\n');

  for (const pageInfo of pages) {
    try {
      console.log(`📸 Taking screenshot of ${pageInfo.name}...`);
      
      // Navigate to the page
      await page.goto(`${baseUrl}${pageInfo.path}`, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      // Wait a bit for animations to settle
      await page.waitForTimeout(2000);

      // Take full page screenshot
      await page.screenshot({
        path: path.join(screenshotsDir, `${pageInfo.name}.png`),
        fullPage: true
      });

      console.log(`✅ Screenshot saved: ${pageInfo.name}.png`);
    } catch (error) {
      console.error(`❌ Error taking screenshot of ${pageInfo.name}:`, error.message);
    }
  }

  console.log('\n🎉 All screenshots completed!');
  console.log(`📁 Screenshots saved in: ${screenshotsDir}`);

  await browser.close();
}

takeScreenshots().catch(console.error);