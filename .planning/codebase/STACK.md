# Technology Stack

## Runtime & Package Management
- **Bun 1.3.5** - Primary runtime with native TypeScript support
- **Node.js 22.x** - Compatibility target (>=22.0.0 <25.0.0)
- **Package Manager**: Bun (ESM module system)

## Core Framework & Language
- **Next.js 16.1.1** - App Router with React Server Components
- **React 19.2.3** - Latest with React Compiler integration
- **TypeScript 5.9.3** - Strict mode enabled

## Styling & UI Framework
- **Tailwind CSS 4.1.18** - Utility-first CSS framework with PostCSS 8.5.6
- **@tailwindcss/postcss 4.1.18** - PostCSS integration
- **tailwind-merge 3.4.0** - Class name merging utility
- **tw-animate-css 1.4.0** - Animation utilities
- **class-variance-authority 0.7.1** - CVA variant patterns

## UI Component Libraries
- **Radix UI** - Complete accessible component primitives:
  - @radix-ui/react-avatar 1.1.11
  - @radix-ui/react-checkbox 1.3.3
  - @radix-ui/react-dialog 1.1.15
  - @radix-ui/react-dropdown-menu 2.1.16
  - @radix-ui/react-icons 1.3.2
  - @radix-ui/react-label 2.1.8
  - @radix-ui/react-popover 1.1.15
  - @radix-ui/react-select 2.2.6
  - @radix-ui/react-separator 1.1.8
  - @radix-ui/react-slot 1.2.4
  - @radix-ui/react-switch 1.2.6
  - @radix-ui/react-tabs 1.1.13
  - @radix-ui/react-toggle 1.1.10

- **shadcn/ui** - Higher-level component wrapper on Radix
- **Lucide React 0.562.0** - Icon library (560+ icons)

## Additional UI Components
- **react-day-picker 9.13.0** - Date picker
- **react-resizable-panels 4.3.0** - Resizable layouts
- **react-intersection-observer 10.0.0** - Lazy loading triggers
- **cmdk 1.1.1** - Command palette/search
- **sonner 2.0.7** - Toast notifications
- **vaul 1.1.2** - Drawer component
- **Swiper 12.0.3** - Carousel/slider
- **motion 12.24.7** - Animation library
- **react-error-boundary 6.0.2** - Error boundary wrapper

## Database & ORM
- **PostgreSQL** - Primary database with connection pooling
  - Connection config: `?connection_limit=10&pool_timeout=20`
  - Extensions: `citext` (case-insensitive text)
  - Full-text search support via `fullTextSearchPostgres` preview
- **Prisma 7.2.0** - Modern ORM with migrations
  - @prisma/client 7.2.0
  - @prisma/adapter-pg 7.2.0 - Native PostgreSQL driver adapter
  - Generator output: `./prisma/generated/prisma`
- **pg 8.16.3** - PostgreSQL client library

## State Management
- **TanStack React Query 5.90.16** - Data synchronization & caching
- **TanStack React Form 1.27.7** - Headless form library
- **TanStack React Table 8.21.3** - Headless table library
- **next-themes 0.4.6** - Dark/light mode management
- **nuqs 2.8.6** - URL query state management

## Form Handling & Validation
- **Zod 4.3.5** - TypeScript-first schema validation
- **TanStack Form 1.27.7** - Client-side form state
- **dompurify 3.3.1** - HTML sanitization
- **isomorphic-dompurify 2.35.0** - SSR-compatible DOMPurify

## Data Visualization
- **Recharts 3.6.0** - React charting library
  - Area charts, bar charts, line charts
  - Custom theme integration

## Email & Communication
- **Resend 6.6.0** - Production email service
  - From: `contact@richardwhudsonjr.com`
  - Features: HTML/plain text templates, custom headers

## Analytics & Monitoring
- **@vercel/analytics 1.6.1** - Web performance metrics
  - Automatic Core Web Vitals tracking
- **Custom Web Vitals Service** - Data aggregation for analytics

## Date/Time Handling
- **date-fns 4.1.0** - Modern date utility library

## Build Tools
- **Next.js Build** - `bun --bun next build`
- **Output**: Standalone (Docker-ready)
- **React Compiler**: Enabled for automatic memoization
- **Image Optimization**: AVIF & WebP formats, 1-year cache TTL
- **Sharp 0.34.5** - High-performance image processing

## Development Tools
- **TypeScript 5.9.3** - Strict mode with incremental compilation
- **ESLint 9.39.2** - Code linting
  - @typescript-eslint/eslint-plugin 8.52.0
  - @typescript-eslint/parser 8.52.0
  - @next/eslint-plugin-next 16.1.1
  - eslint-plugin-react 7.37.5
  - eslint-plugin-react-hooks 7.0.1
  - eslint-plugin-jsx-a11y 6.10.2
- **Lefthook 2.0.13** - Git hook management
- **lint-staged 16.2.7** - Staged file linting
- **concurrently 9.2.1** - Run multiple commands

## Testing Infrastructure
- **Bun Test** - Jest-compatible native test runner
- **@testing-library/react 16.3.1** - Component testing
- **@testing-library/jest-dom 6.9.1** - DOM matchers
- **@testing-library/user-event 14.6.1** - User interaction simulation
- **happy-dom 20.0.11** - Lightweight DOM implementation
- **@happy-dom/global-registrator 20.0.11** - Global DOM setup
- **fast-check 4.5.3** - Property-based testing
- **Playwright 1.57.0** - Cross-browser E2E testing
  - @playwright/test 1.57.0

## Production Dependencies
- **server-only 0.0.1** - Server-side code enforcement
- **postcss 8.5.6** - CSS transformations

## Key Technology Decisions

| Decision | Rationale |
|----------|-----------|
| **Bun Runtime** | 30% faster than Node.js, native TypeScript, better DX |
| **Next.js 16 App Router** | Modern routing, Server Components, improved performance |
| **Prisma 7 Driver Adapter** | Better PostgreSQL support, native connection pooling |
| **TanStack Query v5** | Simplifies async state, auto cache invalidation, offline support |
| **Zod Validation** | Type-safe schemas, TypeScript inference |
| **Tailwind CSS 4** | Utility-first, smaller bundle, engine rewrite |
| **React Compiler** | Automatic memoization, reduces manual optimization |

---

*Last updated: 2026-01-09*
