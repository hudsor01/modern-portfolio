# Technology Stack

**Analysis Date:** 2026-01-08

## Languages

**Primary:**
- TypeScript 5.9.3 - All application code (`package.json`, `tsconfig.json`)

**Secondary:**
- JavaScript (ES modules) - Configuration files (`package.json`)

## Runtime

**Environment:**
- Node.js 22.x - `.nvmrc`
- Bun 1.3.5 (package manager & runtime) - `package.json`

**Package Manager:**
- Bun 1.3.5
- Lockfile: `bun.lockb` present

## Frameworks

**Core:**
- Next.js 16.1.1 (App Router) - `package.json`, `next.config.js`
- React 19.2.3 - `package.json`
- React DOM 19.2.3 - `package.json`

**Testing:**
- Bun Test (Jest-compatible) - Built into Bun runtime
- @testing-library/react 16.3.1 - Component testing
- @testing-library/jest-dom 6.9.1 - DOM matchers
- @playwright/test 1.57.0 - E2E testing
- happy-dom 20.0.11 - DOM implementation for testing

**Build/Dev:**
- TypeScript 5.9.3 - `tsconfig.json`
- Tailwind CSS 4.1.18 - `postcss.config.mjs`
- PostCSS 8.5.6 - `postcss.config.mjs`
- ESLint 9.39.2 - `eslint.config.mjs`
- Husky 9.1.7 - Git hooks for pre-commit checks
- lint-staged 16.2.7 - Runs linters on staged files

## Key Dependencies

**Critical:**
- Prisma 7.2.0 - ORM for PostgreSQL database (`prisma/schema.prisma`, `src/lib/db.ts`)
- Zod 4.3.5 - Schema validation (`src/lib/validations/unified-schemas.ts`)
- Resend 6.6.0 - Email service (`src/lib/email/email-service.ts`, `src/app/api/contact/route.ts`)
- DOMPurify 3.3.1 - HTML sanitization (`src/app/blog/components/blog-content.tsx`)

**Infrastructure:**
- @prisma/adapter-pg 7.2.0 - PostgreSQL adapter (`src/lib/db.ts`)
- pg 8.16.3 - Native PostgreSQL driver (`src/lib/prisma.ts`)
- @vercel/analytics 1.6.1 - Performance monitoring

**UI Framework:**
- Radix UI components (multiple packages) - Accessible primitives
- shadcn/ui pattern (via Radix + CVA)
- motion 12.24.7 - Animations (`src/components/ui/*.tsx`)
- Class Variance Authority 0.7.1 - Component variants
- lucide-react 0.562.0 - Icons
- sonner 2.0.7 - Toast notifications
- Recharts 3.6.0 - Data visualization (`src/app/projects/*/LeadSourcePieChart.tsx`)

**State Management:**
- TanStack Query 5.90.16 - Server state (`src/lib/queryKeys.ts`)
- TanStack Form 1.27.7 - Form management
- TanStack Table 8.21.3 - Table state
- nuqs 2.8.6 - URL state (`src/app/projects/*/page.tsx`)

## Configuration

**Environment:**
- `.env.example` - Template for environment variables
- Required variables: DATABASE_URL, RESEND_API_KEY, CONTACT_EMAIL, JWT_SECRET, NODE_ENV
- Optional: NEXT_PUBLIC_SITE_URL, VERCEL_ANALYTICS_ID

**Build:**
- `next.config.js` - Next.js 16 config with React Compiler, image optimization, security headers
- `tsconfig.json` - Strict TypeScript with path aliases (@/*, @/components/*, etc.)
- `postcss.config.mjs` - PostCSS with Tailwind CSS 4
- `eslint.config.mjs` - ESLint flat config (ESLint 9 format)
- `bunfig.toml` - Bun test configuration with 80% coverage threshold
- `playwright.config.ts` - E2E testing configuration
- `.prettierrc.json` - Code formatter

## Platform Requirements

**Development:**
- Any platform with Node.js 22.x + Bun 1.3.5
- PostgreSQL database
- No Docker required (optional)

**Production:**
- Vercel (recommended deployment platform)
- PostgreSQL database (connection pooling configured)
- Node.js 22.x environment

---

*Stack analysis: 2026-01-08*
*Update after major dependency changes*
