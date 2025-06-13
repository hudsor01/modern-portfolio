# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server (Next.js)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run fix:all` - Run automated fixes (unused imports, any types, ts-ignore)

### Requirements
- Node.js >=22.14.0
- npm 11.2.0 (package manager)

## Architecture Overview

### Framework & Stack
- **Next.js 15** with App Router and React 19
- **TypeScript 5.8.3** with strict mode and `noUncheckedIndexedAccess`
- **Tailwind CSS 4.1.10** for styling with CSS variables for theming
- **Recharts 2.15.3** for data visualizations
- **Framer Motion 12.17.0** for animations
- **TanStack React Query 5.80.7** for data fetching and state management
- **shadcn/ui + Radix UI** for component primitives

### Project Structure
- Uses **App Router** architecture (no route groups in current implementation)
- **Feature-based organization**: Components grouped by domain rather than type
- **Centralized types**: All interfaces/types in `src/types/` directory
- **Direct imports**: No barrel files/index exports - import directly from source files
- **Path aliases**: `@/` for src root, `@/components/`, `@/lib/`, `@/hooks/`, `@/types/`, `@/app/`, `@/styles/`

### Key Architectural Patterns

#### Route Organization
```
src/app/
├── layout.tsx              # Root layout with providers
├── page.tsx               # Home page
├── about/                 # About section
├── projects/              # Projects showcase
│   ├── [slug]/           # Dynamic project pages
│   ├── data/             # Static project data
│   └── */                # Individual project directories
├── resume/               # Resume section with PDF generation
├── contact/              # Contact forms
└── api/                  # API routes (REST endpoints)
```

#### Component Architecture
- **Server Components by default** - only add `'use client'` when needed for browser APIs/state
- **Component composition**: `components/layout/`, `components/ui/`, `components/seo/`
- **Provider pattern**: Theme provider, client components provider at root level
- **Responsive design**: Mobile-first with Tailwind breakpoints

#### Data Layer
- **TanStack React Query**: Client-side data fetching and state management
- **Static project data** in multiple locations: `src/app/projects/data/`, `src/data/`, `src/content/`
- **Type-safe APIs** with Zod validation (`src/lib/validations/`)
- **Server Actions** for form handling (contact forms, resume generation)
- **Fetch-based API calls**: Native `fetch` instead of axios (see `src/lib/api.ts`)
- **Query key factories**: Centralized in `src/lib/queryKeys.ts`
- **Caching strategy**: TanStack Query caching + Next.js static caching

### Current Migration Status
**IMPORTANT**: This codebase is currently undergoing a major architectural migration:

1. **TanStack Query Migration**: Currently implementing TanStack React Query as the unified data layer (see `TANSTACK_QUERY_MIGRATION.md`)
2. **Type-First Architecture**: Comprehensive type safety implementation completed (see `PRISMA_TYPE_FIRST_ARCHITECTURE.md`)
3. **Fetch API Transition**: Migrated from axios to native fetch API
4. **Branch Status**: Working on `implement-api-tanstack-react-query` branch

### Business Logic
This is a **professional portfolio for Richard Hudson**, a Revenue Operations Professional. Key features:

1. **Project Showcase**: Interactive data visualization projects (churn analysis, sales funnels, lead attribution, revenue dashboards)
2. **Resume System**: PDF generation and viewing capabilities
3. **Contact Forms**: Server-side form handling with email integration (Resend)
4. **Analytics Integration**: Vercel Analytics & Speed Insights

### Performance & Security
- **Image Optimization**: Next.js Image component with AVIF/WebP formats
- **Security Headers**: CSP, XSS protection, frame options configured in `next.config.js`
- **Caching**: 1-year cache for static assets, no-cache for API routes
- **Bundle Optimization**: Sharp for image processing, tree-shaking enabled

### Styling System
- **Design Tokens**: CSS variables in `/lib/design-tokens.ts`
- **Theme System**: Dark/light mode with `next-themes`
- **Component Styles**: Utility-first Tailwind with component variants using `class-variance-authority`
- **Animations**: Framer Motion with CSS animations in `/styles/animations.css`

### Development Patterns

#### Type Safety
- **Strict TypeScript**: All types in `src/types/` directory with comprehensive type safety
- **Enhanced TypeScript config**: `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitAny`
- **Type-first architecture**: Complete type safety from database to UI (see `PRISMA_TYPE_FIRST_ARCHITECTURE.md`)
- **Zod Validation**: Input/output validation for forms and APIs (`src/lib/validations/`)
- **Generic type utilities**: Shared API types and query key factories

#### Component Development
- **Single Responsibility**: Small, focused components  
- **Composition over Inheritance**: Use component composition patterns
- **Props Interface**: All component props typed in `/types/ui.ts`
- **Server-First**: Default to Server Components, Client Components only when needed

#### API Design & Data Fetching
- **RESTful Routes**: Follow Next.js API route conventions (`src/app/api/`)
- **Server Actions**: For form submissions and mutations
- **TanStack React Query**: Primary data fetching solution with hooks in `src/hooks/use-api-queries.ts`
- **Type-Safe Responses**: Consistent response types in `src/app/api/types.ts` and `src/types/shared-api.ts`
- **Fetch API**: Native fetch implementation in `src/lib/api.ts` (axios removed)
- **Query Key Management**: Centralized query keys in `src/lib/queryKeys.ts`
- **Error Handling**: Proper error boundaries and user feedback with typed error responses

### Data Visualization
Projects heavily feature **Recharts** for business analytics dashboards:
- Revenue KPI tracking
- Customer churn/retention analysis  
- Sales pipeline funnels
- Lead attribution analytics

Chart components are reusable with:
- **Base chart components**: `src/components/charts/` with type-safe implementations
- **Project-specific charts**: Located in respective project directories under `src/app/projects/`
- **Chart utilities**: `src/lib/chart-utils.ts` for data transformation and validation
- **Type-safe chart data**: All chart components use strongly typed data interfaces

### SEO & Metadata
- **Comprehensive SEO**: Structured data, Open Graph, Twitter cards
- **Dynamic Metadata**: Per-page metadata generation
- **Sitemap Generation**: Automatic sitemap.xml generation
- **Performance Monitoring**: Core Web Vitals tracking

### Testing & Quality
- **ESLint Configuration**: React, TypeScript, Next.js recommended rules
- **No unused variables/parameters**: Enforced at TypeScript level
- **Lint-staged**: Pre-commit hooks for code quality
- **Type checking**: Must pass `tsc --noEmit` before deployment

### Deployment Configuration
- **Platform**: Vercel with regional deployment (iad1)
- **Environment**: Production-ready configuration
- **Build Process**: Standard Next.js build with optimization
- **Social Redirects**: Configured in `next.config.js`

## Important Development Notes

### Working with the Migration
- **Current branch**: `implement-api-tanstack-react-query` - major architectural changes in progress
- **Migration docs**: See `TANSTACK_QUERY_MIGRATION.md` for detailed migration status and next steps
- **Type architecture**: Reference `PRISMA_TYPE_FIRST_ARCHITECTURE.md` for type system implementation details

### Key Files to Understand
- `src/lib/api.ts` - Centralized fetch-based API functions
- `src/hooks/use-api-queries.ts` - TanStack Query hooks for data fetching
- `src/lib/queryKeys.ts` - Query key factories for cache management
- `src/types/shared-api.ts` - Comprehensive API type definitions
- `src/components/providers/client-components-provider.tsx` - Query client setup

### Development Workflow
1. **Type-first development**: Define types in `src/types/` before implementation
2. **Query pattern**: Use TanStack Query hooks for all client-side data fetching
3. **Server Components**: Default to Server Components, add `'use client'` only when necessary
4. **Direct imports**: Always import directly from source files, no barrel exports