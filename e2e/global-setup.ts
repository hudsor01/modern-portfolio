import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use || { baseURL: 'http://localhost:3000' }
  let browser
  let context
  let page

  try {
    console.log('🚀 Starting global setup...')
    console.log(`📍 Base URL: ${baseURL}`)

    // Launch browser with better error handling
    browser = await chromium.launch({
      headless: true,
      args: ['--disable-web-security', '--no-sandbox'],
    })
    
    context = await browser.newContext({
      // Add context options for better stability
      ignoreHTTPSErrors: true,
      viewport: { width: 1280, height: 720 },
    })
    
    page = await context.newPage()

    // Add error listeners
    page.on('pageerror', (error) => {
      console.warn('⚠️ Page error during setup:', error.message)
    })
    
    page.on('requestfailed', (request) => {
      console.warn('⚠️ Failed request during setup:', request.url(), request.failure()?.errorText)
    })

    // Wait for the app to be ready with retries
    console.log('🌐 Navigating to application...')
    await page.goto(baseURL + '/', { waitUntil: 'networkidle', timeout: 60000 })
    
    // Wait for critical elements to be ready
    console.log('⏳ Waiting for page to be ready...')
    await page.waitForSelector('body', { timeout: 30000 })
    
    // Check if we have a proper response
    const title = await page.title()
    if (!title || title.toLowerCase().includes('error')) {
      throw new Error(`Invalid page title: ${title}`)
    }
    
    console.log('✅ Global setup completed successfully')
    console.log(`📄 Page title: ${title}`)
    
  } catch (error) {
    console.error('❌ Global setup failed:', error)
    
    // Try to capture some debug info
    if (page) {
      try {
        const url = page.url()
        const title = await page.title()
        console.error(`Debug info - URL: ${url}, Title: ${title}`)
      } catch (debugError) {
        console.error('Could not capture debug info:', debugError.message)
      }
    }
    
    throw error
  } finally {
    // Cleanup resources
    if (context) {
      await context.close().catch(console.error)
    }
    if (browser) {
      await browser.close().catch(console.error)
    }
  }
}

export default globalSetup