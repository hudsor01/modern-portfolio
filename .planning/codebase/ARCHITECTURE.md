# Architecture

**Analysis Date:** 2026-01-08

## Pattern Overview

**Overall:** Layered Monolithic Next.js Application with N-Tier Architecture

**Key Characteristics:**
- Server-rendered Next.js 16 portfolio site with App Router
- Clear separation of concerns across presentation, API, service, and data layers
- PostgreSQL backend for blog, projects, and contact submissions
- Security-hardened with custom rate limiting, CSRF protection, and input validation
- No authentication system (public-facing portfolio)

## Layers

**Presentation Layer:**
- Purpose: Page rendering and UI components
- Contains: React Server Components, Client Components, layouts
- Location: `src/app/[route]/page.tsx`, `src/components/`
- Depends on: API routes (client-side), Data Access Layer (server-side)
- Used by: End users via browser

**API Layer:**
- Purpose: REST API endpoints for CRUD operations
- Contains: Route handlers with rate limiting, validation, error handling
- Location: `src/app/api/*/route.ts`
- Depends on: Service layer (DAL, email), security middleware
- Used by: Frontend components (via TanStack Query), external clients

**Service/Business Logic Layer:**
- Purpose: Business logic, data transformation, external service integration
- Contains: Data Access Layer (DAL), email service, validation, server actions
- Location: `src/lib/dal/`, `src/lib/email/`, `src/lib/actions/`, `src/lib/validations/`
- Depends on: Data layer (Prisma), external APIs (Resend)
- Used by: API routes, Server Components

**Data Layer:**
- Purpose: Database persistence and queries
- Contains: Prisma client, schema, migrations
- Location: `src/lib/db.ts`, `prisma/schema.prisma`, `prisma/migrations/`
- Depends on: PostgreSQL database
- Used by: Service layer (DAL)

**Security Layer (Cross-cutting):**
- Purpose: Rate limiting, CSRF protection, input sanitization
- Contains: Rate limiter, CSRF validator, security event logger, headers
- Location: `src/lib/security/`
- Depends on: Database (for event logging)
- Used by: API routes

**Utility Layer:**
- Purpose: Shared helpers, configuration, logging, analytics
- Contains: Logger, config management, query key factory, API utilities
- Location: `src/lib/monitoring/`, `src/lib/config/`, `src/lib/analytics/`, `src/lib/api/utils.ts`
- Depends on: Nothing (pure utilities)
- Used by: All other layers

## Data Flow

**HTTP Request Lifecycle (Contact Form Example):**

1. User submits POST /api/contact
2. Rate Limiting checked (`src/lib/security/rate-limiter.ts`)
3. CSRF Token validated (`src/lib/security/csrf-protection.ts`)
4. Request body parsed and validated with Zod (`src/lib/validations/unified-schemas.ts`)
5. ContactSubmission created in database (`src/lib/db.ts` → Prisma)
6. Email sent via Resend (`src/lib/email/email-service.ts`)
7. ContactSubmission updated with email status
8. Response formatted and returned (`src/lib/api/utils.ts` → createApiSuccess)

**Blog Post Query Lifecycle (GET /api/blog):**

1. User requests GET /api/blog?page=1&limit=10
2. Rate Limiting checked (100 requests/min limit)
3. Query parameters parsed (page, limit, filters, sort)
4. Prisma query built (buildWhereClause, buildOrderBy)
5. Database queried with parallel Promise.all (posts + count)
6. Data transformed to API format (transformToBlogPostData)
7. Response with pagination metadata returned
8. ISR caching applied (s-maxage=300 for CDN)

**State Management:**
- No in-memory state (stateless API)
- Database-driven (Prisma as single source of truth)
- Client state via TanStack Query (caching, revalidation)
- URL state via nuqs for filters/tabs

## Key Abstractions

**Data Access Layer (DAL):**
- Purpose: Centralized data fetching with React cache()
- Examples: `getBlogPosts()`, `getProject()`
- Pattern: Wrapper around Prisma with caching
- Location: `src/lib/dal/index.ts`

**Validation Schemas (Zod):**
- Purpose: Single source of truth for validation
- Examples: `contactFormSchema`, `emailSchema`, `blogPostSchema`
- Pattern: Zod schemas with TypeScript type inference
- Location: `src/lib/validations/unified-schemas.ts`

**API Error Handling:**
- Purpose: Consistent error responses and logging
- Functions: `handleApiError()`, `createApiError()`, `createApiSuccess()`
- Pattern: Centralized error formatting
- Location: `src/lib/api/utils.ts`

**Security Middleware:**
- Purpose: Defense in depth (rate limiting, CSRF, sanitization)
- Components: EnhancedRateLimiter, validateCSRFToken, DOMPurify
- Pattern: Applied at route level before business logic
- Location: `src/lib/security/`

**Query Key Factory:**
- Purpose: Centralized TanStack Query key management
- Examples: `projectKeys.all()`, `projectKeys.detail(slug)`, `blogKeys.list(filters)`
- Pattern: Hierarchical key structure for cache invalidation
- Location: `src/lib/queryKeys.ts`

**Server Actions:**
- Purpose: Form submission handling with 'use server'
- Example: `contactFormAction`
- Pattern: Validates input, calls services, returns typed response
- Location: `src/lib/actions/contact-form-action.ts`

## Entry Points

**Application Entry:**
- Location: `src/app/layout.tsx`
- Triggers: Next.js server startup
- Responsibilities: Root layout, providers setup, metadata

**API Entry:**
- Location: `src/app/api/*/route.ts`
- Triggers: HTTP requests
- Responsibilities: Route handling, validation, response formatting

**Database Entry:**
- Location: `src/lib/db.ts`
- Triggers: Module import
- Responsibilities: Prisma client initialization, connection pooling

## Error Handling

**Strategy:** Throw exceptions, catch at boundaries (route handlers, Server Components)

**Patterns:**
- API routes: try/catch at route level, log error, return formatted response
- Validation errors: Zod parse errors caught and formatted as 400 responses
- Database errors: Prisma errors caught and logged with context
- Email errors: Resend failures caught, logged, submission updated with error status

**Error Types:**
- ValidationError (400) - Invalid input
- RateLimitError (429) - Too many requests
- CSRFError (403) - Invalid CSRF token
- DatabaseError (500) - Prisma query failures
- EmailError (500) - Resend API failures

## Cross-Cutting Concerns

**Logging:**
- Structured JSON logging via `src/lib/monitoring/logger.ts`
- Context-aware logging with request metadata
- Log levels: debug, info, warn, error
- Development: Pretty-printed console logs
- Production: JSON logs for aggregation

**Validation:**
- Zod schemas as single source of truth
- Applied at: API routes, server actions, frontend forms
- Type-safe: TypeScript types inferred from schemas

**Security:**
- Rate limiting with progressive penalties
- CSRF token validation on state-changing requests
- HTML sanitization for user-generated content
- Security headers (CSP, HSTS, X-Frame-Options, etc.)
- Security event logging to database

---

*Architecture analysis: 2026-01-08*
*Update when major patterns change*
