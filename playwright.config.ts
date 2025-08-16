import { defineConfig, devices } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

// Get directory paths for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }],
    ['list'], // Add list reporter for better CLI output
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Capture video on failure */
    video: 'retain-on-failure',

    /* Global action timeout */
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Chrome-specific settings
        launchOptions: {
          args: ['--disable-web-security', '--disable-features=VizDisplayCompositor'],
        },
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
      },
    },

    /* Test against mobile viewports - commented out for now to speed up testing */
    // {
    //   name: 'Mobile Chrome',
    //   use: { 
    //     ...devices['Pixel 5'],
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { 
    //     ...devices['iPhone 12'],
    //   },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    
    url: process.env.BASE_URL || 'http://localhost:3000',
    reuseExistingServer: true, // Always reuse existing server
    timeout: 180 * 1000, // 3 minutes for server startup
    // Add environment variables for test mode
    env: {
      NODE_ENV: 'test',
    },
  },

  /* Global setup and teardown */
  globalSetup: path.resolve(__dirname, './e2e/global-setup.ts'),
  globalTeardown: path.resolve(__dirname, './e2e/global-teardown.ts'),

  /* Test timeout - increased for slow operations */
  timeout: 60 * 1000, // 1 minute per test
  expect: {
    timeout: 15 * 1000, // 15 seconds for expect operations
  },
  
  /* Max failures */
  maxFailures: process.env.CI ? 5 : undefined,

  /* Output directories */
  outputDir: 'test-results/',
})