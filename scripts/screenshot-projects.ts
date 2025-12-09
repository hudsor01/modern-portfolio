import { chromium } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const BASE_URL = 'http://localhost:3002';
const SCREENSHOT_DIR = path.join(process.cwd(), 'screenshots');

// Create screenshots directory if it doesn't exist
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function takeScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  try {
    console.log('Taking screenshot of projects page...');

    // Navigate to projects page
    await page.goto(`${BASE_URL}/projects`, { waitUntil: 'networkidle' });

    // Wait for projects to load - wait for any project card
    await page.waitForSelector('a[href^="/projects/"]', { timeout: 15000 });

    // Give it a moment for charts to render
    await page.waitForTimeout(2000);

    // Take full page screenshot of projects page
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '01-projects-page.png'),
      fullPage: true,
    });
    console.log('✓ Projects page screenshot saved');

    // Get all project links
    const projectLinks = await page.$$eval('a[href^="/projects/"]', (links) =>
      links
        .map((link) => link.getAttribute('href'))
        .filter((href): href is string =>
          href !== null &&
          href !== '/projects' &&
          !href.includes('#')
        )
    );

    // Remove duplicates
    const uniqueProjectLinks = [...new Set(projectLinks)];
    console.log(`Found ${uniqueProjectLinks.length} unique project pages`);

    // Take screenshots of each project page
    for (let i = 0; i < uniqueProjectLinks.length; i++) {
      const projectPath = uniqueProjectLinks[i];
      const slug = projectPath.split('/').pop() || 'unknown';

      console.log(`Taking screenshot of ${slug}...`);

      await page.goto(`${BASE_URL}${projectPath}`, { waitUntil: 'networkidle' });

      // Wait for project content to load
      await page.waitForSelector('h1', { timeout: 10000 });

      // Wait for charts and images to fully render
      await page.waitForTimeout(3000);

      // Take full page screenshot
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `${String(i + 2).padStart(2, '0')}-${slug}.png`),
        fullPage: true,
      });

      console.log(`✓ ${slug} screenshot saved`);
    }

    console.log('\n✓ All screenshots completed!');
    console.log(`Screenshots saved to: ${SCREENSHOT_DIR}`);

  } catch (error) {
    console.error('Error taking screenshots:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

takeScreenshots().catch((error) => {
  console.error('Failed to take screenshots:', error);
  process.exit(1);
});
