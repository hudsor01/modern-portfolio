# Comprehensive Codebase Review Prompt

You are a senior software architect and security engineer tasked with conducting a thorough review of a modern Next.js portfolio application. Critically analyze the entire codebase and identify any gaps, missed opportunities, or remaining anti-patterns that may have been overlooked.

## Codebase Overview
- **Application**: Modern portfolio website for a Revenue Operations professional
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5.8.3 with strict mode
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with CSS variables
- **UI Components**: Shadcn/ui with Radix UI primitives
- **State Management**: React hooks, TanStack Query for server state
- **Validation**: Zod schemas throughout

## Critical Areas to Review

### 1. Security Vulnerabilities (Highest Priority)
- **XSS Prevention**: Check ALL HTML rendering paths, including dynamic imports, dangerouslySetInnerHTML usage, and content rendering
- **SQL Injection**: Verify ALL database queries use Prisma's parameterized queries, no raw SQL execution
- **Input Validation**: Validate ALL user inputs are validated server-side with Zod
- **Authentication**: Review auth implementation for any session/token vulnerabilities
- **Rate Limiting**: Verify rate limiting is properly implemented everywhere
- **CSRF Protection**: Check CSRF tokens are validated on all state-changing operations
- **Environment Variables**: Check for hardcoded secrets or exposed sensitive information

### 2. Performance Issues (High Priority)
- **Memory Leaks**: Check for setInterval/setTimeout without cleanup, event listeners not removed
- **Bundle Size**: Identify unnecessarily large imports or unused dependencies
- **Database Queries**: Look for N+1 queries, missing indexes, inefficient queries
- **Component Re-renders**: Identify unnecessary re-renders and missing memoization
- **Image Optimization**: Verify all images use next/image with proper sizing
- **Caching Strategy**: Check for proper caching headers and strategies

### 3. React Best Practices (Medium Priority)
- **useEffect Dependencies**: Verify all useEffect hooks have correct dependency arrays
- **State Management**: Check for proper useState usage without unnecessary re-renders
- **Component Patterns**: Look for proper use of memo, useCallback, useMemo
- **Server Components**: Verify server components don't access browser-only APIs
- **Client Components**: Check for proper isolation of client-side logic

### 4. TypeScript & Type Safety (Medium Priority)
- **Any Types**: Find any remaining `any` types that should be better typed
- **Type Consistency**: Verify types are consistent across API boundaries
- **Error Handling**: Check for proper error typing and handling
- **Generics**: Ensure proper use of generics where needed

### 5. Architecture & Maintainability (Medium Priority)
- **Separation of Concerns**: Verify proper component boundaries and responsibilities
- **Naming Conventions**: Check for consistency throughout
- **Code Duplication**: Identify any repeated code that should be extracted
- **File Organization**: Verify proper placement of code in appropriate directories

### 6. Anti-Patterns (High Priority)
- **Global State Misuse**: Check for overuse of global state where local state would suffice
- **Side Effects in Render**: Verify no side effects occur during component rendering
- **Improper Cleanup**: Check for missing cleanup in effects and components
- **Async/Await Patterns**: Verify proper error handling with async operations

## Specific Areas to Scrutinize

### Components:
- All components using `dangerouslySetInnerHTML`
- Components with complex useEffect implementations
- Client components that might run on server
- Components that access browser APIs without checks

### Hooks:
- Custom hooks for missing dependencies in useEffect
- Custom hooks for proper cleanup functions
- Hooks that might have closure issues
- Performance of hooks in frequently rendered components

### Forms:
- Form submission handlers for proper validation
- Form state management for efficiency
- Error handling and display for security
- CSRF protection on all submissions

### Database:
- All Prisma queries for efficiency and security
- Transaction implementations for atomicity
- Raw SQL queries for parameterization
- Schema definitions for proper indexing

### API Routes:
- Request body parsing for multiple reads
- Response consistency and error handling
- Authentication/authorization checks
- Rate limiting implementation

### Caching:
- All cache implementations for proper invalidation
- Cache key generation for uniqueness
- Memory leaks in cache implementations

### Security:
- All validation schemas for completeness
- Authentication flows for completeness
- Sanitization functions for thoroughness
- Headers and policies for completeness

## Questions to Consider
1. Have all security vulnerabilities been properly addressed?
2. Are there any performance bottlenecks missed?
3. Do all components handle server-side rendering properly?
4. Are there any remaining type safety issues?
5. Is the error handling comprehensive and secure?
6. Are all dependencies properly optimized?
7. Have any architectural improvements been missed?
8. Are there more efficient patterns that could be adopted?
9. Is the application resilient to various failure modes?
10. Does the codebase maintain good observability practices?

## Deliverables Expected
- List of any security vulnerabilities still present
- Performance improvements that could be made  
- Type safety issues or missing types
- Architectural improvements or reorganizations
- Code quality issues or anti-patterns
- Missing tests or inadequate coverage
- Optimization opportunities
- Overall assessment of codebase health

Be extremely critical and thorough. Do not hesitate to point out any issues, no matter how small. The application should be production-ready with zero tolerance for security vulnerabilities or performance issues.