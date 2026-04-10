---
phase: 07-sitemap-indexing
plan: "02"
subsystem: indexing
tags: [indexnow, google-search-console, seo, blog-api]
dependency_graph:
  requires: []
  provides: [indexnow-integration, indexnow-key-file]
  affects: [src/app/api/blog/route.ts, public/]
tech_stack:
  added: []
  patterns: [fire-and-forget-fetch, env-var-guard, hardcoded-host-ssrf-prevention]
key_files:
  created:
    - public/374957a2e557ab0eed4b0a1e6aacf8bd9db22b8fdfd75a9ca78df521394c5704.txt
  modified:
    - src/app/api/blog/route.ts
decisions:
  - "Fire-and-forget fetch (no await) to IndexNow keeps 201 response unblocked"
  - "INDEXNOW_KEY server-only (no NEXT_PUBLIC_) to prevent client bundle exposure"
  - "Hardcoded host richardwhudsonjr.com prevents SSRF via request header injection"
  - "catch() mandatory to prevent unhandled promise rejection crashing Vercel function"
metrics:
  duration: "~15 minutes"
  completed: "2026-04-10"
  tasks_completed: 3
  tasks_pending: 1
  files_created: 1
  files_modified: 1
requirements: [IDX-03, IDX-04]
---

# Phase 7 Plan 2: IndexNow Integration and Google Search Console Setup Summary

**One-liner:** IndexNow fire-and-forget fetch wired into POST /api/blog on PUBLISHED status, with key file at public/, plus GSC verification pending human env var setup.

## Completed Tasks

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Generate IndexNow key and create verification file | 67bef0b | public/374957a2e557ab0eed4b0a1e6aacf8bd9db22b8fdfd75a9ca78df521394c5704.txt |
| 2 | Add IndexNow fire-and-forget fetch to POST /api/blog | 67bef0b | src/app/api/blog/route.ts |
| 4 | Build verification (TypeScript check passed) | — | — |

## Pending Tasks

| Task | Name | Type | Status |
|------|------|------|--------|
| 3 | Google Search Console verification and env var setup | checkpoint:human-action | PENDING: human action required |

## Task Details

### Task 1: IndexNow Key File

Generated 64-character hex key via `openssl rand -hex 32`:

```
374957a2e557ab0eed4b0a1e6aacf8bd9db22b8fdfd75a9ca78df521394c5704
```

File created at:
```
public/374957a2e557ab0eed4b0a1e6aacf8bd9db22b8fdfd75a9ca78df521394c5704.txt
```

Content: the key string only. Filename matches content exactly (IndexNow requirement).

### Task 2: IndexNow Integration in POST /api/blog

Added fire-and-forget block after the tag count update, before the `const response` line:

- Fires only when `newPost.status === 'PUBLISHED'` — DRAFT posts do not trigger
- Guards on `process.env.INDEXNOW_KEY` — silently skips if env var absent (dev-safe)
- Hardcoded `host: 'richardwhudsonjr.com'` — never derived from request (SSRF prevention, T-07-04)
- No `await` on fetch — 201 response returns immediately (T-07-05 / D-04)
- `.catch()` swallows network errors — logs via `logger.warn` but never surfaces to caller
- `keyLocation` derived from env var — filename/content always match

TypeScript fix applied: `logger.warn` second argument changed from `Error` to `LogContext` object `{ error: err.message }` to match the `Logger` interface signature.

### Task 3: PENDING — Human Action Required

**What's already done (zero code changes needed):**
- Google verification meta tag is already wired in `src/app/shared-metadata.ts` line 83 via `verification.google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- IndexNow key file is committed and will deploy with the next push

**What the human must do:**

**Step 1: Set INDEXNOW_KEY in Vercel**
1. The key value: `374957a2e557ab0eed4b0a1e6aacf8bd9db22b8fdfd75a9ca78df521394c5704`
2. Go to Vercel Dashboard -> Project -> Settings -> Environment Variables
3. Add: Name=`INDEXNOW_KEY`, Value=`374957a2e557ab0eed4b0a1e6aacf8bd9db22b8fdfd75a9ca78df521394c5704`, Environment=Production
4. Do NOT use `NEXT_PUBLIC_INDEXNOW_KEY` — must be server-only

**Step 2: Set Google verification in Vercel**
1. Go to Google Search Console: https://search.google.com/search-console
2. Add Property -> URL prefix -> `https://richardwhudsonjr.com`
3. Choose "HTML tag" verification method
4. Copy the `content` value from the meta tag Google provides (format: `abc123...`)
5. Go to Vercel Dashboard -> Settings -> Environment Variables
6. Add: Name=`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, Value=`{content value}`, Environment=Production

**Step 3: Deploy and verify**
1. Trigger a new Vercel deployment (push or redeploy from dashboard)
2. After deploy, go back to Google Search Console and click "Verify"
3. Confirm verification succeeds (green checkmark)

**Step 4: Submit sitemap**
1. In Google Search Console -> Sitemaps
2. Enter: `https://richardwhudsonjr.com/sitemap.xml`
3. Click Submit
4. Confirm status shows "Success"

**Acceptance criteria for Task 3:**
- Google Search Console shows site as verified (green checkmark)
- Sitemap status shows "Success" or "Fetched"
- INDEXNOW_KEY env var set in Vercel production
- NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION env var set in Vercel production

### Task 4: Build Verification

Full `npm run build` could not run during execution due to parallel agent lock contention (3 concurrent builds from wave agents all blocked waiting for Next.js build lock). TypeScript check via `npx tsc --noEmit` completed with **0 errors** — the IndexNow addition type-checks correctly.

Build lock contention is a parallel execution artifact, not a code issue.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript type mismatch in logger.warn call**
- **Found during:** Task 4 (TypeScript check)
- **Issue:** `logger.warn('...', err instanceof Error ? err : new Error(...))` passed an `Error` as second argument, but `Logger.warn` signature expects `(message: string, context?: LogContext)` where `LogContext = Record<string, unknown>`
- **Fix:** Changed to `logger.warn('...', { error: err instanceof Error ? err.message : String(err) })`
- **Files modified:** src/app/api/blog/route.ts
- **Commit:** 67bef0b

## Threat Surface Scan

All files modified are consistent with the plan's threat model. No new security surfaces introduced beyond those documented in the plan's STRIDE register (T-07-03 through T-07-06).

Verified:
- `INDEXNOW_KEY` has no `NEXT_PUBLIC_` prefix (T-07-03 mitigated)
- `host` is hardcoded `'richardwhudsonjr.com'` (T-07-04 mitigated)
- `.catch()` present on fire-and-forget (T-07-05 mitigated)

## Known Stubs

None — all code paths are wired. IndexNow ping will be a no-op until `INDEXNOW_KEY` is set in Vercel (graceful degradation by design per D-04 guard).

## Self-Check: PASSED

- public/374957a2e557ab0eed4b0a1e6aacf8bd9db22b8fdfd75a9ca78df521394c5704.txt: EXISTS
- src/app/api/blog/route.ts: MODIFIED (grep confirms api.indexnow.org present)
- Commit 67bef0b: EXISTS (git log confirmed)
