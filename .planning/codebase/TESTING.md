# Testing Infrastructure

## Test Framework

**Primary**: **Bun Test** (native Bun runtime, Jest-compatible API)

**Configuration**: `bunfig.toml`
```toml
[test]
preload = ["./happydom.ts", "./src/test/setup.tsx"]
timeout = 30000
root = "src"
coverage = false  # Requires --coverage flag
coverageThreshold = { lines = 0.80, functions = 0.80, statements = 0.80 }
```

## Test Statistics

- **Test Files**: 54 files (`.test.ts`, `.test.tsx`)
- **Test Assertions**: ~1,615 test cases
- **Total Test Code**: ~17,311 lines
- **Coverage Target**: 80% (lines, functions, statements)
- **Tests Passing**: 913 (per CLAUDE.md)
- **Tests Skipped**: 62 (intentional)

## Test Organization

```
src/
├── __tests__/ - Integration & system tests (8 files)
├── lib/
│   ├── __tests__/ - Library unit tests
│   ├── security/__tests__/ - Security-focused tests
│   ├── utils/__tests__/ - Utility function tests
│   └── analytics/__tests__/ - Analytics service tests
├── hooks/__tests__/ - Hook tests (5 files)
├── app/api/*/___tests__/ - Route handler tests (10+ files)
└── components/ - Component tests (inline or separate)
```

## Testing Stack

### Core Testing Libraries
- **Bun Test** - Jest-compatible native runner
- **@testing-library/react 16.3.1** - Component testing
- **@testing-library/jest-dom 6.9.1** - DOM matchers
- **@testing-library/user-event 14.6.1** - User interaction simulation
- **fast-check 4.5.3** - Property-based testing

### DOM Environment
- **happy-dom 20.0.11** - Lightweight DOM implementation
- **@happy-dom/global-registrator 20.0.11** - Global DOM setup

### E2E Testing
- **Playwright 1.57.0** - Cross-browser E2E testing
  - UI mode support
  - Headed mode support

## Test Setup Infrastructure

### Setup Files

**`happydom.ts`** - Initializes happy-dom globals
```typescript
import { GlobalRegistrator } from '@happy-dom/global-registrator'
GlobalRegistrator.register()
```

**`src/test/setup.tsx`** - Global test setup with:
- Vitest compatibility layer for Bun
- Module mocks (next/navigation, next/image, etc.)
- RTL cleanup after each test
- Mock utilities and helpers

## Testing Patterns

### Test Structure (AAA Pattern)
```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'bun:test'

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup: Initialize state, create mocks
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('should perform expected behavior', () => {
    // Arrange: Set up test data
    const props = { ... }

    // Act: Perform action
    render(<Component {...props} />)

    // Assert: Verify results
    expect(screen.getByText('...')).toBeInTheDocument()
  })
})
```

### Component Testing
```typescript
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

it('should handle user interaction', async () => {
  const user = userEvent.setup()
  render(<Button onClick={mockFn}>Click me</Button>)

  await user.click(screen.getByRole('button'))

  expect(mockFn).toHaveBeenCalledTimes(1)
})
```

### Hook Testing
```typescript
import { renderHook, act, waitFor } from '@testing-library/react'

it('should update state correctly', () => {
  const { result } = renderHook(() => useCustomHook())

  act(() => {
    result.current.updateValue('new value')
  })

  expect(result.current.value).toBe('new value')
})
```

### Property-Based Testing (fast-check)
```typescript
import fc from 'fast-check'

it('should handle any valid input', () => {
  fc.assert(
    fc.property(
      fc.string({ minLength: 0, maxLength: 100 }),
      (input) => {
        const result = processInput(input)
        expect(result).toBeDefined()
      }
    ),
    { numRuns: 100 }
  )
})
```

### API Route Testing
```typescript
import { NextRequest, NextResponse } from 'next/server'

describe('POST /api/contact', () => {
  it('should return 429 when rate limited', async () => {
    const request = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({ ... })
    })

    const response = await POST(request)

    expect(response.status).toBe(429)
  })
})
```

## Mock Patterns

### Bun Mock Pattern (Preferred)
```typescript
// 1. Declare mock functions BEFORE mock.module()
const mockCreate = vi.fn()

// 2. Set up module mocks before imports
mock.module('@/lib/db', () => ({
  db: { contactSubmission: { create: mockCreate } }
}))

// 3. Import the module
import { db } from '@/lib/db'

// 4. Restore after tests
afterAll(() => {
  mock.restore()
})
```

### Constructor Mocking
```typescript
mock.module('resend', () => ({
  Resend: function() {  // Function syntax for constructors
    return {
      emails: {
        send: vi.fn().mockResolvedValue({ id: 'test-id' })
      }
    }
  }
}))
```

### Global Mocking
```typescript
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
  })
})
```

## Pre-configured Module Mocks

**File**: `src/test/setup.tsx`

Pre-mocked modules:
- `next/navigation` - Router hooks
- `next/image` - Image component as `<img>`
- `next/dynamic` - Returns mock components
- `next-themes` - Theme provider
- `framer-motion` - Pass-through motion components
- `recharts` - Lightweight chart mocks
- `@tanstack/react-query` - Query/mutation mocks
- `nuqs` - URL state management mock
- `server-only` - Empty export

## Coverage Configuration

### Included Paths
- `src/**/*.{ts,tsx}` (all source code)

### Excluded Paths
```toml
coveragePathIgnorePatterns = [
  "src/test/**",                        # Test infrastructure
  "prisma/generated/**",                # Generated code
  "src/components/seo/json-ld/**",     # Static SEO
  "src/components/navigation/**",       # UI-heavy (E2E covered)
  "src/lib/monitoring/**",              # Side-effect heavy
  "src/app/projects/*/components/*Tab.tsx",  # Chart-heavy UI
  "src/lib/design-system/**",           # Complex UI helpers
]
```

**Rationale**: Excludes generated code, UI-heavy components (better tested with E2E), and infrastructure with external dependencies.

## Test Scripts

**From `package.json`**:
```bash
bun test                      # Run all tests
bun test --watch              # Watch mode
bun test --coverage           # With coverage report
bun test --update-snapshots   # Update snapshots
```

## Security-Focused Testing

Tests for:
- **XSS Prevention**: Input sanitization validation
- **SQL Injection**: Prisma ORM resistance
- **Rate Limiting**: Enforcement verification
- **CSRF Protection**: Token validation
- **Input Validation**: Zod schema testing

## E2E Testing (Playwright)

**Configuration**: `playwright.config.ts`

**Features**:
- Cross-browser testing (Chromium, Firefox, WebKit)
- UI mode for debugging
- Headed mode for visibility
- Screenshots on failure
- Video recording on retry

**Usage**:
```bash
bun run e2e              # Run E2E tests
bun run e2e:ui           # UI mode
bun run e2e:headed       # Headed mode
```

## Test Quality Metrics

### Test Types Distribution
- **Unit Tests**: ~70% (component, hook, utility tests)
- **Integration Tests**: ~25% (API route, service tests)
- **E2E Tests**: ~5% (critical path testing)

### Coverage Goals
| Metric | Target | Current |
|--------|--------|---------|
| Lines | 80% | Configured |
| Functions | 80% | Configured |
| Statements | 80% | Configured |
| Branches | Not enforced | - |

## CI/CD Integration

### Pre-commit Hooks (Lefthook)
```yaml
pre-commit:
  parallel: true
  commands:
    lint-staged:
      run: bunx lint-staged
      stage_fixed: true

pre-push:
  commands:
    tests:
      run: bun test
```

### CI Pipelines
```bash
bun run ci:quick  # Lint + type-check (fast)
bun run ci:local  # Lint + type-check + tests
bun run ci:full   # All checks + build
```

## Best Practices

1. **Arrange-Act-Assert**: Follow AAA pattern consistently
2. **Descriptive Names**: Use `should [expected behavior]` format
3. **One Assertion Focus**: Test one thing per test
4. **No Test Interdependence**: Each test runs independently
5. **Mock External Dependencies**: Isolate unit under test
6. **Clean Up**: Use `afterEach` for cleanup
7. **Type Safety**: Fully typed test code
8. **Property Testing**: Use for complex input validation

---

*Last updated: 2026-01-09*
