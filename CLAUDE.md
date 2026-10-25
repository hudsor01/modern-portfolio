# CLAUDE.md

Public portfolio + blog system for Richard Hudson. Next.js App Router, Drizzle ORM on Postgres (Neon in prod), Resend for contact email, Sentry for errors, Vercel for hosting. No user auth — token-gated admin endpoints + CSRF on mutations.

## Stack

Runtime: Bun 1.3.14, Node `>=22 <25` (`package.json:7-9`). Next.js 16.4.3, React 19.3.1, TypeScript 6.0.3 (`strict`, `noUncheckedIndexedAccess`), Tailwind 4.3.3, Zod 4.6.7, Drizzle ORM 0.45.4 + `@neondatabase/serverless` 1.2.0 (HTTP driver), `@sentry/nextjs` 10.76.2, Resend 6.34.1, Vitest 4.1.12, Playwright 1.64.1, Biome 2.5.15 (linter + formatter; held below 2.6, whose `noComponentHookFactories` rule flags nested components still to be refactored), Lefthook 2.2.2.

## Commands

| Script | What |
|---|---|
| `bun dev` | Dev server (`bun --bun next dev`) |
| `bun run build` | Prod build (Node-side `next build`) |
| `bun run build:ci` | Same, but Bun-side (`bun --bun next build`) |
| `bun start` | Prod server (`bun --bun next start`) |
| `bun run lint` / `lint:fix` | Biome check over `src/**` (lint + format) |
| `bun run format` / `format:fix` | Biome format-only over `src/**` |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run ci:quick` | lint + typecheck |
| `bun run test` | `vitest run --passWithNoTests` — unit tests, jsdom |
| `bun run test:watch` | `vitest` in watch mode |
| `bun run test:coverage` | v8 coverage on `src/lib/**` |
| `bun run e2e` (`e2e:ui`, `e2e:headed`, `e2e:chromium`, `e2e:report`) | Playwright. Runs against a **production** build on :3100 — see the e2e gotcha |
| `bun run e2e:server` | `bun run build` + `e2e:serve`. What `playwright.config.ts`'s `webServer` invokes |
| `bun run e2e:serve` | Serve an already-built app: copies `.next/static` + `public` into `.next/standalone/`, then `node .next/standalone/server.js` (honours `PORT`) |
| `bun run db:generate` | `drizzle-kit generate` — emits a SQL migration into `drizzle/migrations/` from the current `src/db/schema.ts` |
| `bun run db:migrate` | `drizzle-kit migrate` — applies pending migrations to `DATABASE_URL` |
| `bun run db:push` | `drizzle-kit push` — sync schema directly without writing a migration file (dev only) |
| `bun run db:studio` | Drizzle Studio |
| `bun run db:seed` | `bun run drizzle/seed.ts` — idempotent upsert seed |

Hooks (`lefthook.yml`): pre-commit runs `bunx biome check --staged --write --no-errors-on-unmatched` over staged `src/**` plus a `gitleaks git --staged` secret scan (skipped with a notice if the binary is absent); pre-push runs `bunx vitest run --passWithNoTests` **and** `bun run typecheck`, in parallel. `--no-verify` bypasses.

## Layout

```
src/
  app/                    Next.js App Router. Top-level routes: about, blog, contact, projects, resume, tools.
                          Plus root layout/page/error/global-error/not-found/sitemap/robots/viewport,
                          shared-metadata.ts, reading-progress.tsx, globals.css.
  app/api/                13 route.ts handlers + 1 route.tsx (og). See API table.
  app/contact/actions.ts  The ONLY 'use server' file in the repo.
  components/             11 subdirs: ui (21 primitives), layout, navigation, charts, projects, contact,
                          blog, about, error, providers, seo/json-ld.
                          (regenerate: find src/components -mindepth 1 -maxdepth 1 -type d | wc -l)
  hooks/                  4 hooks: use-analytics-data, use-contact-form, use-in-view, use-sonner-toast.
  lib/                    Shared utilities. Notable: db.ts, env-validation.ts, logger.ts, schemas.ts,
                          api-rate-limit.ts, api-csrf.ts, csp-edge.ts, email-service.ts,
                          rate-limiter/{store,configs,helpers}.ts, data-service/.
  types/                  13 files, 11 .ts + 2 .d.ts (api, blog, project, forms, monitoring, security,
                          analytics, chart, design-system, hooks, seo, assets.d.ts, next-types.d.ts).
                          All styling now lives in the single src/app/globals.css
                          (the former src/styles/ + fonts.ts were consolidated in).
  db/                     Drizzle schema, client, and CUID2 ID factory.
                            schema.ts — 10 tables, 6 enums (string-union types), citext + inet
                            customType, jsonb columns typed via .$type<T>().
                            index.ts — lazy Proxy over neon-http drizzle client.
                            cuid.ts — replacement for Prisma's @default(cuid()) (uses cuid2).
  data/                   Static catalog data.

drizzle/                  seed.ts (idempotent upsert seed) + migrations/ (drizzle-kit output).
e2e/                      11 Playwright specs: about, audit-regressions, blog, contact, contact-form,
                          homepage, projects, projects-detail, resume, resume-view, security-headers.
                          4 browser projects (chromium/firefox/webkit/mobile-chrome), playwright.config.ts:62-77.
scripts/                  _db.ts — shared neon+drizzle bootstrap (createScriptDb),
                          consumed by drizzle/seed.ts. Also: clean-truncated-slugs.ts,
                          derive-partner-metrics.ts, scrub-secrets-from-history.sh.
src/proxy.ts              Next.js 16 successor to middleware.ts (see Auth/CSP). NOT at the repo root.
```

App Router conventions in use: dynamic segments (`[slug]`), private folders (`_components/`, ~20 of them), and a shared metadata helper at `src/app/shared-metadata.ts` (pages export `metadata` inline — there are **no** per-route `metadata.ts` files). **No** route groups (`(group)`), catch-alls, parallel routes, intercepting routes, or admin route.

Path aliases (`tsconfig.json:42-73`): `@/*` → `src/*`, plus explicit wildcard entries `@/components/*`, `@/lib/*`, `@/hooks/*`, `@/types/*`, `@/app/*`, `@/content/*`, `@/data/*`, `@/db/*`, and one bare entry `@/db` → `src/db/index`. `@/content/*` is declared but no `src/content/` exists yet. `vitest.config.ts:16-23` mirrors only the three load-bearing ones (`@/db`, `@/db/`, `@/`) — order matters there.

## Database

Postgres via Drizzle ORM with the Neon serverless HTTP driver (`@neondatabase/serverless` + `drizzle-orm/neon-http`). Stateless per-query, no connection pool to exhaust on serverless. Schema lives in `src/db/schema.ts`.

**10 tables** (`src/db/schema.ts`): `blogPosts`, `authors`, `categories` (self-referential parent/child), `tags`, `postTags` (composite PK `[postId, tagId]`), `postViews`, `postInteractions`, `projects`, `contactSubmissions`, `securityEvents`. All IDs are CUIDs (cuid2 for new rows; legacy cuid v1 IDs created by Prisma still coexist). Use `cuidSchema` from `src/lib/schemas.ts` for ID validation — not `z.string().uuid()`.

**6 enums** (`pgEnum`): `PostStatus`, `ContentType`, `InteractionType`, `SubmissionStatus`, `SecurityEventType`, `SecuritySeverity`. Drizzle exposes them as string-union types; compare against literals (e.g. `'PUBLISHED'`), no enum object.

Slug + email columns are `citext` (custom Drizzle type → `citext` extension, already enabled in DB). `blogPosts.deletedAt` is a soft-delete column — filter in app code; not enforced. `projects` has 8 typed `jsonb` columns via `.$type<T>()` (impact, results, displayMetrics, metrics, testimonial, gallery, details, charts). `postViews`, `contactSubmissions`, `securityEvents` use a custom `inet` type for IP addresses.

`blogPosts.searchVector` is a `tsvector` **generated column** (`GENERATED ALWAYS … STORED`) weighting title A, excerpt B, content C, with a GIN index plus trigram GIN indexes on title/excerpt — all in `0001_hard_maverick.sql`. Postgres requires an IMMUTABLE expression, so the text-search config is the literal `'english'`; the one-argument `to_tsvector(text)` is only STABLE and is rejected. It backs `/blog?q=` (searched server-side in `page.tsx`, so a query can match a post's full body text, which never reaches the browser). Migrations need the `portfolio_owner` role — the app's `DATABASE_URL` connects as `authenticated`, which has DML but not DDL.

**Migrations**: live in `drizzle/migrations/` going forward (generated via `bunx drizzle-kit generate`). The pre-existing Postgres schema was created by Prisma migrations (now removed from the repo) and remains in place — Drizzle is pointed at the same DB. Use `drizzle-kit push` for dev iteration before generating a migration file.

**The migration set cannot build a database from scratch.** It baselines against the Prisma-created schema, so there are no `CREATE TABLE` migrations — pointing `DATABASE_URL` at an empty Postgres and running `db:migrate` fails immediately. A from-scratch instance also needs the `citext` extension, which no migration creates (`pg_trgm` *is* created, by `0001`). The supported paths are the existing databases or a Neon branch off one.

Applied migrations are compared by **timestamp, not hash**: `drizzle-orm/neon-http/migrator.js:22` gates on `Number(lastDbMigration.created_at) < migration.folderMillis` and never reads the stored `hash`. Editing an already-applied migration file therefore cannot re-trigger it — which is what made adding the `CREATE EXTENSION` guard to `0001` safe, verified by re-running `db:migrate` against production and confirming the indexes `0002` dropped were not recreated. Do not rely on this to rewrite history casually; it is a property of the current driver.

**Client init** (`src/db/index.ts`): exports `db` as a `Proxy` over a lazy `drizzle()` singleton on `globalThis.__drizzle`. `'server-only'` enforces server-side use. `src/lib/db.ts` re-exports from `@/db` so existing `import { db } from '@/lib/db'` callers keep working.

Seed (`drizzle/seed.ts`): upsert-based, idempotent. Seeds 1 author, categories, tags, projects from `src/data/projects`, 8 blog posts (6 published, 1 draft, 1 scheduled), then random views/interactions for published posts. Wipes data first when `NODE_ENV !== 'production'`.

## API routes

14 `route.ts` + 1 `route.tsx` (`og/route.tsx` uses `next/og` `ImageResponse`) = 15 files total. `src/app/api/contact/csrf-route.ts` is a 16th file but is NOT a route (see below).

| Path | Methods | Rate limit | CSRF | Auth | Notes |
|---|---|---|---|---|---|
| `/api/health` | GET | — | — | — | DB ping; trimmed payload (no version/uptime/memory) |
| `/api/health-check` | GET, HEAD | — | — | — | Plain `OK` text for header probes |
| `/api/blog` | GET, POST | `read` / `sensitive` | POST | `ADMIN_API_TOKEN` (POST, `route.ts:175`) | POST validates with `createBlogPostSchema` (strict); fires IndexNow only when `status === 'PUBLISHED'` and `INDEXNOW_KEY` is set. GET also calls `isAdminRequest` (`route.ts:65`) so token holders can pass `?status=DRAFT`; public callers are forced to `published=true` |
| `/api/blog/[slug]` | GET, PUT, DELETE | `sensitive` (PUT `:84`, DELETE `:227`) | PUT, DELETE | `ADMIN_API_TOKEN` (PUT `:92`, DELETE `:235`) | GET increments `viewCount` async, and hides non-PUBLISHED/soft-deleted posts behind a 404 unless `isAdminRequest` (`:45`) |
| `/api/blog/rss` | GET | — | — | — | XML or JSON via `?format=` |
| `/api/blog/tags` | GET, POST | `sensitive` (POST, `route.ts:55`) | POST | `ADMIN_API_TOKEN` (POST, `route.ts:64`) | Order is rate-limit → admin → CSRF → `createTagSchema` |
| `/api/blog/categories` | GET, POST | `sensitive` (POST, `route.ts:44`) | POST | `ADMIN_API_TOKEN` (POST, `route.ts:53`) | Order is rate-limit → admin → CSRF → `createCategorySchema` |
| `/api/blog/analytics` | GET | — | — | — | Validates `timeRange` enum (`7d`/`30d`/`90d`/`1y`) |
| `/api/contact` | POST | `contactForm` — applied **inside** `emailService.sendContactEmail()` (`src/lib/email-service.ts:58` → `rate-limiter/helpers.ts:27`), NOT via `checkRateLimitOrRespond` in the route | yes | — | Resend email; IP-based limit (3/hr, burst 2/10s, 5-min base block) |
| ~~`/api/contact/csrf`~~ | — | — | — | — | **Not reachable.** `src/app/api/contact/csrf-route.ts` exports GET, but Next.js only routes `route.ts`/`route.tsx`, so no URL serves it — and no client code fetches `/api/contact/csrf`. Currently dead code. |
| `/api/projects` | GET | `read` | — | — | |
| `/api/projects/[slug]` | GET | `read` | — | — | `slugSchema` validates param |
| `/api/og` | GET | — | — | — | Dynamic OG image (`route.tsx`) |
| `/api/seed` | POST | — | — | `ADMIN_API_TOKEN` | Returns 404 in production unless `ALLOW_SEED_IN_PRODUCTION='true'`; refuses if posts already exist |
| `/api/security/metrics` | GET | — | — | `METRICS_API_TOKEN` (header `X-Metrics-Token`) | Exports rate-limiter metrics. Returns **403** (not 401) both when the token is unset (`route.ts:9`) and when it mismatches (`route.ts:15`) |
| `/api/cron/publish-scheduled` | GET | — | — | `CRON_SECRET` (`Authorization: Bearer`) | Vercel Cron, **daily 06:00 UTC** (`vercel.json`). Daily is forced by the Hobby plan — sub-daily expressions like `0 * * * *` **fail deployment outright** at config validation, before a build exists ([docs](https://vercel.com/docs/cron-jobs/usage-and-pricing)). Hobby precision is ±59 min, so a post publishes up to ~25 h after `scheduledAt`. Flips `SCHEDULED` → `PUBLISHED` once `scheduledAt` is due, skipping soft-deleted rows. **Fails closed**: 401 when `CRON_SECRET` is unset, and returns an identical 401 for unset vs. wrong token so the response can't confirm whether a secret exists. `Cache-Control: no-store` |

Rate limiter (`src/lib/rate-limiter/store.ts`): in-memory `Map` singleton, LRU eviction every 5 min, exponential progressive penalty with 2× multiplier. Two preset surfaces:
- `RateLimitPresets` (`src/lib/api-rate-limit.ts`): `read` (100/min, burst 120/5s), `sensitive` (10/hr, 30-min block).
- `RateLimitConfigs` (`src/lib/rate-limiter/configs.ts`): `contactForm`.

Use `checkRateLimitOrRespond(request, preset, path, method)` → returns a `NextResponse` (429) to short-circuit, or `null` to proceed.

**Buckets key on the client IP alone** (`getClientIdentifierFromHeaders`, `src/lib/api-request.ts`). The User-Agent used to be hashed into that key, which was a rate-limit bypass: UA is client-controlled, so varying one byte minted a fresh bucket and defeated every limit here. It is now passed as `context.userAgent` instead, where the limiter already scores it for bot/scraper patterns — an attacker-supplied string may raise suspicion, never widen an allowance. Header precedence is platform-set first (`x-vercel-forwarded-for` → `x-real-ip` → `cf-connecting-ip`), with client-settable `x-forwarded-for` last; Vercel overwrites XFF to prevent spoofing, so this only matters off that path.

Validation: `src/lib/schemas.ts`. Notable: `cuidSchema` (use this for IDs, not `z.string().uuid()`), `slugSchema` (lowercase + hyphens, max 100), `contactFormSchema`, `createBlogPostSchema` (`.strict()` — rejects unknown fields).

## Auth & CSP

No user authentication framework. Two API tokens, both compared via `timingSafeEqualString()` (`src/lib/timing-safe-equal.ts`), a length-guarded wrapper over `crypto.timingSafeEqual`:
- `ADMIN_API_TOKEN` — `Authorization: Bearer …` via `isAdminRequest()` (`src/lib/api-admin-auth.ts:20`). Hard-gates `POST /api/seed`, `POST /api/blog`, `PUT`+`DELETE /api/blog/[slug]`, `POST /api/blog/tags`, `POST /api/blog/categories`; also used as a soft read-gate on `GET /api/blog` and `GET /api/blog/[slug]` to expose unpublished posts. Unset in production ⇒ every blog mutation 401s (warned at `src/lib/env-validation.ts:112`).
- `METRICS_API_TOKEN` — `X-Metrics-Token` header on `/api/security/metrics`.
- `CRON_SECRET` — `Authorization: Bearer …` on `/api/cron/publish-scheduled`. Vercel sets this header itself on cron invocations when the env var exists ([docs](https://vercel.com/docs/cron-jobs/manage-cron-jobs)); Vercel's sample compares with `!==`, this repo uses `timingSafeEqualString` like the other two.

CSRF (`src/lib/csrf-protection.ts`): 32-byte hex token in HttpOnly + `SameSite=Strict` cookie `__csrf_token`. Validated on POST/PUT/DELETE for `/api/blog*` and `/api/contact`. Token sent via `x-csrf-token` header (JSON) or `_csrf_token` form field.

`src/proxy.ts` (under `src/`, not the repo root) is the **Next.js 16 successor to `middleware.ts`** — exports a function named `proxy` (not `middleware`). It generates a per-request base64 nonce and sets **only the nonce** on the downstream request as `x-nonce` (so `layout.tsx:48` can read it for inline JSON-LD); the CSP built by `buildEnhancedCSP()` (`src/lib/csp-edge.ts`) is set **only on the response** (`src/proxy.ts:27`) — request headers never reach the browser, so setting it there would be a no-op. Matcher excludes `_next/static`, `_next/image`, `favicon.ico`, image extensions, and `.pdf` (the latter so the resume PDF can embed in `<object>` on `/resume` — paired with a route-specific `X-Frame-Options: SAMEORIGIN` rule for `.pdf` in `next.config.js`; both rules must move together).

Static security headers in `next.config.js:55-180` (the `async headers()` block): HSTS (`max-age=31536000; includeSubDomains; preload`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `X-DNS-Prefetch-Control: on`, `X-XSS-Protection: 0` (intentional — comment at L68-72 explains), `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` denies camera/mic/geolocation/topics. CSP itself is **only** set in `proxy.ts`, never in `headers()`.

CORS on `/api/*`: only the prod origin (`https://richardwhudsonjr.com`) or `http://localhost:3000` in dev.

## Environment variables

All declared in `src/lib/env-validation.ts` (Zod, no `@t3-oss/env-nextjs`). Validation runs at module load (`L139-146`) and throws on failure.

| Var | Required | Notes |
|---|---|---|
| `NODE_ENV` | default `development` | `development` / `production` / `test` |
| `DATABASE_URL` | optional at build, required at runtime | Must start with `postgresql://` or `postgres://` |
| `USE_LOCAL_DB` | optional | Legacy flag from the Prisma era; the Drizzle client always uses neon-http. Local Postgres dev is supported by pointing `DATABASE_URL` at the local instance. |
| `RESEND_API_KEY` | optional | Required to actually send contact email |
| `FROM_EMAIL` | default `noreply@richardwhudsonjr.com` | Must be on the Resend-verified domain |
| `TO_EMAIL` | default `hudsor01@icloud.com` | Real delivery inbox for contact submissions |
| `NEXT_PUBLIC_SITE_URL` | default per env | Must be HTTPS in production |
| `NEXT_PUBLIC_VERCEL_URL` | optional | Vercel-injected |
| `ADMIN_API_TOKEN` | optional | min 32 chars; production warning if <64 |
| `METRICS_API_TOKEN` | optional | min 32 chars; production warning if <64 |
| `CRON_SECRET` | optional | min 32 chars; production warning if unset or <64. Without it `SCHEDULED` posts never publish |
| `ALLOW_SEED_IN_PRODUCTION` | optional | Enum `'true'`/`'false'` — enum (not string) so misspellings fail at boot |

Sentry vars (`SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`, `SENTRY_URL`, `SENTRY_ENVIRONMENT`, `SENTRY_SEND_DEFAULT_PII`, plus `*_TRACES_SAMPLE_RATE` / `*_PROFILES_SAMPLE_RATE` / `*_REPLAYS_*_SAMPLE_RATE`) are read directly in `sentry.server.config.ts`, `sentry.edge.config.ts`, `instrumentation-client.ts` and `sentry.shared.ts`, plus `next.config.js:232-257` (`sentryBuildOptions`) — they are **not** in the Zod schema. There is no `sentry.client.config.ts` (deliberately — see the Sentry section). `INDEXNOW_KEY` is read directly in `src/app/api/blog/route.ts:293`. `LOG_LEVEL` is read in `src/lib/logger.ts:18`. `SKIP_DB_VALIDATION` is set at `.github/workflows/ci.yml:124` but is **not read anywhere in `src/`** — `src/lib/db.ts` is a 7-line re-export of `@/db` with no env check. Dead variable; remove it or wire it up.

## Sentry & logging

Sentry init is split by runtime, and the three entrypoints are **not** symmetrical:

| Runtime | Init lives in | Loaded by |
|---|---|---|
| Node | `sentry.server.config.ts` | `instrumentation.ts` → `register()` |
| Edge | `sentry.edge.config.ts` | `instrumentation.ts` → `register()` |
| **Browser** | **`instrumentation-client.ts`** (init inline) | Next.js directly |

**Never move the browser init into a `sentry.client.config.ts`.** `@sentry/nextjs`
no longer auto-loads that filename, so config placed there is dead code and the
browser SDK silently never initialises — while server and edge keep working, which
makes it very easy to miss. This exact bug shipped here and went unnoticed. Verify
after any change to Sentry wiring:

```
bun run build && grep -rl "<your-dsn-id>" .next/static   # must match a chunk
```

Shared helpers (`parseSampleRate`, the server/edge option builders) live in
`sentry.shared.ts`. Wrapped via `withSentryConfig(nextConfig, …)` in `next.config.js`.
Disabled when `NODE_ENV='test'` or DSN absent — `sentry.shared.ts:64` gates on
`Boolean(dsn) && process.env.NODE_ENV !== 'test'`, so a missing
`NEXT_PUBLIC_SENTRY_DSN` disables Sentry entirely rather than erroring. Sample
rates are clamped to `[0,1]` by `parseSampleRate` and their defaults do **not**
vary by environment: traces `1`, profiles `0`, `replaysSessionSampleRate` `0`,
`replaysOnErrorSampleRate` `1` (`sentry.shared.ts:69,72`;
`instrumentation-client.ts:15,17,27,32`). No tunnel route.

Build-time source-map upload needs `SENTRY_AUTH_TOKEN` **plus** `SENTRY_ORG` and
`SENTRY_PROJECT` (`next.config.js` passes all three into `withSentryConfig`).
`silent: true` means a missing one fails quietly — confirm uploads landed by
checking that a release appears for the deployed commit SHA in Sentry.

**CSP and Sentry are coupled.** `connect-src` in `src/lib/csp-edge.ts` must list
`https://*.ingest.us.sentry.io`, or the browser blocks every client envelope
before it leaves the page — errors, traces and replays all go dark while the
server side keeps reporting normally, so the dashboard still looks alive.
`worker-src 'self' blob:` is equally required: Session Replay compresses payloads
in a Web Worker created from a `blob:` URL, and without it the worker is refused,
replay breaks, and the in-flight request never settles.

**`tunnelRoute` is deliberately not set.** It would proxy events same-origin and
dodge ad blockers, but the Next.js external rewrite it installs hangs ~10s and
returns 408 locally (direct-to-Sentry answers in ~60ms). That leaves a pending
request on every page load, which stalls every `waitForLoadState('networkidle')`
— it took the e2e suite from 14 failures to 122. The accepted trade-off is that
ad blockers can drop some client events by hostname. Only revisit with a verified
fix, and re-run the full e2e suite if you do.

Three `withSentryConfig` options are deliberately **absent**:
`reactComponentAnnotation`, `disableLogger`, `automaticVercelMonitors`. They are
deprecated in favour of `webpack.*` equivalents and, per the SDK's own build
warning, "Not supported with Turbopack" — this app builds with Turbopack, so they
were no-ops that logged a deprecation warning per deploy. Re-add only under
`webpack.*`, and only if the build ever moves off Turbopack.

Coverage currently enabled: errors (all runtimes), tracing at 100%, structured
logs (`enableLogs`) with `console.log/warn/error` forwarded, and Session Replay
on **errors only**. Replay session sampling defaults to 0 on purpose — replay
quota is consumed per replay and, once exhausted, Sentry drops *new* replays
including the ones attached to errors, so sampling idle sessions trades away
error coverage. Every rate is env-overridable (`NEXT_PUBLIC_SENTRY_*` for the
browser, `SENTRY_*` for server/edge). Profiling stays at 0 — it needs the extra
`@sentry/profiling-node` package.

Verify the browser side actually delivers (not just that it initialises) by
loading a page and watching for `POST .../envelope/` returning 200 with no CSP
violation in the console.

Logger (`src/lib/logger.ts`): exports `logger` singleton + `createContextLogger(name)` factory. Levels: `debug`/`info`/`warn`/`error`/`fatal` (controlled by `LOG_LEVEL`). Two transports: `ConsoleTransport` (colored, suppressed in prod) and `SentryTransport` (error → `captureException`, warn → `captureMessage`, info/debug → `addBreadcrumb`). Sentry is the production sink — there is no file transport. Lazy-requires `@sentry/nextjs`.

## Vercel runtime

**Don't add `bunVersion` back to `vercel.json`.** It sets the runtime for Vercel
Functions and Routing Middleware, but `engines.node` in `package.json` takes
precedence — so with both present Vercel logs *"`package.json` takes precedence,
using \"node\""* and ignores `bunVersion` entirely. It was dead config, and removing
it changed no behaviour; Node was already the runtime.

Node is the deliberate choice here, not an accident:
- The Bun runtime has **no automatic source maps** — which would defeat the Sentry
  source-map upload wired through `withSentryConfig` in `next.config.js`.
- This app uses ISR, and Vercel requires `bun run --bun next build` for Next.js +
  ISR on the Bun runtime — directly at odds with the deliberate Node-side `build`
  (see the `bun --bun` note under Gotchas).
- Bun also lacks bytecode caching and request metrics on `node:http`/`node:https`.

Bun remains the package manager and script runner on Vercel regardless: `bun.lock`
drives `bun install` and `buildCommand` is `bun run build`. Only the *function
runtime* is Node. Ref: https://vercel.com/docs/functions/runtimes/bun

## Dependency policy

**`bunfig.toml` sets `[install] peer = false`. Do not remove it.** Bun installs
optional peer dependencies by default; npm and pnpm do not. `drizzle-orm` declares
30 optional peers (as of 0.45.4) — one for every DB driver it supports — so the default behaviour
pulled `@prisma/client` + `prisma` (~215 MB) into a repo that had deliberately
migrated *off* Prisma, plus unused `mysql2` / `pg` / `postgres`. Those phantom
chains were the source of most transitive CVE findings. Turning peer auto-install
off removed 203 packages (693 → 490) and ~350 MB, and took `overrides` from 21
entries to 3.

Consequence: **anything the build actually needs must be a declared dependency.**
`babel-plugin-react-compiler` was silently supplied as a `next` optional peer for
months while `next.config.js` claimed no Babel plugin was needed; `peer = false`
exposed it as a hard build failure. It is now an explicit devDependency. If a build
breaks with "failed to resolve <pkg>" after a dependency change, declare the package
rather than re-enabling peer auto-install.

**Keep `overrides` minimal.** Only 3 are load-bearing, each pinning a *nested* copy
that a parent pins below the fix line:

| Override | Why it exists |
|---|---|
| `postcss` | `next` internally pins its own `postcss` (`8.5.23` as of 16.4.3); collapses every copy onto one patched version |
| `sharp` | Backstop against a *nested* pre-0.35.5 copy (libvips/libheif RCE GHSA-rgj7-g3m4-5g8c fixed in 0.35.4; librsvg GHSA-wq5f-xc86-pv6w fixed in 0.35.5). As of `next` 16.4.3 the parent itself pins `sharp ^0.35.5`, so this no longer changes resolution. Kept only as a floor; re-check it whenever `sharp` is bumped. |
| `esbuild` | `drizzle-kit`, `react-email`, and `vite` pin versions below the dev-server disclosure fix |

Before adding a fourth, check whether the package resolves to a patched version on
its own — an override that pins a caret range *stops* that package tracking upstream
patches and goes stale silently. That is not hypothetical: the old block pinned
`fast-uri ^4.0.0`, which forced the tree onto the 4.x line where the vulnerable range
(`>=4.0.0 <4.1.2`) lives, when it would otherwise have resolved to a clean 3.1.5.
Several other pins had drifted *behind* natural resolution. Neither Dependabot nor
Renovate updates `overrides` ([renovate#15278](https://github.com/renovatebot/renovate/issues/15278)
is still unimplemented), so every entry is permanently hand-maintained.

CI gate is `bun audit --audit-level=high` (`.github/workflows/ci.yml`), but the tree
is currently clean at *every* severity — keep it there.

## Gotchas

- **No Prisma.** The repo migrated off Prisma 7 → Drizzle ORM in May 2026 after [prisma/prisma#28588](https://github.com/prisma/prisma/issues/28588) caused `/blog/[slug]` Server Component queries to suspend indefinitely on Vercel + adapter-neon. Don't reintroduce `@prisma/*` packages or import from `@/generated/prisma/*`.
- **Never call `notFound()` inside a `not-found.tsx`.** It's recursive and Vercel serves HTTP 200 with a 404-marker body, which Google flags as "Soft 404." A `not-found.tsx` should be a plain Server Component that just renders the 404 UI — the HTTP 404 status comes from the `notFound()` call in the page or layout, not from the template itself. Segment-level templates exist at `src/app/blog/[slug]/`, `src/app/blog/category/[slug]/`, and `src/app/projects/[slug]/` for themed 404s; the root template at `src/app/not-found.tsx` is the global fallback.
- **Drizzle relational queries** use `db.query.<table>.findFirst({ where, with: { ... } })` for relations and `db.select().from(table)` for plain SQL-style queries. `db.execute(sql\`...\`)` is the raw-SQL escape hatch (used in `src/lib/search.ts` for full-text search).
- **`db.execute()` returns a result OBJECT, not an array.** neon-http calls with `fullResults: true`, so you get `{ rows, fields, command, rowCount, … }`. Reading `.length` off it yields `undefined`, and `undefined > 0` / `undefined < 5` are both `false` — so a `result as unknown as T[]` cast produces silent wrong behaviour rather than a crash, and `tsc` cannot see through the double cast. Go through `rowsOf()` in `src/lib/search.ts`, and mock the object shape in tests: array-shaped mocks let this bug pass CI for the module's entire life.
- **Binding an array into `sql` does not produce a Postgres array.** `sql\`ANY(${arr}::"PostStatus"[])\`` emits `ANY(($1)::"PostStatus"[])` with the whole array as one param, which Postgres rejects with `22P02`. Expand it instead: ``sql`ANY(ARRAY[${sql.join(arr.map((v) => sql`${v}`), sql`, `)}]::"PostStatus"[])` ``. Both `src/lib/search.ts` clauses use that form.
- **All IDs are CUIDs.** New rows use cuid2 via `src/db/cuid.ts`; legacy rows from the Prisma era use cuid v1. Both are 24–25-char alphanumeric strings — use `cuidSchema` from `src/lib/schemas.ts` for ID validation, never `z.string().uuid()`.
- **citext + inet are custom Drizzle types.** Defined in `src/db/schema.ts` via `customType<{ data: string; driverData: string }>`. Don't replace with plain `text()` — case-insensitive slug/email matching depends on it.
- **CSP comes from `src/proxy.ts`, not `headers()`.** Adding it to `next.config.js` would emit a second, conflicting `Content-Security-Policy` header. Note the CSP itself carries **no** nonce — `script-src` is `'self' 'unsafe-inline' …` (`src/lib/csp-edge.ts:58`) because a nonce is incompatible with this site's static prerendering (explained at `next.config.js:86-88`). The per-request `x-nonce` header still exists and `layout.tsx:48` threads it into the JSON-LD components, but it is not enforced by the policy today.
- **PDF assets are an intentional carve-out.** `.pdf` paths are excluded from the `proxy.ts` matcher (no CSP) and override `X-Frame-Options` to `SAMEORIGIN` via a route-specific `next.config.js` rule, so the resume PDF can embed in `<object>` on `/resume` and `/resume/view`. Chrome PDFium has been progressively restricting `<iframe src=pdf>` since Chrome 116; use `<object data=pdf type="application/pdf">` for embedded PDFs. If a future PDF needs to stay non-framable (e.g. signed contract), narrow the `next.config.js` source from `/:path*\\.pdf` to the literal résumé filename and add an explicit deny rule for the new path. Regression-pinned in `e2e/security-headers.spec.ts`.
- **One canonical email path: `src/lib/email-service.ts`.** Both the `submitContactForm` server action (`src/app/contact/actions.ts`) and the `POST /api/contact` route handler delegate to `emailService.sendContactEmail()`. Templates live in `src/emails/*.tsx` and use `react-email` components (passed via Resend's `react` prop). Don't reintroduce inline HTML strings or per-handler Resend clients.
- **`api/contact/csrf-route.ts` is not auto-routed.** Next.js only treats `route.ts` as an endpoint; this filename was deliberate. Confirm wiring before relying on it.
- **`bun --bun` flag matters.** `dev`, `start` and `build:ci` use it; `build` does not. The Bun-side bundler exposes different edge cases than the Node-side one — when reproducing a CI failure locally, match the script.
- **e2e runs against a production build, never `next dev`.** `playwright.config.ts`'s `webServer` runs `bun run e2e:server` (build → copy standalone assets → `node .next/standalone/server.js`) on port **3100**. This is not a preference: `src/lib/csp-edge.ts` adds `'unsafe-eval'` to `script-src` in development for HMR, and `e2e/security-headers.spec.ts` asserts it is absent — so under the old `bun run dev` webServer that spec failed 100% of the time. It went unnoticed because there was no e2e job in CI until PR #238. `next start` is not an option here (`output: 'standalone'` makes Next refuse it), and the standalone server ships an empty `public/` and `.next/static`, hence the copy steps. Port 3100 rather than 3000 keeps `reuseExistingServer` from silently adopting a stray `bun dev`. Point the suite elsewhere with `PLAYWRIGHT_BASE_URL`, which disables `webServer` entirely.
- **`next build` copies `.env` into `.next/standalone/`.** Verified on this repo. Harmless as deployed — Vercel uses the Build Output API and ignores the standalone bundle — but it means `.next/standalone/` is not safe to treat as a redistributable artifact, and it silently defeats any attempt to test the app "without a database" by copying that directory elsewhere. It also means `env -u DATABASE_URL bun run build && next start` proves nothing about DB-less behaviour: `.env`, `.env.local` and `.env.development.local` all carry a `DATABASE_URL` and Next loads them itself. To genuinely test without a database, delete the `.env*` files from the copied standalone directory — `/api/health` should then report `"database":"down"`.
- **Pre-push runs Vitest.** Bypass with `git push --no-verify` only when the failure is provably unrelated to the change.

## Where to find things

- Public site URL: `NEXT_PUBLIC_SITE_URL`, defaults `https://richardwhudsonjr.com`.
- Vercel region: `iad1` (single region, `vercel.json:5`).
- Image whitelist: `images.unsplash.com` only (`next.config.js:46-52`, inside the `images` block at `:39-53`).
- Cache policy for `/projects/*`, `/blog/*` **and `/tools/*`**: `s-maxage=60, stale-while-revalidate=86400`, CDN 1 hour (`next.config.js:130-136`; source is `/(projects|blog|tools)/:path*`).
- Permanent redirects (`next.config.js:182-229`): `/home` → `/`, plus five blog de-cannibalization 308s (two forecast-accuracy slugs, two dead-deal slugs, one renamed RevOps pillar) whose sources are also excluded from the sitemap via `RETIRED_BLOG_SLUGS`. Edge-level: `/github`, `/linkedin`, `/twitter` (`vercel.json:6-19`; `permanent` defaults to true → 308).
- 88 Vitest files under `src/**/__tests__/` — `src/lib/` (45), `src/app/api/` (14), `src/components/` (18), `src/hooks/` (4), plus `src/app/contact/`, `src/data/`, `src/emails/`. Discovery pattern: `src/**/__tests__/**/*.test.ts{,x}` (`vitest.config.ts:28`). Regenerate: `find src -name '*.test.ts*' | wc -l`.
- 11 Playwright specs under `e2e/`.
- Security audit history: `SECURITY.md` (current controls). `SECURITY_AUDIT_REPORT.md` no longer exists — its findings (S-001, B-001, H-001, B-002, P-001) were closed and the file removed; check git history if you need the original text.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is **hand-maintained**. Next ≤16.3 `next dev` rewrote it here; since 16.4 it manages the block only in `AGENTS.md` (`node_modules/next/dist/server/lib/generate-agent-files.js`), and `agentRules: false` in `next.config.js` turns that off so no second, gitignored copy appears.

<!-- END:nextjs-agent-rules -->
