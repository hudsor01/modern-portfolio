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
| Framework       | Next.js 16 (App Router, Turbopack, React Compiler)                  |
| UI              | React 19 · Tailwind CSS 4 · shadcn/ui · Radix primitives · Motion   |
| Language        | TypeScript 5.9 (strict)                                             |
| Database        | PostgreSQL on [Neon](https://neon.tech) via Prisma 7                |
| Email           | [Resend](https://resend.com)                                        |
| Observability   | Sentry · Vercel Analytics                                           |
| Runtime         | Bun 1.3.x · Node.js 22–24                                           |
| Testing         | Vitest 4 · Playwright 1.57 · `@axe-core/playwright`                 |
| Hosting         | Vercel (region `iad1`)                                              |

See `package.json` for exact pinned versions.

---

## Quickstart

```bash
bun install
cp .env.example .env.local          # fill in DATABASE_URL + RESEND_API_KEY at minimum
bun run db:generate                 # generate Prisma client
bun run dev                         # http://localhost:3000
```

`bun install` runs under the Bun package manager. Node.js is also supported
as a runtime (≥22 <25).

---

## Scripts

| Script                              | Purpose                                           |
| ----------------------------------- | ------------------------------------------------- |
| `bun run dev`                       | Dev server (Turbopack)                            |
| `bun run build` / `build:ci`        | Production build                                  |
| `bun run start`                     | Serve the production build                        |
| `bun run lint` / `lint:fix`         | Biome check (lint + format)                       |
| `bun run format` / `format:fix`     | Biome format-only                                 |
| `bun run typecheck`                 | `tsc --noEmit`                                    |
| `bun run ci:quick`                  | lint + typecheck (the gate lefthook runs locally) |
| `bun test` / `test:watch`           | Vitest                                            |
| `bun run test:coverage`             | Vitest + v8 coverage                              |
| `bun run e2e` / `e2e:ui` / `e2e:headed` | Playwright                                    |
| `bun run db:generate`               | `prisma generate`                                 |
| `bun run db:push` / `db:push:dev`   | `prisma db push` (non-migration schema sync)      |
| `bun run db:migrate`                | `prisma migrate dev` (create + apply locally)     |
| `bun run db:migrate:deploy`         | `prisma migrate deploy` (apply pending in prod)   |
| `bun run db:studio`                 | Open Prisma Studio                                |
| `bun run db:seed`                   | Seed via `prisma db seed`                         |
| `bun run db:reset`                  | **Destructive** — `prisma migrate reset`          |
| `bun run generate-sitemap`          | Static sitemap generator (fallback to app/sitemap.ts) |

---

## Environment variables

Source of truth for user-facing variables: `.env.example` at the repo root.
Runtime-validated variables are defined with a Zod schema in
[`src/lib/env-validation.ts`](src/lib/env-validation.ts) and validated at
module import time — boot fails loudly if anything is malformed.

Required at runtime:

- `DATABASE_URL` — PostgreSQL connection string (Neon or local)
- `RESEND_API_KEY` — Resend API key for contact-form email

See `.env.example` for the complete list (Sentry DSN, sampling rates,
log level, CORS allowlist, Google verification, IndexNow, etc.).

Build-time tip: set `SKIP_DB_VALIDATION=true` when building in CI without a
live DB. `src/lib/db.ts` and the Next.js `NEXT_PHASE` guards already handle
the "no DB during `next build`" case for sitemap / blog pages.

---

## Project structure

```
.
├── src/
│   ├── app/                 # App Router: routes, API handlers, layout
│   │   ├── api/             # Route handlers (contact, health, seed, metrics…)
│   │   ├── blog/            # Blog list + [slug] detail
│   │   ├── projects/        # Case-study pages
│   │   └── ...              # about, contact, resume, etc.
│   ├── components/          # UI (shadcn + Radix), SEO JSON-LD, error boundary
│   ├── lib/                 # db, logger, env-validation, csp-edge, csrf, utils
│   ├── hooks/               # React hooks
│   ├── types/               # Shared TypeScript types
│   ├── data/                # Static content (projects, etc.)
│   ├── styles/              # Tailwind globals
│   └── generated/prisma/    # Generated Prisma client (do not edit)
├── prisma/                  # schema.prisma, migrations, seed
├── e2e/                     # Playwright tests
├── scripts/                 # generate-sitemap.js, etc.
├── proxy.ts                 # Next.js 16 root proxy (replaces middleware.ts)
├── instrumentation.ts       # Next.js instrumentation hook (Sentry bootstrap)
├── sentry.{client,server,edge}.config.ts
├── next.config.js
├── vercel.json              # framework, buildCommand, redirects
└── .planning/               # GSD planning artifacts (git-ignored in repo)
```

---

## Security

See [SECURITY.md](SECURITY.md) for the full posture and how to report
vulnerabilities. Summary:

- **Strict CSP** with per-request nonces — [`src/lib/csp-edge.ts`](src/lib/csp-edge.ts)
- **CSRF** on mutating API routes — [`src/lib/csrf-protection.ts`](src/lib/csrf-protection.ts)
- **Rate limiting** on contact submissions — `src/lib/rate-limiter/`
- **Zod env validation** at startup, with production-only HTTPS enforcement
- **Security headers**: HSTS (1 yr, preload), X-Frame-Options `DENY`,
  `nosniff`, Permissions-Policy (camera/mic/geolocation denied)
- **Dependency hygiene**: `bun audit --audit-level=high` gates every PR via
  GitHub Actions; Renovate keeps dependencies current
- **Error routing**: `console.*` is banned in application code; everything
  flows through `src/lib/logger.ts` → Sentry in production
- **Admin endpoints**: `/api/seed` (POST) requires `Authorization: Bearer
  $ADMIN_API_TOKEN`, checked with `crypto.timingSafeEqual`. Fails closed
  when the token is unset.

---

## Testing

- **Unit / integration** — Vitest (`bun test`, 174+ tests, ~500 ms)
- **E2E** — Playwright with Chromium by default; axe-core accessibility checks
- **Pre-push hook** (`lefthook.yml`) runs `bunx vitest run --passWithNoTests`
  to prevent known-broken code from reaching CI. Bypass with
  `git push --no-verify` when intentional.

---

## Deployment

Vercel handles builds on push:

- **Config**: `vercel.json` (framework `nextjs`, build command `bun run build`,
  region `iad1`)
- **Build**: Next.js 16 with React Compiler enabled (`next.config.js`)
- **Preview deploys** are generated for every pull request
- **Environment variables** are set via the Vercel dashboard (or
  `vercel env add`). `.env.local` is never uploaded

### Database migrations

**`prisma migrate deploy` is not currently wired into the Vercel build.**
`vercel.json`'s `buildCommand` is just `bun run build`. Until that changes,
migrations must be applied manually:

```bash
# from a machine with DATABASE_URL pointed at Neon production
bun run db:migrate:deploy
```

If this gets wired into `buildCommand` (e.g. `prisma migrate deploy && bun run build`),
update this section.

---

## Development workflow

- Lefthook runs `lint-staged` (`biome check --write`) on pre-commit
- Lefthook runs `vitest run` on pre-push
- Non-trivial work flows through the GSD workflow in `.planning/` (see
  `CLAUDE.md`) — small fixes use `/gsd:quick`, investigations use
  `/gsd:debug`, and planned phases use `/gsd:execute-phase`
- Atomic commits preferred. Commit style: `type(scope): subject`
- Commit trailer required by CLAUDE.md: `[hudsor01]`

---

## License

All rights reserved. See [LICENSE](LICENSE).

---

**Author**: Richard Hudson — [richardwhudsonjr.com](https://richardwhudsonjr.com) · [github.com/hudsor01](https://github.com/hudsor01) · [linkedin.com/in/hudsor01](https://linkedin.com/in/hudsor01)
