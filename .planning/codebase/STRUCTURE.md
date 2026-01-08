# Codebase Structure

**Analysis Date:** 2026-01-08

## Directory Layout

```
modern-portfolio/
├── src/                     # Source code
│   ├── app/                # Next.js 16 App Router
│   ├── components/         # React components (80+)
│   ├── lib/                # Core utilities & services
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript definitions
│   ├── data/               # Static data (projects, skills)
│   ├── __tests__/          # Test infrastructure
│   └── test/               # Test utilities & setup
├── prisma/                 # Database schema & migrations
│   ├── schema.prisma      # Prisma schema definition
│   └── migrations/        # Database migrations
├── docs/                   # Project documentation
├── public/                 # Static assets
├── .planning/              # GSD planning directory
├── node_modules/           # Dependencies
├── package.json            # Project manifest
├── tsconfig.json           # TypeScript configuration
├── next.config.js          # Next.js configuration
├── bunfig.toml             # Bun test configuration
└── playwright.config.ts    # E2E test configuration
```

## Directory Purposes

**src/app/**
- Purpose: Next.js 16 App Router structure (routes, layouts, pages)
- Contains: Page components, API routes, layouts, route handlers
- Key files: `layout.tsx` (root layout), `page.tsx` (home page)
- Subdirectories:
  - `api/` - REST API endpoints (28 routes)
  - `projects/` - Project showcase pages
  - `blog/` - Blog system pages
  - `contact/` - Contact form page
  - `about/`, `resume/` - Static pages

**src/components/**
- Purpose: Reusable React components (80+ components)
- Contains: UI components, feature components, providers, layouts
- Key files: N/A (component-based directory)
- Subdirectories:
  - `ui/` - shadcn/ui base components (Button, Card, Label, etc.)
  - `projects/` - Project-specific components
  - `blog/` - Blog-specific components
  - `contact/` - Contact form components
  - `charts/` - Data visualization components
  - `seo/` - SEO components (JSON-LD, meta tags)
  - `navigation/` - Navigation components (Navbar, MobileNav)
  - `providers/` - Context providers (TanStack Query, theme)
  - `layout/` - Layout components (Header, Footer)

**src/lib/**
- Purpose: Core utilities, services, and business logic
- Contains: DAL, security, validation, email, analytics, monitoring
- Key files: `db.ts` (Prisma client), `queryKeys.ts` (cache keys)
- Subdirectories:
  - `security/` - Rate limiting, CSRF, sanitization, headers, event logging
  - `validations/` - Zod schemas (unified-schemas.ts)
  - `email/` - Email service (Resend integration)
  - `analytics/` - Web vitals, data aggregation
  - `monitoring/` - Structured logging
  - `config/` - Configuration management (site.ts, index.ts)
  - `api/` - API utilities (error handling, response formatting)
  - `dal/` - Data Access Layer (cache-wrapped Prisma queries)
  - `actions/` - Server actions (contact-form-action.ts)
  - `dto/` - Data Transfer Objects
  - `forms/` - Form utilities and validators
  - `charts/` - Chart data utilities

**src/hooks/**
- Purpose: Custom React hooks
- Contains: useContactForm, useProjectsAPI, useMobile, useDebounce, etc.
- Key files: `use-contact-form.ts`, `use-projects-api.ts`

**src/types/**
- Purpose: TypeScript type definitions
- Contains: Domain types, API contracts, form types
- Key files: `project.ts`, `blog.ts`, `api.ts`, `shared-api.ts`, `forms.ts`

**src/data/**
- Purpose: Static data files
- Contains: `projects.ts` (showcaseProjects array), `skills.ts`

**src/__tests__/**
- Purpose: Test files co-located with source
- Contains: Unit tests, integration tests
- Pattern: `__tests__/name.test.ts` (54 test files total)

**prisma/**
- Purpose: Database schema and migrations
- Contains: `schema.prisma`, `migrations/` directory
- Key files: `schema.prisma` (15+ models including BlogPost, Author, Category, Tag, ContactSubmission, SEOEvent)

**docs/**
- Purpose: Project documentation
- Contains: API_REFERENCE.md, TESTING_GUIDE.md, DESIGN_SYSTEM.md, ARCHITECTURE.md, etc.

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx` - Root layout with providers
- `src/app/page.tsx` - Home page
- `src/app/api/*/route.ts` - API endpoints
- `package.json` - Scripts and dependencies

**Configuration:**
- `tsconfig.json` - TypeScript strict mode, path aliases
- `next.config.js` - Next.js 16 config (React Compiler, ISR, security headers)
- `bunfig.toml` - Bun test config (80% coverage threshold)
- `playwright.config.ts` - E2E test configuration
- `eslint.config.mjs` - ESLint flat config (ESLint 9 format)
- `.prettierrc.json` - Code formatter
- `.env.example` - Environment variable template

**Core Logic:**
- `src/lib/db.ts` - Prisma client singleton
- `src/lib/dal/index.ts` - Data Access Layer
- `src/lib/validations/unified-schemas.ts` - Zod validation schemas
- `src/lib/security/rate-limiter.ts` - Enhanced rate limiting
- `src/lib/email/email-service.ts` - Resend integration
- `src/lib/queryKeys.ts` - TanStack Query key factory

**Testing:**
- `src/test/setup.tsx` - Test setup (Testing Library, Happy DOM)
- `src/test/happydom.ts` - Happy DOM registration
- `src/**/__tests__/*.test.ts` - Unit tests (913 passing)
- `playwright.config.ts` - E2E test configuration

**Documentation:**
- `CLAUDE.md` - Project quick reference for Claude Code
- `README.md` - User-facing documentation
- `PROJECT_STATUS.md` - Current project health
- `WORKTREE_GUIDE.md` - Git worktree workflow

## Naming Conventions

**Files:**
- `kebab-case.ts` - Utility files, services, DTOs
- `PascalCase.tsx` - React components
- `use-feature.ts` - Custom hooks
- `*.test.ts` or `*.test.tsx` - Test files
- `route.ts` - Next.js API route handlers
- `page.tsx` - Next.js page components
- `layout.tsx` - Next.js layout components

**Directories:**
- `kebab-case` - All directories
- Plural for collections: `components/`, `hooks/`, `migrations/`
- Singular for configs: `config/`, `data/`

**Special Patterns:**
- `index.ts` - Barrel exports (re-export public API)
- `__tests__/` - Test directories

## Where to Add New Code

**New Feature:**
- Primary code: `src/lib/[feature]/` or `src/app/[feature]/`
- Tests: `src/**/__tests__/[feature].test.ts`
- Types: `src/types/[feature].ts`
- API: `src/app/api/[feature]/route.ts`

**New Component:**
- Implementation: `src/components/[category]/[Component].tsx`
- Types: In component file or `src/types/[feature].ts`
- Tests: `src/components/[category]/__tests__/[Component].test.tsx`

**New API Route:**
- Definition: `src/app/api/[resource]/route.ts`
- Validation: Add schema to `src/lib/validations/unified-schemas.ts`
- Tests: `src/app/api/[resource]/__tests__/route.test.ts`

**New Hook:**
- Implementation: `src/hooks/use-[feature].ts`
- Tests: `src/hooks/__tests__/use-[feature].test.ts`

**Utilities:**
- Shared helpers: `src/lib/[category]/[utility].ts`
- Type definitions: `src/types/[domain].ts`

## Special Directories

**.planning/**
- Purpose: GSD (Get Shit Done) planning documents
- Source: Created by /gsd:* commands
- Committed: Yes (planning documentation)

**node_modules/**
- Purpose: Installed dependencies
- Source: Bun install
- Committed: No (in .gitignore)

**prisma/migrations/**
- Purpose: Database migration history
- Source: `prisma migrate` commands
- Committed: Yes (migration tracking)

---

*Structure analysis: 2026-01-08*
*Update when directory structure changes*
