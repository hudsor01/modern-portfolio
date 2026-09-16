import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright Configuration for Portfolio E2E Tests
 *
 * Tests critical user journeys:
 * - Contact form submission
 * - Resume view and download
 * - Projects browsing
 * - Blog reading
 */
// The suite runs against a PRODUCTION build, never `next dev`.
//
// Next.js's own Playwright guide says so explicitly ("We recommend running your
// tests against your production code to more closely resemble how your
// application will behave" — https://nextjs.org/docs/app/guides/testing/playwright),
// and here it is load-bearing rather than advisory: several specs assert things
// that only hold in a production build. `security-headers.spec.ts` pins that
// `script-src` contains no `'unsafe-eval'`, but `src/lib/csp-edge.ts` adds
// `'unsafe-eval'` in development for HMR — so that spec failed 100% of the time
// under the old `bun run dev` webServer, and nobody noticed because Playwright
// never ran in CI.
//
// Port 3100, not 3000, is deliberate: with `reuseExistingServer: !CI`, a :3000
// URL lets a `bun dev` someone left running in another terminal be silently
// adopted as the server under test, which would quietly reintroduce the same bug.
const E2E_PORT = Number(process.env.E2E_PORT ?? 3100)
const E2E_URL = `http://localhost:${E2E_PORT}`

export default defineConfig({
  testDir: './e2e',

  // Run tests in parallel for speed
  fullyParallel: true,

  // Fail CI on test.only
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Limit workers on CI. This is Playwright's own recommendation — "We recommend
  // setting workers to '1' in CI environments to prioritize stability and
  // reproducibility" (https://playwright.dev/docs/ci) — so it stays. The cost is
  // wall-clock: 588 tests serially overran a 20-minute job the first time e2e
  // actually ran in CI. The documented remedy for that is sharding, not more
  // workers, so `.github/workflows/ci.yml` splits the run across 4 shards.
  workers: process.env.CI ? 1 : undefined,

  // Reporters. On CI each shard emits a blob report; the `e2e-report` job merges
  // them into one HTML report. A per-shard HTML report would only ever describe a
  // quarter of the suite.
  reporter: process.env.CI
    ? [['list'], ['blob']]
    : [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],

  // Shared settings for all tests
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || E2E_URL,

    // Capture trace on first retry
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on first retry
    video: 'on-first-retry',

    // Timeout for actions
    actionTimeout: 10000,

    // Timeout for navigation
    navigationTimeout: 30000,
  },

  // Test timeout
  timeout: 60000,

  // Expect timeout
  expect: {
    timeout: 10000,
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile viewport
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  // Build and serve the production standalone server before tests — skipped when
  // PLAYWRIGHT_BASE_URL is set, so CI (and any manual run) can point the suite at
  // a server it started itself instead of paying for a second build.
  //
  // `next start` is NOT usable here: next.config.js sets `output: 'standalone'`,
  // and Next refuses it with `"next start" does not work with "output: standalone"
  // configuration. Use "node .next/standalone/server.js" instead.` The e2e:server
  // script does that, plus the two copy steps standalone requires (it emits an
  // empty public/ and .next/static — verified on a clean build).
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: `bun run e2e:server`,
        url: E2E_URL,
        env: { PORT: String(E2E_PORT) },
        reuseExistingServer: !process.env.CI,
        // Generous: this command includes a full production build.
        timeout: 180_000,
        stdout: 'pipe',
      },
})
