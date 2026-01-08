# Coding Conventions

**Analysis Date:** 2026-01-08

## Naming Patterns

**Files:**
- kebab-case for utility/service files (`rate-limiter.ts`, `contact-dto.ts`, `email-service.ts`)
- PascalCase for React components (`Card.tsx`, `Label.tsx`, `Navbar.tsx`)
- use-* prefix for hooks (`use-contact-form.ts`, `use-debounce.ts`, `use-media-query.ts`)
- *.test.ts or *.test.tsx for test files
- route.ts for Next.js API handlers
- page.tsx for Next.js page components

**Functions:**
- camelCase for all functions
- Prefixes: get* (getters), create* (constructors), validate* (validators), check* (checks), handle* (handlers), is*/has* (predicates)
- Examples: `getSiteConfig()`, `createSuccessResponse()`, `validateContactForm()`, `checkLimit()`, `handleHookError()`

**Variables:**
- camelCase for variables (`navConfig`, `mainNav`)
- UPPER_SNAKE_CASE for constants (`MAX_RETRIES`, `API_BASE_URL`)
- _prefix for private/internal members (`_siteConfig`, `_enhancedRateLimiter`)

**Types:**
- PascalCase for interfaces and types (`ContactFormData`, `ContactSubmissionDTO`, `RateLimitRecord`)
- No I prefix for interfaces (use `User` not `IUser`)
- PascalCase for enum names, UPPER_CASE for values (`Status.PENDING`)

## Code Style

**Formatting:**
- Prettier enforced (`.prettierrc.json`)
- 100 character print width
- 2-space indentation
- Single quotes for strings, double quotes for JSX attributes
- No semicolons
- ES5 trailing commas
- Arrow parens always required

**Linting:**
- ESLint 9 with flat config format (`eslint.config.mjs`)
- Plugins: @eslint/js, typescript-eslint, react, react-hooks, jsx-a11y, next
- Unused vars: Prefix with _ to silence warnings
- Run: `bun run lint`

## Import Organization

**Order:**
1. External packages (react, next, third-party libraries)
2. Internal modules (@/lib, @/components, etc.)
3. Relative imports (., ..)
4. Type imports (import type {})

**Grouping:**
- Blank line between groups
- Alphabetical within each group

**Path Aliases:**
- @/* → src/*
- @/components/* → src/components/*
- @/lib/* → src/lib/*
- @/hooks/* → src/hooks/*
- @/types/* → src/types/*

## Error Handling

**Patterns:**
- Throw errors, catch at boundaries (route handlers, Server Components)
- Extend Error class for custom errors (`ValidationError`, `NotFoundError`)
- Async functions use try/catch, no .catch() chains
- Log error with context before throwing: `logger.error({ err, userId }, 'Failed to process')`
- Include cause: `new Error('Failed to X', { cause: originalError })`

**Error Types:**
- Throw on: invalid input, missing dependencies, invariant violations
- Return Result<T, E> for expected failures (not currently used)

## Logging

**Framework:**
- Structured logging via `src/lib/monitoring/logger.ts`
- Levels: debug, info, warn, error
- Context-aware: `createContextLogger('ComponentName')`

**Patterns:**
- Structured data: `logger.info({ userId, action }, 'User action')`
- Log at service boundaries, not in utilities
- Log state transitions, external API calls, errors
- No console.log in committed code (use logger)

## Comments

**When to Comment:**
- Explain why, not what
- Document business rules and edge cases
- Explain non-obvious algorithms or workarounds
- Avoid obvious comments

**JSDoc/TSDoc:**
- Required for public API functions (exported utilities)
- Optional for internal functions if signature is self-explanatory
- Use @param, @returns, @throws tags when needed

**TODO Comments:**
- Format: `// TODO: description`
- Link to issue if available: `// TODO: Fix race condition (issue #123)`

**Section Comments:**
- Large files use section headers:
```typescript
// ============================================================================
// SECTION NAME
// ============================================================================
```

## Function Design

**Size:**
- Keep under 50 lines where possible
- Extract helpers for complex logic
- One level of abstraction per function

**Parameters:**
- Max 3 parameters
- Use options object for 4+ parameters: `function create(options: CreateOptions)`
- Destructure in parameter list: `function process({ id, name }: ProcessParams)`

**Return Values:**
- Explicit return statements
- Return early for guard clauses
- Avoid implicit undefined returns

## Module Design

**Exports:**
- Named exports preferred (`export const`, `export function`, `export interface`)
- Default exports only for React components (Next.js pages, layouts)
- Export public API from index.ts barrel files

**Barrel Files:**
- index.ts re-exports public API
- Keep internal helpers private (don't export from index)
- Avoid circular dependencies

**Server-Only Pattern:**
- Files that must run on server: `import 'server-only'` at top
- Examples: `src/lib/dto/contact-dto.ts`, `src/lib/db.ts`

## TypeScript Patterns

**Type Exports:**
- Use `export interface` and `export type` declarations
- Avoid `export default` for types
- Zod schemas as single source of truth: `z.infer<typeof schema>`

**Type Safety:**
- Strict mode enabled (`tsconfig.json`)
- Avoid `any` (230+ usages exist, but should be reduced)
- Use `unknown` for truly unknown types
- Use type guards for narrowing

---

*Convention analysis: 2026-01-08*
*Update when patterns change*
