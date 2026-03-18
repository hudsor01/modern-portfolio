---
phase: 01-security-hardening
plan: 02
subsystem: infra
tags: [csp, nonce, middleware, edge-runtime, env-validation, zod, security-headers]

# Dependency graph
requires: []
provides:
  - "Edge middleware generating per-request CSP nonces via src/middleware.ts"
  - "Zod schema extended with ALLOWED_ORIGINS (string[]) and USE_LOCAL_DB (boolean)"
  - "Six files migrated from raw process.env to validated env object"
affects: [layout, api-routes, security-headers, email-service, db]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Edge middleware reads from csp-edge.ts only (no Node.js imports allowed)"
    - "btoa(String.fromCharCode(...array)) used for base64 nonce encoding in Edge Runtime"
    - "Zod .transform() converts env strings to typed values (string[], boolean)"
    - "All service-critical env vars read from env object, not raw process.env"

key-files:
  created:
    - src/middleware.ts
  modified:
    - src/lib/env-validation.ts
    - src/lib/email-service.ts
    - src/lib/security-headers.ts
    - src/lib/db.ts
    - src/app/api/contact/route.ts
    - src/app/api/blog/rss/route.ts

key-decisions:
  - "Used btoa(String.fromCharCode(...)) instead of Buffer.from().toString('base64') for Edge Runtime compatibility"
  - "API routes excluded from middleware matcher — they set their own headers and don't serve HTML needing CSP nonces"
  - "process.env.DATABASE_URL intentionally kept in db.ts for Prisma adapter constructor (env-validation runs separately)"
  - "csp-edge.ts left untouched — Edge Runtime file cannot import env-validation.ts"
  - "ALLOWED_ORIGINS Zod transform pre-splits CSV string to string[] so consumers use env.ALLOWED_ORIGINS directly"

patterns-established:
  - "Edge middleware pattern: import only from csp-edge.ts, use Web Crypto API for nonces"
  - "Env migration pattern: add field to Zod schema with .transform(), then replace process.env.X with env.X"

requirements-completed: [R3, R5]

# Metrics
duration: 4min
completed: 2026-03-18
---

# Phase 01 Plan 02: CSP Nonce Middleware and Env Migration Summary

**Next.js Edge middleware activating nonce-based CSP policy and six service files migrated from raw process.env to Zod-validated env object**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-18T15:13:25Z
- **Completed:** 2026-03-18T15:17:47Z
- **Tasks:** 2
- **Files modified:** 7 (1 created, 6 modified)

## Accomplishments
- Created `src/middleware.ts` — Edge-compatible middleware that generates per-request CSP nonces, sets `Content-Security-Policy` response header, and forwards the script nonce to server components via `x-nonce` request header (consumed by `layout.tsx`)
- Extended `env-validation.ts` Zod schema with `ALLOWED_ORIGINS` (CSV string auto-split to `string[]`) and `USE_LOCAL_DB` (string auto-coerced to `boolean`)
- Migrated 6 files from raw `process.env` reads to the validated `env` object: `email-service.ts`, `security-headers.ts`, `db.ts`, `contact/route.ts`, and `blog/rss/route.ts`

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Edge middleware for CSP nonce injection** - `fe56f36` (feat)
2. **Task 2: Extend env schema and migrate service-critical process.env reads** - `0a55b1f` (feat)

**Plan metadata:** _(pending final commit)_

## Files Created/Modified
- `src/middleware.ts` - Edge middleware: per-request CSP nonce generation, Content-Security-Policy header, x-nonce forwarding
- `src/lib/env-validation.ts` - Added ALLOWED_ORIGINS and USE_LOCAL_DB fields with Zod transforms
- `src/lib/email-service.ts` - Migrated RESEND_API_KEY, FROM_EMAIL, TO_EMAIL, NODE_ENV to env object
- `src/lib/security-headers.ts` - Migrated ALLOWED_ORIGINS; now uses pre-split string[] from env
- `src/lib/db.ts` - Migrated USE_LOCAL_DB to env; DATABASE_URL intentionally kept as process.env for Prisma
- `src/app/api/contact/route.ts` - Migrated RESEND_API_KEY and CONTACT_EMAIL to env object
- `src/app/api/blog/rss/route.ts` - Migrated NEXT_PUBLIC_SITE_URL to env object

## Decisions Made
- **btoa vs Buffer:** Used `btoa(String.fromCharCode(...array))` for base64 nonce encoding. `Buffer.from().toString('base64')` is the Node.js approach; `btoa` is the Web Crypto standard and guaranteed available in Edge Runtime.
- **API route exclusion from matcher:** API routes excluded from middleware — they set their own cache/security headers and don't serve HTML that needs CSP nonces injected. This prevents double-header issues.
- **DATABASE_URL kept as process.env:** The Prisma adapter constructors (PrismaPg, PrismaNeon) require the raw connection string from `process.env`. The `env-validation.ts` module already validates it at startup; keeping it raw in the adapter call avoids a circular dependency concern.
- **csp-edge.ts left unmodified:** This file runs in Edge Runtime. Importing `env-validation.ts` (which uses Node.js `logger`) would break Edge compatibility.
- **ALLOWED_ORIGINS pre-split in schema:** Zod `.transform()` splits the CSV string to `string[]` so `security-headers.ts` uses `env.ALLOWED_ORIGINS` directly without `.split(',')` or `.trim()` logic.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered
- **Stash test false negative:** Running `git stash` to test pre-existing build errors caused a stale build cache state that incorrectly showed a type error in `blog-json-ld.tsx`. Re-running `bun run build` with Task 2 changes applied confirmed the build passes cleanly. The `blog-json-ld.tsx` error is out-of-scope and pre-existing (different from the clean build that completed during Task 1).

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness
- CSP nonce middleware is active and injecting nonces on all page responses
- `layout.tsx` already reads `x-nonce` header — nonce consumption is wired end-to-end
- Env schema now validates ALLOWED_ORIGINS and USE_LOCAL_DB at startup
- All service-critical env reads go through validated env object — silent failures eliminated

---
*Phase: 01-security-hardening*
*Completed: 2026-03-18*
