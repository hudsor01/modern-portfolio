# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Core Development
- `bun dev` - Start development server (Next.js with Turbo)
- `bun run build` - Build for production
- `bun start` - Start production server
- `bun run lint` - Run ESLint
- `bun run lint:fix` - Run ESLint with auto-fix
- `bun run type-check` - Run TypeScript type checking (note: hyphenated, not typecheck)

### Testing
- `bun test` - Run unit tests with Vitest
- `bun run test:ui` - Run tests with Vitest UI
- `bun run test:coverage` - Run tests with coverage report (80% threshold)
- `bun run test:watch` - Run tests in watch mode
- `bun run e2e` - Run Playwright E2E tests
- `bun run e2e:ui` - Run E2E tests with Playwright UI
- `bun run e2e:headed` - Run E2E tests in headed mode
- `bun run test:all` - Run both unit and E2E tests

### Database (Prisma)
- `bun run db:generate` - Generate Prisma client
- `bun run db:push` - Push schema changes to database
- `bun run db:migrate` - Create and apply migrations
- `bun run db:seed` - Seed database with initial data
- `bun run db:studio` - Open Prisma Studio GUI

### Build & Analysis
- `bun run validate` - Run type-check and lint together
- `bun run analyze` - Build with bundle analyzer
- `bun run clean` - Clean build artifacts and cache
- `bun run dev:debug` - Start dev server with Bun inspector

### CI Commands
- `bun run ci:quick` - Run lint and type-check in parallel (pre-push check)
- `bun run ci:local` - Run lint, type-check, and tests in parallel
- `bun run ci:full` - Run ci:quick then build

### Requirements
- Bun >= 1.1.0 (runtime and package manager)
- Node.js >= 22.0.0 (for compatibility)
- PostgreSQL database (for Prisma features)


## Architecture Overview

### Core Stack
- **Bun 1.1+** as runtime and package manager
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
- **Coverage**: 80% threshold enforced via `bun run test:coverage`

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
- Maintain 80% coverage threshold (enforced by `bun run test:coverage`)
- Use test factories in `src/test/factories.ts` for consistent test data

## Coding Standards (Mandatory)

### YAGNI (You Aren't Gonna Need It)
- **Do not implement features, functionality, or infrastructure that is not immediately required**
- No speculative coding, no "just in case" implementations, no premature optimization
- If it's not needed now, it will not be developed
- Applies to: libraries, frameworks, database schemas, API endpoints, and business logic
- Remove dead code immediately—don't comment it out "for later"

### Composition Over Inheritance
- Build all system components using composition rather than inheritance hierarchies
- **Avoid deep inheritance trees**—prefer flat component structures
- Build functionality by combining smaller, independent components
- Never create parent-child class relationships for code reuse
- Use hooks for shared behavior, not base classes

### Explicit Data Flow & Type Safety
- All data must have clearly defined, strongly typed interfaces
- **No `any` types, no dynamic types, no implicit conversions**
- No untyped objects passed between functions
- All inputs, outputs, and transformations must be explicitly declared with proper type annotations
- Data crossing module boundaries must be validated with Zod and typed
- **Never disable ESLint type-checking rules** (`@typescript-eslint/no-explicit-any`)

### Small, Focused Modules (High Cohesion, Low Coupling)
- Each module, class, function, and component must have a single, well-defined purpose
- **Maximum component size: 300 lines** (split larger components)
- **Maximum function size: 50 lines** (extract helper functions)
- Modules should only contain code directly related to their primary responsibility
- Dependencies between modules must be minimal and clearly defined through explicit interfaces
- Extract related state into custom hooks (e.g., `useContactForm` instead of 7 separate `useState`)

### Fail Fast, Log Precisely
- Validate inputs immediately and throw clear, specific errors when invalid data is encountered
- **Do not attempt to recover from invalid states silently**
- Never swallow errors or use empty catch blocks
- All error conditions must be logged with sufficient context to identify root cause
- Error messages must be actionable—include what failed, why, and how to fix
- **No fire-and-forget promises**—always handle rejections explicitly

### Idempotency Everywhere
- All operations that modify state or interact with external systems must be idempotent
- Running the same operation multiple times must produce the same result as running it once
- Applies to: database operations, API calls, file operations, and any state-changing functions
- Use unique identifiers and upsert patterns where appropriate

### Predictable State Management
- All application state must be managed in a deterministic, traceable manner
- **No hidden global state, no implicit side effects, no shared mutable state**
- State changes must follow clear, predictable patterns
- Derive computed values with `useMemo`—never use `useEffect` + `setState` for derived state
- Use TanStack Query for server state, local state only for UI concerns

### Single Responsibility Principle
- Every function, class, module, and service must have exactly one reason to change
- If a component handles multiple concerns, split it into separate components
- Separate: business logic, data access, presentation, and infrastructure concerns
- One file = one export = one purpose

### Prefer Readability Over Cleverness
- Code must be written for human understanding first, performance second
- **No clever tricks, no overly compact syntax, no "smart" solutions that sacrifice clarity**
- The codebase must be understandable by any team member without extensive documentation
- Use descriptive variable names, even if longer
- Prefer explicit over implicit behavior

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

### API Patterns
1. **REST API** (`src/app/api/`): Next.js API routes with Zod validation
2. **Server Actions** (`src/lib/actions/`): Form submissions and mutations
3. **Native fetch**: No axios, use `src/lib/api/` utilities

### State Management
1. **TanStack Query** for server state (`src/hooks/use-api-queries.ts`)
2. **Query keys** centralized in `src/lib/queryKeys.ts`
3. **React Hook Form** for form state with Zod schemas

### Testing Strategy
- Run `bun test` for unit tests (80% coverage target)
- Run `bun run e2e` for Playwright tests
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
- **Project Showcase**: Interactive data visualization projects with RechartsUse 'bd' for task tracking
