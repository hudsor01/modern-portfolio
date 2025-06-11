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
- **TypeScript 5.8.2** with strict mode and `noUncheckedIndexedAccess`
- **Tailwind CSS 4.0.17** for styling with CSS variables for theming
- **Recharts 2.15.1** for data visualizations
- **Framer Motion 12.6.2** for animations
- **shadcn/ui + Radix UI** for component primitives

### Project Structure
- Uses **App Router** with route groups: `app/(home)/`
- **Feature-based organization**: Components grouped by domain rather than type
- **Centralized types**: All interfaces/types in `/types/` directory
- **Direct imports**: No barrel files/index exports - import directly from source files
- **Path aliases**: `@/` for root, `@components/`, `@lib/`, `@app/`, `@utils/`

### Key Architectural Patterns

#### Route Organization
```
app/
├── layout.tsx              # Root layout
├── (home)/                # Route group
│   ├── layout.tsx         # Home-specific layout with fonts/providers
│   ├── page.tsx           # Home page
│   ├── about/page.tsx     # About page
│   ├── projects/          # Projects section
│   └── resume/            # Resume section
└── api/                   # API routes (REST endpoints)
```

#### Component Architecture
- **Server Components by default** - only add `'use client'` when needed for browser APIs/state
- **Component composition**: `components/layout/`, `components/ui/`, `components/seo/`
- **Provider pattern**: Theme provider, client components provider at root level
- **Responsive design**: Mobile-first with Tailwind breakpoints

#### Data Layer
- **Static project data** in `app/(home)/projects/data/projects.ts`
- **Type-safe APIs** with Zod validation (`lib/validations/`)
- **Server Actions** for form handling (contact forms, resume generation)
- **Caching strategy**: Aggressive static caching, no-cache for APIs

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
- **Strict TypeScript**: All types in `/types/` directory
- **Zod Validation**: Input/output validation for forms and APIs
- **No implicit any**: Explicit typing required throughout

#### Component Development
- **Single Responsibility**: Small, focused components  
- **Composition over Inheritance**: Use component composition patterns
- **Props Interface**: All component props typed in `/types/ui.ts`
- **Server-First**: Default to Server Components, Client Components only when needed

#### API Design
- **RESTful Routes**: Follow Next.js API route conventions
- **Server Actions**: For form submissions and mutations
- **Type-Safe Responses**: Consistent response types in `/app/api/types.ts`
- **Error Handling**: Proper error boundaries and user feedback

### Data Visualization
Projects heavily feature **Recharts** for business analytics dashboards:
- Revenue KPI tracking
- Customer churn/retention analysis  
- Sales pipeline funnels
- Lead attribution analytics

Chart components are reusable and located in project-specific directories under `app/(home)/projects/`.

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