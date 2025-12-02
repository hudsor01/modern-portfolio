# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Core Development
- `pnpm dev` - Start development server (Next.js with Turbo)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix
- `pnpm type-check` - Run TypeScript type checking (note: hyphenated, not typecheck)

### Testing
- `pnpm test` - Run unit tests with Vitest
- `pnpm test:ui` - Run tests with Vitest UI
- `pnpm test:coverage` - Run tests with coverage report (80% threshold)
- `pnpm test:watch` - Run tests in watch mode
- `pnpm e2e` - Run Playwright E2E tests
- `pnpm e2e:ui` - Run E2E tests with Playwright UI
- `pnpm e2e:headed` - Run E2E tests in headed mode
- `pnpm test:all` - Run both unit and E2E tests

### Database (Prisma)
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema changes to database
- `pnpm db:migrate` - Create and apply migrations
- `pnpm db:seed` - Seed database with initial data
- `pnpm db:studio` - Open Prisma Studio GUI

### Build & Analysis
- `pnpm validate` - Run type-check and lint together
- `pnpm analyze` - Build with bundle analyzer
- `pnpm clean` - Clean build artifacts and cache
- `pnpm dev:debug` - Start dev server with Node.js inspector

### CI Commands
- `pnpm ci:quick` - Run lint and type-check in parallel (pre-push check)
- `pnpm ci:local` - Run lint, type-check, and tests in parallel
- `pnpm ci:full` - Run ci:quick then build

### Requirements
- Node.js >=22.14.0
- pnpm >=9.0.0 (package manager)
- PostgreSQL database (for Prisma features)


## Architecture Overview

### Core Stack
- **Next.js 15** with App Router and React 19
- **TypeScript 5.8** with strict mode and `noUncheckedIndexedAccess`
- **Tailwind CSS 4** for styling
- **Prisma 6** ORM with PostgreSQL
- **TanStack React Query** for server state
- **Recharts** for data visualizations
- **Framer Motion** for animations
- **Radix UI** components with shadcn/ui patterns
- **Zod** for runtime validation

### Testing Architecture
- **Vitest** for unit tests with 80% coverage thresholds
- **Playwright** for E2E testing across Chrome, Firefox, Safari
- **Test Organization**:
  - Unit tests: `src/**/__tests__/*.test.ts(x)`
  - E2E tests: `e2e/*.spec.ts`
  - Test utilities: `src/test/setup.tsx`, `src/test/factories.ts`
- **Coverage excludes**: Blog features, automation, SEO tools (see tsconfig.json)

### High-Level Architecture

#### State Management
- **TanStack Query**: Server state and caching
  - API data fetching with `src/hooks/use-api-queries.ts`
  - Query key factories in `src/lib/queryKeys.ts`
- **React Hook Form** with Zod validation for forms

#### Security & Performance
- **Rate Limiting**: Enhanced rate limiter (`src/lib/security/`)
- **JWT Auth**: Token-based authentication (`src/lib/security/jwt-auth.ts`)
- **Web Vitals**: Performance monitoring (`src/lib/analytics/`)

#### Project Structure
```
src/
├── app/                   # Next.js App Router
│   ├── api/              # REST API routes
│   ├── projects/         # Project showcase pages
│   ├── blog/             # Blog system
│   ├── contact/          # Contact form
│   └── resume/           # Resume/PDF viewing
├── lib/
│   ├── security/         # Auth, rate limiting
│   ├── analytics/        # Web vitals, metrics
│   ├── validations/      # Zod schemas
│   ├── forms/            # Form utilities
│   └── utils/            # Shared utilities
├── hooks/                # Custom React hooks
├── components/
│   ├── providers/        # React context providers
│   └── ui/               # Reusable UI components
└── test/                 # Test utilities and factories
```


## Business Context
**Professional portfolio for Richard Hudson**, Revenue Operations Professional:
- Interactive data visualization projects (Revenue KPI, Sales Analytics, etc.)
- Real business data: $4.8M+ revenue, 432% growth, 2,217% network expansion
- Contact forms with Resend email integration (enhanced with real-time validation)
- Resume generation and PDF viewing (with iframe viewer and download functionality)
- Blog system with functional article pages and navigation
- Modern glassmorphism UI with gradient backgrounds

## Development Principles

### DRY (Don't Repeat Yourself)
- Extract shared logic into reusable hooks (`src/hooks/`) or utilities (`src/lib/utils/`)
- Use shared Zod schemas in `src/lib/validations/` across API routes and forms
- Centralize query keys in `src/lib/queryKeys.ts`
- Reuse UI components from `src/components/ui/`

### KISS (Keep It Simple, Stupid)
- Prefer simple, readable solutions over clever abstractions
- Avoid premature optimization—solve the current problem first
- Use Server Components by default; only add `'use client'` when necessary
- Keep components focused on a single responsibility

### TDD (Test-Driven Development)
- Write tests before implementing features when possible
- Follow the Red-Green-Refactor cycle:
  1. Write a failing test that defines expected behavior
  2. Write minimal code to make the test pass
  3. Refactor while keeping tests green
- Maintain 80% coverage threshold (enforced by `pnpm test:coverage`)
- Use test factories in `src/test/factories.ts` for consistent test data

## Key Development Patterns

### shadcn/ui Component Usage
- **Use base components directly**: Import from `@/components/ui/` and use CVA for variants
- **No barrel files**: Components export themselves directly, no `index.ts` re-exports
- **No wrapper abstractions**: Don't create wrapper components around shadcn/ui base components
- **CVA for variants**: Use `class-variance-authority` to create component variants
- **Composition over abstraction**: Compose base components in your pages/features instead of creating abstraction layers

Example pattern:
```tsx
// CORRECT: Use shadcn/ui base components directly
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

// WRONG: Don't create wrappers like <MyCustomChartCard> or <QueryAwareChart>
```

### TypeScript Configuration
- **Strict mode** enabled with `noUncheckedIndexedAccess: true`
- **Path aliases**: `@/` for src root, `@/components/*`, `@/lib/*`, etc.
- **Excludes**: Blog features, automation, SEO tools excluded from compilation (see tsconfig.json)

### API Patterns
1. **REST API** (`src/app/api/`): Next.js API routes with Zod validation
2. **Server Actions** (`src/lib/actions/`): Form submissions and mutations
3. **Native fetch**: No axios, use `src/lib/api/` utilities

### State Management
1. **TanStack Query** for server state (`src/hooks/use-api-queries.ts`)
2. **Query keys** centralized in `src/lib/queryKeys.ts`
3. **React Hook Form** for form state with Zod schemas

### Testing Strategy
- Run `pnpm test` for unit tests (80% coverage target)
- Run `pnpm e2e` for Playwright tests
- Test factories in `src/test/factories.ts`
- Global setup in `src/test/setup.tsx`

### Environment Variables
Required variables:
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

## Key Features
- **PDF Resume Viewer**: Iframe implementation with download functionality
- **Blog System**: API integration with navigation
- **Contact Form**: Real-time validation, progress tracking, visual subject selection
- **Project Showcase**: Interactive data visualization projects with Recharts