# Playwright e2e

End-to-end tests run via `bun run e2e` or `bunx playwright test`.

## Default flow

```bash
bun run e2e
```

`playwright.config.ts` boots `bun run e2e:server` in the background — a full
production build, the two copy steps `output: 'standalone'` requires, then
`node .next/standalone/server.js` — waits for `http://localhost:3100`, runs the
suite across chromium / firefox / webkit / mobile-chrome, then tears down. The
`e2e` job in `.github/workflows/ci.yml` uses this same path.

**Never point this suite at `next dev`.** `src/lib/csp-edge.ts` adds
`'unsafe-eval'` to `script-src` in development for HMR, and
`security-headers.spec.ts` asserts it is absent — so a dev server makes that
spec fail 100% of the time. That was the old default, and it stayed unnoticed
because Playwright did not run in CI until PR #238.

Port 3100 is deliberate: `reuseExistingServer` adopts whatever already listens
on the URL, so using 3000 would let a stray `bun dev` in another terminal
silently become the server under test.

## Running against an external server (`PLAYWRIGHT_BASE_URL`)

Set `PLAYWRIGHT_BASE_URL` to skip the bundled dev server and hit a
pre-started target. Useful for:

- **Reusing a build you already made**, instead of paying for the one
  `webServer` would run:

  ```bash
  bun run build
  PORT=3010 bun run e2e:serve &
  PLAYWRIGHT_BASE_URL=http://localhost:3010 bunx playwright test
  ```

  `e2e:serve` performs the `public/` and `.next/static` copies that
  `output: 'standalone'` leaves empty, then starts the standalone server
  on `PORT`. Pick any free port.

- **Vercel preview deployments** — point at the deploy URL to validate
  CSP, security headers, and a11y in the actual hosted environment:

  ```bash
  PLAYWRIGHT_BASE_URL=https://<preview>.vercel.app bunx playwright test
  ```

When `PLAYWRIGHT_BASE_URL` is set, `webServer` in `playwright.config.ts`
becomes `undefined`, so Playwright neither builds nor starts anything —
whatever is at that URL is what gets tested. Make sure it is a production
build, or `security-headers.spec.ts` will fail on `'unsafe-eval'`.

## Project layout

- `*.spec.ts` — page-level tests (one file per public route).
- `_meta/*.spec.ts` — cross-cutting tests not tied to a specific page
  (browser-engine keyboard infrastructure, etc.). Underscore prefix so
  they sort before page specs in IDE listings.

## Browsers

```bash
bunx playwright install chromium firefox webkit
```

`mobile-chrome` reuses the chromium binary at the Pixel 5 viewport, so
no separate install is needed.

## Running a single project

```bash
bunx playwright test --project=chromium
bunx playwright test --project=webkit -g "passes accessibility"
```

## Known engine quirks

- **WebKit Tab → links**: Safari's "Tab focuses links" preference is
  off by default. Tab moves through form-control inputs only. Tests
  that need to assert Tab traversal use `<input>` fixtures (see
  `_meta/keyboard-infra.spec.ts`); page-DOM Tab regressions are covered
  via the contact-form regression gate which starts focus on a real
  `<input name="name">`.

- **CSP `upgrade-insecure-requests` on http://localhost**: WebKit
  doesn't have Chromium's localhost exemption. The proxy strips this
  directive on local HTTP origins; `e2e/security-headers.spec.ts`
  asserts presence iff `baseURL` starts with `https://`.
