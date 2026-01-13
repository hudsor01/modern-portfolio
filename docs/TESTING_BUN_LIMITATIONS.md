# Bun Test Runner Limitations & Workarounds

## Known Issue: Module Mock Isolation

### Problem

Bun's `mock.module()` has a **known limitation** where mocks are not scoped to individual test files:

- **GitHub Issue**: [#12823 - Bun mocks to be scoped to test file](https://github.com/oven-sh/bun/issues/12823)
- **Impact**: When test files mock the same modules, the mocks spill over between files
- **Status**: Acknowledged by Bun team, no fix available yet (as of Bun 1.3.5)

### Technical Details

```typescript
// Problem: Both files mock the same module
// File A: use-contact-form.test.ts
mock.module('resend', () => ({ /* mock A */ }))

// File B: contact-form.test.tsx  
mock.module('resend', () => ({ /* mock B */ }))

// When tests run sequentially:
// - File A's tests pass ✅
// - File B's tests fail ❌ (because File A's mock is still active)
```

**Why `mock.restore()` doesn't help:**
> "Calling `mock.restore()` does **not** reset the value of modules overridden with `mock.module()`."
> — [Bun Documentation](https://bun.com/docs/test/mocks)

### Current Workarounds

#### Option 1: Consolidate Tests (✅ Recommended)

**Tests that mock the same modules should be in the same file.**

```typescript
// ✅ GOOD: All tests using same mocks in one file
// contact-form-integration.test.tsx
mock.module('resend', () => ({ /* shared mock */ }))

describe('Contact Form Hook', () => { /* tests */ })
describe('Contact Form Component', () => { /* tests */ })
```

```typescript
// ❌ BAD: Same mocks in multiple files
// use-contact-form.test.ts
mock.module('resend', () => ({ /* mock */ }))

// contact-form.test.tsx (separate file)
mock.module('resend', () => ({ /* mock */ })) // Conflicts!
```

**Pros:**
- Follows Bun best practices
- No flaky tests
- Maintains full test coverage
- Tests are logically related anyway (hook + component for same feature)

**Cons:**
- Single larger test file (acceptable for related tests)

#### Option 2: Skip with Documentation (⚠️ Current State)

Keep test skipped with clear documentation:

```typescript
// Note: Skipped due to Bun mock.module isolation bug
// See: https://github.com/oven-sh/bun/issues/12823
// Functionality is tested in use-contact-form.test.ts
it.skip('should show error message after failed submission', async () => {
```

**Pros:**
- Quick solution
- Documents the limitation

**Cons:**
- Reduced coverage (UI rendering not tested)
- Permanent workaround for tool limitation

#### Option 3: Separate Test Runs (🔧 Complex)

Run tests with conflicting mocks in separate test commands:

```json
{
  "scripts": {
    "test:hooks": "bun test src/hooks/**/*.test.ts",
    "test:components": "bun test src/components/**/*.test.tsx",
    "test": "bun run test:hooks && bun run test:components"
  }
}
```

**Pros:**
- Full isolation
- All tests enabled

**Cons:**
- Slower CI/CD (2x test runs)
- More complex configuration
- Doesn't scale well (need separate run for each conflict)

### Our Decision

**We use Option 1 (Consolidate Tests)** because:
1. Tests are logically related (same feature: contact form)
2. Follows Bun's recommended pattern for shared mocks
3. Maintains 100% test coverage
4. No flaky tests
5. Simpler than running multiple test suites

### When Bun Fixes This

When [Issue #12823](https://github.com/oven-sh/bun/issues/12823) is resolved:
- ✅ Tests can be split back into separate files if desired
- ✅ `mock.restore()` will properly reset module mocks
- ✅ Full test isolation will work as expected

### References

- [Bun Issue #12823](https://github.com/oven-sh/bun/issues/12823) - Bun mocks to be scoped to test file (32 👍)
- [Bun Discussion #6236](https://github.com/oven-sh/bun/discussions/6236) - How to mock a module with bun:test?
- [Bun Mocks Documentation](https://bun.com/docs/test/mocks)
- [Blog: Mock Prisma in Bun](https://blog.nidhin.dev/mock-prisma-schema-in-bun-tests) - Symbol.dispose workaround
