# Modern Portfolio - QWEN Context

## Project Overview

This is a modern portfolio website built by Richard Hudson, a Revenue Operations Professional based in Dallas-Fort Worth. The project is built with Next.js 16 (React 19) as a server-rendered application with client-side interactivity, using TypeScript for type safety, TailwindCSS for styling, and Prisma with PostgreSQL for data persistence.

### Key Technologies and Architecture

- **Framework**: Next.js 16 with App Router (RSC enabled)
- **Language**: TypeScript 5.8.3
- **Styling**: TailwindCSS with shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel (with standalone output)
- **Package Manager**: Bun 1.1.0
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: Radix UI primitives via shadcn/ui

### Project Structure

```
modern-portfolio/
├── src/
│   ├── app/                    # Next.js 16 App Router pages
│   ├── components/            # Reusable UI components
│   ├── data/                  # Data fetching utilities
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions and shared code
│   ├── styles/                # Global CSS and styling utilities
│   ├── test/                  # Test utilities and setup
│   └── types/                 # TypeScript type definitions
├── prisma/                    # Database schema and migrations
├── e2e/                       # Playwright end-to-end tests
├── scripts/                   # Build and utility scripts
└── public/                    # Static assets
```

### Key Features

1. **Portfolio Showcase**: Professional portfolio highlighting RevOps experience and achievements
2. **Blog System**: Full-featured blog with CMS capabilities, including:
   - Post management with drafts/published states
   - Categories and tags
   - SEO optimization tools
   - Analytics tracking
   - Version control for content
   - Social media optimization
3. **Data Visualization**: Interactive charts and metrics presentation
4. **SEO Optimimized**: Built-in SEO features with metadata management, sitemap generation, and performance optimization
5. **Responsive Design**: Mobile-first responsive layout using TailwindCSS
6. **Performance Optimized**: Image optimization, caching strategies, and bundle analysis
7. **Analytics Integration**: Post views, engagement tracking, and SEO event monitoring

### Database Schema Highlights

The project uses a comprehensive PostgreSQL database with Prisma ORM covering:

- **Blog System**: Posts, authors, categories, tags, versions, series
- **SEO Tools**: SEO events, keywords tracking, sitemap management
- **Analytics**: View tracking, engagement metrics, performance monitoring
- **Portfolio**: Project showcase with categorization and metrics
- **Content**: Rich text, markdown, and HTML content management

### Environment Setup

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local

# Set up database
bun run db:push
bun run db:seed

# Start development server
bun run dev
```

### Building and Running

**Development:**
```bash
bun run dev                    # Start development server
bun run dev:debug             # Start development server with debugging
```

**Production:**
```bash
bun run build                 # Build for production
bun run start                 # Start production server
bun run build:analyze         # Build with bundle analysis
```

**Database Management:**
```bash
bun run db:generate           # Generate Prisma client
bun run db:push               # Push schema changes to database
bun run db:migrate            # Run migrations
bun run db:seed               # Seed database with initial data
bun run db:studio             # Open Prisma Studio
```

**Testing:**
```bash
bun run test                  # Run unit tests
bun run test:watch           # Run unit tests in watch mode
bun run test:coverage        # Run tests with coverage report
bun run test:e2e             # Run end-to-end tests
bun run test:e2e:ui          # Run E2E tests with UI
bun run test:all             # Run all tests (unit + E2E)
```

**Linting and Type Checking:**
```bash
bun run lint                  # Lint code
bun run lint:fix              # Fix lint issues
bun run type-check           # Check TypeScript types
bun run validate             # Run type checking and linting
```

### Development Conventions

1. **Code Style**: Follows ESLint and Prettier standards with React Compiler compatibility
2. **Component Organization**: Uses shadcn/ui component library with consistent design system
3. **File Naming**: Component files use PascalCase, utils/helpers use camelCase
4. **Imports**: Path aliases using @/ prefix (e.g., @/components/, @/lib/, @/hooks/)
5. **Type Safety**: Full TypeScript coverage with strict mode enabled
6. **Testing**: Unit tests with Vitest and React Testing Library, E2E tests with Playwright
7. **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML
8. **Performance**: Client/server component separation, image optimization, lazy loading
9. **Security**: Content Security Policy, XSS prevention, secure headers

### Special Features and Optimizations

1. **React Compiler**: Enabled for automatic memoization (Next.js 16+)
2. **Advanced Image Optimization**: AVIF/WebP formats, responsive sizes, 1-year cache TTL
3. **Security Headers**: HSTS, X-Frame-Options, XSS protection, and more
4. **Performance Headers**: Proper caching strategies for static and dynamic content
5. **Bundle Analysis**: Integrated with @next/bundle-analyzer
6. **CI/CD Ready**: Husky hooks, lint-staged, and comprehensive CI scripts
7. **SEO Automation**: Dynamic sitemap generation, metadata management, and analytics
8. **Micro-interactions**: Framer Motion animations and engagement tracking

### Notable Configuration Files

- `next.config.js`: Advanced Next.js configuration with security headers and performance optimizations
- `tsconfig.json`: Strict TypeScript configuration with path aliases
- `playwright.config.ts`: Comprehensive E2E testing setup
- `vitest.config.ts`: Unit testing with coverage thresholds
- `components.json`: shadcn/ui configuration and aliasing
- `.env.example`: Template for environment variables
- `prisma/schema.prisma`: Complete database schema with relations

### Development Workflow

The project implements a modern development workflow with:
- Pre-commit hooks (Husky/lint-staged) that run linting and type checking
- Comprehensive test suite covering both unit and integration scenarios
- Automated sitemap generation after builds
- Bundle analysis capabilities
- Performance monitoring and optimization
- Accessibility compliance

### Target Audience and Purpose

This portfolio is specifically designed for Richard Hudson's role as a Revenue Operations Professional, highlighting his expertise with:
- $4.8M+ revenue impact
- 432% growth delivered
- Salesloft and HubSpot certifications
- 10+ successful project implementations
- Data analytics and process automation expertise

The technical implementation showcases modern web development practices while serving the professional goals of demonstrating expertise in sales automation, CRM optimization, and system implementation.