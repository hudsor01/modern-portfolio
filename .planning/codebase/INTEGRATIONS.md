# External Integrations

## Database Integration

### PostgreSQL
**Type**: Primary data store
**Version**: Compatible with Prisma 7.x

**Configuration**:
```
Connection: postgresql://user:pass@host:port/db?connection_limit=10&pool_timeout=20
Extensions:
  - citext (case-insensitive text queries)
  - Full-text search support
```

**Features**:
- Connection pooling (limit: 10, timeout: 20s)
- Native full-text search
- Complex schema with 18+ models
- Migrations via Prisma Migrate

**Database Models**:
- Blog system (9 models): BlogPost, Author, Category, Tag, PostView, PostInteraction, SEOEvent, SEOKeyword, SitemapEntry
- Projects (1 model): Project with JSON fields
- Contact (1 model): ContactSubmission
- Security (1 model): SecurityEvent

### Prisma ORM
**Version**: 7.2.0
**Driver**: @prisma/adapter-pg 7.2.0 (native PostgreSQL adapter)

**Configuration**:
```prisma
generator client {
  provider        = "prisma-client-js"
  output          = "./generated/prisma"
  previewFeatures = ["fullTextSearchPostgres"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Features**:
- Type-safe database queries
- Automatic migrations
- Prisma Studio GUI (`bun run db:studio`)
- Generated client at `./prisma/generated/prisma`

**Scripts**:
```bash
bun run db:generate         # Generate Prisma client
bun run db:push            # Push schema to DB
bun run db:migrate         # Run migrations (dev)
bun run db:migrate:deploy  # Deploy migrations (prod)
bun run db:seed            # Seed database
bun run db:studio          # Open Prisma Studio
```

---

## Email Service

### Resend
**Version**: 6.6.0
**Purpose**: Production email delivery

**Configuration**:
```typescript
RESEND_API_KEY=re_...
CONTACT_EMAIL=hello@richardwhudsonjr.com
```

**From Email**: `contact@richardwhudsonjr.com`

**Features**:
- Contact form notifications
- Auto-reply emails to users
- HTML & plain text templates
- Custom headers:
  - `X-Contact-Form: true`
  - `X-Auto-Reply: true`
- Rate limiting integration
- Zod schema validation

**Usage**:
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'contact@richardwhudsonjr.com',
  to: 'user@example.com',
  subject: 'Thank you for contacting us',
  html: '<p>...</p>',
  text: '...'
})
```

**Error Handling**:
- Validation errors logged
- Fallback messaging
- Rate limit integration

---

## Analytics & Monitoring

### Vercel Analytics
**Version**: @vercel/analytics 1.6.1
**Purpose**: Web performance metrics

**Features**:
- Automatic Core Web Vitals tracking:
  - LCP (Largest Contentful Paint)
  - FID (First Input Delay)
  - CLS (Cumulative Layout Shift)
  - FCP (First Contentful Paint)
  - TTFB (Time to First Byte)
- Real-user monitoring (RUM)
- Integrated into root layout

**Setup**:
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Custom Analytics Service

**Blog Analytics**:
- Post view tracking with geographic data
- Reading time and scroll depth
- Visitor identification (sessionId, visitorId, IP)
- User agent and referrer tracking
- Interaction tracking (likes, shares, comments, bookmarks)

**SEO Analytics**:
- Keyword position tracking
- Search volume and difficulty metrics
- CPC (Cost Per Click) data
- Click-through rate (CTR) tracking
- Ranking change events
- SEO event logging with severity levels

**Implementation**:
- Database-backed (PostgreSQL models)
- API endpoints for data collection
- Privacy-respecting (anonymized IPs)

---

## Content Delivery

### Unsplash
**Purpose**: External image hosting

**Configuration**:
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
      pathname: '/**',
    },
  ],
}
```

**Features**:
- High-quality project images
- Automatic optimization via Next.js Image
- AVIF & WebP format support
- 1-year cache TTL

---

## Third-Party UI Libraries

### Radix UI
**Purpose**: Accessible component primitives
**Version**: Various (1.x - 2.x)

**Components Used**:
- Avatar, Checkbox, Dialog, Dropdown Menu
- Icons, Label, Popover, Select
- Separator, Slot, Switch, Tabs, Toggle

**Features**:
- WAI-ARIA compliant
- Keyboard navigation
- Focus management
- Unstyled (customizable with Tailwind)

### Motion (Framer Motion)
**Version**: 12.24.7
**Purpose**: Animation library

**Features**:
- Declarative animations
- Gesture support
- Layout animations
- SVG animations

**Usage**:
```typescript
import { motion } from 'motion'

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

---

## Authentication & Authorization

### CSRF Protection
**Implementation**: Custom token-based system

**Features**:
- Token generation via `/api/contact/csrf-route`
- Header validation (`x-csrf-token`)
- Per-request validation
- 403 response on failure

**Usage**:
```typescript
// Client-side
const csrfToken = await fetch('/api/contact/csrf-route').then(r => r.json())

await fetch('/api/contact', {
  method: 'POST',
  headers: {
    'x-csrf-token': csrfToken.token,
  },
  body: JSON.stringify(data),
})
```

---

## SEO Integrations

### Google Search Console
**Environment Variable**: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`

**Features**:
- Site ownership verification
- Search analytics access
- Indexing status monitoring

### Sitemap Generation
**Endpoint**: `/sitemap.xml`

**Features**:
- Automatic generation via `src/app/sitemap.ts`
- Dynamic routes included (blog posts, projects)
- Priority and change frequency configured

### RSS Feed
**Endpoint**: `/api/blog/rss`

**Features**:
- XML RSS 2.0 format
- Blog post feed
- Automatic updates on new posts

---

## Development Tools Integration

### Git Hooks (Lefthook)
**Version**: 2.0.13

**Configuration**: `lefthook.yml`
```yaml
pre-commit:
  parallel: true
  commands:
    lint-staged:
      run: bunx lint-staged
      stage_fixed: true

pre-push:
  commands:
    tests:
      run: bun test
```

**Features**:
- Pre-commit linting with auto-fix
- Pre-push testing
- Faster than Husky (Go binary)
- No Node.js dependency

---

## CI/CD Integration

### Vercel (Recommended Platform)
**Build Command**: `bun run build`
**Install Command**: `bun install`
**Node Version**: 22.x

**Features**:
- Automatic deployments on push
- Preview deployments for PRs
- Environment variable management
- Edge network CDN
- Serverless functions

**Environment Variables Required**:
```
DATABASE_URL
RESEND_API_KEY
CONTACT_EMAIL
JWT_SECRET
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION (optional)
```

---

## Security Integrations

### Rate Limiting
**Implementation**: Custom in-memory rate limiter

**Features**:
- Memory-based with smart eviction
- Adaptive thresholds based on global load
- Progressive penalties (exponential backoff)
- Suspicious activity detection
- Whitelist/blacklist support
- Per-client identification (IP + User-Agent hash)

**Configurations**:
- Contact form: 3 attempts/hour, 5-min base block
- API endpoints: 100 attempts/15 minutes
- Authentication: 5 attempts/15 minutes

### HTML Sanitization
**Library**: DOMPurify 3.3.1 + isomorphic-dompurify 2.35.0

**Features**:
- XSS prevention
- Custom allowed tags configuration
- Server-side compatible (isomorphic)
- Dual-layer protection (escape + sanitize)

---

## Environment Configuration

### Required Environment Variables
```bash
# Database
DATABASE_URL="postgresql://..."

# Email Service
RESEND_API_KEY="re_..."
CONTACT_EMAIL="hello@richardwhudsonjr.com"

# Security
JWT_SECRET="min-32-chars"

# Application
NODE_ENV="production"
NEXT_PUBLIC_SITE_URL="https://richardwhudsonjr.com"

# Optional
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=""
```

### Environment Validation
**File**: `src/lib/security/env-validation.ts`

**Features**:
- Automatic validation at module load
- PostgreSQL URL format checking
- Development vs. production logging levels
- Conditional file logging support

---

*Last updated: 2026-01-09*
