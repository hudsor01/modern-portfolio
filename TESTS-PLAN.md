# Tests Plan — Comprehensive Coverage Backfill

Branch: `test/full-coverage-backfill` (off `audit/page-interactivity`)
Baseline: 13 unit test files / 214 vitest tests + 7 Playwright specs.

## Inventory

### Already covered (do NOT duplicate)

**Unit (vitest)**
- `src/lib/api-core.test.ts`
- `src/lib/csp-edge.test.ts`
- `src/lib/csrf-protection.test.ts`
- `src/lib/data-service.test.ts`
- `src/lib/env-validation.test.ts`
- `src/lib/json-ld-schemas.test.ts`
- `src/lib/metrics-endpoint.test.ts` — partial coverage of `/api/security/metrics` (auth/header/cache contract)
- `src/lib/rate-limiter.test.ts`
- `src/lib/sanitization.test.ts`
- `src/components/blog/related-posts.test.ts`
- `src/emails/email-templates.test.tsx`
- `src/app/contact/actions.test.ts`
- `src/app/api/contact/route.test.ts` — POST /api/contact

**E2E (Playwright)**
- `e2e/about.spec.ts`
- `e2e/blog.spec.ts`
- `e2e/contact-form.spec.ts`
- `e2e/projects.spec.ts`
- `e2e/resume.spec.ts`
- `e2e/security-headers.spec.ts`
- `e2e/_meta/keyboard-infra.spec.ts`

### Wave 1 — API routes (THIS SESSION)

Highest leverage: routes are public attack surface. Cover happy path + auth/CSRF/validation/error gates per route. Quality > quantity (don't enumerate every edge case).

| File to create | Notes |
|---|---|
| `src/app/api/health/__tests__/route.test.ts` | GET 200 healthy / 503 when db.execute throws; cache headers |
| `src/app/api/health-check/__tests__/route.test.ts` | GET + HEAD return 200 with `OK` body / null body, no-cache headers |
| `src/app/api/blog/__tests__/route.test.ts` | GET list shape (success, data array, pagination); POST 400 on schema reject; POST 403 on missing CSRF; POST 201 happy path; admin-token gating filter on `?status=DRAFT` |
| `src/app/api/blog/[slug]/__tests__/route.test.ts` | GET 404 for missing/unpublished (anon); GET 200 for published; PUT 403 no CSRF; DELETE 403 no CSRF; PUT 404 not-found; DELETE 200 happy |
| `src/app/api/blog/rss/__tests__/route.test.ts` | GET default returns JSON + correct content-type; `?format=xml` returns RSS XML; respects `?limit=` cap (max 100) |
| `src/app/api/blog/tags/__tests__/route.test.ts` | GET ok; POST 403 no CSRF; POST 400 missing name; POST 409 duplicate slug; POST 201 happy |
| `src/app/api/blog/categories/__tests__/route.test.ts` | GET ok; POST 403 no CSRF; POST 400 missing name; POST 409 duplicate slug; POST 201 happy |
| `src/app/api/blog/analytics/__tests__/route.test.ts` | GET 200 with valid `timeRange` enum; GET 400 with invalid enum; GET 200 default (`30d`); shape includes top-level analytics keys |
| `src/app/api/contact/__tests__/csrf-route.test.ts` | GET 200 returns `{ token }`; sets cookie; cache-control `no-store` |
| `src/app/api/projects/__tests__/route.test.ts` | GET 200, returns success+data array shape, includes Cache-Control header |
| `src/app/api/projects/[slug]/__tests__/route.test.ts` | GET 200 known slug; GET 404 unknown; GET 400 invalid slug shape (regex) |
| `src/app/api/og/__tests__/route.test.tsx` | GET 200 returns image/png; truncation of oversized title/subtitle/category; cache headers (smoke — heavy mock of `next/og`) |
| `src/app/api/sentry-debug/__tests__/route.test.ts` | GET 404 in production; GET 200 in dev with sentry config snapshot |
| `src/app/api/seed/__tests__/route.test.ts` | POST 404 in production (without `ALLOW_SEED_IN_PRODUCTION`); POST 401 missing `ADMIN_API_TOKEN`; POST short-circuits when posts exist; POST 200 happy |
| `src/app/api/security/metrics/__tests__/route.test.ts` | **SKIP** — already covered by `src/lib/__tests__/metrics-endpoint.test.ts`. Do not duplicate. |

Wave 1 deliverable: 14 new test files.

### Wave 2 — Lib utilities (FUTURE)

Order by leverage. Files most likely to harbor bugs (parsing, security, formatting, response-shape) first.

**High leverage (write first):**
- `src/lib/__tests__/api-blog.test.ts` — generateSlug, buildBlogWhereClause permutations, transformToBlogPostData round-trip, transformToTagData/CategoryData
- `src/lib/__tests__/api-admin-auth.test.ts` — token absent, malformed Authorization header, length-mismatch, correct token, wrong same-length token (timing-safe)
- `src/lib/__tests__/api-csrf.test.ts` — happy / missing-token / mismatched-token / 403 shape
- `src/lib/__tests__/api-rate-limit.test.ts` — preset shapes; checkRateLimitOrRespond returns 429 with `Retry-After` after limit; null when within limits
- `src/lib/__tests__/api-pagination.test.ts` — parsePaginationParams default / custom / clamp; createPaginationMeta math
- `src/lib/__tests__/api-request.test.ts` — getClientIdentifier from x-forwarded-for / cf-connecting-ip / vercel header / fallback "unknown"; getRequestMetadata; parseRequestBody throws on non-JSON content-type
- `src/lib/__tests__/api-response.test.ts` — successResponse / errorResponse / validationErrorResponse zod-error shape; createApiErrorResponse strips stack in production
- `src/lib/__tests__/api-headers.test.ts` — header building helpers
- `src/lib/__tests__/schemas.test.ts` — emailSchema / urlSchema / slugSchema / cuidSchema accept-reject; contactFormSchema rejects honeypot leak / oversized payload; createBlogPostSchema strict reject; safeValidate wrapper
- `src/lib/__tests__/security.test.ts` — securityConfig surface; threshold getters
- `src/lib/__tests__/error-handling.test.ts`
- `src/lib/__tests__/email-service.test.ts` — sendContactEmail success path, missing API key (returns failure not throw), Resend error handling, validationErrors path
- `src/lib/__tests__/route-utils.test.ts`

**Medium leverage:**
- `src/lib/__tests__/data-formatters.test.ts` — number / currency / date formatters
- `src/lib/__tests__/charts.test.ts`
- `src/lib/__tests__/projects.test.ts` — getProjects, getProject, getFeaturedProjects, getProjectsByCategory, getCategories
- `src/lib/__tests__/json-ld-utils.test.ts`
- `src/lib/__tests__/logger.test.ts` — log levels respect LOG_LEVEL; ConsoleTransport suppression in production; SentryTransport routing
- `src/lib/__tests__/utils.test.ts` — cn() class merging
- `src/lib/__tests__/safe-lazy.test.ts`
- `src/lib/__tests__/site.test.ts`
- `src/lib/__tests__/spacing.test.ts`
- `src/lib/__tests__/tokens.test.ts`
- `src/lib/__tests__/ui-thresholds.test.ts`
- `src/lib/__tests__/db.test.ts` — env-validation gate behavior with SKIP_DB_VALIDATION
- `src/lib/__tests__/search.test.ts` — full-text search SQL builder
- `src/lib/__tests__/data-service-cache.test.ts` — TTL and revalidation
- ~~`src/lib/__tests__/data-service-service.test.ts`~~ — **COVERED** by pre-existing `data-service.test.ts` (which imports `AnalyticsDataService` from `@/lib/data-service/service`). No separate file needed.
- `src/lib/__tests__/rate-limiter-configs.test.ts` — preset shapes
- `src/lib/__tests__/rate-limiter-helpers.test.ts`
- `src/lib/__tests__/rate-limiter-store.test.ts` — eviction batch ratio, cleanup interval, exportMetrics shape

### Wave 3 — Hooks (FUTURE)

`@testing-library/react` is not yet a dep — add it before this wave (or use `renderHook` from `react-dom/test-utils`).

| File | Coverage |
|---|---|
| `src/hooks/__tests__/use-mounted.test.ts` | false → true after mount |
| `src/hooks/__tests__/use-debounce.test.ts` | timer-based, cancellation |
| `src/hooks/__tests__/use-local-storage.test.ts` | initial / set / SSR-safe / quota error |
| `src/hooks/__tests__/use-csrf-token.test.ts` | fetch / cache / refetch |
| `src/hooks/__tests__/use-media-query.test.ts` | matchMedia mock |
| `src/hooks/__tests__/use-scroll-position.test.ts` | window scroll listener |
| `src/hooks/__tests__/use-in-view.test.ts` | IntersectionObserver mock |
| ~~`src/hooks/__tests__/use-loading-state.test.ts`~~ | **REMOVED** — source `src/hooks/use-loading-state.ts` deleted in PR #94 (dead code, naming collision with `loading-patterns.tsx`'s identically-named hook, both had zero non-test consumers). |
| `src/hooks/__tests__/use-quick-view-modal.test.ts` | open / close / target tracking |
| `src/hooks/__tests__/use-contact-form.test.ts` | TanStack Form integration |
| `src/hooks/__tests__/use-page-analytics.test.ts` | route change effect |
| `src/hooks/__tests__/use-analytics-data.test.ts` | fetch + error |
| `src/hooks/__tests__/use-sonner-toast.test.ts` | toast wrapper |

### Wave 4 — Components (FUTURE)

Skip pure-presentation primitives in `components/ui/` (Radix wrappers — already battle-tested upstream). Cover interactive logic and orchestration only.

**Critical (interactive logic):**
- `src/components/contact/__tests__/contact-form.test.tsx` — submit success / validation error / honeypot / network error / loading state / toast
- `src/components/layout/__tests__/navbar.test.tsx` — mobile menu open/close / aria-expanded / route highlight
- `src/components/layout/__tests__/scroll-to-top.test.tsx` — visibility threshold / click-to-top
- `src/components/about/__tests__/animated-counter.test.tsx` — final value matches target after animation completes
- `src/components/projects/__tests__/project-card.test.tsx` — link target / metric rendering
- `src/components/navigation/__tests__/keyboard-navigation.test.tsx` — keyboard event handlers
- `src/components/error/__tests__/*.test.tsx` — error boundary
- `src/components/ui/__tests__/number-ticker.test.tsx` — animation lifecycle (covers regression #3)
- `src/components/ui/__tests__/typing-animation.test.tsx`

**Medium (rendering contract):**
- `src/components/seo/__tests__/json-ld.test.tsx` — script tag rendered with correct schema, nonce read from headers
- `src/components/projects/__tests__/metrics-grid.test.tsx`
- `src/components/projects/__tests__/project-stats.test.tsx`
- `src/components/about/__tests__/expertise-narrative.test.tsx`

### Wave 5 — Page e2e + regression assertions (FUTURE)

**New page specs:**
- `e2e/homepage.spec.ts` — hero loads, "Proven Results" counters animate from 0 to final, navigation works, no console errors
- `e2e/contact.spec.ts` — page renders separately from form spec; sidebar/contact-info visible; noscript fallback visible with JS disabled (regression #4)
- `e2e/resume-view.spec.ts` — `/resume/view` PDF embed via `<object>`; no X-Frame-Options block
- `e2e/projects-detail.spec.ts` — parametrized over all 13 project slugs: layout renders, tabs interactive, no console errors. Use a shared describe.each.

**Regression assertions (audit fixes that just landed in `545218a`/`13181bd`):**
- `e2e/about.spec.ts` extension: assert button text is "View Resume" (not "Download Resume") — regression #1
- `e2e/projects.spec.ts` (or new `revenue-kpi.spec.ts`): assert NO timeframe pills on `/projects/revenue-kpi` page — regression #2
- `e2e/homepage.spec.ts`: assert "Proven Results" counters reach a non-zero final value (use `expect.poll` with timeout) — regression #3
- `e2e/contact-form.spec.ts` extension: assert visible `<noscript>` fallback when JS disabled — regression #4 (use `browser.newContext({ javaScriptEnabled: false })`)
- `e2e/security-headers.spec.ts` extension: assert `GET /api/generate-resume-pdf` returns 404 (route deleted) — regression #5

## Wave 4 — Components (DONE)

Delivered 25 component test files / +180 tests (793 → 973). Coverage:

**Critical interactive (regression-locked):**
- `contact/__tests__/contact-form.test.tsx` — submit/disabled, privacy toggle, **<noscript> fallback (regression #5)**
- `layout/__tests__/navbar.test.tsx` — mobile menu, aria-expanded, Let's Talk CTA
- `layout/__tests__/scroll-to-top.test.tsx` — 500px threshold, smooth scrollTo, hide-on-return
- `about/__tests__/personal-info.test.tsx` — **"View Resume" button text (regression #2)**
- `layout/__tests__/home-page-content.test.tsx` — **ImpactMetric renders NumberTicker unconditionally with delay/value forwarded (regression #3)**
- `projects/__tests__/project-page-layout.test.tsx` — back link, tags, conditional timeframe pills, metrics
- `error/__tests__/error-boundary.test.tsx` — catches throws, fallback (node + function), reset, onError, HOC

**Animation / display:**
- `ui/__tests__/number-ticker.test.tsx` — startValue, className, span props
- `ui/__tests__/typing-animation.test.tsx` — typing tick, custom cursor, className
- `about/__tests__/animated-counter.test.tsx` — in-view trigger, currency/%/integer formats
- `projects/__tests__/metrics-grid.test.tsx` — N cards, columns prop, loading skeletons (capped at 8), presets

**SEO:**
- `seo/__tests__/structured-data.test.tsx` — JSON serialization, </script> escape, nonce
- `seo/__tests__/blog-json-ld.test.tsx` — Blog/BlogPosting/CollectionPage/FAQPage schemas

**Other:**
- `contact/__tests__/contact-info.test.tsx`, `featured-projects.test.tsx`, `success-stories.test.tsx`
- `projects/__tests__/project-stats.test.tsx`, `project-card.test.tsx`, `project-tab-content.test.tsx`, `shared-cards.test.tsx`
- `about/__tests__/expertise-narrative.test.tsx`, `what-i-bring.test.tsx`, `certifications-section.test.tsx`
- `navigation/__tests__/keyboard-navigation.test.tsx`, `back-button.test.tsx`

**Skipped:** Pure Radix-wrapper UI primitives in `src/components/ui/` (button, card, input, label, badge, dialog, etc.) — covered upstream by Radix tests. Also `layout/footer.tsx` (pure presentation), `providers/*` (DI shells), `seo/json-ld/*` per-schema files (data shape covered by `lib/__tests__/json-ld-schemas.test.ts` Wave 2), `projects/animated-background.tsx` and `loading-state.tsx` (CSS-only), `charts/lazy-charts.tsx` (recharts wrapper).

## Bugs found

(Populate as test-writing surfaces issues — do NOT fix in this branch.)

_None yet — see commit log if Wave 1 turns up findings._

## Notes / constraints learned

- `vi.mock('@/db', ...)` mocking pattern — db is a Proxy, must mock the whole module export.
- `src/app/api/contact/csrf-route.ts` filename is non-standard — Next.js does NOT auto-route it. Tests should import it directly.
- `env-validation.ts` runs at module load and throws on bad env. Tests that mock `@/lib/env-validation` MUST do so before any transitive import.
- All API handlers wrap their body in `try/catch` and return a sanitized `createErrorResponse(...)` — verify response.error never includes a stack trace.
- `vitest.config.mts` uses `jsdom` env globally; route-handler tests can opt into `// @vitest-environment node` directive (used by `metrics-endpoint.test.ts`).
- `getClientIdentifier` requires `x-forwarded-for` or similar to compute a non-"unknown" IP — set on every test request to avoid bucket collisions.
- **jsdom strips `<noscript>` children at parse time.** To assert noscript content, render with `react-dom/server`'s `renderToStaticMarkup` and inspect the SSR string.
- **Radix primitives need `ResizeObserver` polyfilled** in jsdom — Checkbox/Dialog/etc. rely on `@radix-ui/react-use-size`. Stub it locally before render.
- **Motion/`useInView` needs `IntersectionObserver` polyfilled.** Either stub globally or fire entries through a mock that captures the constructor callback (see `src/hooks/__tests__/use-in-view.test.ts` for the pattern).
- **`@testing-library/user-event` is NOT installed.** Use `fireEvent` from `@testing-library/react` for clicks/submits.
