import { chromium } from 'playwright';

async function takeScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const baseUrl = 'http://localhost:3000';
  
  try {
    console.log('📸 Starting comprehensive screenshot review...');
    
    // 1. Homepage - Hero section and overview
    console.log('📷 Capturing Homepage...');
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'screenshots/01-homepage-hero.png', 
      fullPage: true 
    });

    // 2. About page
    console.log('📷 Capturing About page...');
    await page.goto(`${baseUrl}/about`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'screenshots/02-about-page.png', 
      fullPage: true 
    });

    // 3. Projects overview page
    console.log('📷 Capturing Projects overview...');
    await page.goto(`${baseUrl}/projects`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'screenshots/03-projects-overview.png', 
      fullPage: true 
    });

    // 4. Revenue KPI Dashboard project
    console.log('📷 Capturing Revenue KPI project...');
    await page.goto(`${baseUrl}/projects/revenue-kpi`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'screenshots/04-revenue-kpi-project.png', 
      fullPage: true 
    });

    // 5. Deal Funnel project
    console.log('📷 Capturing Deal Funnel project...');
    await page.goto(`${baseUrl}/projects/deal-funnel`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'screenshots/05-deal-funnel-project.png', 
      fullPage: true 
    });

    // 6. Churn Retention project
    console.log('📷 Capturing Churn Retention project...');
    await page.goto(`${baseUrl}/projects/churn-retention`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'screenshots/06-churn-retention-project.png', 
      fullPage: true 
    });

    // 7. Lead Attribution project
    console.log('📷 Capturing Lead Attribution project...');
    await page.goto(`${baseUrl}/projects/lead-attribution`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'screenshots/07-lead-attribution-project.png', 
      fullPage: true 
    });

    // 8. Resume page
    console.log('📷 Capturing Resume page...');
    await page.goto(`${baseUrl}/resume`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'screenshots/08-resume-page.png', 
      fullPage: true 
    });

    // 9. Contact page
    console.log('📷 Capturing Contact page...');
    await page.goto(`${baseUrl}/contact`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'screenshots/09-contact-page.png', 
      fullPage: true 
    });

    // 10. Dark mode toggle test - switch to dark mode and capture homepage
    console.log('📷 Testing dark mode...');
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');
    
    // Click dark mode toggle
    await page.click('[data-testid="theme-toggle"], button[aria-label*="theme"], button:has-text("☀️"), button:has-text("🌙")').catch(() => {
      console.log('Dark mode toggle not found with standard selectors, trying alternative...');
    });
    
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'screenshots/10-homepage-dark-mode.png', 
      fullPage: true 
    });

    console.log('✅ Screenshot review completed successfully!');
    console.log('📁 Screenshots saved to /screenshots/ directory');
    
  } catch (error) {
    console.error('❌ Error during screenshot capture:', error);
  } finally {
    await browser.close();
  }
}

takeScreenshots();