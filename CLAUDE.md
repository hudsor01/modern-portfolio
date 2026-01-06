# CLAUDE.md - Project Bible

This is the authoritative guide for the modern-portfolio codebase. All development decisions should align with this document.

---

## Quick Reference

### Top 10 Commands
```bash
bun dev                    # Start development server
bun run build              # Production build
bun test                   # Run unit tests
bun run e2e                # Run Playwright E2E tests
bun run type-check         # TypeScript checking
bun run lint               # ESLint check
bun run db:studio          # Open Prisma Studio
bun run db:migrate         # Create/apply migrations
bun run validate           # Type-check + lint (parallel)
bun run ci:full            # Full CI pipeline
```

### Environment Setup
```bash
# 1. Install dependencies
bun install

# 2. Set up environment variables (copy .env.example to .env)
# Required: DATABASE_URL, RESEND_API_KEY, JWT_SECRET, CONTACT_EMAIL

# 3. Generate Prisma client
bun run db:generate

# 4. Push schema to database
bun run db:push

# 5. Seed database (optional)
bun run db:seed

# 6. Start development
bun dev
```

### Key File Locations
| Purpose | Location |
|---------|----------|
| API Routes | `src/app/api/` |
| Zod Schemas | `src/lib/validations/unified-schemas.ts` |
| Query Keys | `src/lib/queryKeys.ts` |
| Rate Limiter | `src/lib/security/rate-limiter.ts` |
| Design Tokens | `src/lib/design-system/tokens.ts` |
| Database Schema | `prisma/schema.prisma` |
| Test Factories | `src/test/factories.ts` |
| Custom Hooks | `src/hooks/` |

---

## Tech Stack

### Runtime & Package Management
| Tool | Version | Purpose |
|------|---------|---------|
| **Bun** | 1.3.5 | Runtime and package manager |
| **Node.js** | >=22.0.0 | Runtime compatibility |

### Framework & UI
| Package | Version | Purpose |
|---------|---------|---------|
| **Next.js** | 16.1.1 | React framework with App Router |
| **React** | 19.2.3 | UI framework |
| **TypeScript** | 5.9.3 | Type safety (strict mode) |
| **Motion** | 12.24.0 | Animation library |

### Database & ORM
| Package | Version | Purpose |
|---------|---------|---------|
| **Prisma** | 7.2.0 | ORM with Bun runtime support |
| **PostgreSQL** | - | Primary database |
| **pg** | 8.16.3 | PostgreSQL driver |

### State Management
| Package | Version | Purpose |
|---------|---------|---------|
| **TanStack Query** | 5.90.16 | Server state & caching |
| **TanStack Form** | 1.27.7 | Form state management |
| **TanStack Table** | 8.21.3 | Data tables |

### Styling
| Package | Version | Purpose |
|---------|---------|---------|
| **Tailwind CSS** | 4.1.18 | Utility-first CSS |
| **CVA** | 0.7.1 | Component variants |
| **Tailwind Merge** | 3.4.0 | Class conflict resolution |
| **Radix UI** | Various | Accessible primitives |

### Validation & Security
| Package | Version | Purpose |
|---------|---------|---------|
| **Zod** | 4.3.4 | Schema validation |
| **DOMPurify** | 3.3.1 | HTML sanitization |
| **LRU Cache** | 11.2.4 | In-memory caching |

### Testing
| Package | Version | Purpose |
|---------|---------|---------|
| **Bun Test** | Built-in | Unit tests (Vitest-compatible) |
| **Playwright** | 1.57.0 | E2E testing |
| **Testing Library** | 16.3.1 | React component testing |

### Email & Analytics
| Package | Version | Purpose |
|---------|---------|---------|
| **Resend** | 6.6.0 | Transactional email |
| **Vercel Analytics** | 1.6.1 | Web analytics |
| **Recharts** | 3.6.0 | Data visualization |

---

## Project Architecture

### Directory Structure
```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # REST API routes
│   │   ├── blog/                 # Blog CRUD + interactions
│   │   ├── contact/              # Contact form submission
│   │   ├── projects/             # Projects listing + interactions
│   │   └── health-check/         # Health endpoint
│   ├── about/                    # About page
│   ├── blog/                     # Blog pages
│   │   └── [slug]/               # Dynamic blog posts
│   ├── contact/                  # Contact form
│   ├── projects/                 # Project showcase
│   │   └── [slug]/               # Dynamic project pages
│   ├── resume/                   # Resume/PDF viewer
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   ├── error.tsx                 # Error boundary
│   ├── not-found.tsx             # 404 page
│   ├── robots.ts                 # SEO robots config
│   └── sitemap.ts                # Dynamic sitemap
│
├── components/
│   ├── ui/                       # shadcn/ui base components (80+)
│   ├── layout/                   # Header, footer, navbar
│   ├── navigation/               # Breadcrumbs, tabs
│   ├── projects/                 # Project showcase components
│   ├── contact/                  # Contact form components
│   ├── about/                    # Skills, certifications
│   ├── charts/                   # Recharts visualizations
│   ├── providers/                # React context providers
│   ├── seo/                      # JSON-LD, metadata
│   └── error/                    # Error boundaries
│
├── lib/
│   ├── security/                 # Rate limiting, CSRF, sanitization
│   │   ├── rate-limiter.ts       # Enhanced rate limiter
│   │   ├── sanitize.ts           # HTML sanitization levels
│   │   ├── csrf-protection.ts    # CSRF token handling
│   │   └── html-escape.ts        # XSS prevention
│   ├── validations/              # Zod schemas
│   │   └── unified-schemas.ts    # All validation schemas
│   ├── api/                      # API utilities
│   │   └── response.ts           # Response helpers
│   ├── design-system/            # Design tokens
│   │   └── tokens.ts             # Colors, spacing, typography
│   ├── monitoring/               # Logging infrastructure
│   │   └── logger.ts             # Production logger
│   ├── analytics/                # Web vitals, metrics
│   ├── email/                    # Resend integration
│   ├── server/                   # Server-only utilities
│   ├── actions/                  # Server actions
│   ├── database/                 # Database utilities
│   ├── utils/                    # Shared utilities
│   ├── queryKeys.ts              # Query key factories
│   ├── prisma.ts                 # Prisma client singleton
│   └── prisma-types.ts           # Enum exports
│
├── hooks/                        # Custom React hooks
│   ├── use-contact-form.ts       # Contact form logic
│   ├── use-api-queries.ts        # TanStack Query hooks
│   ├── use-debounce.ts           # Debounced values
│   ├── use-media-query.ts        # Responsive queries
│   └── use-local-storage.ts      # Persistent state
│
├── types/                        # TypeScript definitions
│   ├── project.ts                # Project types
│   ├── blog.ts                   # Blog types
│   └── shared-api.ts             # Shared API types
│
└── test/                         # Test utilities
    ├── setup.tsx                 # Test setup
    └── factories.ts              # Test data factories
```

### Data Flow Pattern
```
User Input
    │
    ▼
┌─────────────────┐
│  Zod Validation │  (src/lib/validations/)
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  Rate Limiting  │  (src/lib/security/rate-limiter.ts)
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  API Route      │  (src/app/api/)
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  Prisma ORM     │  (prisma/schema.prisma)
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  PostgreSQL     │
└─────────────────┘
```

### Rendering Strategy Map

**Cost Optimization**: Prefer Client Components to minimize Vercel function invocations.

| Route | Strategy | Revalidation | Cost Impact |
|-------|----------|--------------|-------------|
| `/` | Static | Build only | Free (CDN) |
| `/about` | Static | Build only | Free (CDN) |
| `/projects` | Client | - | Free (browser) |
| `/projects/[slug]` | ISR | 3600s | Low (1 invocation/hour) |
| `/blog` | Client | - | Free (browser) |
| `/blog/[slug]` | ISR | 3600s | Low (1 invocation/hour) |
| `/contact` | Client | - | Free (browser) |
| `/resume` | Client | - | Free (browser) |

**Rule**: Use `'use client'` + TanStack Query for data fetching. Reserve Server Components for SEO-critical pages with ISR.

---

## Commands Reference

### Development
```bash
bun dev                    # Start Next.js dev server
bun run build              # Production build
bun start                  # Run production server
bun run dev:debug          # Dev with Bun inspector
```

### Testing
```bash
bun test                   # Run unit tests
bun run test:watch         # Watch mode
bun run test:coverage      # Coverage report (80% threshold)
bun run e2e                # Playwright E2E tests
bun run e2e:ui             # E2E with UI mode
bun run e2e:headed         # E2E in headed browser
```

### Database
```bash
bun run db:generate        # Generate Prisma client
bun run db:push            # Push schema to database
bun run db:migrate         # Create/apply migrations
bun run db:migrate:deploy  # Deploy migrations (production)
bun run db:migrate:reset   # Reset database + migrations
bun run db:seed            # Seed database
bun run db:studio          # Open Prisma Studio GUI
```

### Code Quality
```bash
bun run lint               # ESLint check
bun run lint:fix           # ESLint with auto-fix
bun run type-check         # TypeScript checking
bun run validate           # Type-check + lint (parallel)
```

### CI/CD
```bash
bun run ci:quick           # Lint + type-check (parallel)
bun run ci:local           # Lint + type-check + tests (parallel)
bun run ci:full            # ci:quick + build
```

---

## API Routes Documentation

### Projects API

#### `GET /api/projects`
List all projects with filtering and sorting.

**Rate Limit**: 100 requests/15min (burst: 20 req/5s)

**Query Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category |
| `featured` | boolean | Filter featured projects |
| `search` | string | Search title/description |

**Response**:
```typescript
{
  success: boolean
  data: Project[]
  pagination?: { page, limit, total, totalPages }
}
```

#### `GET /api/projects/[slug]`
Get single project by slug.

#### `POST /api/projects/[slug]/interactions`
Track project interactions (views, likes, shares).

**Body**:
```typescript
{
  type: 'LIKE' | 'SHARE' | 'BOOKMARK' | 'DOWNLOAD'
  value?: string
  metadata?: Record<string, unknown>
}
```

---

### Blog API

#### `GET /api/blog`
List blog posts with filtering, sorting, and pagination.

**Rate Limit**: 100 requests/15min

**Query Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (max: 100, default: 10) |
| `status` | PostStatus | Filter by status |
| `authorId` | string | Filter by author |
| `categoryId` | string | Filter by category |
| `tagIds` | string[] | Filter by tags |
| `search` | string | Full-text search |
| `sortField` | string | Sort field |
| `sortOrder` | 'asc' \| 'desc' | Sort direction |

**Response**:
```typescript
{
  success: boolean
  data: BlogPost[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
```

#### `POST /api/blog`
Create new blog post.

**Rate Limit**: 10 posts/hour (progressive penalty)

**Requires**: CSRF token validation

**Body**: See `blogPostCreateSchema` in unified-schemas.ts

#### `GET /api/blog/[slug]`
Get single blog post with author, category, and tags.

#### `POST /api/blog/[slug]/interactions`
Track blog interactions.

---

### Contact API

#### `POST /api/contact`
Submit contact form.

**Rate Limit**: 3 requests/hour (progressive penalty, 5min base block)

**Burst Protection**: 2 requests/10s max

**Requires**: CSRF token validation, honeypot check

**Body**:
```typescript
{
  name: string      // 2-50 chars
  email: string     // Valid email
  company?: string  // Max 100 chars
  phone?: string    // Valid phone format
  message: string   // 10-1000 chars
  honeypot?: string // Must be empty (bot detection)
}
```

**Response Headers**:
```
X-RateLimit-Remaining: number
X-RateLimit-Reset: timestamp
Retry-After: seconds (if blocked)
```

---

### Rate Limiting Configurations

| Endpoint | Window | Max Attempts | Burst Protection | Penalty |
|----------|--------|--------------|------------------|---------|
| Contact Form | 1 hour | 3 | 2 req/10s | 5min base, exponential |
| API Endpoints | 15 min | 100 | 20 req/5s | None |
| Auth | 15 min | 5 | 3 req/30s | 10min base, exponential |
| File Upload | 1 hour | 10 | 3 req/1min | 5min base, exponential |

---

## Security Implementation

### Rate Limiter (`src/lib/security/rate-limiter.ts`)

**Features**:
- Progressive penalty with exponential backoff
- Burst protection for rapid successive requests
- Adaptive thresholds based on global load and client risk
- Suspicious behavior detection (bot patterns, user agent analysis)
- Request history tracking for pattern analysis
- Whitelist/blacklist management

**Usage**:
```typescript
import {
  checkEnhancedContactFormRateLimit,
  checkEnhancedApiRateLimit,
  getClientIdentifier
} from '@/lib/security/rate-limiter'

// In API route
const clientId = getClientIdentifier(request)
const result = checkEnhancedContactFormRateLimit(clientId, {
  userAgent: request.headers.get('user-agent'),
  path: '/api/contact'
})

if (!result.allowed) {
  return Response.json(
    { error: result.reason },
    {
      status: 429,
      headers: { 'Retry-After': String(result.retryAfter) }
    }
  )
}
```

### HTML Sanitization Levels (`src/lib/security/sanitize.ts`)

| Level | Function | Use Case |
|-------|----------|----------|
| Rich | `sanitizeBlogContent()` | CMS content (tables, images, code) |
| Strict | `sanitizeUserContent()` | User input (basic formatting only) |
| Strip | `stripHtml()` | Pure text output |
| URL | `sanitizeUrl()` | Prevent protocol attacks |

### CSRF Protection
```typescript
// Generate token (server action)
import { generateCsrfToken } from '@/lib/security/csrf-protection'

// Validate in API route
import { validateCsrfToken } from '@/lib/security/csrf-protection'
const csrfToken = request.headers.get('x-csrf-token')
if (!validateCsrfToken(csrfToken)) {
  return Response.json({ error: 'Invalid CSRF token' }, { status: 403 })
}
```

---

## Database Schema

### Core Models

#### BlogPost
```prisma
model BlogPost {
  id              String        @id @default(cuid())
  title           String
  slug            String        @unique
  excerpt         String?       @db.Text
  content         String        @db.Text
  contentType     ContentType   @default(MARKDOWN)
  status          PostStatus    @default(DRAFT)

  // SEO
  metaTitle       String?
  metaDescription String?       @db.VarChar(160)
  keywords        String[]
  canonicalUrl    String?

  // Social Media
  ogTitle         String?
  ogDescription   String?       @db.VarChar(300)
  ogImage         String?

  // Metrics
  viewCount       Int           @default(0)
  likeCount       Int           @default(0)
  shareCount      Int           @default(0)

  // Timestamps
  publishedAt     DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  // Relations
  author          Author        @relation(fields: [authorId], references: [id])
  category        Category?     @relation(fields: [categoryId], references: [id])
  tags            PostTag[]
  versions        PostVersion[]
  views           PostView[]
  interactions    PostInteraction[]
}
```

#### Project
```prisma
model Project {
  id              String    @id @default(cuid())
  slug            String    @unique
  title           String
  description     String    @db.Text
  longDescription String?   @db.Text
  content         String?   @db.Text
  image           String
  link            String?
  github          String?
  category        String
  tags            String[]
  featured        Boolean   @default(false)

  // Rich JSON Fields
  impact          Json?     // string[]
  results         Json?     // Array<{metric, before, after, improvement}>
  displayMetrics  Json?     // Array<{label, value, iconName}>
  testimonial     Json?     // {quote, author, role, company}
  gallery         Json?     // Array<{url, alt, caption}>

  // Analytics
  viewCount       Int       @default(0)
  clickCount      Int       @default(0)

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

#### ContactSubmission
```prisma
model ContactSubmission {
  id          String           @id @default(cuid())
  name        String
  email       String
  company     String?
  phone       String?
  subject     String?
  message     String           @db.Text
  status      SubmissionStatus @default(NEW)
  responded   Boolean          @default(false)
  emailSent   Boolean          @default(false)
  emailId     String?          // Resend email ID
  createdAt   DateTime         @default(now())
}
```

### Enums Reference

```typescript
enum PostStatus {
  DRAFT      // Work in progress
  REVIEW     // Under review
  SCHEDULED  // Scheduled for publishing
  PUBLISHED  // Live
  ARCHIVED   // Hidden but preserved
  DELETED    // Soft deleted
}

enum ContentType {
  MARKDOWN
  HTML
  RICH_TEXT
}

enum InteractionType {
  LIKE
  SHARE
  COMMENT
  BOOKMARK
  SUBSCRIBE
  DOWNLOAD
}

enum SubmissionStatus {
  NEW
  READ
  IN_PROGRESS
  RESPONDED
  ARCHIVED
  SPAM
}

enum SecurityEventType {
  RATE_LIMIT_EXCEEDED
  CSRF_VALIDATION_FAILED
  INVALID_INPUT
  SUSPICIOUS_ACTIVITY
  BOT_DETECTED
  BRUTE_FORCE_ATTEMPT
  BLOCKED_REQUEST
}
```

### Relationships
```
Author ─────────< BlogPost
                     │
Category ───────────<│
                     │
Tag ─────< PostTag >─┘
                     │
BlogPost ───────< PostView
           │
           └────< PostInteraction
           │
           └────< PostVersion
```

---

## Query Management

### Query Key Hierarchy
```typescript
// src/lib/queryKeys.ts

// Projects
projectKeys.all()           // ['projects']
projectKeys.lists()         // ['projects', 'list']
projectKeys.list(filters)   // ['projects', 'list', filters]
projectKeys.details()       // ['projects', 'detail']
projectKeys.detail(slug)    // ['projects', 'detail', slug]
projectKeys.featured()      // ['projects', 'featured']

// Blog
blogKeys.all()              // ['blog']
blogKeys.posts()            // ['blog', 'posts']
blogKeys.post(slug)         // ['blog', 'posts', slug]
blogKeys.postsList(f, s)    // ['blog', 'posts', 'list', filters, sort]
blogKeys.categories()       // ['blog', 'categories']
blogKeys.tags()             // ['blog', 'tags']
blogKeys.analytics()        // ['blog', 'analytics']

// Analytics
analyticsKeys.all()         // ['analytics']
analyticsKeys.projects()    // ['analytics', 'projects']
analyticsKeys.project(slug) // ['analytics', 'projects', slug]
```

### Cache Invalidation
```typescript
import { cacheInvalidation } from '@/lib/queryKeys'

// Invalidate all projects
cacheInvalidation.invalidateAllProjects(queryClient)

// Invalidate specific project
cacheInvalidation.invalidateProject(queryClient, 'project-slug')

// Invalidate project lists only
cacheInvalidation.invalidateProjectLists(queryClient)

// Blog invalidation
cacheInvalidation.invalidateAllBlog(queryClient)
cacheInvalidation.invalidateBlogPost(queryClient, 'post-slug')
cacheInvalidation.invalidateBlogCategories(queryClient)
```

### TanStack Query Configuration
```typescript
// src/components/providers/tanstack-query-provider.tsx

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      gcTime: 30 * 60 * 1000,        // 30 minutes (cache time)
      retry: 2,                       // Retry failed requests
      refetchOnWindowFocus: false,    // Don't refetch on focus
      refetchOnReconnect: true,       // Refetch on reconnect
    },
  },
})
```

---

## Validation Schemas

### Base Schemas (`src/lib/validations/unified-schemas.ts`)

```typescript
// Primitives
emailSchema        // Valid email, max 254 chars
urlSchema          // Valid URL, max 2048 chars
slugSchema         // Lowercase, alphanumeric + hyphens
cuidSchema         // CUID format validation
phoneSchema        // International phone (10-15 digits)
colorSchema        // Hex color (#RGB or #RRGGBB)
metaDescriptionSchema  // Max 160 chars (SEO standard)
keywordsSchema     // Max 10 keywords, 50 chars each
dateSchema         // YYYY-MM-DD or Date object
datetimeSchema     // ISO datetime string
```

### Domain Schemas

```typescript
// Contact Form
contactFormSchema = z.object({
  name: z.string().min(2).max(50),
  email: emailSchema,
  company: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  message: z.string().min(10).max(1000),
  honeypot: z.string().optional(), // Must be empty
})

// Pagination
paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
})

// Blog Filters
blogPostFilterSchema = z.object({
  status: PostStatusSchema.optional(),
  authorId: cuidSchema.optional(),
  categoryId: cuidSchema.optional(),
  tagIds: z.array(cuidSchema).optional(),
  search: z.string().max(200).optional(),
  dateRange: z.object({ from: z.date(), to: z.date() }).optional(),
})
```

### Validation Utilities

```typescript
// Throws ValidationError on failure
const data = validate(contactFormSchema, input)

// Returns { success, data } or { success, error }
const result = safeValidate(contactFormSchema, input)

// Convert Zod errors to field-keyed object
const error = ValidationError.fromZodError(zodError)
// { details: { name: ['Too short'], email: ['Invalid'] } }
```

---

## Form Handling

### TanStack Form Pattern
```typescript
// src/hooks/use-contact-form.ts

import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { contactFormSchema } from '@/lib/validations/unified-schemas'

export function useContactForm() {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      company: '',
      phone: '',
      message: '',
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: contactFormSchema,
    },
    onSubmit: async ({ value }) => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(value),
      })
      // Handle response
    },
  })

  return { form }
}
```

### Form Field Component Pattern
```tsx
<form.Field
  name="email"
  children={(field) => (
    <div>
      <Label htmlFor={field.name}>Email</Label>
      <Input
        id={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
      {field.state.meta.errors.length > 0 && (
        <p className="text-red-500">{field.state.meta.errors[0]}</p>
      )}
    </div>
  )}
/>
```

---

## Design System

### Design Tokens (`src/lib/design-system/tokens.ts`)

**Colors**:
- `primary`, `secondary`, `accent`, `muted`
- `destructive`, `success`, `warning`
- `background`, `foreground`, `card`, `border`

**Spacing**: `xs` (4px), `sm` (8px), `md` (16px), `lg` (24px), `xl` (32px), `2xl` (48px)

**Typography**:
- Fonts: `sans` (Spline Sans), `mono` (Roboto Mono), `display` (Playfair Display)
- Sizes: `xs` to `7xl`
- Weights: `regular` (400) to `extrabold` (800)

**Animation**:
- Durations: `fast` (150ms), `normal` (300ms), `slow` (500ms)
- Easings: `linear`, `in`, `out`, `in-out`, `bounce`, `spring`

### Glassmorphism Pattern
```css
/* Container style */
.glass-container {
  @apply bg-white/5 backdrop-blur border border-white/10 rounded-3xl;
}

/* Card style */
.glass-card {
  @apply bg-white/5 backdrop-blur border border-white/10 rounded-2xl;
}
```

### CTA Button Pattern
```tsx
<Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
  Get Started
</Button>
```

---

## Coding Standards

### Principles (Mandatory)

#### YAGNI (You Aren't Gonna Need It)
- **Do not implement features that are not immediately required**
- No speculative coding, no "just in case" implementations
- Remove dead code immediately - don't comment it out

#### Composition Over Inheritance
- Build components using composition, not inheritance
- Use hooks for shared behavior, not base classes
- Prefer flat component structures

#### Type Safety (Non-Negotiable)
```typescript
// WRONG: Never use 'any'
const data: any = response.json()

// CORRECT: Type everything explicitly
interface ProjectData {
  id: string
  title: string
  slug: string
}
const data: ProjectData = await response.json()

// CORRECT: Validate at boundaries with Zod
const validated = projectSchema.parse(data)
```

#### Module Size Limits
- **Maximum component size**: 300 lines (split larger components)
- **Maximum function size**: 50 lines (extract helper functions)
- **One file = one export = one purpose**

#### Error Handling
```typescript
// WRONG: Empty catch block
try {
  await submitForm()
} catch {}

// CORRECT: Handle errors explicitly
try {
  await submitForm()
} catch (error) {
  logger.error('Form submission failed', { error, formData })
  throw error
}
```

### shadcn/ui Patterns

#### DO: Use base components directly
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{project.description}</p>
        <Button variant="outline">View Project</Button>
      </CardContent>
    </Card>
  )
}
```

#### DON'T: Create wrapper abstractions
```tsx
// WRONG: Don't create wrappers
function MyCustomCard({ children }) {
  return <Card className="custom-styles">{children}</Card>
}

// CORRECT: Use CVA for variants
const cardVariants = cva('base-styles', {
  variants: {
    variant: {
      default: 'bg-white',
      elevated: 'bg-white shadow-lg',
      glass: 'bg-white/5 backdrop-blur',
    },
  },
})
```

### Client Components (Preferred for Cost Optimization)

**Why Client Components?** Vercel charges per Server Component invocation. Use Client Components with TanStack Query to fetch data client-side and avoid per-request costs.

```tsx
// PREFERRED: Client Component with TanStack Query
'use client'
import { useQuery } from '@tanstack/react-query'
import { projectKeys } from '@/lib/queryKeys'

function ProjectsPage() {
  const { data, isLoading } = useQuery({
    queryKey: projectKeys.list(),
    queryFn: () => fetch('/api/projects').then(res => res.json()),
  })

  if (isLoading) return <Skeleton />
  return <ProjectGrid projects={data} />
}
```

**When to use Server Components:**
- SEO-critical pages (blog posts, landing pages) - use ISR to limit costs
- Truly static content that never changes
- Initial page shell (layout.tsx)

```tsx
// Server Component with ISR (cost-effective for SEO)
// Only runs once per revalidation period, not per request
export const revalidate = 3600 // 1 hour

async function BlogPost({ slug }: { slug: string }) {
  const post = await prisma.blogPost.findUnique({ where: { slug } })
  return <article>{post?.content}</article>
}
```

### ISR Caching Pattern
```typescript
// src/app/blog/[slug]/page.tsx

export const revalidate = 3600 // Revalidate every hour

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
  })
  return posts.map(({ slug }) => ({ slug }))
}
```

---

## Testing Strategy

### Unit Tests (Bun Test)

**Location**: `src/**/__tests__/*.test.ts(x)`

**Coverage Target**: 80% (enforced)

**Run**: `bun test` or `bun run test:coverage`

**Pattern**:
```typescript
import { describe, it, expect, beforeEach } from 'bun:test'
import { createTestFactory } from '@/test/factories'

describe('ContactForm', () => {
  const factory = createTestFactory()

  beforeEach(() => {
    factory.reset()
  })

  it('validates email format', () => {
    const result = contactFormSchema.safeParse({
      name: 'Test',
      email: 'invalid-email',
      message: 'Hello world test message',
    })
    expect(result.success).toBe(false)
  })
})
```

### E2E Tests (Playwright)

**Location**: `e2e/*.spec.ts`

**Run**: `bun run e2e`

**Pattern**:
```typescript
import { test, expect } from '@playwright/test'

test('contact form submission', async ({ page }) => {
  await page.goto('/contact')
  await page.fill('input[name="name"]', 'Test User')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('textarea[name="message"]', 'Test message content')
  await page.click('button[type="submit"]')
  await expect(page.locator('.success-message')).toBeVisible()
})
```

### Test Factories (`src/test/factories.ts`)

Use factories for consistent test data across unit and E2E tests.

---

## Key Features

### Portfolio Projects (11+)
- Revenue KPI Dashboard
- Commission Optimization
- Deal Funnel Analytics
- Customer Lifetime Value
- Partner Performance
- Lead Attribution
- Multi-Channel Attribution
- Revenue Operations Center
- Quota & Territory Management
- Sales Enablement
- Churn & Retention

### Blog System
- Full CRUD with versioning
- Categories and tags
- SEO optimization (meta, OG, Twitter)
- Reading time estimation
- View and interaction tracking
- RSS feed generation

### Contact Form
- Real-time validation (TanStack Form + Zod)
- CSRF protection
- Rate limiting (3/hour)
- Honeypot bot detection
- Resend email integration
- Auto-reply to submitter

### Resume Viewer
- PDF iframe display
- Download functionality
- Section navigation

### SEO Implementation
- Dynamic sitemap generation
- Robots.txt configuration
- JSON-LD structured data (Person, Website, Organization)
- Open Graph tags
- Twitter Card tags

---

## Environment Variables

### Required
```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# Email
RESEND_API_KEY="re_xxxxxxxxxxxx"
CONTACT_EMAIL="your@email.com"

# Security
JWT_SECRET="your-32-character-minimum-secret"
```

### Optional
```bash
# Site
NEXT_PUBLIC_SITE_URL="https://richardwhudsonjr.com"
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="verification-code"

# Analytics (auto-detected on Vercel)
VERCEL_ANALYTICS_ID="xxxxx"
```

---

## Business Context

**Professional portfolio for Richard Hudson**, Revenue Operations Professional:
- Interactive data visualization projects showcasing RevOps expertise
- Real business metrics: $4.8M+ revenue, 432% growth, 2,217% network expansion
- Certifications: SalesLoft Admin, HubSpot Revenue Operations
- Modern glassmorphism UI with gradient backgrounds
- Mobile-responsive design with Tailwind CSS

---

## Official Best Practices (From Authoritative Sources)

These patterns are sourced directly from official documentation for each technology in our stack.

### Next.js 16 Patterns (Source: vercel/next.js)

#### ISR with Revalidation
```typescript
// Time-based revalidation - page regenerates every hour
interface Post {
  id: string
  title: string
  content: string
}

export const revalidate = 3600 // Revalidate every hour

export default async function Page() {
  const data = await fetch('https://api.example.com/posts')
  const posts: Post[] = await data.json()
  return (
    <main>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </main>
  )
}
```

#### Data Fetching Strategies
```typescript
// Static data (cached until manually invalidated)
const staticData = await fetch('https://...', { cache: 'force-cache' })

// Dynamic data (fresh on every request - AVOID for cost)
const dynamicData = await fetch('https://...', { cache: 'no-store' })

// Revalidated data (cached for specific time - PREFERRED)
const revalidatedData = await fetch('https://...', {
  next: { revalidate: 3600 }, // 1 hour
})

// Tag-based revalidation (for on-demand invalidation)
const taggedData = await fetch('https://...', {
  next: { tags: ['products'] },
})
```

#### Dynamic Routes with ISR
```typescript
// src/app/projects/[slug]/page.tsx
export const revalidate = 3600

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    select: { slug: true },
  })
  return projects.map(({ slug }) => ({ slug }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await prisma.project.findUnique({ where: { slug } })
  return <ProjectDetail project={project} />
}
```

---

### React 19 Patterns (Source: react.dev)

#### useTransition for Non-Blocking Updates
```typescript
import { useState, useTransition } from 'react'

function FilterableList() {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Immediate update for input
    setQuery(e.target.value)

    // Non-blocking update for expensive filtering
    startTransition(() => {
      // This won't block user input
      filterItems(e.target.value)
    })
  }

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <span>Filtering...</span>}
      <ItemList />
    </div>
  )
}
```

#### useOptimistic for Instant UI Feedback
```typescript
import { useOptimistic, useState } from 'react'

function MessageThread({ messages, sendMessage }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: string) => [
      ...state,
      { text: newMessage, sending: true },
    ]
  )

  async function formAction(formData: FormData) {
    const message = formData.get('message') as string
    addOptimisticMessage(message) // Instant UI update
    await sendMessage(formData)   // Actual server call
  }

  return (
    <>
      {optimisticMessages.map((msg, i) => (
        <div key={i}>
          {msg.text}
          {msg.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction}>
        <input name="message" />
        <button type="submit">Send</button>
      </form>
    </>
  )
}
```

---

### Tailwind CSS 4 Patterns (Source: tailwindcss.com)

#### Container Queries (Built-in, no plugin needed)
```tsx
// Responsive grid based on CONTAINER size, not viewport
<div className="@container">
  <div className="grid grid-cols-1 @sm:grid-cols-3 @lg:grid-cols-4">
    {/* Items adapt to container width */}
  </div>
</div>
```

#### Bento Grid Layout
```tsx
// Official Tailwind pattern for bento-style grids
<div className="grid grid-cols-2 gap-4 @sm:grid-cols-3">
  <div className="col-span-2 row-span-2 rounded-lg bg-sky-500 p-4">
    Featured Item
  </div>
  <div className="rounded-lg bg-sky-500 p-4">Item 2</div>
  <div className="rounded-lg bg-sky-500 p-4">Item 3</div>
  <div className="col-span-2 rounded-lg bg-sky-500 p-4">Wide Item</div>
</div>
```

#### Subgrid for Aligned Nested Grids
```tsx
<div className="grid grid-cols-4 gap-4">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
  {/* Nested grid inherits parent columns */}
  <div className="col-span-3 grid grid-cols-subgrid gap-4">
    <div className="col-start-2">Aligned to parent grid</div>
  </div>
</div>
```

---

### Motion 12 Patterns (Source: motion.dev)

#### Variants for Reusable Animations
```typescript
const variants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 20 },
}

<motion.div
  variants={variants}
  initial="hidden"
  whileInView="visible"
  exit="hidden"
/>
```

#### Staggered Children Animations
```typescript
const list = {
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      delayChildren: stagger(0.1), // 100ms between each child
    },
  },
  hidden: { opacity: 0 },
}

const item = {
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: -20 },
}

<motion.ul initial="hidden" whileInView="visible" variants={list}>
  <motion.li variants={item} />
  <motion.li variants={item} />
  <motion.li variants={item} />
</motion.ul>
```

#### Gesture Animations
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  whileFocus={{ boxShadow: '0 0 0 2px #3b82f6' }}
>
  Click me
</motion.button>
```

---

### TanStack Query Patterns (Source: tanstack.com/query)

#### Optimistic Updates with Rollback
```typescript
const queryClient = useQueryClient()

const mutation = useMutation({
  mutationFn: updateProject,

  onMutate: async (newProject) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: projectKeys.detail(newProject.slug) })

    // Snapshot previous value
    const previousProject = queryClient.getQueryData(
      projectKeys.detail(newProject.slug)
    )

    // Optimistically update
    queryClient.setQueryData(
      projectKeys.detail(newProject.slug),
      newProject
    )

    // Return rollback data
    return { previousProject }
  },

  onError: (err, newProject, context) => {
    // Rollback on error
    queryClient.setQueryData(
      projectKeys.detail(newProject.slug),
      context?.previousProject
    )
  },

  onSettled: (data, error, variables) => {
    // Always refetch after mutation
    queryClient.invalidateQueries({
      queryKey: projectKeys.detail(variables.slug)
    })
  },
})
```

#### Query with Loading States
```typescript
function ProjectsList() {
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: projectKeys.list(),
    queryFn: fetchProjects,
  })

  if (isLoading) return <Skeleton />
  if (isError) return <Error message={error.message} />

  return (
    <div>
      {isFetching && <RefreshIndicator />}
      <ProjectGrid projects={data} />
    </div>
  )
}
```

---

### TanStack Form Patterns (Source: tanstack.com/form)

#### Form with Zod Validation
```typescript
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
})

function RegistrationForm() {
  const form = useForm({
    defaultValues: { username: '', email: '' },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      await registerUser(value)
    },
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
      <form.Field
        name="username"
        children={(field) => (
          <div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors.map((error, i) => (
              <p key={i} className="text-red-500">{error}</p>
            ))}
          </div>
        )}
      />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? 'Submitting...' : 'Register'}
          </button>
        )}
      />
    </form>
  )
}
```

#### Async Field Validation
```typescript
<form.Field
  name="username"
  validators={{
    onChange: ({ value }) =>
      value.length < 3 ? 'Too short' : undefined,
    onChangeAsyncDebounceMs: 500,
    onChangeAsync: async ({ value }) => {
      const exists = await checkUsernameExists(value)
      return exists ? 'Username already taken' : undefined
    },
  }}
  children={(field) => (
    <div>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {field.state.meta.isValidating && <span>Checking...</span>}
    </div>
  )}
/>
```

---

### Bento Grid Component (Source: Magic UI)

**Installation**: `npx shadcn@latest add https://magicui.design/r/bento-grid`

**Location**: `src/components/ui/bento-grid.tsx`

#### Component Structure
```typescript
interface BentoCardProps {
  name: string           // Card title
  description: string    // Card description
  className: string      // Grid span classes
  background: ReactNode  // Background content/animation
  Icon: React.ElementType // Icon component
  href: string           // Link destination
  cta: string            // Call-to-action text
}
```

#### Usage Pattern
```tsx
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { FileTextIcon, CodeIcon, RocketIcon } from '@radix-ui/react-icons'

<BentoGrid className="lg:grid-rows-3">
  {/* Large featured card */}
  <BentoCard
    name="Featured Project"
    description="This is the main featured item"
    className="lg:row-span-2 lg:col-span-2"
    Icon={RocketIcon}
    href="/projects/featured"
    cta="View Project"
    background={<AnimatedBackground />}
  />

  {/* Standard cards */}
  <BentoCard
    name="Documentation"
    description="Read the docs"
    className="lg:col-span-1"
    Icon={FileTextIcon}
    href="/docs"
    cta="Learn more"
    background={<div className="absolute inset-0 bg-gradient-to-br from-blue-500/10" />}
  />

  <BentoCard
    name="Code Examples"
    description="See it in action"
    className="lg:col-span-1"
    Icon={CodeIcon}
    href="/examples"
    cta="View code"
    background={<div className="absolute inset-0 bg-gradient-to-br from-purple-500/10" />}
  />
</BentoGrid>
```

#### Responsive Grid Classes
```tsx
// Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns
<BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3">

  {/* Full width on mobile, 2 cols on desktop */}
  <BentoCard className="col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2" />

  {/* Single cell */}
  <BentoCard className="col-span-1" />

  {/* Wide card on larger screens */}
  <BentoCard className="col-span-1 lg:col-span-2" />
</BentoGrid>
```

#### Background Animation Pattern
```tsx
// Use Motion for animated backgrounds
const AnimatedBackground = () => (
  <motion.div
    className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"
    animate={{
      background: [
        'linear-gradient(to bottom right, rgba(59,130,246,0.2), rgba(168,85,247,0.2))',
        'linear-gradient(to bottom right, rgba(168,85,247,0.2), rgba(59,130,246,0.2))',
      ],
    }}
    transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
  />
)
```

---

*Last updated: 2026-01-05*
*Maintained by: Claude Code*
*Documentation sources: Next.js, React, Tailwind CSS, Motion, TanStack, Magic UI*
