import { chromium } from 'playwright';

async function takeFinalScreenshot() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  try {
    console.log('📸 Taking final screenshot of implemented changes...');
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'screenshots/final-implementation.png', 
      fullPage: true 
    });

    console.log('✅ Final screenshot completed!');
    
  } catch (error) {
    console.error('❌ Error during screenshot:', error);
  } finally {
    await browser.close();
  }
}

takeFinalScreenshot();