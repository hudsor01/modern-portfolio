# modern-portfolio

Personal portfolio and revenue-operations site for Richard Hudson.
Production: **[richardwhudsonjr.com](https://richardwhudsonjr.com)**.

Marketing content, project case studies, a blog backed by Postgres, a
contact form, and a downloadable resume — all rendered by the Next.js 16
App Router, deployed to Vercel.

---

## Stack

| Layer           | Choice                                                              |
| --------------- | ------------------------------------------------------------------- |
| Framework       | Next.js 16 (App Router, React Compiler enabled)                     |
| UI              | React 19 · Tailwind CSS 4 · shadcn/ui · Radix primitives · Motion   |
| Language        | TypeScript 7 (native compiler; strict, `noUncheckedIndexedAccess`)  |
| Database        | PostgreSQL on [Neon](https://neon.tech) via Drizzle ORM 0.45 (HTTP driver) |
| Validation      | Zod 4                                                               |
| Email           | [Resend](https://resend.com) 6                                      |
| Observability   | Sentry (`@sentry/nextjs` 11) · Vercel Analytics · Speed Insights    |
| Runtime         | Bun 1.4.4 · Node.js `>=22 <25`                                      |
| Testing         | Vitest 5 · Playwright · `@axe-core/playwright`                      |
| Tooling         | Biome 2 (lint + format) · Lefthook 2 · Dependabot                   |
| Hosting         | Vercel (region `iad1`)                                              |

See [`package.json`](package.json) for exact pinned versions.

---

## Quickstart

```bash
bun install
# Set the two required runtime vars in .env.local (see Environment below):
#   DATABASE_URL=postgresql://...
#   RESEND_API_KEY=re_...
bun run dev                         # http://localhost:3000
```

Drizzle has no client-generation step at install time — the schema in
[`src/db/schema.ts`](src/db/schema.ts) is the runtime artifact. Generate
SQL migrations with `bun run db:generate` only when you change the schema.

---

## Scripts

Sourced from [`package.json`](package.json):

| Script                              | Purpose                                           |
| ----------------------------------- | ------------------------------------------------- |
| `bun run dev`                       | Dev server (`bun --bun next dev`)                 |
| `bun run build`                     | Production build (Node-side `next build`)         |
| `bun run build:ci`                  | Production build (Bun-side `bun --bun next build`)|
| `bun start`                         | Serve the production build                        |
| `bun run lint` / `lint:fix`         | Biome check (lint + format) over `src/`           |
| `bun run format` / `format:fix`     | Biome format-only over `src/`                     |
| `bun run typecheck`                 | `tsc --noEmit`                                    |
| `bun run typecheck:e2e`             | `tsc --noEmit -p e2e` (the Playwright specs)      |
| `bun run ci:quick`                  | `lint` + `typecheck` + `typecheck:e2e` (the gate CI runs) |
| `bun test` / `test:watch`           | Vitest (unit/integration, jsdom)                  |
| `bun run test:coverage`             | Vitest + v8 coverage                              |
| `bun run e2e` / `e2e:ui` / `e2e:headed` / `e2e:chromium` / `e2e:report` | Playwright |
| `bun run db:generate`               | `drizzle-kit generate` — emit SQL migration into `drizzle/migrations/` |
| `bun run db:migrate`                | `drizzle-kit migrate` — apply pending migrations to `DATABASE_URL` |
| `bun run db:push`                   | `drizzle-kit push` — sync schema without writing a migration (dev only) |
| `bun run db:studio`                 | Open Drizzle Studio                               |
| `bun run db:seed`                   | Run [`drizzle/seed.ts`](drizzle/seed.ts) — idempotent upsert seed |

---

## Environment

There is no checked-in `.env.example`. The Zod schema in
[`src/lib/env-validation.ts`](src/lib/env-validation.ts) is the source of
truth — validation runs at module load and throws on malformed input.

Required at runtime:

- `DATABASE_URL` — Neon Postgres connection string (must start with `postgresql://` or `postgres://`).
  The Drizzle client uses Neon's HTTP driver, so local development needs a Neon branch, not a plain local Postgres
- `RESEND_API_KEY` — Resend API key for the contact-form endpoint

Optional / situational:

- `NEXT_PUBLIC_SITE_URL` — must be HTTPS in production
- `ADMIN_API_TOKEN` — required for `POST /api/seed` (Bearer token, ≥32 chars)
- `METRICS_API_TOKEN` — required for `GET /api/security/metrics` (`X-Metrics-Token` header, ≥32 chars)
- `ALLOW_SEED_IN_PRODUCTION` — `'true'` to enable `/api/seed` in prod
- Sentry: `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`, sample-rate vars
- `INDEXNOW_KEY` — read directly by the blog POST handler when publishing

Build-time tip: `next build` needs no database — `DATABASE_URL` is only required
at runtime, and CI's `build` job in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) sets none.

---

## Project structure

```
.
├── src/
│   ├── app/                 # App Router routes + API handlers
│   │   ├── api/             # 17 route files (contact, blog, projects,
│   │   │                    #   og, health, seed, cron, security/metrics, …)
│   │   ├── about/ blog/ contact/ projects/ resume/
│   │   └── layout.tsx, page.tsx, error.tsx, sitemap.ts, robots.ts, …
│   ├── components/          # ui (shadcn + Radix), layout, navigation, charts,
│   │                        #   blog, projects, contact, about, error, providers,
│   │                        #   seo (JSON-LD)
│   ├── db/                  # Drizzle schema, client (lazy proxy), cuid2 factory
│   ├── lib/                 # env-validation, logger, schemas, csp-edge, csrf,
│   │                        #   rate-limiter, email-service, data-service, …
│   ├── proxy.ts             # Next.js 16 proxy (replaces middleware.ts): CSP + nonce, and
│   │                        #   one-hop lowercase / trailing-slash / redirect-table 308s
│   ├── hooks/               # React hooks
│   ├── types/               # Shared TypeScript types
│   ├── data/                # Static catalog (project case-study data) + redirect
│   │                        #   tables (redirects.json, blog-slug-renames.json,
│   │                        #   blog-retired-slugs.json)
├── drizzle/
│   ├── migrations/          # drizzle-kit output (SQL)
│   └── seed.ts              # Idempotent seed
├── e2e/                     # 36 Playwright specs
├── public/
├── instrumentation.ts       # Next.js instrumentation (Sentry server bootstrap)
├── instrumentation-client.ts# Sentry client bootstrap
├── sentry.{server,edge}.config.ts, sentry.shared.ts
├── next.config.js
├── drizzle.config.ts
└── vercel.json              # framework, buildCommand, regions, crons
```

Path aliases (`tsconfig.json`): `@/*` → `src/*`, plus shortcuts for
`@/components`, `@/lib`, `@/hooks`, `@/types`, `@/db`, `@/db/*`, etc.

---

## Database

Postgres via Drizzle ORM with the Neon serverless **HTTP** driver
(`@neondatabase/serverless` + `drizzle-orm/neon-http`). Stateless per
query, no connection pool — sidesteps the connection-pool failure modes
that bit the previous Prisma 7 + adapter-neon setup.

- Schema: [`src/db/schema.ts`](src/db/schema.ts) — 10 tables, 6 enums
  (`pgEnum`), `citext` + `inet` custom types, jsonb columns typed via
  `.$type<T>()`.
- Client: [`src/db/index.ts`](src/db/index.ts) — lazy `Proxy` over a
  `drizzle()` singleton on `globalThis.__drizzle`. `'server-only'`
  enforces server-side use; importing this module does not instantiate
  the client, so build workers that never query don't pay the init cost.
- IDs: cuid2 for new rows. Use `cuidSchema` from
  [`src/lib/schemas.ts`](src/lib/schemas.ts) for ID validation —
  not `z.string().uuid()`.
- Migrations: [`drizzle/migrations/`](drizzle/migrations/). The pre-existing
  Postgres schema was created by Prisma migrations (since removed from
  the repo) and remains in place — Drizzle is pointed at the same DB.

---

## API surface

Public:

- `GET /api/health` · `GET /api/health-check` — DB ping / probe text
- `GET, POST /api/blog` — list / create posts
- `GET, PUT, DELETE /api/blog/[slug]`
- `POST /api/blog/[slug]/view` — view-count beacon (204 always)
- `GET /api/blog/rss` — RSS 2.0 XML by default (the autodiscovery target); JSON via `?format=json`
- `GET, POST /api/blog/tags` · `GET, POST /api/blog/categories`
- `GET /api/blog/analytics`
- `POST /api/contact` — Resend email; rate-limited (3/hr, burst 2/10s)
- `GET /api/projects` · `GET /api/projects/[slug]`
- `GET /api/og` — dynamic OG image (`next/og`)

Token-gated:

- `POST /api/seed` — `Authorization: Bearer $ADMIN_API_TOKEN` (timing-safe
  compare); returns 404 in production unless `ALLOW_SEED_IN_PRODUCTION='true'`
- `GET /api/security/metrics` — `X-Metrics-Token: $METRICS_API_TOKEN`;
  exports rate-limiter metrics
- `GET /api/cron/publish-scheduled` · `GET /api/cron/purge-contact-submissions` —
  `Authorization: Bearer $CRON_SECRET` (Vercel Cron)

CSRF (`x-csrf-token` header matching the `__csrf_token` cookie) is enforced on
mutating `/api/blog*` and `/api/contact` routes, except the
`POST /api/blog/[slug]/view` beacon (`sendBeacon` cannot set headers; it is
rate-limited and only increments an anonymous counter).

---

## Security

See [SECURITY.md](SECURITY.md) for the full posture and how to report
vulnerabilities. Summary:

- **Redirects** resolve in [`src/proxy.ts`](src/proxy.ts) via `resolveSingleHop`, one 308 each, from `src/data/redirects.json` plus the two blog slug maps (built by `src/lib/redirect-table.mjs`, shared with `next.config.js`); `vercel.json` holds none
- **CSP** built per request in [`src/proxy.ts`](src/proxy.ts) from [`src/lib/csp-edge.ts`](src/lib/csp-edge.ts) (`script-src 'self' 'unsafe-inline'`: a nonce is incompatible with static prerendering — see SECURITY.md)
- **CSRF** on mutating API routes — [`src/lib/csrf-protection.ts`](src/lib/csrf-protection.ts) · [`src/lib/api-csrf.ts`](src/lib/api-csrf.ts)
- **Rate limiting** — [`src/lib/rate-limiter/`](src/lib/rate-limiter/) (in-memory store with progressive backoff)
- **Zod env validation** at startup, with HTTPS enforced outside development — [`src/lib/env-validation.ts`](src/lib/env-validation.ts)
- **Security headers**: HSTS (1 yr, preload), `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`
  (camera/mic/geolocation denied) — [`next.config.js`](next.config.js)
- **Dependency hygiene**: `bun audit --audit-level=high` runs on every pull
  request, failing CI on any high/critical advisory, and re-runs daily against
  `main` — [`.github/workflows/audit.yml`](.github/workflows/audit.yml).
  [Dependabot](.github/dependabot.yml) opens weekly dependency and monthly
  GitHub Actions update PRs
- **Structured logging**: `console.*` is banned in application code;
  everything flows through [`src/lib/logger.ts`](src/lib/logger.ts) → Sentry in production
- **Admin tokens** are compared with `crypto.timingSafeEqual` and fail
  closed when unset

---

## Testing

- **Unit / integration** — Vitest (`bun test`), jsdom, suite runs in
  ~500 ms (Lefthook gates pre-push on it)
- **E2E** — Playwright with Chromium by default; axe-core accessibility
  checks. 36 specs in [`e2e/`](e2e/)
- **Pre-push hook** ([`lefthook.yml`](lefthook.yml)) runs
  `bunx vitest run --passWithNoTests`. Bypass with `git push --no-verify`
  when intentional and verifiable.

---

## Deployment

Vercel handles builds on push:

- **Config**: [`vercel.json`](vercel.json) (framework `nextjs`, build
  command `bun run build`, region `iad1`)
- **Build**: Next.js 16 with React Compiler enabled
  ([`next.config.js`](next.config.js)); `output: 'standalone'`
- **Preview deploys** are generated for pull requests, except from
  `dependabot/**` branches (`git.deploymentEnabled` in `vercel.json`)
- **Environment variables** are set via the Vercel dashboard (or
  `vercel env add`). `.env.local` is never uploaded

### Database migrations

`drizzle-kit migrate` is **not** wired into the Vercel build. `vercel.json`'s
`buildCommand` is just `bun run build`. Apply pending migrations manually:

```bash
# from a machine with DATABASE_URL pointed at production
bunx drizzle-kit migrate
```

If this gets wired into `buildCommand` (e.g.
`bunx drizzle-kit migrate && bun run build`), update this section.

---

## Development workflow

- **Lefthook pre-commit** runs `bunx biome check --staged --write` over
  staged `src/**/*.{ts,tsx,js,jsx,json}` and re-stages anything Biome
  rewrote (no `lint-staged` dependency).
- **Lefthook pre-push** runs the Vitest suite.
- Atomic commits preferred. Commit style: `type(scope): subject`.
- Commit trailer required: `[hudsor01]`.

---

## License

All rights reserved. See [LICENSE](LICENSE).

---

**Author**: Richard Hudson — [richardwhudsonjr.com](https://richardwhudsonjr.com) · [github.com/hudsor01](https://github.com/hudsor01) · [linkedin.com/in/hudsor01](https://linkedin.com/in/hudsor01)
