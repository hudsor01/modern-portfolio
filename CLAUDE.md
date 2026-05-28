# CLAUDE.md

Public portfolio + blog system for Richard Hudson. Next.js App Router, Drizzle ORM on Postgres (Neon in prod), Resend for contact email, Sentry for errors, Vercel for hosting. No user auth — token-gated admin endpoints + CSRF on mutations.

## Stack

Runtime: Bun 1.3.13, Node `>=22 <25` (`package.json:6-9`). Next.js 16.2.4, React 19.2.5, TypeScript 6.0.3 (`strict`, `noUncheckedIndexedAccess`), Tailwind 4.2.4, Zod 4.4.3, Drizzle ORM 0.45 + `@neondatabase/serverless` (HTTP driver), `@sentry/nextjs` 10.51, Resend 6.12, Vitest 4.1, Playwright 1.59, Biome 2.4.14 (linter + formatter), Lefthook 2.

## Commands

| Script | What |
|---|---|
| `bun dev` | Dev server (`bun --bun next dev`) |
| `bun run build` | Prod build (Node-side `next build`) |
| `bun run build:ci` | Same, but Bun-side (`bun --bun next build`) |
| `bun start` | Prod server |
| `bun run lint` / `lint:fix` | Biome check over `src/**` (lint + format) |
| `bun run format` / `format:fix` | Biome format-only over `src/**` |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run ci:quick` | lint + typecheck |
| `bunx vitest run` (or `bun run test`) | Unit tests, jsdom |
| `bun run test:coverage` | v8 coverage on `src/lib/**` |
| `bun run e2e` (`e2e:ui`, `e2e:headed`, `e2e:chromium`, `e2e:report`) | Playwright |
| `bun run db:generate` | `drizzle-kit generate` — emits a SQL migration into `drizzle/migrations/` from the current `src/db/schema.ts` |
| `bun run db:migrate` | `drizzle-kit migrate` — applies pending migrations to `DATABASE_URL` |
| `bun run db:push` | `drizzle-kit push` — sync schema directly without writing a migration file (dev only) |
| `bun run db:studio` | Drizzle Studio |
| `bun run db:seed` | `bun run drizzle/seed.ts` — idempotent upsert seed |

Hooks (`lefthook.yml`): pre-commit runs `bunx biome check --staged --write` over staged `src/**`; pre-push runs `bunx vitest run --passWithNoTests`. `--no-verify` bypasses.

## Layout

```
src/
  app/                    Next.js App Router. Top-level routes: about, blog, contact, projects, resume.
                          Plus root layout/page/error/global-error/not-found/sitemap/robots/viewport.
  app/api/                14 route.ts handlers + 1 route.tsx (og). See API table.
  app/contact/actions.ts  The ONLY 'use server' file in the repo.
  components/             10 subdirs: ui (42 primitives), layout, navigation, charts, projects, contact,
                          about, error, providers, seo/json-ld.
  hooks/                  13 hooks (use-mounted, use-csrf-token, use-page-analytics, ...).
  lib/                    Shared utilities. Notable: db.ts, env-validation.ts, logger.ts, schemas.ts,
                          api-rate-limit.ts, api-csrf.ts, csp-edge.ts, email-service.ts,
                          rate-limiter/{store,configs,helpers}.ts, data-service/.
  types/                  ~16 .ts files (api, blog, project, forms, monitoring, ...).
  styles/                 fonts.ts + 4 .css files (animations, blog-styles, interaction-patterns,
                          responsive-utilities). Note: globals.css lives in src/app/, not here.
  db/                     Drizzle schema, client, and CUID2 ID factory.
                            schema.ts — 10 tables, 6 enums (string-union types), citext + inet
                            customType, jsonb columns typed via .$type<T>().
                            index.ts — lazy Proxy over neon-http drizzle client.
                            cuid.ts — replacement for Prisma's @default(cuid()) (uses cuid2).
  data/                   Static catalog data.

drizzle/                  seed.ts (idempotent upsert seed) + migrations/ (drizzle-kit output).
e2e/                      5 Playwright specs: blog, contact-form, projects, resume, security-headers.
scripts/                  Drizzle one-offs (idempotent, safe to re-run):
                          _db.ts — shared neon+drizzle bootstrap.
                          touch-blog-lastmod.ts — bumps updatedAt on every
                          PUBLISHED post to refresh sitemap <lastmod>.
                          update-blog-featured-images.ts — syncs prod's
                          featuredImage/Alt to src/data/blog-featured-images.ts.
                          apply-featured-image-unique-index.ts — DDL one-off
                          for the partial unique index on PUBLISHED posts.
proxy.ts                  Next.js 16 successor to middleware.ts (see Auth/CSP).
```

App Router conventions in use: dynamic segments (`[slug]`), private folders (`_components/`), per-route `metadata.ts` (e.g. `src/app/contact/metadata.ts`). **No** route groups (`(group)`), catch-alls, parallel routes, intercepting routes, or admin route.

Path aliases (`tsconfig.json`): `@/*` → `src/*`. Specific aliases for `@/components`, `@/lib`, `@/hooks`, `@/types`, `@/app`, `@/styles`, `@/content`, `@/data`, `@/db` (→ `src/db/index`), `@/db/*`. `@/content/*` is declared but no `src/content/` exists yet.

## Database

Postgres via Drizzle ORM with the Neon serverless HTTP driver (`@neondatabase/serverless` + `drizzle-orm/neon-http`). Stateless per-query, no connection pool to exhaust on serverless. Schema lives in `src/db/schema.ts`.

**10 tables** (`src/db/schema.ts`): `blogPosts`, `authors`, `categories` (self-referential parent/child), `tags`, `postTags` (composite PK `[postId, tagId]`), `postViews`, `postInteractions`, `projects`, `contactSubmissions`, `securityEvents`. All IDs are CUIDs (cuid2 for new rows; legacy cuid v1 IDs created by Prisma still coexist). Use `cuidSchema` from `src/lib/schemas.ts` for ID validation — not `z.string().uuid()`.

**6 enums** (`pgEnum`): `PostStatus`, `ContentType`, `InteractionType`, `SubmissionStatus`, `SecurityEventType`, `SecuritySeverity`. Drizzle exposes them as string-union types; compare against literals (e.g. `'PUBLISHED'`), no enum object.

Slug + email columns are `citext` (custom Drizzle type → `citext` extension, already enabled in DB). `blogPosts.deletedAt` is a soft-delete column — filter in app code; not enforced. `projects` has 8 typed `jsonb` columns via `.$type<T>()` (impact, results, displayMetrics, metrics, testimonial, gallery, details, charts). `postViews`, `contactSubmissions`, `securityEvents` use a custom `inet` type for IP addresses.

**Migrations**: live in `drizzle/migrations/` going forward (generated via `bunx drizzle-kit generate`). The pre-existing Postgres schema was created by Prisma migrations (now removed from the repo) and remains in place — Drizzle is pointed at the same DB. Use `drizzle-kit push` for dev iteration before generating a migration file.

**Client init** (`src/db/index.ts`): exports `db` as a `Proxy` over a lazy `drizzle()` singleton on `globalThis.__drizzle`. `'server-only'` enforces server-side use. `src/lib/db.ts` re-exports from `@/db` so existing `import { db } from '@/lib/db'` callers keep working.

Seed (`drizzle/seed.ts`): upsert-based, idempotent. Seeds 1 author, categories, tags, projects from `src/data/projects`, 8 blog posts (6 published, 1 draft, 1 scheduled), then random views/interactions for published posts. Wipes data first when `NODE_ENV !== 'production'`.

## API routes

14 `route.ts` + 1 `route.tsx` (`og/route.tsx` uses `next/og` `ImageResponse`).

| Path | Methods | Rate limit | CSRF | Auth | Notes |
|---|---|---|---|---|---|
| `/api/health` | GET | — | — | — | DB ping; trimmed payload (no version/uptime/memory) |
| `/api/health-check` | GET, HEAD | — | — | — | Plain `OK` text for header probes |
| `/api/blog` | GET, POST | `read` / `sensitive` | POST | — | POST validates with `createBlogPostSchema` (strict); fires IndexNow only when `status === 'PUBLISHED'` and `INDEXNOW_KEY` is set |
| `/api/blog/[slug]` | GET, PUT, DELETE | — | PUT, DELETE | — | GET increments `viewCount` async |
| `/api/blog/rss` | GET | — | — | — | XML or JSON via `?format=` |
| `/api/blog/tags` | GET, POST | — | POST | — | |
| `/api/blog/categories` | GET, POST | — | POST | — | |
| `/api/blog/analytics` | GET | — | — | — | Validates `timeRange` enum (`7d`/`30d`/`90d`/`1y`) |
| `/api/contact` | POST | `contactForm` | yes | — | Resend email; IP-based limit (3/hr, burst 2/10s) |
| `/api/contact/csrf-route.ts` | GET | — | — | — | Issues CSRF cookie + token (note non-standard filename, not `route.ts`) |
| `/api/projects` | GET | `read` | — | — | |
| `/api/projects/[slug]` | GET | `read` | — | — | `slugSchema` validates param |
| `/api/og` | GET | — | — | — | Dynamic OG image (`route.tsx`) |
| `/api/seed` | POST | — | — | `ADMIN_API_TOKEN` | Returns 404 in production unless `ALLOW_SEED_IN_PRODUCTION='true'`; refuses if posts already exist |
| `/api/security/metrics` | GET | — | — | `METRICS_API_TOKEN` (header `X-Metrics-Token`) | Exports rate-limiter metrics |

Rate limiter (`src/lib/rate-limiter/store.ts`): in-memory `Map` singleton, LRU eviction every 5 min, exponential progressive penalty with 2× multiplier. Two preset surfaces:
- `RateLimitPresets` (`src/lib/api-rate-limit.ts:32`): `read` (100/min, burst 120/5s), `write` (30/hr, 15-min block), `sensitive` (10/hr, 30-min block).
- `RateLimitConfigs` (`src/lib/rate-limiter/configs.ts:6`): `contactForm`, `api`, `auth`, `upload`.

Use `checkRateLimitOrRespond(request, preset, path, method)` → returns a `NextResponse` (429) to short-circuit, or `null` to proceed.

Validation: `src/lib/schemas.ts`. Notable: `cuidSchema` (use this for IDs, not `z.string().uuid()`), `slugSchema` (lowercase + hyphens, max 100), `contactFormSchema`, `createBlogPostSchema` (`.strict()` — rejects unknown fields).

## Auth & CSP

No user authentication framework. Two surfaces protected by API tokens, both compared with `crypto.timingSafeEqual`:
- `ADMIN_API_TOKEN` — `Authorization: Bearer …` on `/api/seed`.
- `METRICS_API_TOKEN` — `X-Metrics-Token` header on `/api/security/metrics`.

CSRF (`src/lib/csrf-protection.ts`): 32-byte hex token in HttpOnly + `SameSite=Strict` cookie `__csrf_token`. Validated on POST/PUT/DELETE for `/api/blog*` and `/api/contact`. Token sent via `x-csrf-token` header (JSON) or `_csrf_token` form field.

`proxy.ts` is the **Next.js 16 successor to `middleware.ts`** — exports a function named `proxy` (not `middleware`). It generates a per-request base64 nonce, builds CSP via `buildEnhancedCSP()` from `src/lib/csp-edge.ts`, and sets it on both the downstream request (so `layout.tsx` can read `x-nonce` for inline JSON-LD) and the response. Matcher excludes `_next/static`, `_next/image`, `favicon.ico`, image extensions, and `.pdf` (the latter so the resume PDF can embed in `<object>` on `/resume` — paired with a route-specific `X-Frame-Options: SAMEORIGIN` rule for `.pdf` in `next.config.js`; both rules must move together).

Static security headers in `next.config.js:48-162`: HSTS (`max-age=31536000; includeSubDomains; preload`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection: 0` (intentional — comment at L62-68 explains), `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` denies camera/mic/geolocation/topics. CSP itself is **only** set in `proxy.ts`, never in `headers()`.

CORS on `/api/*`: only the prod origin (`https://richardwhudsonjr.com`) or `http://localhost:3000` in dev.

## Environment variables

All declared in `src/lib/env-validation.ts` (Zod, no `@t3-oss/env-nextjs`). Validation runs at module load (`L149-156`) and throws on failure.

| Var | Required | Notes |
|---|---|---|
| `NODE_ENV` | default `development` | `development` / `production` / `test` |
| `DATABASE_URL` | optional at build, required at runtime | Must start with `postgresql://` or `postgres://` |
| `USE_LOCAL_DB` | optional | Legacy flag from the Prisma era; the Drizzle client always uses neon-http. Local Postgres dev is supported by pointing `DATABASE_URL` at the local instance. |
| `RESEND_API_KEY` | optional | Required to actually send contact email |
| `CONTACT_EMAIL` | optional | Recipient for contact form |
| `FROM_EMAIL` | default `contact@richardwhudsonjr.com` | |
| `TO_EMAIL` | default `hello@richardwhudsonjr.com` | |
| `NEXT_PUBLIC_SITE_URL` | default per env | Must be HTTPS in production |
| `ALLOWED_ORIGINS` | optional | CSV, transformed to `string[]` |
| `NEXT_PUBLIC_VERCEL_URL`, `VERCEL_URL` | optional | Vercel-injected |
| `ADMIN_API_TOKEN` | optional | min 32 chars; production warning if <64 |
| `METRICS_API_TOKEN` | optional | min 32 chars; production warning if <64 |
| `ALLOW_SEED_IN_PRODUCTION` | optional | Enum `'true'`/`'false'` — enum (not string) so misspellings fail at boot |

Sentry vars (`SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`, `SENTRY_URL`, plus `*_TRACES_SAMPLE_RATE` / `*_PROFILES_SAMPLE_RATE` / `*_REPLAYS_*_SAMPLE_RATE`) are read directly in `sentry.{server,client,edge}.config.ts` and `next.config.js:179-185` — they are **not** in the Zod schema. `INDEXNOW_KEY` is read directly in `src/app/api/blog/route.ts:243`. `SKIP_DB_VALIDATION` (`src/lib/db.ts`) bypasses startup DB env check in test/CI.

## Sentry & logging

Three Sentry configs at repo root: `sentry.server.config.ts`, `sentry.client.config.ts`, `sentry.edge.config.ts`. Wrapped via `withSentryConfig(nextConfig, …)` in `next.config.js:187`. Disabled when `NODE_ENV='test'` or DSN absent. Sample rates parsed via local `parseSampleRate()`, clamped `[0,1]`, default `0.1` in prod / `1` in dev. No tunnel route.

Logger (`src/lib/logger.ts`): exports `logger` singleton + `createContextLogger(name)` factory. Levels: `debug`/`info`/`warn`/`error`/`fatal` (controlled by `LOG_LEVEL`). Three transports: `ConsoleTransport` (colored, suppressed in prod), `SentryTransport` (error → `captureException`, warn → `captureMessage`, info/debug → `addBreadcrumb`), `FileTransport` (buffered, flushes every 5s). Lazy-requires `@sentry/nextjs`.

## Gotchas

- **No Prisma.** The repo migrated off Prisma 7 → Drizzle ORM in May 2026 after [prisma/prisma#28588](https://github.com/prisma/prisma/issues/28588) caused `/blog/[slug]` Server Component queries to suspend indefinitely on Vercel + adapter-neon. Don't reintroduce `@prisma/*` packages or import from `@/generated/prisma/*`.
- **Never call `notFound()` inside a `not-found.tsx`.** It's recursive and Vercel serves HTTP 200 with a 404-marker body, which Google flags as "Soft 404." A `not-found.tsx` should be a plain Server Component that just renders the 404 UI — the HTTP 404 status comes from the `notFound()` call in the page or layout, not from the template itself. Segment-level templates exist at `src/app/blog/[slug]/`, `src/app/blog/category/[slug]/`, and `src/app/projects/[slug]/` for themed 404s; the root template at `src/app/not-found.tsx` is the global fallback.
- **Drizzle relational queries** use `db.query.<table>.findFirst({ where, with: { ... } })` for relations and `db.select().from(table)` for plain SQL-style queries. `db.execute(sql\`...\`)` is the raw-SQL escape hatch (used in `src/lib/search.ts` for full-text search).
- **All IDs are CUIDs.** New rows use cuid2 via `src/db/cuid.ts`; legacy rows from the Prisma era use cuid v1. Both are 24–25-char alphanumeric strings — use `cuidSchema` from `src/lib/schemas.ts` for ID validation, never `z.string().uuid()`.
- **citext + inet are custom Drizzle types.** Defined in `src/db/schema.ts` via `customType<{ data: string; driverData: string }>`. Don't replace with plain `text()` — case-insensitive slug/email matching depends on it.
- **CSP comes from `proxy.ts`, not `headers()`.** Adding it to `next.config.js` will collide with the per-request nonce. Inline `<script>` and `<style>` in components must read the nonce via the `x-nonce` request header.
- **PDF assets are an intentional carve-out.** `.pdf` paths are excluded from the `proxy.ts` matcher (no CSP) and override `X-Frame-Options` to `SAMEORIGIN` via a route-specific `next.config.js` rule, so the resume PDF can embed in `<object>` on `/resume` and `/resume/view`. Chrome PDFium has been progressively restricting `<iframe src=pdf>` since Chrome 116; use `<object data=pdf type="application/pdf">` for embedded PDFs. If a future PDF needs to stay non-framable (e.g. signed contract), narrow the `next.config.js` source from `/:path*\\.pdf` to the literal résumé filename and add an explicit deny rule for the new path. Regression-pinned in `e2e/security-headers.spec.ts`.
- **One canonical email path: `src/lib/email-service.ts`.** Both the `submitContactForm` server action (`src/app/contact/actions.ts`) and the `POST /api/contact` route handler delegate to `emailService.sendContactEmail()`. Templates live in `src/emails/*.tsx` and use `react-email` components (passed via Resend's `react` prop). Don't reintroduce inline HTML strings or per-handler Resend clients.
- **`api/contact/csrf-route.ts` is not auto-routed.** Next.js only treats `route.ts` as an endpoint; this filename was deliberate. Confirm wiring before relying on it.
- **`bun --bun` flag matters.** `dev` and `build:ci` use it; `build` does not. The Bun-side bundler exposes different edge cases than the Node-side one — when reproducing a CI failure locally, match the script.
- **Pre-push runs Vitest.** Bypass with `git push --no-verify` only when the failure is provably unrelated to the change.

## Where to find things

- Public site URL: `NEXT_PUBLIC_SITE_URL`, defaults `https://richardwhudsonjr.com`.
- Vercel region: `iad1` (single region, `vercel.json:6`).
- Image whitelist: `images.unsplash.com` only (`next.config.js:38-44`).
- Cache policy for `/projects/*` and `/blog/*`: `s-maxage=60, stale-while-revalidate=86400`, CDN 1 hour (`next.config.js:148-160`).
- Permanent redirects: `/home` → `/` (`next.config.js`); `/github`, `/linkedin`, `/twitter` (`vercel.json`).
- 9 unit test files under `src/lib/__tests__/` and `src/app/api/contact/__tests__/`.
- 5 Playwright specs under `e2e/`.
- Security audit history: `SECURITY.md` (current controls), `SECURITY_AUDIT_REPORT.md` (findings; recent commits closed S-001, B-001, H-001, B-002, P-001).
