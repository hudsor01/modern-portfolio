---
phase: 04-performance-optimization
plan: 03
subsystem: api
tags: [bundle-analyzer, metrics, rate-limiter, security, next-config]

# Dependency graph
requires:
  - phase: 02-critical-test-coverage
    provides: rate-limiter with exportMetrics() singleton
  - phase: 01-security-hardening
    provides: env-validation.ts Zod schema pattern
provides:
  - /api/security/metrics endpoint with crypto.timingSafeEqual token auth
  - METRICS_API_TOKEN optional env var in env-validation.ts
  - @next/bundle-analyzer integrated in next.config.js (ANALYZE=true)
  - 7 unit tests for metrics endpoint auth scenarios
affects: [monitoring, observability, performance-analysis]

# Tech tracking
tech-stack:
  added: ["@next/bundle-analyzer@16.2.0"]
  patterns:
    - "Metrics endpoint disabled (403) when token not configured"
    - "crypto.timingSafeEqual with length pre-check for constant-time comparison"
    - "Bundle analyzer wraps INSIDE Sentry (withSentryConfig(withBundleAnalyzer(nextConfig)))"
    - "ANALYZE=true bun run build generates .next/analyze/ HTML reports"

key-files:
  created:
    - src/app/api/security/metrics/route.ts
    - src/lib/__tests__/metrics-endpoint.test.ts
    - src/lib/chart-components.tsx
  modified:
    - src/lib/env-validation.ts
    - next.config.js
    - package.json
    - src/components/charts/lazy-charts.tsx

key-decisions:
  - "Metrics endpoint returns 403 (not 401/404) for all auth failures to avoid leaking endpoint existence"
  - "crypto.timingSafeEqual with length pre-check (throws on unequal lengths) prevents timing attacks"
  - "withBundleAnalyzer wraps INSIDE withSentryConfig so Sentry instruments all chunks"
  - "METRICS_API_TOKEN optional in env schema — endpoint disabled when absent"

patterns-established:
  - "Admin-only endpoints use token auth via X-{Service}-Token header with timingSafeEqual"
  - "Bundle analyzer enabled on-demand via ANALYZE env var, not in default build"

requirements-completed: [R17, R19]

# Metrics
duration: 9min
completed: 2026-03-19
---

# Phase 4 Plan 03: Bundle Analyzer and Metrics Endpoint Summary

**Rate limiter metrics API with crypto.timingSafeEqual token auth plus @next/bundle-analyzer integrated for on-demand bundle size analysis**

## Performance

- **Duration:** 9 min
- **Started:** 2026-03-19T15:04:52Z
- **Completed:** 2026-03-19T15:14:00Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Created /api/security/metrics endpoint returning rate limiter analytics with token-gated access
- Implemented constant-time token comparison using crypto.timingSafeEqual with length pre-check
- Added METRICS_API_TOKEN optional field to Zod env schema with production length warning
- Installed @next/bundle-analyzer and configured in next.config.js with ANALYZE=true trigger
- 7 unit tests covering all auth scenarios (140 total tests passing)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create metrics endpoint with token auth and unit tests** - `eb4926c` (feat) - TDD
2. **Task 2: Add @next/bundle-analyzer to next.config.js** - `b63dafd` (feat)

**Plan metadata:** *(this commit)*

_Note: Task 1 used TDD — tests written first (RED), then implementation (GREEN)._

## Files Created/Modified
- `src/app/api/security/metrics/route.ts` - Metrics API endpoint with timingSafeEqual token auth
- `src/lib/__tests__/metrics-endpoint.test.ts` - 7 unit tests for all auth scenarios
- `src/lib/env-validation.ts` - Added METRICS_API_TOKEN optional field + production warning
- `next.config.js` - Added withBundleAnalyzer wrapper inside withSentryConfig
- `package.json` - Added @next/bundle-analyzer@16.2.0 devDependency
- `src/components/charts/lazy-charts.tsx` - Restored recharts re-exports and helper components
- `src/lib/chart-components.tsx` - Restored chart utility components (ChartWrapper, ChartGrid, etc.)

## Decisions Made
- Metrics endpoint always returns 403 (not 401 or 404) to avoid leaking endpoint existence or auth mechanism
- crypto.timingSafeEqual with explicit length pre-check (the function throws on different lengths)
- Bundle analyzer wraps INSIDE Sentry: `withSentryConfig(withBundleAnalyzer(nextConfig))` — Sentry must be outermost to instrument all chunks
- METRICS_API_TOKEN is optional so endpoint is self-disabling when not configured

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Restored missing recharts re-exports and chart-components.tsx**
- **Found during:** Task 2 (build verification)
- **Issue:** Task 1 commit accidentally included pre-staged deletions of recharts re-exports from lazy-charts.tsx and chart-components.tsx, causing 340+ build errors: "The export Bar was not found in module lazy-charts.tsx"
- **Fix:** Restored `src/lib/chart-components.tsx` from git history and restored recharts re-exports (`Bar`, `Area`, `Line`, `Cell`, `Pie`, `Legend`, `Tooltip`, `ResponsiveContainer`, `PolarGrid`, etc.) to lazy-charts.tsx
- **Files modified:** src/components/charts/lazy-charts.tsx, src/lib/chart-components.tsx
- **Verification:** Build succeeded with 0 errors
- **Committed in:** b63dafd (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - pre-existing staged deletions accidentally committed)
**Impact on plan:** Fix was necessary to restore build functionality. No scope creep.

## Issues Encountered
- Pre-existing staged changes (deletion of chart-components.tsx and recharts re-exports from lazy-charts.tsx) were accidentally included in Task 1 commit because `git add` picked them up from the staging area. Resolved by restoring the files in Task 2 commit.

## User Setup Required

**Optional:** To enable metrics monitoring, add `METRICS_API_TOKEN` to environment:
```
METRICS_API_TOKEN=<random 64+ character string>
```
Then query: `GET /api/security/metrics` with header `X-Metrics-Token: <token>`

**Optional:** To generate bundle analysis report:
```
ANALYZE=true bun run build
```
Opens `.next/analyze/` directory with HTML report.

## Next Phase Readiness
- Bundle analyzer ready for identifying large chunks in next performance phase
- Metrics endpoint ready for integration with monitoring dashboard
- All 140 tests passing, build clean

## Self-Check: PASSED

All created files verified present. All task commits verified in git history.

---
*Phase: 04-performance-optimization*
*Completed: 2026-03-19*
