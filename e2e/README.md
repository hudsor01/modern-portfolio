# Playwright e2e

End-to-end tests run via `bun run e2e` or `bunx playwright test`.

## Default flow

```bash
bun run e2e
```

`playwright.config.ts` boots `bun run dev` in the background, waits for
`http://localhost:3000`, runs the suite across chromium / firefox /
webkit / mobile-chrome, then tears down. CI uses this path.

## Running against an external server (`PLAYWRIGHT_BASE_URL`)

Set `PLAYWRIGHT_BASE_URL` to skip the bundled dev server and hit a
pre-started target. Useful for:

- **Standalone production-build smoke testing** (different code path
  than `next dev` — catches issues like CSP `upgrade-insecure-requests`
  on WebKit that only surface on a built standalone server):

  ```bash
  bun run build
  cp -r .next/static .next/standalone/.next/
  cp -r public .next/standalone/
  ( cd .next/standalone && PORT=3010 node server.js ) &
  PLAYWRIGHT_BASE_URL=http://localhost:3010 bunx playwright test
  ```

  Use a non-default port (`3010`) when port 3000 is claimed by an SSH
  tunnel or another service.

- **Vercel preview deployments** — point at the deploy URL to validate
  CSP, security headers, and a11y in the actual hosted environment:

  ```bash
  PLAYWRIGHT_BASE_URL=https://<preview>.vercel.app bunx playwright test
  ```

When `PLAYWRIGHT_BASE_URL` is set, `webServer` in `playwright.config.ts`
becomes `undefined`, so Playwright doesn't try to spawn `bun run dev`.

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
