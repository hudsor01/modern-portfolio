# Modern Portfolio

Personal portfolio for Richard Hudson — revenue operations, projects, blog, resume. Production site: [richardwhudsonjr.com](https://richardwhudsonjr.com).

## Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4, shadcn/ui, Radix primitives |
| Language | TypeScript 5.9 (strict) |
| Database | PostgreSQL via [Neon](https://neon.tech) + [Prisma 7](https://www.prisma.io) |
| Email | [Resend](https://resend.com) |
| Observability | [Sentry](https://sentry.io), [Vercel Analytics](https://vercel.com/analytics) |
| Testing | Vitest 4, Playwright 1.57, `@axe-core/playwright` |
| Runtime | Bun 1.3.6, Node.js 22–24 |
| Hosting | [Vercel](https://vercel.com) |

## Quickstart

```bash
bun install
cp .env.example .env.local   # fill in values (see Environment Variables)
bun run db:generate
bun run dev                  # http://localhost:3000
```

## Scripts

| Script | Purpose |
|---|---|
| `bun run dev` | Start Next.js dev server (Turbopack) |
| `bun run build` | Production build |
| `bun run start` | Serve production build |
| `bun run lint` / `lint:fix` | ESLint (flat config) |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run ci:quick` | lint + typecheck (CI gate) |
| `bun test` | Vitest unit tests |
| `bun run test:watch` | Vitest watch mode |
| `bun run test:coverage` | Vitest + v8 coverage |
| `bun run e2e` | Playwright end-to-end |
| `bun run e2e:ui` | Playwright UI mode |
| `bun run db:generate` | Regenerate Prisma client |
| `bun run db:push` | Push schema to DB (dev) |
| `bun run db:migrate` | Create + apply dev migration |
| `bun run db:migrate:deploy` | Apply migrations in prod/CI |
| `bun run db:studio` | Open Prisma Studio |
| `bun run db:seed` | Seed via `prisma db seed` |

## Environment Variables

Source of truth: [`src/lib/env-validation.ts`](src/lib/env-validation.ts) (Zod schema, validated at startup).

### Required (runtime)

| Var | Notes |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (`postgresql://…` or `postgres://…`). Optional at build time (CI skips via `SKIP_DB_VALIDATION=true`). |
| `RESEND_API_KEY` | API key for the contact form email delivery. |

### Optional (with defaults or feature-gated)

| Var | Default | Purpose |
|---|---|---|
| `NODE_ENV` | `development` | `development` \| `production` \| `test` |
| `NEXT_PUBLIC_SITE_URL` | `https://richardwhudsonjr.com` (prod) / `http://localhost:3000` (dev) | Must use HTTPS in production. Drives CSP, canonical URLs, OG. |
| `FROM_EMAIL` | `contact@richardwhudsonjr.com` | Sender address for contact form. |
| `TO_EMAIL` | `hello@richardwhudsonjr.com` | Inbox address for contact form. |
| `CONTACT_EMAIL` | — | Override for `TO_EMAIL`. |
| `ALLOWED_ORIGINS` | `[]` | Comma-separated CORS allowlist. |
| `USE_LOCAL_DB` | `false` | Use local Postgres adapter instead of Neon. |
| `JWT_SECRET` | — | 32–512 chars. Currently unused but validated if set. |
| `JWT_EXPIRES_IN` | — | Format `1h`, `30m`, `7d`. |
| `ADMIN_API_TOKEN` | — | ≥32 chars. |
| `METRICS_API_TOKEN` | — | ≥32 chars; gates `/api/metrics`. |
| `LOG_LEVEL` | `info` (prod) / `debug` (dev) | `debug` \| `info` \| `warn` \| `error` \| `fatal` |
| `ENABLE_FILE_LOGGING` | `false` | Opt-in file transport in production. |
| `VERCEL_URL` / `NEXT_PUBLIC_VERCEL_URL` | — | Set automatically by Vercel. |

Build-time tip: set `SKIP_DB_VALIDATION=true` and `NEXT_PHASE=phase-production-build` in CI environments without DB access — the build guard pattern in `src/lib/db.ts` handles this.

## Project Structure

```
src/
├── app/              # Next.js App Router (routes, API handlers, layout)
├── components/       # UI components (shadcn, Radix, SEO JSON-LD)
├── lib/              # db, logger, env-validation, csp, csrf, api-response
├── hooks/            # React hooks
├── types/            # Shared TypeScript types
├── data/             # Static content
├── styles/           # Tailwind globals
└── generated/prisma/ # Prisma client (auto-generated; do not edit)
prisma/               # schema, migrations, seed
.planning/            # GSD workflow planning artifacts
proxy.ts              # Next.js 16 root proxy (headers, redirects)
```

## Security

- Strict CSP with per-request nonces ([`src/lib/csp-edge.ts`](src/lib/csp-edge.ts))
- CSRF protection on mutating API routes ([`src/lib/csrf-protection.ts`](src/lib/csrf-protection.ts))
- Env validation at startup (Zod) — production requires HTTPS site URL
- HSTS (1 yr, preload), Permissions-Policy, X-Frame-Options DENY, nosniff
- Automated dependency patching via Renovate with security auto-merge
- `bun audit --audit-level=high` gates every PR

## Deployment

Vercel handles builds and deploys automatically on push to `main`:

1. Connect the repo in Vercel dashboard
2. Set required env vars (at minimum `DATABASE_URL`, `RESEND_API_KEY`)
3. Vercel detects Next.js 16 and builds with `bun run build`
4. Preview deployments generated per pull request

Production migrations: `bun run db:migrate:deploy` runs against Neon as part of the Vercel build step.

## Development Workflow

- Lefthook runs `lint-staged` (ESLint --fix) on pre-commit
- All non-trivial work flows through the [GSD workflow](/.planning) (see `CLAUDE.md`)
- Atomic commits preferred — message style: `type(scope): subject`

## License

Private — all rights reserved.

Author: Richard Hudson — [richardwhudsonjr.com](https://richardwhudsonjr.com)
