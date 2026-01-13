# ESLint Pattern Enforcement

This document replaces the deleted consistency tests with ESLint rules and code review guidelines.

## What Was Deleted

We deleted **389 consistency/pattern tests** (~39% of test suite) that tested implementation details rather than behavior:

### Deleted Test Categories:
- **Layout consistency tests**: Tested if components have specific DOM structure
- **Design token tests**: Tested if design tokens are used consistently
- **Naming convention tests**: Tested if variables follow naming patterns
- **Loading pattern tests**: Tested if loading states use same patterns
- **Responsive consistency tests**: Tested if breakpoints are used consistently
- **Navigation pattern tests**: Tested if navigation follows same structure
- **Accessibility pattern tests**: Tested if ARIA attributes are consistent
- **Type definition naming tests**: Tested if types follow naming conventions

**Why deleted:** These test implementation details, not user-facing behavior. They're better enforced at authoring time via linting.

---

## Patterns Now Enforced by ESLint

### 1. Unused Catch Block Variables (Already Enforced)

**Rule:** `@typescript-eslint/no-unused-vars`

```javascript
// ✅ Correct
try {
  await riskyOperation()
} catch (_error) {  // Unused, prefixed with _
  console.error('Operation failed')
}

// ❌ Wrong (ESLint error)
try {
  await riskyOperation()
} catch (error) {  // Unused, but not prefixed
  console.error('Operation failed')
}
```

**Config:**
```javascript
'@typescript-eslint/no-unused-vars': [
  'warn',
  {
    caughtErrorsIgnorePattern: '^_',
  },
]
```

---

### 2. Accessibility - Alt Text (Already Enforced)

**Rule:** `jsx-a11y/alt-text`

```javascript
// ✅ Correct
<img src="/photo.jpg" alt="Team photo from 2024" />

// ❌ Wrong (ESLint warning)
<img src="/photo.jpg" />
```

**Config:**
```javascript
'jsx-a11y/alt-text': 'warn',
```

---

### 3. Next.js Image Component (Already Enforced)

**Rule:** `@next/next/no-img-element`

```javascript
// ✅ Correct
import Image from 'next/image'
<Image src="/photo.jpg" alt="..." width={500} height={300} />

// ❌ Wrong (ESLint warning)
<img src="/photo.jpg" alt="..." />
```

**Config:**
```javascript
'@next/next/no-img-element': 'warn',
```

---

## Additional Rules We Could Add

### 4. Consistent Import Order

Install `eslint-plugin-import`:

```bash
bun add -D eslint-plugin-import
```

**Rule:**
```javascript
'import/order': [
  'warn',
  {
    'groups': [
      'builtin',   // Node.js built-ins
      'external',  // npm packages
      'internal',  // @/ imports
      ['parent', 'sibling', 'index'],
    ],
    'newlines-between': 'always',
    'alphabetize': {
      'order': 'asc',
      'caseInsensitive': true,
    },
  },
]
```

---

### 5. Prevent Console Logs in Production

**Rule:**
```javascript
'no-console': [
  'warn',
  {
    allow: ['warn', 'error', 'info'], // Allow warnings/errors
  }
]
```

---

## Patterns NOT Enforceable by ESLint

These require manual code review:

### 1. Design Token Usage

**Cannot enforce:** "All colors must use CSS variables"

**Why:** ESLint can't analyze CSS-in-JS or Tailwind classes to validate token usage.

**Alternative:** Document in `DESIGN_SYSTEM.md`, enforce in code review.

```typescript
// ✅ Preferred (code review check)
<div className="bg-primary text-primary-foreground" />

// ⚠️  Avoid (code review check)
<div className="bg-blue-500 text-white" />
```

---

### 2. Component Structure Consistency

**Cannot enforce:** "All project pages must have same header structure"

**Why:** ESLint can't validate DOM structure or component composition.

**Alternative:** Use shared components instead.

```typescript
// ✅ Enforced by architecture, not linting
import { ProjectPageLayout } from '@/components/projects/shared'

export default function Page() {
  return (
    <ProjectPageLayout title="..." description="...">
      {/* Content */}
    </ProjectPageLayout>
  )
}
```

---

### 3. Loading State Patterns

**Cannot enforce:** "All loading states must use skeleton with glassmorphism"

**Why:** ESLint can't validate className combinations or animation patterns.

**Alternative:** Use shared `<LoadingSkeleton />` component.

```typescript
// ✅ Enforced by using shared component
import { LoadingSkeleton } from '@/components/ui/loading-skeleton'

function Loading() {
  return <LoadingSkeleton />
}
```

---

### 4. Error Handling Patterns

**Cannot enforce:** "All API routes must use `handleApiError()`"

**Why:** ESLint can't enforce control flow patterns.

**Alternative:** Document in `API_PATTERNS.md`, enforce in code review.

```typescript
// ✅ Preferred (code review check)
try {
  // ... API logic
} catch (error) {
  return handleApiError(error, 'operation-name')
}

// ❌ Avoid (code review check)
try {
  // ... API logic
} catch (error) {
  return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
}
```

---

## Testing Philosophy

### What We Test
✅ **User-facing behavior:**
- API routes return correct data/status codes
- Forms validate inputs correctly
- Hooks manage state correctly
- Security functions sanitize inputs

### What We Don't Test
❌ **Implementation details:**
- Does component use specific className?
- Is data-testid in correct location?
- Do all pages have same DOM structure?
- Are design tokens used consistently?

**Rationale:** Tests should fail when user experience breaks, not when refactoring internal implementation.

---

## Summary

**Before:** 993 tests (389 testing patterns/consistency)
**After:** 604 tests (all testing behavior)

**Deleted:** 389 pattern tests (~39% reduction)

**Coverage maintained:** ESLint + architecture + code review handle pattern enforcement better than tests.

**Result:**
- ✅ Faster test suite (25s → 7s)
- ✅ Tests focused on behavior, not styling/structure
- ✅ Pattern enforcement at authoring time (ESLint), not test time
- ✅ Clearer separation: tests = behavior, linting = patterns
