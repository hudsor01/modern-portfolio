# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Core Development
- `npm run dev` - Start development server (Next.js with Turbo)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run type-check` - Run TypeScript type checking (note: hyphenated, not typecheck)

### Testing
- `npm run test` - Run unit tests with Vitest
- `npm run test:ui` - Run tests with Vitest UI
- `npm run test:coverage` - Run tests with coverage report (80% threshold)
- `npm run test:watch` - Run tests in watch mode
- `npm run e2e` - Run Playwright E2E tests
- `npm run e2e:ui` - Run E2E tests with Playwright UI
- `npm run e2e:headed` - Run E2E tests in headed mode
- `npm run test:all` - Run both unit and E2E tests

### Database (Prisma)
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and apply migrations
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio GUI

### Build & Analysis
- `npm run validate` - Run type-check and lint together
- `npm run analyze` - Build with bundle analyzer
- `npm run clean` - Clean build artifacts and cache
- `npm run dev:debug` - Start dev server with Node.js inspector

### Requirements
- Node.js >=22.14.0
- npm 11.2.0 (package manager)
- PostgreSQL database (for Prisma features)


## Architecture Overview

### Core Stack
- **Next.js 15.4.5** with App Router and React 19
- **TypeScript 5.8.3** with strict mode and `noUncheckedIndexedAccess`
- **Tailwind CSS 4.1.11** for styling
- **Prisma 6.13.0** ORM with PostgreSQL
- **Jotai 2.13.0** for atomic state management
- **TanStack React Query 5.84.1** for server state
- **Hono 4.8.2** for RPC API layer (`src/server/rpc/`)
- **Recharts 3.1.2** for data visualizations
- **Framer Motion 12.23.12** for animations
- **Radix UI** components with shadcn/ui patterns
- **Zod 4.0.15** for runtime validation

### Testing Architecture
- **Vitest** for unit tests with 80% coverage thresholds
- **Playwright** for E2E testing across Chrome, Firefox, Safari
- **Test Organization**:
  - Unit tests: `src/**/__tests__/*.test.ts(x)`
  - E2E tests: `e2e/*.spec.ts`
  - Test utilities: `src/test/setup.tsx`, `src/test/factories.ts`
- **Coverage excludes**: Blog features, automation, SEO tools (see tsconfig.json)

### High-Level Architecture

#### State Management Layers
1. **Jotai Atoms** (`src/lib/atoms/`): Client-side atomic state
   - Form state, UI state, user preferences
   - Cross-tab synchronization utilities
   - Optimistic updates and local mutations
2. **TanStack Query**: Server state and caching
   - API data fetching with `src/hooks/use-api-queries.ts`
   - Query key factories in `src/lib/queryKeys.ts`
3. **Hono RPC** (`src/server/rpc/`): Type-safe API layer
   - Routes defined in `src/server/rpc/routes/`
   - Middleware for auth, rate limiting, validation
   - Client available at `src/server/rpc/client.ts`

#### Security & Performance
- **CSP with Nonces**: Dynamic CSP headers in middleware.ts
- **Rate Limiting**: Enhanced rate limiter with analytics (`src/lib/security/enhanced-rate-limiter.ts`)
- **JWT Auth**: Token-based authentication (`src/lib/security/jwt-auth.ts`)
- **Environment Validation**: Zod-based env validation at build time
- **Web Vitals**: Performance monitoring service (`src/lib/analytics/web-vitals-service.ts`)

#### Project Structure
```
src/
├── app/                   # Next.js App Router
│   ├── api/              # REST API routes
│   │   └── rpc/[[...route]]/ # Hono RPC endpoint
│   └── projects/         # Project showcase pages
├── server/
│   └── rpc/              # Hono RPC server
│       ├── app.ts        # Hono app configuration
│       ├── client.ts     # Type-safe RPC client
│       ├── middleware.ts # Auth, rate limiting
│       └── routes/       # API route handlers
├── lib/
│   ├── atoms/            # Jotai state atoms
│   ├── security/         # Auth, rate limiting, CSP
│   └── analytics/        # Web vitals, metrics
├── components/
│   ├── providers/        # React context providers
│   └── ui/               # Reusable UI components
└── test/                  # Test utilities and factories
```


## Business Context
**Professional portfolio for Richard Hudson**, Revenue Operations Professional:
- Interactive data visualization projects (Revenue KPI, Sales Analytics, etc.)
- Real business data: $4.8M+ revenue, 432% growth, 2,217% network expansion
- Contact forms with Resend email integration (enhanced with real-time validation)
- Resume generation and PDF viewing (with iframe viewer and download functionality)
- Blog system with functional article pages and navigation
- Modern glassmorphism UI with gradient backgrounds

## Key Development Patterns

### TypeScript Configuration
- **Strict mode** enabled with `noUncheckedIndexedAccess: true`
- **Path aliases**: `@/` for src root, `@/components/*`, `@/lib/*`, etc.
- **Excludes**: Blog features, automation, SEO tools excluded from compilation (see tsconfig.json)

### API Patterns
1. **Hono RPC** (`src/server/rpc/`): Type-safe API with Zod validation
2. **REST API** (`src/app/api/`): Traditional Next.js API routes
3. **Server Actions**: Form submissions and mutations
4. **Native fetch**: No axios, use `src/lib/api.ts` utilities

### State Management
1. **Jotai atoms** for client state (`src/lib/atoms/`)
2. **TanStack Query** for server state (`src/hooks/use-api-queries.ts`)
3. **Query keys** centralized in `src/lib/queryKeys.ts`

### Testing Strategy
- Run `npm run test` for unit tests (80% coverage target)
- Run `npm run e2e` for Playwright tests
- Test factories in `src/test/factories.ts`
- Global setup in `src/test/setup.tsx`

### Environment Variables
Required variables (see `.env.example`):
- `DATABASE_URL`: PostgreSQL connection string
- `RESEND_API_KEY`: Email service API key
- `JWT_SECRET`: Authentication secret (32+ chars)
- `CONTACT_EMAIL`: Where to send contact form submissions

## Design System Conventions
- **Glassmorphism containers**: `bg-white/5 backdrop-blur border border-white/10`
- **Container pattern**: Outer `rounded-3xl`, inner `rounded-2xl`
- **CTA buttons**: Blue gradient `bg-gradient-to-r from-blue-500 to-indigo-600`
- **Mobile-first**: Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`)
- **Server Components by default**: Only use `'use client'` when necessary

## Recent Updates (Aug 2025)
- **PDF Resume Viewer**: Fixed with proper iframe implementation and download functionality
- **Blog System**: Restored functionality with proper API integration and navigation
- **Contact Form**: Enhanced with enterprise-level features (real-time validation, progress tracking, visual subject selection)
- **Project Cleanup**: Removed temporary database scripts and development artifacts
- **Performance**: Optimized build process and cleaned cache artifacts