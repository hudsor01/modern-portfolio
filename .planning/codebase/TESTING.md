# Testing Patterns

**Analysis Date:** 2026-01-08

## Test Framework

**Runner:**
- Bun Test (Jest-compatible API, built into Bun runtime)
- Config: `bunfig.toml` in project root
- Coverage: 80% threshold (lines, functions, statements)

**Assertion Library:**
- Bun Test built-in `expect`
- Matchers: toBe, toEqual, toThrow, toMatchObject, toHaveBeenCalled, etc.

**Run Commands:**
```bash
bun test                              # Run all tests
bun test --watch                      # Watch mode
bun test path/to/file.test.ts        # Single file
bun run test:coverage                 # Coverage report
```

## Test File Organization

**Location:**
- `__tests__/` directories co-located with source files
- Pattern: `src/**/__tests__/*.test.ts` or `*.test.tsx`

**Naming:**
- Matches source file name with `.test` suffix
- Examples: `label.test.tsx`, `route.test.ts`, `use-blog-post-form.test.ts`

**Structure:**
```
src/
  components/ui/
    label.tsx
    __tests__/
      label.test.tsx
  app/api/contact/
    route.ts
    __tests__/
      route.test.ts
  hooks/
    use-debounce.ts
    __tests__/
      use-debounce.test.ts
```

## Test Structure

**Suite Organization:**
```typescript
import { describe, it, expect, vi, mock, beforeEach, afterEach } from 'bun:test'

describe('ModuleName', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('functionName', () => {
    it('should handle success case', async () => {
      // Arrange
      mockFn.mockResolvedValue(...)

      // Act
      const result = await functionUnderTest()

      // Assert
      expect(result).toBe(expected)
      expect(mockFn).toHaveBeenCalledWith(...)
    })

    it('should handle error case', () => {
      expect(() => functionCall()).toThrow('error message')
    })
  })
})
```

**Patterns:**
- Use `beforeEach` for per-test setup, avoid `beforeAll`
- Use `afterEach` to restore mocks: `vi.restoreAllMocks()`
- Explicit arrange/act/assert comments in complex tests
- One assertion focus per test (multiple expects OK)

## Mocking

**Framework:**
- Bun Test built-in mocking (Vitest-compatible `vi`)
- Module mocking via `mock.module()` at top of test file

**Patterns:**
```typescript
import { mock, vi } from 'bun:test'

// Mock module
mock.module('@/lib/db', () => ({
  db: {
    contactSubmission: {
      create: vi.fn(),
      update: vi.fn()
    }
  }
}))

// In test
const mockCreate = vi.mocked(db.contactSubmission.create)
mockCreate.mockResolvedValue({ id: 'test-id', ... })

// Cleanup
afterAll(() => {
  mock.restore()
})
```

**What to Mock:**
- Database operations (Prisma client)
- External APIs (Resend, etc.)
- File system operations
- Environment variables
- Time/dates (`vi.useFakeTimers()`)

**What NOT to Mock:**
- Pure functions
- Internal business logic
- Simple utilities (string manipulation, array helpers)
- TypeScript types

## Fixtures and Factories

**Test Data:**
```typescript
// Factory functions in test file
function createTestUser(overrides?: Partial<User>): User {
  return {
    id: 'test-id',
    name: 'Test User',
    email: 'test@example.com',
    ...overrides
  }
}

// Inline mock data
const mockData = {
  id: 'test',
  value: 42
}
```

**Location:**
- Factory functions: Define in test file near usage
- Shared fixtures: Could use `src/test/fixtures/` (not currently implemented)
- Mock data: Inline in test when simple, factory when complex

## Coverage

**Requirements:**
- Target: 80% line/function/statement coverage
- Enforcement: Configured in `bunfig.toml`
- 72 files/patterns excluded from coverage (UI-heavy, generated code, test infrastructure)

**Configuration:**
- Tool: Bun Test built-in coverage
- Excludes: `src/test/**`, `prisma/generated/**`, `src/components/seo/json-ld/**`, chart components, monitoring

**View Coverage:**
```bash
bun run test:coverage
# Coverage report in terminal
```

## Test Types

**Unit Tests:**
- Test single function/component in isolation
- Mock all external dependencies (db, APIs, file system)
- Fast: Each test <100ms
- Examples: `src/lib/security/__tests__/rate-limiter.test.ts`, `src/hooks/__tests__/use-debounce.test.ts`

**Integration Tests:**
- Test multiple modules together
- Mock only external boundaries (database, external APIs)
- Examples: `src/app/api/contact/__tests__/route.test.ts` (tests route + validation + error handling)

**E2E Tests:**
- Framework: Playwright (`@playwright/test`)
- Location: Root-level `playwright.config.ts`
- Scope: Critical user paths (contact form submission, project navigation)
- Run: `bun run e2e`, `bun run e2e:ui`, `bun run e2e:headed`

## Common Patterns

**Async Testing:**
```typescript
it('should handle async operation', async () => {
  const result = await asyncFunction()
  expect(result).toBe('expected')
})
```

**Error Testing:**
```typescript
it('should throw on invalid input', () => {
  expect(() => functionCall()).toThrow('error message')
})

// Async error
it('should reject on failure', async () => {
  await expect(asyncCall()).rejects.toThrow('error message')
})
```

**Component Testing:**
```typescript
import { render, screen } from '@testing-library/react'

it('should render component', () => {
  render(<Component />)
  expect(screen.getByText('Hello')).toBeDefined()
})
```

**DOM Testing:**
- Happy DOM 20.0.11 for fast DOM implementation
- Testing Library for component queries and interactions
- Setup: `src/test/setup.tsx` (imported via `bunfig.toml`)

**Snapshot Testing:**
- Not currently used in codebase
- Prefer explicit assertions for clarity

## Test Statistics

**Current Status:**
- 913 tests passing
- 62 tests intentionally skipped
- 54 test files total
- Test files range from 25-753 lines (large test files exist for comprehensive coverage)

---

*Testing analysis: 2026-01-08*
*Update when test patterns change*
