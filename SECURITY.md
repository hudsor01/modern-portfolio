# Security policy

This repository hosts the personal portfolio at **richardwhudsonjr.com**.
Security issues are taken seriously even though the project is single-author
and small in scope.

---

## Reporting a vulnerability

**Do not file a public GitHub issue for security problems.**

Report privately via one of:

- Email: [hello@richardwhudsonjr.com](mailto:hello@richardwhudsonjr.com) with subject `SECURITY:` and a description
- GitHub private vulnerability advisory:
  <https://github.com/hudsor01/modern-portfolio/security/advisories/new>

Please include:

1. A description of the vulnerability and its impact
2. Reproduction steps (URL, payload, curl command, etc.)
3. Affected commit SHA or deployed URL if known
4. Any suggested remediation

You will get an acknowledgement within **72 hours**. Coordinated-disclosure
timeline is negotiable; please propose one if you have a preference.

---

## Supported versions

Only the latest commit on `main` (and the currently deployed Vercel
production build) is supported. Preview deployments, feature branches, and
historical tags are out of scope.

---

## Scope

In scope:

- `richardwhudsonjr.com` and Vercel preview subdomains for this project
- Source code under this repository
- API routes under `/api/*` (contact, blog, health, metrics, etc.)

Out of scope:

- Third-party services this app depends on (Neon, Resend, Sentry, Vercel,
  Google Fonts) — report those directly to the vendor
- Denial-of-service testing or load testing
- Physical, social-engineering, or phishing attacks
- Automated scanner output without a demonstrated impact
- Best-practice recommendations without a concrete exploit path

---

## Security posture

Defensive controls currently in place:

### Transport & headers

- HTTPS enforced — `NEXT_PUBLIC_SITE_URL` must be HTTPS in production
  (validated at boot in `src/lib/env-validation.ts`)
- **HSTS**: `max-age=31536000; includeSubDomains; preload`
- **CSP** with per-request nonces — `src/lib/csp-edge.ts`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`: camera, microphone, geolocation denied

### Application

- **CSRF** token validation on mutating routes — `src/lib/csrf-protection.ts`,
  `src/lib/api-csrf.ts`
- **Rate limiting** on contact submissions — `src/lib/rate-limiter/`
- **Input validation** — all external input parsed through Zod schemas
- **Output sanitization** — `isomorphic-dompurify` for any user-provided HTML
- **Structured logging** — `console.*` banned in application code; all error
  paths route through `src/lib/logger.ts` → Sentry in production

### Secrets & environment

- All secrets injected via Vercel environment variables — never committed
- `.env`, `.env.*` are git-ignored (`.env.example` is the only tracked env
  file and contains no real values)
- Zod schema at boot enforces format, length, and HTTPS requirements;
  weak `JWT_SECRET` patterns are flagged at startup

### Supply chain

- `bun audit --audit-level=high` runs in CI and blocks merges on any
  unresolved high/critical finding
- Transitive vulnerabilities are pinned through npm-compatible `overrides`
  in `package.json`
- Renovate submits automated dependency-update PRs with security auto-merge

### Data

- Single Postgres database on Neon, accessed only via Prisma with prepared
  statements (no string interpolation into SQL)
- `/api/seed` is a **POST** guarded by (1) `Authorization: Bearer
  $ADMIN_API_TOKEN` compared with `crypto.timingSafeEqual`, and (2) an
  idempotency check that refuses to run when the blog-posts table is
  non-empty. Fails closed when `ADMIN_API_TOKEN` is unset.

---

## Known gaps / follow-ups

These are publicly documented so reporters don't waste cycles on them:

- `JWT_SECRET` and `METRICS_API_TOKEN` are validated by the env schema but
  not yet consumed by any route handler. Wiring them up is tracked in
  `.planning/`. `ADMIN_API_TOKEN` is now consumed by `/api/seed`.
- `/api/sentry-debug` exists for observability verification and reveals
  which Sentry env vars are set (not their values). Consider removing or
  gating before any milestone where it is no longer needed.

---

## Acknowledgements

Thanks in advance for responsible disclosure. If you'd like credit, include
the name/handle you'd like referenced.
