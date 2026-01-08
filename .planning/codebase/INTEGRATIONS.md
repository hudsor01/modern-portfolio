# External Integrations

**Analysis Date:** 2026-01-08

## APIs & External Services

**Email Service:**
- Resend - Transactional email delivery
  - SDK/Client: resend npm package 6.6.0 (`package.json`)
  - Auth: API key in RESEND_API_KEY environment variable (`.env.example`)
  - Endpoints used: Send email API
  - Usage: `src/lib/email/email-service.ts`, `src/app/api/contact/route.ts`
  - Features: Contact form notifications, auto-reply emails, HTML/text variants

**Analytics:**
- Vercel Analytics - Performance monitoring
  - SDK/Client: @vercel/analytics 1.6.1 (`package.json`)
  - Integration: Automatic via Vercel platform
  - Custom tracking: `src/lib/analytics/web-vitals-service.ts`, `src/lib/analytics/data-aggregation-service.ts`

## Data Storage

**Databases:**
- PostgreSQL - Primary data store
  - Connection: via DATABASE_URL environment variable (`.env.example`)
  - Client: Prisma ORM 7.2.0 with @prisma/adapter-pg driver
  - Migrations: `prisma/migrations/` directory
  - Schema: `prisma/schema.prisma`
  - Connection pooling: Configured for production (`?connection_limit=10&pool_timeout=20`)
  - Features: Full-text search, CITEXT extension for case-insensitive text

**File Storage:**
- None currently - no cloud storage integration
- Images served from Unsplash (configured in `next.config.js` remote patterns)

**Caching:**
- None - No Redis or external caching layer
- Uses Next.js ISR (Incremental Static Regeneration) for page-level caching

## Authentication & Identity

**Auth Provider:**
- None currently - No authentication system integrated
- JWT_SECRET environment variable present but unused (placeholder for future auth)

## Monitoring & Observability

**Error Tracking:**
- Custom security event logging - `src/lib/security/security-event-logger.ts`
  - Logs to database (SecurityEvent model in Prisma schema)
  - Tracks: rate limit exceeded, CSRF failures, invalid inputs, suspicious activities

**Analytics:**
- Vercel Analytics - Client-side performance metrics
- Custom Web Vitals Service - `src/lib/analytics/web-vitals-service.ts`
- Data Aggregation Service - `src/lib/analytics/data-aggregation-service.ts`

**Logs:**
- Structured logging - `src/lib/monitoring/logger.ts`
  - Console-based logging in development
  - Structured JSON logs in production
  - Context-aware logging with request metadata

## CI/CD & Deployment

**Hosting:**
- Vercel (implied from analytics integration)
  - Deployment: Likely automatic on git push
  - Environment vars: Configured in Vercel dashboard

**CI Pipeline:**
- GitHub Actions (implied from workflow structure)
  - Test command: `bun test`
  - Build command: `bun run build`
  - Type checking: `bun run type-check`
  - Linting: `bun run lint`

## Environment Configuration

**Development:**
- Required env vars: DATABASE_URL, RESEND_API_KEY, CONTACT_EMAIL, JWT_SECRET
- Secrets location: `.env.local` (gitignored, template in `.env.example`)
- Mock/stub services: Not implemented - uses real services

**Production:**
- Secrets management: Environment variables via hosting platform
- Database: PostgreSQL with connection pooling
- Failover/redundancy: Not configured

## Webhooks & Callbacks

**Incoming:**
- None currently - No webhook endpoints

**Outgoing:**
- None currently - No outgoing webhooks

## Security Infrastructure

**Rate Limiting:**
- Custom implementation - `src/lib/security/rate-limiter.ts`
  - In-memory rate limiting with LRU cache
  - Progressive penalties, burst protection, adaptive thresholds
  - Applied to: Contact form (3/hour), Blog API (100/min), Blog creation (10/hour)

**CSRF Protection:**
- Custom implementation - `src/lib/security/csrf-protection.ts`
  - Token generation and validation
  - Applied to: Contact form, blog post creation
  - Endpoint: `/api/contact/csrf-route` for token generation

**HTML Sanitization:**
- DOMPurify - `src/app/blog/components/blog-content.tsx`
  - Sanitizes user-generated HTML content
  - Configured ALLOWED_TAGS and ALLOWED_ATTR

**Security Headers:**
- Custom security headers - `src/lib/security/security-headers.ts`, `next.config.js`
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - X-XSS-Protection
  - Content-Security-Policy (CSP)
  - Strict-Transport-Security (HSTS)
  - Permissions-Policy

**Image Processing:**
- Sharp 0.34.5 - Used by Next.js Image Optimization
  - Formats: AVIF, WebP (`next.config.js`)
  - Remote patterns: images.unsplash.com
  - Cache TTL: 31536000 seconds (1 year)

---

*Integration audit: 2026-01-08*
*Update when adding/removing external services*
