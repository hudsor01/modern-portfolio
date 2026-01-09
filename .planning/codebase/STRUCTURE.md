# Codebase Structure

## Overview
**Total Files**: 445 TypeScript/TSX files

## Root Directory Layout
```
modern-portfolio/
├── src/ - Application source code
├── prisma/ - Database schema & migrations
├── e2e/ - End-to-end tests (Playwright)
├── docs/ - Detailed documentation
├── .vercel/ - Vercel deployment config
├── next.config.js - Next.js configuration
├── package.json - Dependencies & scripts
├── bunfig.toml - Bun runtime configuration
└── playwright.config.ts - E2E testing config
```

## Source Directory (`/src`) - 445 Files

### `/src/app` - Next.js 16 App Router
```
app/
├── layout.tsx - Root layout (fonts, metadata, providers)
├── page.tsx - Home page (Server Component)
├── error.tsx - Global error boundary
├── not-found.tsx - 404 page
├── loading.tsx - Loading skeleton
├── robots.ts - robots.txt generation
├── sitemap.ts - XML sitemap generation
├── viewport.ts - Viewport metadata
│
├── api/ - REST API Routes
│   ├── /contact/ - Contact form endpoint (rate-limited, CSRF)
│   ├── /projects/ - Projects CRUD
│   ├── /blog/ - Blog CRUD operations
│   ├── /health-check/ - Health status
│   ├── /send-email/ - Email service
│   └── /generate-resume-pdf/ - PDF generation
│
├── projects/ - Project showcase pages
│   ├── page.tsx - Projects list (Client Component)
│   ├── [slug]/ - Dynamic project pages
│   ├── [projectName]/ - Static project pages (11 specific)
│   │   ├── components/ - Project-specific components
│   │   └── data/ - Project-specific data
│   └── data/ - Shared project data
│
├── blog/ - Blog system
│   ├── page.tsx - Blog listing
│   ├── [slug]/ - Dynamic blog post pages
│   └── components/ - Blog-specific components
│
├── contact/ - Contact page
│   └── page.tsx
│
├── about/ - About page
│
└── resume/ - Resume pages
    ├── view/ - Resume viewing mode
    ├── components/ - Resume components
    └── data/ - Resume data
```

### `/src/components` - 98 Components
```
components/
├── ui/ - Shadcn/UI + custom primitives (48 components)
│   ├── button.tsx, card.tsx, input.tsx, select.tsx
│   ├── dialog.tsx, dropdown-menu.tsx, tabs.tsx
│   ├── toast.tsx, tooltip.tsx, popover.tsx
│   └── [... 38 more UI components]
│
├── layout/ - Layout components
│   ├── navbar.tsx, footer.tsx, sidebar.tsx
│   ├── home-page-content.tsx
│   └── scroll-to-top.tsx
│
├── navigation/ - Navigation components
│   ├── breadcrumbs/, mobile-nav/
│   └── [navigation utilities]
│
├── projects/ - Project-related components
│   ├── project-card.tsx
│   ├── project-cta-section.tsx
│   ├── project-stats.tsx
│   ├── shared/ - Reusable project components
│   └── __tests__/
│
├── charts/ - Data visualization
│   ├── bar-chart/, line-chart/, pie-chart/
│   └── [chart components]
│
├── contact/ - Contact form components
│
├── about/ - About section components
│
├── seo/ - SEO-related components
│   └── json-ld/ - Structured data (JSON-LD)
│
├── error/ - Error boundary components
│
└── providers/ - React context providers
    ├── client-components-provider.tsx
    ├── tanstack-query-provider.tsx
    └── theme-provider.tsx
```

### `/src/lib` - Utilities & Core Logic
```
lib/
├── db.ts - Prisma client singleton
├── prisma.ts - Prisma re-exports
├── queryKeys.ts - TanStack Query key factories
├── query-config.ts - Query client configuration
├── error-handling.ts - Standardized error handling
├── utils.ts - General utilities
│
├── api/ - API utilities
│   ├── utils.ts - Client ID, metadata, response formatting
│   └── response.ts - Response builders
│
├── security/ - Security utilities
│   ├── rate-limiter.ts - Enhanced rate limiting
│   ├── csrf-protection.ts - CSRF token validation
│   ├── sanitization.ts - HTML/input sanitization
│   ├── security-event-logger.ts - Audit trail
│   ├── env-validation.ts - Environment validation
│   ├── security-headers.ts - HTTP headers
│   └── __tests__/ - Security tests
│
├── validations/ - Zod schemas
│   ├── unified-schemas.ts - Centralized validation
│   ├── project-schema.ts, blog-schema.ts
│   ├── query-params.ts
│   └── MIGRATION_GUIDE.md
│
├── content/ - Data layer/DAL
│   └── projects.ts - Project data retrieval
│
├── dal/ - Data Access Layer
│
├── database/ - Database utilities
│
├── analytics/ - Analytics & tracking
│   ├── event-tracker.ts
│   ├── page-views.ts
│   └── __tests__/
│
├── monitoring/ - Logging & observability
│   └── logger.ts - Context-aware logging
│
├── seo/ - SEO utilities
│   ├── generate-metadata.ts
│   ├── generate-sitemap.ts
│   └── [SEO utilities]
│
├── charts/ - Chart data processing
│   ├── chart-utils.ts
│   └── chart-colors.ts
│
├── email/ - Email utilities
│
├── forms/ - Form validation & types
│   ├── form-types.ts
│   ├── tanstack-form-types.ts
│   └── tanstack-validators.ts
│
├── design-system/ - Design system utilities
│
├── constants/ - Application constants
│
├── config/ - Configuration files
│
├── actions/ - Server actions
│
├── dto/ - Data Transfer Objects
│
└── utils/ - Miscellaneous utilities
    ├── cn.ts - Tailwind class merging
    ├── format.ts, route-utils.ts
    └── [utility functions]
```

### `/src/hooks` - Custom React Hooks (20 files)
```
hooks/
├── use-analytics-data.ts
├── use-contact-form.ts
├── use-csrf-token.ts
├── use-debounce.ts
├── use-in-view.ts
├── use-keyboard-navigation.ts
├── use-loading-state.ts
├── use-local-storage.ts
├── use-media-query.ts
├── use-mobile.ts
├── use-mounted.ts
├── use-page-analytics.ts
├── use-projects-api.ts
├── use-quick-view-modal.ts
├── use-scroll-position.ts
├── use-sonner-toast.ts
├── use-swiper-autoplay.ts
└── __tests__/
```

### `/src/types` - TypeScript Definitions (15 files)
```
types/
├── api.ts - API response types
├── project.ts - Project types
├── blog.ts, blog-database.ts - Blog types
├── forms.ts - Form types
├── analytics.ts - Analytics types
├── chart.ts - Chart types
├── common.ts - Common types
├── experience.ts - Resume/experience types
├── navigation.ts - Navigation types
├── shared-api.ts - Shared API types
├── recharts.ts - Recharts types
├── mock-types.ts - Mock data types
├── next-types.d.ts - Next.js type extensions
└── test-utils.ts - Testing utilities
```

### `/src/data` - Static Data
```
data/
├── projects.ts - Project showcase data
└── [other static data]
```

### `/src/styles` - Global Styles
```
styles/
├── globals.css - Tailwind + custom styles
└── animations.css - Animation definitions
```

### `/src/test` - Test Utilities
```
test/
├── setup.tsx - Global test setup
└── __tests__/
```

## Database (`/prisma`)
```
prisma/
├── schema.prisma - Database schema (18+ models)
├── migrations/ - Migration history
├── seed.ts - Database seeding
└── generated/ - Generated Prisma client
```

## Testing (`/e2e`)
```
e2e/
├── [Playwright E2E tests]
└── playwright.config.ts (root)
```

## Documentation (`/docs`)
```
docs/
├── API_REFERENCE.md - Complete API docs
├── TESTING_GUIDE.md - Testing patterns
├── DESIGN_SYSTEM.md - Design tokens
├── ARCHITECTURE.md - Deep dive
├── ANIMATIONS.md - Animation system
└── DEPLOYMENT.md - Deployment guide
```

## Module Boundaries

### Path Aliases (from tsconfig.json)
```
@/* → ./src/*
@/components/* → ./src/components/*
@/lib/* → ./src/lib/*
@/hooks/* → ./src/hooks/*
@/types/* → ./src/types/*
@/prisma/* → ./prisma/generated/prisma/*
```

### Import Organization
1. External libraries (react, next, @tanstack)
2. Absolute imports via `@/` aliases
3. Relative imports (rarely used)
4. Empty line separator between groups
5. Alphabetically sorted within groups

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| **Components** | PascalCase | `Button.tsx`, `ProjectCard.tsx` |
| **Hooks** | kebab-case with `use-` | `use-contact-form.ts`, `use-debounce.ts` |
| **Types** | PascalCase | `navigation.ts`, `common.ts` |
| **Utilities** | camelCase | `utils.ts`, `chart-utils.ts` |
| **Constants** | UPPER_SNAKE_CASE or camelCase | `API_TIMEOUT`, `defaultConfig` |
| **Tests** | `__tests__/` or `.test.ts(x)` | `button.test.tsx` |

## Code Organization Patterns

### Barrel Exports
```typescript
// components/ui/index.ts
export { Button } from './button'
export { Card } from './card'
// ...

// Import usage:
import { Button, Card } from '@/components/ui'
```

### Feature Colocation
```
projects/
├── project-card.tsx (feature component)
├── shared/ (reusable within feature)
│   ├── project-header.tsx
│   └── project-footer.tsx
└── __tests__/
    └── project-card.test.tsx
```

---

*Last updated: 2026-01-09*
