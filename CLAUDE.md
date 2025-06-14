# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

I need you to understand that in this project, we can not use Thryv anywhere. If you read the word Thryv or variations of it anywhere, refactor that file to not use it.

## Commands

### Development
- `npm run dev` - Start development server (Next.js)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

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

### Project Structure
- **src/ directory**: All source code moved to src/ (recent migration from root)
- **App Router** architecture (no route groups in current implementation)
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
.
├── components.json
├── Deal_Volume_by_Stage copy.csv
├── eslint.config.mjs
├── middleware.ts
├── next-env.d.ts
├── next.config.js
├── package.json
├── PartnerRecordExport_customers_2024-11-01 copy.csv
├── PartnerRecordExport_deals_2024-11-01.csv
├── PartnerRecordExport_partners_2024-11-01 copy.csv
├── PartnerRecordExport_transactions_2024-11-01 copy.csv
├── postcss.config.mjs
├── PROJECT_ROADMAP.md
├── public
│   ├── apple-touch-icon.png
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon.ico
│   ├── fonts
│   ├── images
│   │   ├── boxes.jpg
│   │   ├── contact-hero.jpg
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   ├── projects
│   │   │   ├── churn-retention.jpg
│   │   │   ├── deal-funnel.jpg
│   │   │   ├── lead-attribution.jpg
│   │   │   └── revenue-kpi.jpg
│   │   ├── richard.jpg
│   │   └── testimonials
│   ├── manifest.json
│   ├── manifest.webmanifest
│   ├── maskable-icon.png
│   ├── Richard Hudson - Resume.pdf
│   ├── robots.txt
│   └── safari-pinned-tab.png
├── screenshots
│   ├── cac-unit-economics.png
│   ├── churn-retention-fixed.png
│   ├── churn-retention.png
│   ├── deal-funnel-debug.png
│   ├── deal-funnel-enhanced.png
│   ├── deal-funnel-massive-org.png
│   ├── deal-funnel-real-data.png
│   ├── deal-funnel-realistic.png
│   ├── deal-funnel-true-shape.png
│   ├── deal-funnel.png
│   ├── lead-attribution.png
│   ├── projects-main.png
│   └── revenue-kpi.png
├── src
│   ├── app
│   │   ├── about
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── api
│   │   │   ├── analytics
│   │   │   │   └── vitals
│   │   │   │       └── route.ts
│   │   │   ├── contact
│   │   │   │   └── route.ts
│   │   │   ├── csp-report
│   │   │   │   └── route.ts
│   │   │   ├── generate-resume-pdf
│   │   │   │   └── route.ts
│   │   │   ├── pdf
│   │   │   │   └── route.ts
│   │   │   ├── projects
│   │   │   │   ├── [slug]
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── send-email
│   │   │   │   ├── action.ts
│   │   │   │   └── route.ts
│   │   │   └── types.ts
│   │   ├── contact
│   │   │   ├── contact-form-updated.tsx
│   │   │   └── page.tsx
│   │   ├── error.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading-skeleton.tsx
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   ├── projects
│   │   │   ├── [slug]
│   │   │   │   └── page.tsx
│   │   │   ├── cac-unit-economics
│   │   │   │   ├── CACBreakdownChart.tsx
│   │   │   │   ├── metadata.json
│   │   │   │   ├── page.tsx
│   │   │   │   ├── PaybackPeriodChart.tsx
│   │   │   │   └── UnitEconomicsChart.tsx
│   │   │   ├── churn-retention
│   │   │   │   ├── ChurnLineChart.tsx
│   │   │   │   ├── metadata.json
│   │   │   │   ├── page.tsx
│   │   │   │   └── RetentionHeatmap.tsx
│   │   │   ├── data
│   │   │   │   ├── partner-analytics
│   │   │   │   │   └── index.ts
│   │   │   │   ├── projects-paths.ts
│   │   │   │   └── projects.ts
│   │   │   ├── deal-funnel
│   │   │   │   ├── DealStageFunnelChart.tsx
│   │   │   │   ├── metadata.json
│   │   │   │   └── page.tsx
│   │   │   ├── lead-attribution
│   │   │   │   ├── LeadSourcePieChart.tsx
│   │   │   │   ├── metadata.json
│   │   │   │   └── page.tsx
│   │   │   ├── metadata.ts
│   │   │   ├── page.tsx
│   │   │   ├── partner-performance
│   │   │   │   ├── metadata.json
│   │   │   │   ├── page.tsx
│   │   │   │   ├── PartnerROIChart.tsx
│   │   │   │   ├── PartnerTierChart.tsx
│   │   │   │   └── RevenueContributionChart.tsx
│   │   │   └── revenue-kpi
│   │   │       ├── metadata.json
│   │   │       ├── page.tsx
│   │   │       ├── PartnerGroupPieChart.tsx
│   │   │       ├── RevenueBarChart.tsx
│   │   │       ├── RevenueLineChart.tsx
│   │   │       └── TopPartnersChart.tsx
│   │   ├── resume
│   │   │   ├── achievements.tsx
│   │   │   ├── page.tsx
│   │   │   ├── resume-download.tsx
│   │   │   ├── resume-viewer.tsx
│   │   │   └── view
│   │   │       └── page.tsx
│   │   ├── robots.ts
│   │   ├── shared-metadata.ts
│   │   ├── sitemap.ts
│   │   └── viewport.ts
│   ├── components
│   │   ├── about
│   │   │   └── about-content.tsx
│   │   ├── charts
│   │   │   ├── bar-chart.tsx
│   │   │   ├── funnel-chart.tsx
│   │   │   ├── heatmap-chart.tsx
│   │   │   ├── index.ts
│   │   │   ├── line-chart.tsx
│   │   │   ├── pie-chart.tsx
│   │   │   └── types.ts
│   │   ├── consent
│   │   │   └── consent-banner.tsx
│   │   ├── error
│   │   │   └── error-boundary.tsx
│   │   ├── layout
│   │   │   ├── achievements-section.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── header.tsx
│   │   │   ├── hero-section.tsx
│   │   │   ├── hero-with-image.tsx
│   │   │   ├── home-page-content.tsx
│   │   │   ├── navbar-wrapper.tsx
│   │   │   ├── navbar.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── swiper-navigation.tsx
│   │   │   └── testimonials-section.tsx
│   │   ├── previews
│   │   │   └── revenue-dashboard-preview.tsx
│   │   ├── projects
│   │   │   ├── modern-projects-content.tsx
│   │   │   ├── project-card.tsx
│   │   │   ├── project-carousel.tsx
│   │   │   ├── project-chart.tsx
│   │   │   ├── project-charts.tsx
│   │   │   ├── project-detail-client-boundary.tsx
│   │   │   ├── project-filter.tsx
│   │   │   ├── project-filters-enhanced.tsx
│   │   │   ├── project-filters.tsx
│   │   │   ├── project-grid.tsx
│   │   │   ├── project-quick-view.tsx
│   │   │   ├── project-swiper.tsx
│   │   │   ├── project-tabs.tsx
│   │   │   ├── projects-client-boundary.tsx
│   │   │   ├── projects-typewriter.tsx
│   │   │   ├── ReactSlickCarousel.tsx
│   │   │   └── revenue-dashboard-preview.tsx
│   │   ├── providers
│   │   │   ├── client-components-provider.tsx
│   │   │   └── theme-provider.tsx
│   │   ├── seo
│   │   │   ├── global-seo.tsx
│   │   │   ├── home-page-schema.tsx
│   │   │   ├── metadata-generator.ts
│   │   │   ├── seo-provider.tsx
│   │   │   ├── seo.ts
│   │   │   └── structured-data.tsx
│   │   ├── skills
│   │   │   └── skills-chart.tsx
│   │   └── ui
│   │       ├── accordion.tsx
│   │       ├── animate-on-scroll.tsx
│   │       ├── animated-heading.tsx
│   │       ├── animated-section.tsx
│   │       ├── aspect-ratio.tsx
│   │       ├── background-effects.tsx
│   │       ├── badge.tsx
│   │       ├── breadcrumb.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── chart.tsx
│   │       ├── checkbox.tsx
│   │       ├── client-motion.tsx
│   │       ├── client-side-only.tsx
│   │       ├── collapsible.tsx
│   │       ├── command-menu.tsx
│   │       ├── command.tsx
│   │       ├── contact-dialog.tsx
│   │       ├── contact-form-server-action.tsx
│   │       ├── contact-form.tsx
│   │       ├── context-menu.tsx
│   │       ├── counter.tsx
│   │       ├── cta-section.tsx
│   │       ├── data-table-column-header.tsx
│   │       ├── data-table.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── dynamic-counters.tsx
│   │       ├── fade-in.tsx
│   │       ├── form.tsx
│   │       ├── hover-card.tsx
│   │       ├── icons.tsx
│   │       ├── image-with-fallback.tsx
│   │       ├── infinite-scroll.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── lazy-load.tsx
│   │       ├── menubar.tsx
│   │       ├── mobile-drawer.tsx
│   │       ├── optimistic.tsx
│   │       ├── optimized-image.tsx
│   │       ├── page-animations.tsx
│   │       ├── page-transition.tsx
│   │       ├── pagination.tsx
│   │       ├── popover.tsx
│   │       ├── progress.tsx
│   │       ├── radio-group.tsx
│   │       ├── resizable.tsx
│   │       ├── scroll-area.tsx
│   │       ├── scroll-fade.tsx
│   │       ├── scroll-progress.tsx
│   │       ├── scroll-to-top.tsx
│   │       ├── section-container.tsx
│   │       ├── section.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── skeleton.tsx
│   │       ├── skills-chart.tsx
│   │       ├── skills-progress.tsx
│   │       ├── skills-section.tsx
│   │       ├── slider.tsx
│   │       ├── social-share.tsx
│   │       ├── sonner-toast.tsx
│   │       ├── spinner.tsx
│   │       ├── suspense-wrapper.tsx
│   │       ├── swiper-styles-project.css
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── text-reveal.tsx
│   │       ├── textarea.tsx
│   │       ├── theme-image.tsx
│   │       ├── theme-switcher.tsx
│   │       ├── timeline.tsx
│   │       ├── toaster.tsx
│   │       ├── toggle-group.tsx
│   │       ├── toggle.tsx
│   │       ├── tooltip.tsx
│   │       ├── types.ts
│   │       ├── typewriter.tsx
│   │       ├── typography.tsx
│   │       ├── use-mobile.tsx
│   │       └── web-vitals.tsx
│   ├── content
│   │   └── projects.json
│   ├── data
│   │   ├── projects.ts
│   │   └── skills.ts
│   ├── hooks
│   │   ├── use-api-queries.ts
│   │   ├── use-debounce.ts
│   │   ├── use-local-storage.ts
│   │   ├── use-media-query.ts
│   │   ├── use-mobile.ts
│   │   ├── use-mounted.ts
│   │   ├── use-projects.ts
│   │   ├── use-scroll-position.ts
│   │   ├── use-sonner-toast.ts
│   │   └── use-swiper-autoplay.ts
│   ├── lib
│   │   ├── actions
│   │   │   ├── contact-form-action.ts
│   │   │   └── projects.ts
│   │   ├── analytics
│   │   │   ├── data-service.ts
│   │   │   ├── google-analytics.tsx
│   │   │   └── web-vitals-service.ts
│   │   ├── api
│   │   │   └── response.ts
│   │   ├── api.ts
│   │   ├── chart-utils.ts
│   │   ├── component-styles.ts
│   │   ├── config
│   │   │   └── site.ts
│   │   ├── content
│   │   │   └── projects.ts
│   │   ├── design-tokens.ts
│   │   ├── email
│   │   │   └── email-service.ts
│   │   ├── error-utils.ts
│   │   ├── image-config.ts
│   │   ├── image-processor.js
│   │   ├── memoization.ts
│   │   ├── monitoring
│   │   │   └── logger.ts
│   │   ├── query-config.ts
│   │   ├── queryKeys.ts
│   │   ├── seo
│   │   │   ├── analyzer.ts
│   │   │   ├── canonical.ts
│   │   │   ├── enhanced-metadata.ts
│   │   │   ├── index.ts
│   │   │   ├── keyword-tracker.ts
│   │   │   ├── meta-tags.ts
│   │   │   ├── metadata.ts
│   │   │   ├── site-map.ts
│   │   │   └── structured-data.tsx
│   │   ├── theme-utils.ts
│   │   ├── typography.ts
│   │   ├── utils
│   │   │   ├── css-variable-utils.ts
│   │   │   ├── register-sw.ts
│   │   │   ├── route-utils.ts
│   │   │   └── theme-colors.ts
│   │   ├── utils.ts
│   │   ├── validation.ts
│   │   └── validations
│   │       ├── blog-schema.ts
│   │       └── contact-form-schema.ts
│   ├── styles
│   │   ├── animations.css
│   │   └── fonts.ts
│   └── types
│       ├── analytics.ts
│       ├── api.ts
│       ├── chart.ts
│       ├── common.ts
│       ├── contact.ts
│       ├── experience.ts
│       ├── navigation.ts
│       ├── next-types.d.ts
│       ├── project.ts
│       ├── projects-types.ts
│       ├── projects.ts
│       ├── react-scroll.d.ts
│       ├── recharts.ts
│       ├── resume.ts
│       ├── seo.ts
│       ├── shared-api.ts
│       ├── skills.ts
│       ├── theme.ts
│       └── ui.ts
├── take-screenshots.js
├── tsconfig.json
├── tsconfig.tsbuildinfo
├── vercel.json
└── Year_Over_Year_Growth_Summary.csv
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

1. **TanStack Query Migration**: Phase I completed, Phase II (SSR/RSC hydration) in progress
   - ✅ Migrated from axios to native fetch
   - ✅ Global QueryClient setup
   - ✅ Client-side mutations refactored
   - 🔄 SSR/RSC hydration pending
   - 📋 Advanced features (prefetching, optimistic updates) planned
2. **Type-First Architecture**: Comprehensive type safety implementation completed
3. **Branch Status**: Working on `implement-api-tanstack-react-query` branch

### Business Logic
This is a **professional portfolio for Richard Hudson**, a Revenue Operations Professional. Key features:

1. **Project Showcase**: Interactive data visualization projects (churn analysis, sales funnels, lead attribution, revenue dashboards)
2. **Resume System**: PDF generation and viewing capabilities
3. **Contact Forms**: Server-side form handling with email integration (Resend)
4. **Analytics Integration**: Vercel Analytics & Speed Insights

### Performance & Security
- **Image Optimization**: Next.js Image component with AVIF/WebP formats
- **Security Headers**: CSP, XSS protection, frame options configured in `next.config.js`
- **CSP Reporting**: Endpoint at `/api/csp-report` for security monitoring
- **Caching**: 1-year cache for static assets, no-cache for API routes
- **Bundle Optimization**: Sharp for image processing, tree-shaking enabled

### Styling System
- **Design Tokens**: CSS variables in `src/lib/design-tokens.ts`
- **Theme System**: Dark/light mode with `next-themes`
- **Component Styles**: Utility-first Tailwind with component variants using `class-variance-authority`
- **Animations**: Framer Motion with CSS animations in `src/styles/animations.css`

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
- **Web Vitals Service**: Analytics endpoint at `/api/analytics/vitals`

### Code Quality
- **ESLint Configuration**: Next.js recommended rules (warnings, not errors)
- **TypeScript**: Must pass `tsc --noEmit` before deployment
- **Note**: Playwright is installed but not configured for testing

### Deployment Configuration
- **Platform**: Vercel
- **Environment**: Production
- **Build Process**: Standard Next.js build with optimization
- **Social Redirects**: Configured in `next.config.js`

## Important Development Notes

### Working with the Migration
- **Current branch**: `implement-api-tanstack-react-query` - major architectural changes in progress
- **Migration docs**: See `TANSTACK_QUERY_MIGRATION.md` for detailed migration status
- **Type architecture**: Reference `PRISMA_TYPE_FIRST_ARCHITECTURE.md` for type system implementation

### Key Files to Understand
- `src/lib/api.ts` - Centralized fetch-based API functions
- `src/hooks/use-api-queries.ts` - TanStack Query hooks for data fetching
- `src/lib/queryKeys.ts` - Query key factories for cache management
- `src/types/shared-api.ts` - Comprehensive API type definitions
- `src/components/providers/client-components-provider.tsx` - Query client setup
- `src/lib/query-config.ts` - Query configuration

### Development Workflow
1. **Type-first development**: Define types in `src/types/` before implementation
2. **Query pattern**: Use TanStack Query hooks for all client-side data fetching
3. **Server Components**: Default to Server Components, add `'use client'` only when necessary
4. **Direct imports**: Always import directly from source files, no barrel exports
5. **Linting**: Run `npm run lint` and `npm run typecheck` before committing