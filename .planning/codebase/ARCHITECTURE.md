# System Architecture

## Architecture Pattern

**Type**: Layered Next.js App Router with Server/Client Component Separation

### Layer Structure
```
┌─────────────────────────────────────────┐
│     Presentation Layer (React)          │
│  Server Components / Client Components  │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│   State Management Layer                │
│  TanStack Query v5 (async data)         │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│     API Layer (Next.js Routes)          │
│  Security Middleware + Validation       │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│   Data Access Layer (Prisma ORM)        │
│  PostgreSQL with Driver Adapter         │
└─────────────────────────────────────────┘
```

### Cross-Cutting Concerns
- **Security Layer**: Rate limiting, CSRF protection, input validation, sanitization
- **Utility/Infrastructure Layer**: Logging, analytics, error handling, monitoring

## Routing Architecture

### App Router Structure (Next.js 16)
```
src/app/
├── (root layout) - Fonts, metadata, providers
├── /api/ - REST API routes
├── /projects/ - Project showcase pages
├── /blog/ - Blog system
├── /contact/ - Contact form page
├── /about/ - About page
├── /resume/ - Resume pages
└── sitemap.ts, robots.ts, metadata...
```

### Route Types

**Page Routes**:
- `/` - Home (Server Component, SEO optimized)
- `/projects` - Projects list (Client Component with filtering)
- `/projects/[slug]` - Dynamic project pages (SSG)
- `/blog` - Blog listing (Client Component with pagination)
- `/blog/[slug]` - Dynamic blog posts (SSG + ISR)
- `/contact` - Contact form (Client Component)
- `/about` - About page (Server Component)
- `/resume` - Resume display (Server Component)

**API Routes**:
- `/api/contact` - POST (CSRF protected, rate limited)
- `/api/projects` - GET (ISR 1hr)
- `/api/projects/[slug]` - GET, PUT, DELETE
- `/api/projects/[slug]/interactions` - POST
- `/api/blog` - GET, POST
- `/api/blog/[slug]` - GET, PUT, DELETE
- `/api/blog/[slug]/interactions` - POST
- `/api/blog/categories` - GET, POST
- `/api/blog/tags` - GET, POST
- `/api/blog/rss` - GET (RSS feed)
- `/api/health-check` - GET

## Data Flow Patterns

### Server-Side Data Fetching
```
Static Data Sources → Prisma Database → Server Components
                   ↘               ↗
                    Project/Blog Data
```

**Generation Strategy**:
- **Static Pages**: Home, About, Resume
- **SSG**: `/projects/[slug]` (generated at build)
- **ISR**: `/blog`, `/blog/[slug]` (revalidate: 60s)
- **Dynamic Metadata**: `generateMetadata()` for SEO

### Client-Side Data Fetching (TanStack Query)
```
Component → useQuery() → Query Key Factory → fetch('/api/...')
                      ↓
                 Cache (stale: 5min, gc: 30min)
                      ↓
                 Auto-refetch (focus, reconnect)
```

**Cache Strategy**:
- Stale time: 5 minutes
- GC time: 30 minutes
- Retry: 2x on 5xx errors, no retry on 4xx
- Invalidation: Manual + automatic (focus/reconnect)

### Form Data Flow
```
Client Component (use-contact-form)
    ↓ TanStack Form + Zod validation
    ↓ CSRF token retrieval
    ↓ POST to /api/contact
API Route Handler
    ↓ Rate limit check (3 req/60s)
    ↓ CSRF validation
    ↓ Input validation (Zod)
    ↓ DB storage (Prisma)
    ↓ Email sending (Resend)
    ↓ Response with rate limit headers
Client
    ↓ Toast notification
    ↓ Error/success handling
```

## State Management Strategy

| State Type | Technology | Use Case |
|------------|-----------|----------|
| Server State | React `cache()` | Data deduplication on server |
| Client Async State | TanStack Query v5 | API data fetching/caching |
| Client UI State | React `useState()` | UI toggles, modals, filters |
| URL State | `nuqs` | Search, filters, pagination |
| Form State | TanStack Form + Zod | Contact/blog forms |
| Theme State | `next-themes` | Light/dark mode |

### Query Key Organization
Hierarchical factory pattern:
```typescript
projectKeys = {
  all: () => ['projects'],
  lists: () => [...projectKeys.all(), 'list'],
  list: (filters) => [...projectKeys.lists(), filters],
  details: () => [...projectKeys.all(), 'detail'],
  detail: (slug) => [...projectKeys.details(), slug],
  featured: () => [...projectKeys.all(), 'featured']
}
```

## Component Architecture

### Server vs Client Component Strategy

**Server Components** (default):
- Page layouts (`layout.tsx`)
- Data-fetching pages (home, projects/[slug], blog/[slug])
- Metadata generation
- Database queries
- Environment secrets access

**Client Components** (`'use client'`):
- Interactive forms (contact, filters)
- Real-time state (modals, dropdowns)
- Hooks usage (useQuery, useState, custom hooks)
- Browser APIs (localStorage, window, document)
- TanStack Query providers
- Navigation components

### Component Organization
```
Feature-Driven Structure:
src/components/
├── /ui/ - Primitive, reusable components (48+ shadcn/ui)
├── /layout/ - Layout shell components (navbar, footer)
├── /projects/ - Feature-specific components
│   ├── project-card.tsx
│   └── /shared/ - Reusable within feature
└── /seo/, /contact/, /charts/
```

## API Layer Design

### Request/Response Pattern
```typescript
1. Extract client ID for rate limiting
2. Check rate limits first
3. Validate CSRF token
4. Parse & validate body (Zod)
5. Process (DB, external services)
6. Return standardized response
```

### Security Layers (Defense in Depth)
```
Request
  → Rate Limit
  → CSRF Validation
  → Input Sanitization
  → Zod Schema Validation
  → DB/Service
  → Response
```

### Error Handling
Centralized error response building:
- ValidationError → 400
- Unauthorized → 401/403
- RateLimitError → 429
- ServerError → 500
- Logging with context (client ID, duration, status)

## Database Architecture (Prisma + PostgreSQL)

### Schema Organization

**Blog System** (9 models):
- BlogPost, Author, Category, Tag
- PostView, PostInteraction, SEOEvent, SEOKeyword, SitemapEntry

**Project Management** (1 model):
- Project (with JSON fields for metrics, charts, gallery)

**Contact Management** (1 model):
- ContactSubmission (status workflow: NEW → READ → RESPONDED → ARCHIVED)

**Security** (1 model):
- SecurityEvent (audit trail for rate limits, CSRF, attacks)

### Indexing Strategy
Multi-level indexing for query performance:
```prisma
@@index([status, publishedAt(sort: Desc)])  // Compound
@@index([status])                            // Filtered queries
@@index([authorId])                          // Relationships
@@index([viewCount(sort: Desc)])            // Popular content
```

## Performance Patterns

### Caching Strategy
```
ISR (Incremental Static Regeneration):
├── /api/projects: 1hr server, 2hr CDN
├── /blog: 60s revalidation
└── /projects/[slug], /blog/[slug]: Static by default

Query Client:
├── Stale time: 5 minutes
├── GC time: 30 minutes
└── Refetch: On window focus, reconnect

HTTP Headers:
├── Assets: Cache 1 year (immutable)
├── Dynamic content: s-maxage=60, stale-while-revalidate=86400
└── API: no-store (no caching)
```

### Image & Bundle Optimization
```
Images:
├── Formats: AVIF + WebP
├── Optimization: Next.js Image component
├── External: Unsplash (remotePatterns)
└── CSP: Sandboxed, no SVG upload

Bundle:
├── React Compiler: Automatic memoization
├── Tree-shaking: ESM modules
└── Code splitting: Dynamic imports
```

## Deployment Architecture

**Platform**: Vercel (recommended)
- Build: `bun run build`
- Runtime: Node 22.x
- Output: Standalone (Docker-ready)
- Database: PostgreSQL with connection pooling
- CDN: Vercel Edge Network

---

*Last updated: 2026-01-09*
