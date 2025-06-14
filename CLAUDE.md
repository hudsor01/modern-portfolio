# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server (Next.js)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking (note: hyphenated, not typecheck)

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
- **Sonner 2.0.5** for toast notifications
- **date-fns 4.1.0** for date utilities
- **Vercel Analytics** for performance monitoring
- **Native Fetch API** for all HTTP requests (no axios)

### Project Structure
- **src/ directory**: All source code moved to src/ (migration from root completed)
- **App Router** architecture with modern Next.js patterns
- **Feature-based organization**: Components grouped by domain rather than type
- **Centralized types**: All interfaces/types in `src/types/` directory
- **Direct imports**: No barrel files/index exports - import directly from source files
- **Path aliases**: 
  - `@/` → src root
  - `@/components/`, `@/lib/`, `@/hooks/`, `@/types/`, `@/app/`, `@/styles/`
  - `@/content/`, `@/data/` (additional aliases for content)

### Key Architectural Patterns

#### Route Organization
```
src/app/
├── layout.tsx              # Root layout with providers and structured data
├── page.tsx               # Home page (hero-only, no SEO content)
├── about/                 # About section with SEO-optimized content
├── projects/              # Projects showcase
│   ├── [slug]/           # Dynamic project pages with structured data
│   ├── data/             # Static project data and analytics
│   ├── revenue-kpi/      # Revenue analytics dashboard
│   ├── deal-funnel/      # Sales pipeline analysis
│   ├── churn-retention/  # Customer analytics
│   ├── lead-attribution/ # Marketing attribution
│   ├── cac-unit-economics/ # Unit economics analysis
│   └── partner-performance/ # Partner ROI tracking
├── resume/               # Resume section with PDF generation
├── contact/              # Contact forms with modal integration
└── api/                  # API routes (REST endpoints)
    ├── analytics/        # Vercel Analytics integration
    ├── contact/          # Contact form handling
    ├── projects/         # Project data endpoints
    └── send-email/       # Email service integration
```

#### Component Architecture
- **Server Components by default** - only add `'use client'` when needed for browser APIs/state
- **Component composition**: `components/layout/`, `components/ui/`, `components/seo/`
- **Provider pattern**: Theme provider, client components provider at root level
- **Responsive design**: Mobile-first with Tailwind breakpoints
- **Container-in-container design pattern**: `rounded-3xl` outer, `rounded-2xl` inner containers
- **Glassmorphism effects**: `bg-white/5 backdrop-blur border border-white/10`

#### Data Layer
- **TanStack React Query**: Client-side data fetching and state management
- **Static project data** in multiple locations: `src/app/projects/data/`, `src/data/`, `src/content/`
- **Type-safe APIs** with Zod validation (`src/lib/validations/`)
- **Server Actions** for form handling (contact forms, resume generation)
- **Fetch-based API calls**: Native `fetch` instead of axios (see `src/lib/api.ts`)
- **Query key factories**: Centralized in `src/lib/queryKeys.ts`
- **Caching strategy**: TanStack Query caching + Next.js static caching

### Architecture Migration Status
**COMPLETED**: Major architectural migration and modernization:

1. **TanStack Query Migration**: ✅ COMPLETED
   - ✅ Migrated from axios to native fetch
   - ✅ Global QueryClient setup
   - ✅ Client-side mutations refactored
   - ✅ Type-safe query patterns implemented
   - ✅ Query key factories centralized

2. **Type-First Architecture**: ✅ COMPLETED
   - ✅ Comprehensive type safety implementation
   - ✅ All types centralized in `src/types/`
   - ✅ Strict TypeScript configuration
   - ✅ Runtime validation with Zod

3. **SEO Optimization**: ✅ COMPLETED
   - ✅ Comprehensive structured data (JSON-LD)
   - ✅ Enhanced robots.txt and sitemap.xml
   - ✅ Meta tags optimization
   - ✅ Canonical URLs implementation
   - ✅ Business backlinks integration

4. **Design System Enhancement**: ✅ COMPLETED
   - ✅ Container-in-container design pattern
   - ✅ Blue gradient styling throughout
   - ✅ ContactModal for all CTAs
   - ✅ Glassmorphism effects
   - ✅ Responsive design optimization

5. **Data Integration**: ✅ COMPLETED
   - ✅ Factual statistics from CSV data ($4.8M+ revenue)
   - ✅ Real analytics integration
   - ✅ Performance metrics tracking

### Business Logic
This is a **professional portfolio for Richard Hudson**, a Revenue Operations Professional. Key features:

1. **Project Showcase**: Interactive data visualization projects
   - Revenue KPI Dashboard (Business Intelligence)
   - Sales Pipeline Funnel Analysis (Sales Operations) 
   - Customer Churn & Retention Analysis (Customer Analytics)
   - Lead Attribution Analytics (Marketing Analytics)
   - CAC & Unit Economics Analysis
   - Partner Performance Tracking

2. **Resume System**: PDF generation and viewing capabilities
3. **Contact Forms**: Server-side form handling with email integration
4. **Analytics Integration**: Vercel Analytics & Speed Insights
5. **SEO Optimization**: Comprehensive structured data and meta optimization

### Performance & Security
- **Image Optimization**: Next.js Image component with AVIF/WebP formats
- **Security Headers**: CSP, XSS protection, frame options configured in `next.config.js`
- **CSP Reporting**: Endpoint at `/api/csp-report` for security monitoring
- **Caching**: 1-year cache for static assets, no-cache for API routes
- **Bundle Optimization**: Sharp for image processing, tree-shaking enabled
- **Core Web Vitals**: Monitoring via Vercel Analytics

### Styling System
- **Design Tokens**: CSS variables in `src/lib/design-tokens.ts`
- **Theme System**: Dark/light mode with `next-themes`
- **Component Styles**: Utility-first Tailwind with component variants using `class-variance-authority`
- **Animations**: Framer Motion with CSS animations in `src/styles/animations.css`
- **Blue Gradient Theme**: `bg-gradient-to-r from-blue-500 to-indigo-600` for CTAs
- **Glassmorphism**: `bg-white/5 backdrop-blur border border-white/10` for containers

### Development Patterns

#### Type Safety
- **Strict TypeScript**: All types in `src/types/` directory
- **Enhanced TypeScript config**: 
  - `target: ES2022`
  - `strict: true`
  - `noUncheckedIndexedAccess: true`
  - `noUnusedLocals: true`
  - `noUnusedParameters: true`
  - `noImplicitAny: true`
- **Zod Validation**: Input/output validation for forms and APIs (`src/lib/validations/`)
- **Generic type utilities**: Shared API types and query key factories

#### Component Development
- **Single Responsibility**: Small, focused components  
- **Composition over Inheritance**: Use component composition patterns
- **Props Interface**: Component props typed in respective type files
- **Server-First**: Default to Server Components, Client Components only when needed
- **No Comments**: Avoid code comments unless explicitly requested

#### API Design & Data Fetching
- **RESTful Routes**: Follow Next.js API route conventions (`src/app/api/`)
- **Server Actions**: For form submissions and mutations
- **TanStack React Query**: Primary data fetching solution with hooks in `src/hooks/use-api-queries.ts`
- **Type-Safe Responses**: Consistent response types in `src/app/api/types.ts` and `src/types/shared-api.ts`
- **Fetch API**: Native fetch implementation in `src/lib/api.ts`
- **Query Key Management**: Centralized query keys in `src/lib/queryKeys.ts`
- **Error Handling**: Proper error boundaries and user feedback with typed error responses

### Data Visualization
Projects heavily feature **Recharts** for business analytics dashboards:
- Revenue KPI tracking with partner analytics
- Customer churn/retention analysis with predictive modeling
- Sales pipeline funnels with conversion optimization
- Lead attribution analytics with multi-touch attribution
- CAC and unit economics analysis
- Partner performance and ROI tracking

Chart components are reusable with:
- **Base chart components**: `src/components/charts/` with type-safe implementations
- **Project-specific charts**: Located in respective project directories under `src/app/projects/`
- **Chart utilities**: `src/lib/chart-utils.ts` for data transformation and validation
- **Type-safe chart data**: All chart components use strongly typed data interfaces

### SEO & Metadata
- **Comprehensive SEO**: Structured data, Open Graph, Twitter cards
- **JSON-LD Structured Data**: 
  - Person schema for Richard Hudson
  - Website schema for portfolio
  - Service schema for consulting services
  - CreativeWork schema for individual projects
- **Dynamic Metadata**: Per-page metadata generation with keyword optimization
- **Sitemap Generation**: Automatic sitemap.xml with all project pages
- **Robots.txt**: Optimized crawler directives with bad bot blocking
- **Canonical URLs**: Proper canonical URL implementation
- **Business Backlinks**: Hudson Digital Solutions integration
- **Performance Monitoring**: Core Web Vitals tracking
- **Web Vitals Service**: Analytics endpoint at `/api/analytics/vitals`

### Code Quality
- **ESLint Configuration**: Next.js recommended rules (warnings, not errors)
- **TypeScript**: Must pass `tsc --noEmit` before deployment
- **Prettier**: Code formatting consistency
- **No Testing Framework**: Playwright installed but not configured

### Deployment Configuration
- **Platform**: Vercel with optimized regional deployment
- **Environment**: Production-ready configuration
- **Build Process**: Standard Next.js build with optimization
- **Social Redirects**: Configured in `next.config.js`
- **Analytics**: Vercel Analytics and Speed Insights integrated

## Important Development Notes

### Current Status
- **Branch**: `implement-api-tanstack-react-query` 
- **Status**: ✅ PRODUCTION READY - All major features completed
- **Migration**: ✅ COMPLETED - Full architectural modernization finished

### Key Files to Understand
- `src/lib/api.ts` - Centralized fetch-based API functions
- `src/hooks/use-api-queries.ts` - TanStack Query hooks for data fetching
- `src/lib/queryKeys.ts` - Query key factories for cache management
- `src/types/shared-api.ts` - Comprehensive API type definitions
- `src/components/providers/client-components-provider.tsx` - Query client setup
- `src/lib/query-config.ts` - Query configuration
- `src/components/seo/json-ld.tsx` - Structured data components
- `src/components/ui/contact-modal.tsx` - Reusable contact modal
- `src/components/layout/footer.tsx` - Footer with business backlinks

### Data Sources
- **Real CSV Data**: Project uses actual business data from CSV files
  - `Year_Over_Year_Growth_Summary.csv` - $4.8M+ total revenue
  - `PartnerRecordExport_*.csv` - Partner analytics and transaction data
  - Statistics are factual: 8+ projects, $4.8M+ revenue, 432% growth, 2,217% network expansion

### Design System
- **Container Pattern**: Always use container-in-container design
  - Outer: `bg-white/5 backdrop-blur border border-white/10 rounded-3xl`
  - Inner: `bg-white/5 backdrop-blur border border-white/10 rounded-2xl`
- **CTA Styling**: Blue gradient backgrounds for all call-to-action buttons
  - `bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700`
- **Modal Integration**: All non-functional CTAs open ContactModal
- **No Gray Backgrounds**: Replaced all gray CTA backgrounds with blue gradients

### Development Workflow
1. **Type-first development**: Define types in `src/types/` before implementation
2. **Query pattern**: Use TanStack Query hooks for all client-side data fetching
3. **Server Components**: Default to Server Components, add `'use client'` only when necessary
4. **Direct imports**: Always import directly from source files, no barrel exports
5. **Linting**: Run `npm run lint` and `npm run type-check` before committing
6. **SEO First**: All new pages should include appropriate structured data
7. **Mobile First**: Always implement mobile-responsive design

### Completed Features Summary
- ✅ Modern Next.js 15 + React 19 architecture
- ✅ TypeScript with strict configuration
- ✅ TanStack React Query integration
- ✅ Comprehensive SEO optimization
- ✅ Structured data (JSON-LD) implementation
- ✅ Enhanced design system with container patterns
- ✅ Contact modal integration across all CTAs
- ✅ Real business data integration ($4.8M+ revenue)
- ✅ Vercel Analytics integration
- ✅ Business backlink integration
- ✅ Performance optimization
- ✅ Security hardening
- ✅ Mobile responsiveness
- ✅ Code quality standards (ESLint + TypeScript)

## Special Notes
- **Home Page**: Intentionally minimal - hero-only design with no SEO content
- **About Page**: Added to navbar for SEO benefits with optimized content
- **Projects**: All project pages have dedicated structured data
- **Contact Integration**: ContactModal used consistently across all CTAs
- **Brand Removal**: All "RH" branding replaced with full name or removed
- **Statistics**: All numbers are factual from CSV data analysis
- **Footer**: Conditional rendering based on pathname with business backlinks