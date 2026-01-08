# CLAUDE.md - Project Quick Reference

**Modern Portfolio** | Next.js 16 | Bun Runtime | PostgreSQL + Prisma

> For detailed documentation, see `/docs` folder

---

## 🚀 Quick Start

```bash
bun install                # Install dependencies
bun run db:generate        # Generate Prisma client
bun dev                    # Start development (http://localhost:3000)
```

**Environment**: Copy `.env.example` to `.env.local` and configure

---

## 📋 Essential Commands

| Command | Purpose |
|---------|---------|
| `bun dev` | Development server |
| `bun test` | Run tests (913 passing) |
| `bun run lint` | Check code quality |
| `bun run type-check` | TypeScript validation |
| `bun run build` | Production build |
| `bun run ci:full` | Full CI pipeline |
| `bun run db:studio` | Prisma Studio GUI |

---

## 🏗️ Architecture

```
modern-portfolio/
├── src/
│   ├── app/              # Next.js 16 App Router
│   │   ├── api/          # REST API routes
│   │   ├── projects/     # Project showcase pages
│   │   └── blog/         # Blog system
│   ├── components/       # React components (80+)
│   ├── lib/              # Core utilities
│   │   ├── security/     # Rate limiting, sanitization
│   │   ├── validations/  # Zod schemas
│   │   └── analytics/    # Tracking & monitoring
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript definitions
├── prisma/               # Database schema & migrations
└── docs/                 # Detailed documentation
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Bun 1.3.5 |
| **Framework** | Next.js 16.1.1 (App Router) |
| **Language** | TypeScript 5.9.3 (strict) |
| **Database** | PostgreSQL + Prisma ORM |
| **Styling** | Tailwind CSS 4 + tw-animate-css |
| **Testing** | Bun Test (Jest-compatible) |
| **E2E Testing** | Playwright |
| **UI Components** | shadcn/ui + Radix UI |
| **State** | TanStack Query v5 |
| **Forms** | TanStack Form + Zod |
| **Email** | Resend |
| **Analytics** | Vercel Analytics |

---

## 🔐 Security & Performance

- ✅ Rate limiting on all API routes
- ✅ CSRF protection
- ✅ HTML sanitization (DOMPurify)
- ✅ Zod validation on all inputs
- ✅ ISR revalidation (60s)
- ✅ Image optimization (Next.js Image)
- ✅ Bundle size monitoring

---

## 📊 API Routes

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/health-check` | GET | Health status |
| `/api/contact` | POST | Contact form |
| `/api/projects` | GET, POST | Project CRUD |
| `/api/projects/[slug]` | GET, PUT, DELETE | Single project |
| `/api/blog` | GET, POST | Blog posts |
| `/api/blog/[slug]` | GET, PUT, DELETE | Single post |
| `/api/blog/categories` | GET, POST | Categories |
| `/api/blog/tags` | GET, POST | Tags |
| `/api/blog/rss` | GET | RSS feed |

**Full API docs**: See `/docs/API_REFERENCE.md`

---

## 🧪 Testing Strategy

- **Unit Tests**: 913 passing (62 intentionally skipped)
- **Coverage Target**: 80%+
- **E2E Tests**: Playwright for critical paths
- **Run Tests**: `bun test` (fast, Bun-native)

**Full testing guide**: See `/docs/TESTING_GUIDE.md`

---

## 🎨 Design System

**Colors**: Cyan/blue scheme (`hsl(var(--primary))`)
**Typography**: Responsive sizing, semantic weights
**Components**: CVA variants, consistent patterns
**Animations**: tw-animate-css (globally available)

**Full design system**: See `/docs/DESIGN_SYSTEM.md`

---

## 📝 Key Patterns

### Validation (Zod)
```typescript
import { contactFormSchema } from '@/lib/validations/unified-schemas'
const result = contactFormSchema.safeParse(data)
```

### API Error Handling
```typescript
import { handleApiError } from '@/lib/api/utils'
return handleApiError(error, 'operation-name')
```

### Query Keys
```typescript
import { projectKeys, blogKeys } from '@/lib/queryKeys'
const queryKey = projectKeys.detail(slug)
```

### Rate Limiting
```typescript
import { enhancedRateLimit } from '@/lib/security/rate-limiter'
const result = await enhancedRateLimit(req, { max: 10, window: 60 })
```

---

## 🔄 Git Workflow

### Worktree Development
```bash
git worktree add ../worktrees/feature-name -b feature/name
cd ../worktrees/feature-name
# ... make changes
git commit -m "feat: description"
cd /path/to/main/repo
git merge feature/name
```

### Pre-Commit Hooks (Husky)
- ✅ Lint-staged (ESLint + type-check)
- ✅ Pre-push tests

---

## 📚 Detailed Documentation

| Document | Purpose |
|----------|---------|
| `/docs/API_REFERENCE.md` | Complete API documentation |
| `/docs/TESTING_GUIDE.md` | Testing patterns & examples |
| `/docs/DESIGN_SYSTEM.md` | Design tokens & components |
| `/docs/ARCHITECTURE.md` | Deep dive into architecture |
| `/docs/ANIMATIONS.md` | Animation system guide |
| `/WORKTREE_GUIDE.md` | Git worktree workflow |
| `/PROJECT_STATUS.md` | Current project health |

---

## 🌍 Environment Variables

```bash
# Required
DATABASE_URL="postgresql://..."
RESEND_API_KEY="re_..."
CONTACT_EMAIL="your@email.com"
JWT_SECRET="min-32-chars"

# Optional
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
VERCEL_ANALYTICS_ID=""
```

---

## 🎯 Business Context

**Target Audience**: Recruiters & potential clients
**Primary Goal**: Showcase technical expertise through real projects
**Key Features**:
- Interactive project case studies with data visualizations
- Technical blog with categories/tags
- Contact form with rate limiting
- SEO optimization (sitemap, meta tags, RSS)

---

## 📈 Current Status

| Metric | Status |
|--------|--------|
| Tests | ✅ 913/913 passing |
| Lint | ✅ 0 errors, 7 warnings |
| Type Safety | ✅ Strict mode, 0 errors |
| Build | ⏳ Run `bun run build` |
| Lighthouse | ⏳ Target 90+ all categories |

---

## 🚀 Deployment

**Platform**: Vercel (recommended)
**Build Command**: `bun run build`
**Install Command**: `bun install`
**Node Version**: 22.x

**See**: `/docs/DEPLOYMENT.md` for full deployment guide

---

**Last Updated**: 2026-01-07
**Version**: 0.1.0
**Maintainer**: @hudsor01
