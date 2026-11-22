# CLAUDE.md

Public portfolio + blog system for Richard Hudson. Next.js App Router, Drizzle ORM on Postgres (Neon in prod), Resend for contact email, Sentry for errors, tracing, logs and error replay, Vercel for hosting. No user auth — token-gated admin endpoints + CSRF on mutations.

## Stack

Runtime: Bun 1.4.4 (`packageManager`; CI's SHA-pinned `setup-bun` v2 reads that field when given no version, so CI installs exactly this. Vercel's build does not — it installs with its own Bun, 1.3.14 as of 2026-10-31; see the `bun.lock` gotcha), Node `>=22 <25` (`package.json:7-9`). Major versions only — exact pins are in `package.json`, and Dependabot moves minors weekly: Next.js 16, React 19, TypeScript 7 (the native Go port — ships no `lib/typescript.js` compiler API, only the `typescript/unstable/*` IPC client; `next build` type-checks through the `tsc` CLI, so never set `experimental.useTypeScriptCli: false`), Tailwind 4, Zod 4, Drizzle ORM 0.45 (pre-1.0, so the minor is the breaking line) + `@neondatabase/serverless` 1 (HTTP driver), `@sentry/nextjs` 11, Resend 6, Vitest 5 + jsdom 30, Playwright 1, Biome 2 (linter + formatter), Lefthook 2.

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
| `bun run db:seed` | `bun run drizzle/seed.ts` — sample-data seed. **Destructive:** unless `NODE_ENV=production` it first deletes 8 tables (see Database) |

Hooks (`lefthook.yml`): pre-commit runs `bunx biome check --staged --write --no-errors-on-unmatched` over staged `src/**` plus a `gitleaks git --staged` secret scan (skipped with a notice if the binary is absent); pre-push runs `bunx vitest run --passWithNoTests` **and** `bun run typecheck`, in parallel. `--no-verify` bypasses. In CI, the `secrets` job runs gitleaks-action with `GITLEAKS_VERSION` pinned (8.30.1): `.gitleaks.toml`'s global `[[allowlists]]` need gitleaks ≥8.25, the action defaults to 8.24.3, and on `pull_request` it scans only the PR's own commits.

## Layout

```
src/
  app/                    Next.js App Router. Top-level routes: about, blog, contact, projects, resume, tools.
                          Plus root layout/page/error/global-error/not-found/sitemap/robots/viewport,
                          shared-metadata.ts, reading-progress.tsx, globals.css.
  app/api/                14 route.ts handlers + 1 route.tsx (og). See API table.
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
                          (the former src/styles/*.css were inlined; its unused fonts.ts was
                          deleted — fonts load via next/font in layout.tsx).
  db/                     Drizzle schema, client, and CUID2 ID factory.
                            schema.ts — 10 tables, 6 enums (string-union types), citext + inet +
                            tsvector customTypes, jsonb columns typed via .$type<T>() (all 8 on
                            projects; postInteractions.metadata and securityEvents.details are untyped).
                            index.ts — lazy Proxy over neon-http drizzle client.
                            cuid.ts — replacement for Prisma's @default(cuid()) (uses cuid2).
  data/                   Static catalog data.
  emails/                 react-email templates (auto-reply, contact-notification) used by lib/email-service.ts.

drizzle/                  seed.ts (sample-data seed; wipes first outside production) + migrations/ (drizzle-kit output).
e2e/                      12 Playwright specs: about, audit-regressions, blog, contact, contact-form,
                          homepage, projects, projects-detail, resume, resume-view, security-headers,
                          _meta/keyboard-infra.
                          4 browser projects (chromium/firefox/webkit/mobile-chrome), playwright.config.ts:86-104.
scripts/                  _db.ts — shared neon+drizzle bootstrap (createScriptDb),
                          consumed by drizzle/seed.ts and clean-truncated-slugs.ts. Also:
                          derive-partner-metrics.ts, scrub-secrets-from-history.sh.
src/proxy.ts              Next.js 16 successor to middleware.ts (see Auth/CSP). NOT at the repo root.
```

App Router conventions in use: dynamic segments (`[slug]`), private folders (`_components/`, ~20 of them), and a shared metadata helper at `src/app/shared-metadata.ts` (pages export `metadata` inline — there are **no** per-route `metadata.ts` files). **No** route groups (`(group)`), catch-alls, parallel routes, intercepting routes, or admin route.

Path aliases (`tsconfig.json:38-69`): `@/*` → `src/*`, plus explicit wildcard entries `@/components/*`, `@/lib/*`, `@/hooks/*`, `@/types/*`, `@/app/*`, `@/content/*`, `@/data/*`, `@/db/*`, and one bare entry `@/db` → `src/db/index`. `@/content/*` is declared but no `src/content/` exists yet. `vitest.config.mts:16-23` mirrors only the three load-bearing ones (`@/db`, `@/db/`, `@/`) — order matters there.

## Database

Postgres via Drizzle ORM with the Neon serverless HTTP driver (`@neondatabase/serverless` + `drizzle-orm/neon-http`). Stateless per-query, no connection pool to exhaust on serverless. Schema lives in `src/db/schema.ts`.

**10 tables** (`src/db/schema.ts`): `blogPosts`, `authors`, `categories` (self-referential parent/child), `tags`, `postTags` (composite PK `[postId, tagId]`), `postViews`, `postInteractions`, `projects`, `contactSubmissions`, `securityEvents`. All IDs are CUIDs (cuid2 for new rows; legacy cuid v1 IDs created by Prisma still coexist) — except `projects` rows from `drizzle/seed.ts`, which reuse the slug-style `id` from `src/data/projects.ts` (e.g. `'revenue-kpi'`). Use `cuidSchema` from `src/lib/schemas.ts` for ID validation — not `z.string().uuid()`.

**6 enums** (`pgEnum`): `PostStatus`, `ContentType`, `InteractionType`, `SubmissionStatus`, `SecurityEventType`, `SecuritySeverity`. Drizzle exposes them as string-union types; compare against literals (e.g. `'PUBLISHED'`), no enum object.

Slug columns and `authors.email` are `citext` (custom Drizzle type → `citext` extension, already enabled in DB); `contactSubmissions.email` is plain `text`. `blogPosts.deletedAt` is a soft-delete column — filter in app code; not enforced. `projects` has 8 typed `jsonb` columns via `.$type<T>()` (impact, results, displayMetrics, metrics, testimonial, gallery, details, charts). `postViews`, `contactSubmissions`, `securityEvents` use a custom `inet` type for IP addresses.

`blogPosts.searchVector` is a `tsvector` **generated column** (`GENERATED ALWAYS … STORED`) weighting title A, excerpt B, content C, with a GIN index — both in `0001_hard_maverick.sql`, which also added trigram GIN indexes on title/excerpt that `0002_ancient_thor.sql` dropped as unusable (see the note at `src/db/schema.ts:256`). Postgres requires an IMMUTABLE expression, so the text-search config is the literal `'english'`; the one-argument `to_tsvector(text)` is only STABLE and is rejected. It backs `/blog?q=` (searched server-side in `page.tsx`, so a query can match a post's full body text, which never reaches the browser). Migrations need the `portfolio_owner` role — the app's `DATABASE_URL` connects as `authenticated`, which has DML but not DDL.

**Migrations**: live in `drizzle/migrations/` going forward (generated via `bunx drizzle-kit generate`). The pre-existing Postgres schema was created by Prisma migrations (now removed from the repo) and remains in place — Drizzle is pointed at the same DB. Use `drizzle-kit push` for dev iteration before generating a migration file.

**The migration set cannot build a database from scratch.** It baselines against the Prisma-created schema, so there are no `CREATE TABLE` migrations — pointing `DATABASE_URL` at an empty Postgres and running `db:migrate` fails immediately. A from-scratch instance also needs the `citext` extension, which no migration creates (`pg_trgm` *is* created, by `0001`). The supported paths are the existing databases or a Neon branch off one.

Applied migrations are compared by **timestamp, not hash**: `drizzle-orm/pg-core/dialect.js:62` (`PgDialect.migrate` — `db:migrate` reaches it through `drizzle-orm/neon-serverless/migrator`, because `drizzle-kit` probes `pg` → `postgres` → `@vercel/postgres` → `@neondatabase/serverless` and only the last is installed) gates on `Number(lastDbMigration.created_at) < migration.folderMillis` and never reads the stored `hash`. Editing an already-applied migration file therefore cannot re-trigger it — which is what made adding the `CREATE EXTENSION` guard to `0001` safe, verified by re-running `db:migrate` against production and confirming the indexes `0002` dropped were not recreated. Do not rely on this to rewrite history casually; it is an implementation detail of drizzle-orm's Postgres migrators (`PgDialect.migrate` and `neon-http`'s own copy share the same check), not a documented guarantee.

**Client init** (`src/db/index.ts`): exports `db` as a `Proxy` over a lazy `drizzle()` singleton on `globalThis.__drizzle`. `'server-only'` enforces server-side use. `src/lib/db.ts` re-exports from `@/db` so existing `import { db } from '@/lib/db'` callers keep working.

Seed (`drizzle/seed.ts`): **destructive outside production** — unless `NODE_ENV=production` it first deletes 8 tables, and the local `.env*` files carry a working `DATABASE_URL`, so only run it against a Neon branch you mean to reset. Authors/categories/tags are upserted and projects insert-or-skip on `id`, but blog posts, views and interactions are plain inserts — re-runs only work because of that wipe (a second run under `NODE_ENV=production` fails on the unique `blog_posts.slug`). Seeds 1 author, categories, tags, projects from `src/data/projects`, 8 blog posts (6 published, 1 draft, 1 scheduled), then random views/interactions for published posts. Its inserts depend on `updatedAtColumn()` (see the `updatedAt` gotcha); before #244 the first one failed on every Prisma-created database.

## API routes

14 `route.ts` + 1 `route.tsx` (`og/route.tsx` uses `next/og` `ImageResponse`) = 15 files total. `src/app/api/contact/csrf-route.ts` is a 16th file but is NOT a route (see below).

| Path | Methods | Rate limit | CSRF | Auth | Notes |
|---|---|---|---|---|---|
| `/api/health` | GET | — | — | — | DB ping; trimmed payload (no version/uptime/memory) |
| `/api/health-check` | GET, HEAD | — | — | — | Plain `OK` text for header probes |
| `/api/blog` | GET, POST | `read` / `sensitive` | POST | `ADMIN_API_TOKEN` (POST, `route.ts:199`) | POST validates with `createBlogPostSchema` (strict); fires IndexNow only when `status === 'PUBLISHED'` and `INDEXNOW_KEY` is set. GET also calls `isAdminRequest` (`route.ts:66`): token holders can filter with `?status=` / `?published=` and get a `private, no-store` response (`:177`); everyone else gets PUBLISHED, non-soft-deleted posts whatever they send (`:131`), CDN-cacheable. An unparseable or out-of-range `dateFrom`/`dateTo` is a 400. Until #242 the gate only *defaulted* `published=true`, so an anonymous `?status=DRAFT` listed drafts — keep it an override |
| `/api/blog/[slug]` | GET, PUT, DELETE | `sensitive` (PUT `:84`, DELETE `:227`) | PUT, DELETE | `ADMIN_API_TOKEN` (PUT `:92`, DELETE `:235`) | GET increments `viewCount` async, and hides non-PUBLISHED/soft-deleted posts behind a 404 unless `isAdminRequest` (`:45`) |
| `/api/blog/rss` | GET | — | — | — | XML or JSON via `?format=`. Lists only PUBLISHED, non-soft-deleted posts (`rss/route.ts:36`; until #242 soft-deleted posts stayed in the feed) |
| `/api/blog/tags` | GET, POST | `sensitive` (POST, `route.ts:55`) | POST | `ADMIN_API_TOKEN` (POST, `route.ts:64`) | Order is rate-limit → admin → CSRF → `createTagSchema` |
| `/api/blog/categories` | GET, POST | `sensitive` (POST, `route.ts:44`) | POST | `ADMIN_API_TOKEN` (POST, `route.ts:53`) | Order is rate-limit → admin → CSRF → `createCategorySchema` |
| `/api/blog/analytics` | GET | — | — | — | Validates `timeRange` enum (`7d`/`30d`/`90d`/`1y`). Every post query uses the public gate; `totalPosts`/`draftPosts` (they reveal unpublished posts) go only to `isAdminRequest` callers (`analytics/route.ts:56`, `:154`), whose response is `private, no-store` |
| `/api/contact` | POST | `contactForm` — applied **inside** `emailService.sendContactEmail()` (`src/lib/email-service.ts:61` → `rate-limiter/helpers.ts:27`), NOT via `checkRateLimitOrRespond` in the route | yes | — | Resend email; IP-based limit (3/hr, burst 2/10s, 5-min base block) |
| ~~`/api/contact/csrf`~~ | — | — | — | — | **Not reachable.** `src/app/api/contact/csrf-route.ts` exports GET, but Next.js only routes `route.ts`/`route.tsx`, so no URL serves it — and no client code fetches `/api/contact/csrf`. Currently dead code. |
| `/api/projects` | GET | `read` | — | — | |
| `/api/projects/[slug]` | GET | `read` | — | — | `slugSchema` validates param |
| `/api/og` | GET | — | — | — | Dynamic OG image (`route.tsx`) |
| `/api/seed` | POST | — | — | `ADMIN_API_TOKEN` | Returns 404 in production unless `ALLOW_SEED_IN_PRODUCTION='true'`; refuses if posts already exist |
| `/api/security/metrics` | GET | — | — | `METRICS_API_TOKEN` (header `X-Metrics-Token`) | Exports rate-limiter metrics. Returns **403** (not 401) both when the token is unset (`route.ts:9`) and when it mismatches (`route.ts:15`) |
| `/api/cron/publish-scheduled` | GET | — | — | `CRON_SECRET` (`Authorization: Bearer`) | Vercel Cron, **hourly on the hour** (`vercel.json`), so a post publishes up to an hour after `scheduledAt`. Hourly needs **Pro** (once-per-minute minimum, per-minute precision — [docs](https://vercel.com/docs/cron-jobs/usage-and-pricing)); on Hobby, sub-daily expressions like `0 * * * *` **fail deployment outright** at config validation, which is why it ran daily until the team moved to Pro. Flips `SCHEDULED` → `PUBLISHED` once `scheduledAt` is due, skipping soft-deleted rows. **Fails closed**: 401 when `CRON_SECRET` is unset, and returns an identical 401 for unset vs. wrong token so the response can't confirm whether a secret exists. `Cache-Control: no-store` |

Rate limiter (`src/lib/rate-limiter/store.ts`): in-memory `Map` singleton; a 5-min cleanup sweep (expired/idle records, penalty decay), and LRU-style eviction (expired/unpenalised records first, oldest `createdAt` first) only once the store hits 10,000 entries; exponential progressive penalty with 2× multiplier. Two preset surfaces:
- `RateLimitPresets` (`src/lib/api-rate-limit.ts`): `read` (100/min, burst 120/5s), `sensitive` (10/hr, 30-min block).
- `RateLimitConfigs` (`src/lib/rate-limiter/configs.ts`): `contactForm`.

Each preset sets a `bucket`, and the store keys counters `${bucket}:${clientId}` (`src/lib/rate-limiter/store.ts:110`), so `read` traffic can never spend a client's `sensitive` or `contactForm` allowance. `bucket` is optional on `RateLimitConfig` — a new preset must set it, or it falls back to the bare client id and shares that counter with any other bucket-less config.

Use `checkRateLimitOrRespond(request, preset, path, method)` → returns a `NextResponse` (429) to short-circuit, or `null` to proceed.

**The `clientId` in every counter key is the client IP alone** (`getClientIdentifierFromHeaders`, `src/lib/api-request.ts`). The User-Agent used to be hashed into that key, which was a rate-limit bypass: UA is client-controlled, so varying one byte minted a fresh counter and defeated every limit here. It is now passed as `context.userAgent` instead, where the limiter already scores it for bot/scraper patterns — an attacker-supplied string may raise suspicion, never widen an allowance. Header precedence is platform-set first (`x-vercel-forwarded-for` → `x-real-ip` → `cf-connecting-ip`), with client-settable `x-forwarded-for` last; Vercel overwrites XFF to prevent spoofing, so this only matters off that path.

Validation: `src/lib/schemas.ts`. Notable: `cuidSchema` (use this for IDs, not `z.string().uuid()`), `slugSchema` (lowercase + hyphens, max 100), `contactFormSchema`, `createBlogPostSchema` (`.strict()` — rejects unknown fields).

## Auth & CSP

No user authentication framework. Three API tokens, all compared via `timingSafeEqualString()` (`src/lib/timing-safe-equal.ts`), a length-guarded wrapper over `crypto.timingSafeEqual`:
- `ADMIN_API_TOKEN` — `Authorization: Bearer …` via `isAdminRequest()` (`src/lib/api-admin-auth.ts:20`). Hard-gates `POST /api/seed`, `POST /api/blog`, `PUT`+`DELETE /api/blog/[slug]`, `POST /api/blog/tags`, `POST /api/blog/categories`; also used as a soft read-gate on `GET /api/blog`, `GET /api/blog/[slug]` and `GET /api/blog/analytics` to expose unpublished posts and counts — those admin responses are `private, no-store`. Unset in production ⇒ every blog mutation 401s (warned at `src/lib/env-validation.ts:117`).
- `METRICS_API_TOKEN` — `X-Metrics-Token` header on `/api/security/metrics`.
- `CRON_SECRET` — `Authorization: Bearer …` on `/api/cron/publish-scheduled`. Vercel sets this header itself on cron invocations when the env var exists ([docs](https://vercel.com/docs/cron-jobs/manage-cron-jobs)); Vercel's sample compares with `!==`, this repo uses `timingSafeEqualString` like the other two.

CSRF (`src/lib/csrf-protection.ts`): 32-byte hex token in HttpOnly + `SameSite=Strict` cookie `__csrf_token`. Validated on POST/PUT/DELETE for `/api/blog*` and `/api/contact`. Token accepted **only** via the `x-csrf-token` header (`validateCSRFOrRespond`, `src/lib/api-csrf.ts:23`), whatever the content type. The `_csrf_token` form-field fallback lives in `csrfProtectionMiddleware` (`src/lib/csrf-protection.ts:126`) and is reached only by unit tests: its sole caller is the unrouted `csrf-route.ts`, which passes an empty `allowedMethods` and so only ever issues tokens. No routed code sets the cookie either, so API callers send the same value as both `Cookie: __csrf_token=…` and `x-csrf-token` (double-submit).

`src/proxy.ts` (under `src/`, not the repo root) is the **Next.js 16 successor to `middleware.ts`** — exports a function named `proxy` (not `middleware`). It generates a per-request base64 nonce and sets **only the nonce** on the downstream request as `x-nonce` (so `layout.tsx:48` can read it for inline JSON-LD); the CSP built by `buildEnhancedCSP()` (`src/lib/csp-edge.ts`) is set **only on the response** (`src/proxy.ts:27`) — request headers never reach the browser, so setting it there would be a no-op. Matcher excludes `_next/static`, `_next/image`, `favicon.ico`, image extensions, and `.pdf` (the latter so the resume PDF can embed in `<object>` on `/resume` — paired with a route-specific `X-Frame-Options: SAMEORIGIN` rule for `.pdf` in `next.config.js`; both rules must move together).

Static security headers in `next.config.js:55-180` (the `async headers()` block): HSTS (`max-age=31536000; includeSubDomains; preload`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `X-DNS-Prefetch-Control: on`, `X-XSS-Protection: 0` (intentional — comment at L68-72 explains), `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` denies camera/mic/geolocation/topics. CSP itself is **only** set in `proxy.ts`, never in `headers()`. The one other CSP is `images.contentSecurityPolicy` (`next.config.js:45`), which the image optimizer sends only on `/_next/image` responses — a path the proxy matcher excludes.

CORS on `/api/*`: only the prod origin (`https://richardwhudsonjr.com`) or `http://localhost:3000` in dev.

## Environment variables

The table's vars are declared in `src/lib/env-validation.ts` (Zod, no `@t3-oss/env-nextjs`); the ones in the paragraph after it are read directly. Validation runs at module load (`L152-159`) and throws on failure.

| Var | Required | Notes |
|---|---|---|
| `NODE_ENV` | default `development` | `development` / `production` / `test` |
| `DATABASE_URL` | optional at build, required at runtime | Must start with `postgresql://` or `postgres://` |
| `USE_LOCAL_DB` | optional | Legacy flag from the Prisma era — still in the schema, read nowhere; the Drizzle client always uses neon-http. Pointing `DATABASE_URL` at a plain local Postgres does **not** work: neon-http sends every query as an HTTPS request to Neon's SQL-over-HTTP endpoint derived from the host (`@neondatabase/serverless`'s default `fetchEndpoint`, never overridden here), which plain Postgres doesn't serve — use a Neon branch. |
| `RESEND_API_KEY` | optional | Required to actually send contact email |
| `FROM_EMAIL` | default `noreply@richardwhudsonjr.com` | Must be on the Resend-verified domain |
| `TO_EMAIL` | default `hudsor01@icloud.com` | Real delivery inbox for contact submissions |
| `NEXT_PUBLIC_SITE_URL` | default per env | If set, must be HTTPS unless `NODE_ENV=development` (so `test` rejects `http://` too); production re-checks the resolved value. Validated only — the URL the site actually emits is `SITE_ORIGIN` (see Where to find things) |
| `NEXT_PUBLIC_VERCEL_URL` | optional | Vercel-injected |
| `ADMIN_API_TOKEN` | optional | min 32 chars; production warning if unset or <64 |
| `METRICS_API_TOKEN` | optional | min 32 chars; production warning if <64 |
| `CRON_SECRET` | optional | min 32 chars; production warning if unset or <64. Without it `SCHEDULED` posts never publish |
| `ALLOW_SEED_IN_PRODUCTION` | optional | Enum `'true'`/`'false'` — enum (not string) so misspellings fail at boot |

Sentry vars (`SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`, `SENTRY_URL`, `SENTRY_ENVIRONMENT` (+ `NEXT_PUBLIC_` twin), `SENTRY_SEND_DEFAULT_PII` (+ `NEXT_PUBLIC_` twin; drives `dataCollection`, see the Sentry section), plus `*_TRACES_SAMPLE_RATE` / `*_REPLAYS_*_SAMPLE_RATE`) are read directly in `sentry.shared.ts` (server + edge; the two `sentry.*.config.ts` files spread `serverRuntimeSentryOptions()`, add only `consoleLoggingIntegration`, and read no env), `instrumentation-client.ts` and `src/app/global-error.tsx:14` (`NEXT_PUBLIC_SENTRY_DSN` gate), plus `next.config.js:232-261` (`sentryBuildOptions`) — they are **not** in the Zod schema. There is no `sentry.client.config.ts` (deliberately — see the Sentry section). `INDEXNOW_KEY` is read directly in `src/app/api/blog/route.ts:317`, and `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in `src/app/shared-metadata.ts:85` (Search Console `verification.google`; `''` when unset). Vercel's system `VERCEL_ENV` is also read directly: `shouldEmitUpgradeInsecureRequests()` (`src/lib/csp-edge.ts:51`) adds CSP `upgrade-insecure-requests` when it is `'production'` (or the request is HTTPS; never in dev), and it is the Sentry `environment` fallback (`sentry.shared.ts:102`; the browser reads `NEXT_PUBLIC_VERCEL_ENV` at `instrumentation-client.ts:39`). `LOG_LEVEL` is read in `src/lib/logger.ts:18`. Outside the app: `DIRECT_URL` is the `DATABASE_URL` fallback in `scripts/clean-truncated-slugs.ts:40-41`; e2e reads `E2E_PORT` (default `3100`, `playwright.config.ts:27`), and CI's e2e job promotes an optional `E2E_DATABASE_URL` secret to `DATABASE_URL`. The build needs no database: CI's `build` job sets no `DATABASE_URL`. (CI used to also set a `SKIP_DB_VALIDATION` that nothing read; it was removed as dead config.)

## Sentry & logging

Sentry init is split by runtime, and the three entrypoints are **not** symmetrical:

| Runtime | Init lives in | Loaded by |
|---|---|---|
| Node | `sentry.server.config.ts` | `instrumentation.ts` → `register()` |
| Edge | `sentry.edge.config.ts` (wired but dormant — nothing runs on edge: `src/proxy.ts` is Node-only in Next 16, no route sets `runtime = 'edge'`) | `instrumentation.ts` → `register()` |
| **Browser** | **`instrumentation-client.ts`** (init inline) | Next.js directly |

**Never move the browser init into a `sentry.client.config.ts`.** `@sentry/nextjs`
no longer auto-loads that filename under Turbopack (only its deprecated webpack
path still injects it), so config placed there is dead code and the
browser SDK silently never initialises — while server and edge keep working, which
makes it very easy to miss. This exact bug shipped here and went unnoticed. Verify
after any change to Sentry wiring:

```
bun run build && grep -rl "<your-dsn-id>" .next/static   # must match a chunk
```

Shared helpers (`parseSampleRate`, `resolveDataCollection`, the server/edge option
builder `serverRuntimeSentryOptions()`, and `resolveEnvironment`) live in `sentry.shared.ts`. Wrapped via `withSentryConfig(nextConfig, …)`
in `next.config.js`.
Disabled when `NODE_ENV='test'` or DSN absent — `sentry.shared.ts:101` (server/edge)
and `instrumentation-client.ts:36` (browser) gate on
`Boolean(dsn) && process.env.NODE_ENV !== 'test'`, so a missing
DSN disables that runtime rather than erroring — server/edge use
`SENTRY_DSN || NEXT_PUBLIC_SENTRY_DSN` (`sentry.shared.ts:97`), the browser only
`NEXT_PUBLIC_SENTRY_DSN` (`instrumentation-client.ts:10`). Sample
rates are clamped to `[0,1]` by `parseSampleRate` and their defaults do **not**
vary by environment: traces `1`, `replaysSessionSampleRate` `0`,
`replaysOnErrorSampleRate` `1` (`sentry.shared.ts:106`;
`instrumentation-client.ts:15,22,27`). No tunnel route.

**SDK v11 made data collection permissive by default — keep `dataCollection` set.**
v11 removed `sendDefaultPii` and replaced it with `dataCollection`, whose *unset*
default collects cookies, request/response bodies, user info and DB query data.
`resolveDataCollection()` (`sentry.shared.ts`) therefore returns Sentry's
documented v10-equivalent restrictive baseline unless `*_SEND_DEFAULT_PII='true'`,
which yields `undefined` (the v11 default ≈ v10 `sendDefaultPii: true`). Deleting
the option would silently widen what leaves the site.

**`serverRuntimeSentryOptions()` ends in `satisfies NodeOptions & EdgeOptions`.**
Its object is spread into `Sentry.init({...})`, and TypeScript does not
excess-property-check spreads — so before that guard, options v11 removed
(`profilesSampleRate`, `enableLogs`, `sendDefaultPii`) type-checked fine on
server/edge and silently did nothing; only the inline browser config errored. The
import is `import type`, erased at build, so the module still pulls in no SDK.

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

`disableLogger` and `automaticVercelMonitors` are deliberately **absent** from
`withSentryConfig`: v11 removed them as top-level options, and their `webpack.*`
replacements are no-ops on Turbopack, which this app builds with. Re-add only
under `webpack.*`, and only if the build ever moves off Turbopack — except
`automaticVercelMonitors`, whose `webpack.*` form is the Pages-Router-only wrapper
and would still miss the App Router cron route; cron monitoring here would be
`_experimental.vercelCronsMonitoring` (span-based, works on Turbopack).
`reactComponentAnnotation` is different: v11 reinstated it top-level and it *does*
work on Turbopack + Next 16 — it is unset by choice, not because it is broken.

Coverage currently enabled: errors (all runtimes), tracing at 100% (v11 streams
spans by default — `beforeSendTransaction`/`ignoreTransactions` are no-ops now;
use `beforeSendSpan`/`ignoreSpans`), structured logs with `console.log/warn/error` forwarded (v11
has no `enableLogs`; adding `consoleLoggingIntegration` in each runtime is what
turns logs on), and Session Replay
on **errors only**. Replay session sampling defaults to 0 on purpose — replay
quota is consumed per replay and, once exhausted, Sentry drops *new* replays
including the ones attached to errors, so sampling idle sessions trades away
error coverage. Every rate is env-overridable (`NEXT_PUBLIC_SENTRY_*` for the
browser, `SENTRY_*` for server/edge). Profiling is off by omission: v11 removed
`profilesSampleRate`, and session profiling (`profileSessionSampleRate`) needs the
extra `@sentry/profiling-node` package. Browser sessions now default to the
`'page'` lifecycle (one session per page load, not per navigation), so session
counts in Release Health dropped at the v11 upgrade by design.

Verify the browser side actually delivers (not just that it initialises) by
loading a page and watching for `POST .../envelope/` returning 200 with no CSP
violation in the console.

Logger (`src/lib/logger.ts`): exports `logger` singleton + `createContextLogger(name)` factory. Levels: `debug`/`info`/`warn`/`error`/`fatal` (controlled by `LOG_LEVEL`). Two transports: `ConsoleTransport` (colored, suppressed in prod) and `SentryTransport` (error/fatal → `captureException` when an `Error` is passed, else `captureMessage`; warn → `captureMessage`, info/debug → `addBreadcrumb`). Sentry is the production sink — there is no file transport, and during `next build` (`NEXT_PHASE === 'phase-production-build'`) the logger has no transport at all, so its output is dropped. Lazy-requires `@sentry/nextjs`.

## Vercel runtime

**Don't add `bunVersion` back to `vercel.json`.** It sets the runtime for Vercel
Functions and Routing Middleware, but `engines.node` in `package.json` takes
precedence — so with both present Vercel logs *"`package.json` takes precedence,
using \"node\""* and ignores `bunVersion` entirely. It was dead config, and removing
it changed no behaviour; Node was already the runtime.

Node is the deliberate choice here, not an accident:
- The Bun runtime has **no automatic source maps** — which would defeat the Sentry
  source-map upload wired through `withSentryConfig` in `next.config.js`.
- No route uses ISR today (every prerendered route is `revalidate: false`), but if
  one ever does, Vercel requires `bun run --bun next build` for Next.js + ISR on
  the Bun runtime — directly at odds with the deliberate Node-side `build` (see the
  `bun --bun` note under Gotchas).
- Bun also lacks bytecode caching and request metrics on `node:http`/`node:https`.

Bun remains the package manager and script runner on Vercel regardless: `bun.lock`
drives `bun install` and `buildCommand` is `bun run build`. Only the *function
runtime* is Node. Vercel installs with the Bun in its build image, not
`packageManager`'s: the 2026-10-31 production build logged `bun install v1.3.14`
while CI ran 1.4.4 — see the `bun.lock` gotcha. Ref: https://vercel.com/docs/functions/runtimes/bun

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
rather than re-enabling peer auto-install. `vite` is the same story: Vitest 5
dropped it from its dependencies and made it a *required peer*, so with
`peer = false` a clean install has no `vite` and the test job cannot load
`vitest.config.mts`. It is declared as a devDependency for that reason only. A
stale `node_modules` hides this class of bug — Bun does not prune packages that
`peer = false` stops installing — so verify dependency changes with
`rm -rf node_modules && bun install --frozen-lockfile`.

**Keep `overrides` minimal.** There are 4. Each was added to lift a *nested* copy
that a parent pinned below a fix line; as of `next` 16.4.6 only `esbuild` and `glob`
still do — `postcss` now only dedupes (every copy forced to exactly `8.5.32`) and
`sharp` is only a floor:

| Override | Why it exists |
|---|---|
| `postcss` | `next` internally pins its own `postcss` (`8.5.23` as of 16.4.6); collapses every copy onto one patched version |
| `sharp` | Backstop against a *nested* pre-0.35.5 copy (libvips/libheif RCE GHSA-rgj7-g3m4-5g8c fixed in 0.35.4; librsvg GHSA-wq5f-xc86-pv6w fixed in 0.35.5). As of `next` 16.4.6 the parent itself pins `sharp ^0.35.5`, so this no longer changes resolution. Kept only as a floor; re-check it whenever `next` is bumped. There is deliberately **no direct `sharp` dependency**: `next` installs it as an `optionalDependency` (not a peer, so `peer = false` does not drop it), which is what `next/image` optimization uses in the standalone server — verified by `/_next/image` returning AVIF. The old direct pin only existed to lift `next`'s former `^0.34.5`. |
| `esbuild` | `^0.28.2`. Collapses the tree onto one esbuild; the parents still below it are `drizzle-kit` (`^0.25.4`), which works on 0.28 (`drizzle-kit check` and `drizzle-kit export` verified), and `@esbuild-kit/core-utils` (`~0.18.20`, pulled in by drizzle-kit's `@esbuild-kit/esm-loader`, which drizzle-kit's `bin.cjs` never loads) — that `~0.18.20` sits inside GHSA-67mh-4wv8-2f99 (`<=0.24.2`), so it is the copy this override actually lifts. `react-email`, `tsx` and `vite` already ask for `^0.27`/`^0.28` — the old `^0.25.0` pin was forcing them *below* their own declared ranges |
| `glob` | `^14.0.2`. `react-email` and `@sentry/bundler-plugins` pin `glob ^13.0.6` even at their latest, and 13.x has no backport for GHSA-3g3m-2fjr-6pw4 or its `minimatch` 10 dependency's GHSA-g3hv-75wg-m249 (glob 14 moves to `minimatch` 11). Neither consumer uses an API glob 14 broke: `react-email` calls `glob()`/`globSync()` only in its CLI, which no script runs; Sentry's Next.js upload passes directories to sentry-cli (`prepareArtifacts: false`), and its `globFiles` results on this `.next` were identical under 13 and 14. Remove once both parents accept `^14` |

Before adding a fourth, check whether the package resolves to a patched version on
its own — an override that pins a caret range *stops* that package tracking upstream
patches and goes stale silently. That is not hypothetical: the old block pinned
`fast-uri ^4.0.0`, which forced the tree onto the 4.x line where the vulnerable range
(`>=4.0.0 <4.1.2`) lives, when it would otherwise have resolved to a clean 3.1.5.
Several other pins had drifted *behind* natural resolution. Dependabot never
edits `overrides` (see below), so every entry is hand-maintained.

**Dependabot version updates, not security updates.** `.github/dependabot.yml`
opens a weekly `bun` PR: minor and patch bumps grouped into one, majors
separately, nothing published less than 3 days ago (`cooldown`). A second entry
groups every GitHub Action into one monthly PR, SHA pins included. The `bun`
entry bumps direct dependencies only and never edits `overrides`, so `postcss` (pinned in both) is
ignored, and transitive fixes still come from the daily audit plus a hand-written
override. Its updater bundles Bun 1.4.2, which keeps `bun.lock` at
`lockfileVersion: 1` but drops the `libc`/`hasInstallScript` keys 1.4.4 writes —
churn, not breakage (see the `bun.lock` gotcha). Dependabot *security* updates
stay off: GitHub doesn't support them for Bun, and here they only ever bumped
`package.json` (#53, #60, both red in CI) or, since dependabot-core #16220, error
on the alert. Bot PRs run CI without Actions secrets, so the DB-dependent e2e
specs skip. `vercel.json`'s `git.deploymentEnabled` skips Vercel previews on
`dependabot/**` branches: previews carry the production `DATABASE_URL`, and the
build would run an unreviewed dependency's code with it (`dependabot/*` doesn't
match Dependabot's multi-slash branch names). Renovate was never installed and its
config is gone; don't bring back its `lockFileMaintenance`, which regenerates
`bun.lock` at `lockfileVersion: 2`.

CI gate is `bun audit --audit-level=high`, defined once in
`.github/workflows/audit.yml`: `ci.yml`'s `audit` job calls it on every PR, and it
re-runs daily on `main` (`cron: '37 11 * * *'`, UTC; runs can start hours late) so
an advisory published between PRs still fails a check. It needs no install —
`bun audit` takes its package list only from `bun.lock` and ignores `node_modules`
(it still needs `package.json`, and applies `bunfig.toml`, including `peer = false`)
— and it exits 1 when the registry can't be reached, so a failed check never
passes as clean. Dependabot is not a substitute:
its alerts see only package.json's direct deps (the dependency graph does not parse
`bun.lock`), and between 2026-09-30 and 2026-10-31 it never alerted on 10 reviewed
next/dompurify advisories in range, four of them critical. A failed scheduled run
notifies only if GitHub Actions notifications are on for the user who last edited
the cron. Keep the tree clean at *every* severity: `bun audit` (no level) reports
nothing as of 2026-11-02.

## Gotchas

- **No Prisma.** The repo migrated off Prisma 7 → Drizzle ORM in May 2026 after [prisma/prisma#28588](https://github.com/prisma/prisma/issues/28588) caused `/blog/[slug]` Server Component queries to suspend indefinitely on Vercel + adapter-neon. Don't reintroduce `@prisma/*` packages or import from `@/generated/prisma/*`.
- **Never call `notFound()` inside a `not-found.tsx`.** It's recursive and Vercel serves HTTP 200 with a 404-marker body, which Google flags as "Soft 404." A `not-found.tsx` should be a plain Server Component that just renders the 404 UI — the HTTP 404 status comes from the `notFound()` call in the page or layout, not from the template itself. Segment-level templates exist at `src/app/blog/[slug]/`, `src/app/blog/category/[slug]/`, and `src/app/projects/[slug]/` for themed 404s; the root template at `src/app/not-found.tsx` is the global fallback.
- **Drizzle relational queries** use `db.query.<table>.findFirst({ where, with: { ... } })` for relations and `db.select().from(table)` for plain SQL-style queries. `db.execute(sql\`...\`)` is the raw-SQL escape hatch (used in `src/lib/search.ts` for full-text search).
- **`db.execute()` returns a result OBJECT, not an array.** neon-http calls with `fullResults: true`, so you get `{ rows, fields, command, rowCount, … }`. Reading `.length` off it yields `undefined`, and `undefined > 0` / `undefined < 5` are both `false` — so a `result as unknown as T[]` cast produces silent wrong behaviour rather than a crash, and `tsc` cannot see through the double cast. Go through `rowsOf()` in `src/lib/search.ts`, and mock the object shape in tests: array-shaped mocks let this bug pass CI for the module's entire life.
- **Binding an array into `sql` does not produce a Postgres array.** `sql\`ANY(${arr}::"PostStatus"[])\`` emits `ANY(($1)::"PostStatus"[])` for one value: drizzle expands a JS array into a parenthesised list, one param per element (`($1, $2)` for two), so Postgres receives a scalar (rejected as a malformed array literal, `22P02`) or a row, never an array. Expand it instead: ``sql`ANY(ARRAY[${sql.join(arr.map((v) => sql`${v}`), sql`, `)}]::"PostStatus"[])` ``. `statusCondition` in `src/lib/search.ts` uses that form; its `exclusion` clause applies the same `sql.join` expansion inside `NOT IN (…)`.
- **All IDs are CUIDs** — except `projects` rows from `drizzle/seed.ts`, which use the slug-style ids from `src/data/projects.ts`. New rows use cuid2 via `src/db/cuid.ts`; legacy rows from the Prisma era use cuid v1. Both are 24–25-char alphanumeric strings — use `cuidSchema` from `src/lib/schemas.ts` for ID validation, never `z.string().uuid()`.
- **citext + inet (and the `tsvector` behind `blogPosts.searchVector`) are custom Drizzle types.** Defined in `src/db/schema.ts` via `customType<{ data: string; driverData: string }>`. Don't replace with plain `text()` — case-insensitive slug and author-email matching depends on it.
- **Prisma-created `updatedAt` columns have no DB default.** Prisma's `@updatedAt` never made one, so on every existing database `updatedAt` is `NOT NULL` with no `DEFAULT` — `.defaultNow()` in `schema.ts` only describes a freshly generated schema, and an INSERT that leaves the column to SQL `DEFAULT` fails with 23502 (that broke the seed and every admin POST until #244). Build every `updatedAt` with `updatedAtColumn()` (`src/db/schema.ts`), whose `$defaultFn` makes Drizzle bind the timestamp on insert; `src/db/__tests__/schema.test.ts` fails for any table that doesn't. Updates must still set `updatedAt` explicitly — there is deliberately no `$onUpdate`, which would also bump it on every `viewCount` increment. `createdAt` is fine: Prisma's `@default(now())` did create a DB default.
- **CSP comes from `src/proxy.ts`, not `headers()`.** Adding it to `next.config.js` would emit a second, conflicting `Content-Security-Policy` header. Note the CSP itself carries **no** nonce — `script-src` is `'self' 'unsafe-inline' …` (`src/lib/csp-edge.ts:58`) because a nonce is incompatible with this site's static prerendering (explained in `SECURITY.md:140-147`; `next.config.js:86-88` only points there). The per-request `x-nonce` header still exists and `layout.tsx:48` threads it into the JSON-LD components, but it is not enforced by the policy today.
- **PDF assets are an intentional carve-out.** `.pdf` paths are excluded from the `proxy.ts` matcher (no CSP) and override `X-Frame-Options` to `SAMEORIGIN` via a route-specific `next.config.js` rule, so the resume PDF can embed in `<object>` on `/resume` and `/resume/view`. Chrome PDFium has been progressively restricting `<iframe src=pdf>` since Chrome 116; use `<object data=pdf type="application/pdf">` for embedded PDFs. If a future PDF needs to stay non-framable (e.g. signed contract), narrow the `next.config.js` source from `/:path*\\.pdf` to the literal résumé filename and add an explicit deny rule for the new path. Regression-pinned in `e2e/security-headers.spec.ts`.
- **One canonical email path: `src/lib/email-service.ts`.** Both the `submitContactForm` server action (`src/app/contact/actions.ts`) and the `POST /api/contact` route handler delegate to `emailService.sendContactEmail()`. Templates live in `src/emails/*.tsx` and use `react-email` components (passed via Resend's `react` prop). Don't reintroduce inline HTML strings or per-handler Resend clients.
- **`api/contact/csrf-route.ts` is not auto-routed.** Next.js only treats `route.ts`/`route.tsx` as an endpoint; this filename was deliberate. Confirm wiring before relying on it.
- **`bun --bun` flag matters.** `dev`, `start` and `build:ci` use it; `build` does not. The Bun runtime exposes different edge cases than Node (Turbopack bundles under both) — when reproducing a CI failure locally, match the script: CI runs `bun run build` (its `build` job, and `e2e:server` via Playwright), never `build:ci`.
- **`bun.lock` is checked by content, not by which Bun wrote it — but write it with Bun 1.4.4 and keep it at `lockfileVersion: 1`.** The file records no writer version. `--frozen-lockfile` re-applies `package.json` to the loaded lock and fails only if the resolved package tree changes, `overrides`/catalog/`packageExtensions` changed, or the lock won't parse — it never compares bytes (Bun docs: "Edits that keep every package at its locked version don't fail the install"; `src/install/lockfile.rs` `Lockfile::eql` at tag `bun-v1.4.4`). That is why CI's Bun 1.3.14 passed PR #239's lock, which carried keys only 1.4.4 writes. The writer still matters: (1) 1.4.4 records `"libc"` and `"hasInstallScript"` on entries it resolves and never backfills unchanged ones, while older Bun drops both on its next save — PR #240's lock lost all 34 of #239's `libc` keys. (2) A nested or version-scoped override, or regenerating the lock from scratch, makes 1.4.4 write `lockfileVersion` 2 or 3, which 1.3.14 can't read: its `--frozen-lockfile` fails, and a plain `bun install` prints `Ignoring lockfile` and resolves everything fresh — which is what Vercel's install does, on 1.3.14 as of 2026-10-31. Until local and Vercel run Bun ≥1.4.0, never delete-and-regenerate `bun.lock`, and keep overrides flat (`"glob": "^14.0.2"`, not `"parent>glob"`). (3) Newer Bun checks more: 1.4.4's `--frozen-lockfile` also fails on a direct dependency locked outside its `package.json` range.
- **e2e runs against a production build, never `next dev`.** `playwright.config.ts`'s `webServer` runs `bun run e2e:server` (build → copy standalone assets → `node .next/standalone/server.js`) on port **3100**. This is not a preference: `src/lib/csp-edge.ts` adds `'unsafe-eval'` to `script-src` in development for HMR, and `e2e/security-headers.spec.ts` asserts it is absent — so under the old `bun run dev` webServer that spec failed 100% of the time. It went unnoticed because there was no e2e job in CI until PR #238. `next start` is not the supported server here (under `output: 'standalone'` Next only *warns* that it "does not work" and points to `node .next/standalone/server.js` — it still starts, but serves `.next/`, not the standalone bundle under test), and the standalone output ships no `public/` or `.next/static` at all, hence the copy steps. Port 3100 rather than 3000 keeps `reuseExistingServer` from silently adopting a stray `bun dev`. Point the suite elsewhere with `PLAYWRIGHT_BASE_URL`, which disables `webServer` entirely.
- **`next build` copies `.env` into `.next/standalone/`.** Verified on this repo. Harmless as deployed — Vercel uses the Build Output API and ignores the standalone bundle — but it means `.next/standalone/` is not safe to treat as a redistributable artifact, and it silently defeats any attempt to test the app "without a database" by copying that directory elsewhere. It also means `env -u DATABASE_URL bun run build && next start` proves nothing about DB-less behaviour: `.env`, `.env.local` and `.env.development.local` all carry a `DATABASE_URL`, and Next itself loads `.env.local` + `.env` in production mode (it reads `.env.development.local` only under `next dev`). To genuinely test without a database, delete the `.env*` files from the copied standalone directory — `/api/health` should then report `"database":"down"`.
- **Pre-push runs Vitest and `bun run typecheck`.** Bypass with `git push --no-verify` only when the failure is provably unrelated to the change.

## Where to find things

- Public site URL: hardcoded `SITE_ORIGIN` = `https://richardwhudsonjr.com` (`src/lib/absolute-url.ts:15`) — canonical, OG, JSON-LD, sitemap and robots all use it. `NEXT_PUBLIC_SITE_URL` (default `https://richardwhudsonjr.com` in production, `http://localhost:3000` otherwise, `src/lib/env-validation.ts:65-69`) is only validated; its one reader, `absoluteUrlTestable()` (`src/lib/utils.ts:12`), has no non-test caller.
- Vercel region: `iad1` (single region, `vercel.json:5`).
- Image whitelist: `images.unsplash.com` only (`next.config.js:46-52`, inside the `images` block at `:39-53`).
- Cache policy for `/projects/*`, `/blog/*` **and `/tools/*`**: `s-maxage=60, stale-while-revalidate=86400`, CDN 1 hour (`next.config.js:130-136`; source is `/(projects|blog|tools)/:path*`). Search renders (`/blog?q=…`) override it to `s-maxage=60, stale-while-revalidate=300`, CDN 60 s (`next.config.js:151-158`; declared later, so it wins).
- Permanent redirects (`next.config.js:182-229`): `/home` → `/`, plus five blog 308s — four de-cannibalization (two forecast-accuracy slugs, two dead-deal slugs), whose sources are also excluded from the sitemap via `RETIRED_BLOG_SLUGS` (`src/app/sitemap.ts:57-62`), and one renamed RevOps pillar, which is not in that set (the sitemap lists only published DB posts, and no post has the old slug — it 404'd until this 308 was added, per `next.config.js:218-222`). Edge-level: `/github`, `/linkedin`, `/twitter` (`vercel.json:14-27`; `permanent` defaults to true → 308).
- 93 Vitest files under `src/**/__tests__/` — `src/lib/` (44), `src/app/api/` (15), `src/components/` (23), `src/hooks/` (4), `src/app/projects/` (2), plus `src/app/blog/`, `src/app/contact/`, `src/data/`, `src/db/`, `src/emails/`. Discovery pattern: `src/**/__tests__/**/*.test.ts{,x}` (`vitest.config.mts:35`). Regenerate: `find src -name '*.test.ts*' | wc -l`.
- 12 Playwright specs under `e2e/` (11 top-level + `e2e/_meta/keyboard-infra.spec.ts`).
- Security audit history: `SECURITY.md` (current controls). `SECURITY_AUDIT_REPORT.md` no longer exists — its findings (S-001, B-001, H-001, B-002, P-001) were closed, but that report was never committed (`*.md` is gitignored, `.gitignore:79`; the 2025 `SECURITY_AUDIT_REPORT.md` in history, `0a7fdf37`, is an unrelated earlier audit with none of these IDs), so the findings and their fixes are recorded in commit `c7025546`'s message (2026-04-18).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is **hand-maintained**. Next ≤16.3 `next dev` rewrote it here; since 16.4 it manages the block only in `AGENTS.md` (`node_modules/next/dist/server/lib/generate-agent-files.js`), and `agentRules: false` in `next.config.js` turns that off so no second, gitignored copy appears.

<!-- END:nextjs-agent-rules -->
