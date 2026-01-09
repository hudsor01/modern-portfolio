# Code Conventions

## TypeScript Configuration

### Strictness Level: **Maximum (Strict Mode)**

**File**: `tsconfig.json`

**Enabled Strict Options**:
- `strict: true` - All strict type checking enabled
- `noImplicitOverride: true` - Explicit `override` keyword required
- `noImplicitReturns: true` - Functions must return explicitly
- `noUncheckedIndexedAccess: true` - Type-safe object/array access
- `noUnusedLocals: true` - No unused local variables
- `noUnusedParameters: true` - No unused function parameters
- `useUnknownInCatchVariables: true` - Catch variables typed as `unknown`
- `noFallthroughCasesInSwitch: true` - No fallthrough in switches

**Module Settings**:
- Resolution: `bundler` - Modern ESM-first resolution
- Target: `ESNext`
- Libraries: DOM, DOM.Iterable, ESNext.Disposable

## Linting Configuration

### ESLint (v9 Flat Config)

**File**: `eslint.config.mjs`

**Active Rulesets**:
- `@eslint/js` - Base JavaScript recommendations
- `typescript-eslint/recommended` - TypeScript best practices
- `react/recommended` - React 19 rules
- `react-hooks/rules-of-hooks` (error) - Hook rules enforcement
- `jsx-a11y` - Accessibility rules
- `@next/next` - Next.js 16 best practices

**Custom Rule Overrides**:
| Rule | Level | Purpose |
|------|-------|---------|
| `react/react-in-jsx-scope` | off | Not needed in React 19 JSX transform |
| `react-hooks/exhaustive-deps` | warn | Advisory dependency array checking |
| `@typescript-eslint/no-explicit-any` | warn | Discourage but allow `any` |
| `@typescript-eslint/no-unused-vars` | warn | With `_` prefix exception |
| `jsx-a11y/alt-text` | warn | Accessibility warnings |
| `@next/next/no-img-element` | warn | Prefer Next.js Image |
| `@next/next/no-html-link-for-pages` | error | Enforce Link component |

## Code Style

### Prettier Configuration

**File**: `.prettierrc.json`

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": false,
  "singleQuote": true,
  "jsxSingleQuote": false,
  "trailingComma": "es5",
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**Key Standards**:
- 100 character line limit
- 2-space indentation (no tabs)
- No semicolons
- Single quotes for strings (double for JSX)
- Trailing commas in ES5 style
- Always include arrow function parens

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| **Components** | PascalCase | `Button.tsx`, `CardSection.tsx` |
| **Hooks** | kebab-case with `use-` | `use-contact-form.ts` |
| **Utilities** | camelCase | `formatDate.ts`, `chart-utils.ts` |
| **Types/Interfaces** | PascalCase | `Project`, `BlogPost`, `INavigation` |
| **Constants** | UPPER_SNAKE_CASE | `API_TIMEOUT`, `MAX_RETRIES` |
| **Private members** | `_` prefix | `_privateMethod` |
| **Test files** | `.test.ts(x)` | `button.test.tsx` |

## Import Organization

**Order**:
1. External libraries (`react`, `next`, `@tanstack`)
2. Absolute imports via `@/` path aliases
3. Relative imports (minimized)
4. Empty line separator between groups
5. Alphabetically sorted within each group

**Example**:
```typescript
// External
import { useState } from 'react'
import { NextResponse } from 'next/server'
import { useQuery } from '@tanstack/react-query'

// Absolute
import { Button } from '@/components/ui/button'
import { projectKeys } from '@/lib/queryKeys'
import type { Project } from '@/types/project'

// Relative (rare)
import { localHelper } from './utils'
```

## Component Patterns

### CVA (Class Variance Authority)
```typescript
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'base-styles', // base classes
  {
    variants: {
      variant: {
        default: 'bg-primary',
        outline: 'border',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-8 px-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)
```

### Server vs Client Components
```typescript
// Server Component (default, no directive)
export default async function ProjectPage({ params }: Props) {
  const project = await getProject(params.slug)
  return <ProjectDetails project={project} />
}

// Client Component (explicit directive)
'use client'

export function ContactForm() {
  const [state, setState] = useState()
  return <form>...</form>
}
```

### Slot Pattern (Radix UI Composition)
```typescript
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>...</DialogContent>
</Dialog>
```

### Generic TypeScript for Reusable Hooks
```typescript
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Type-safe storage hook
}
```

## File Structure Patterns

### Component Files
```typescript
// Imports
import { ... } from '...'

// Types
interface ButtonProps {
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm'
}

// Component
export function Button({ variant, size }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }))} />
}

// Exports (if needed)
export type { ButtonProps }
```

### Utility Files
```typescript
// Imports
import { ... } from '...'

// Main export (named preferred over default)
export function formatDate(date: Date): string {
  // ...
}

// Additional exports
export function parseDate(str: string): Date {
  // ...
}
```

### API Route Files
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Schema validation
const schema = z.object({ ... })

// Main handler
export async function POST(request: NextRequest) {
  // 1. Rate limit check
  // 2. CSRF validation
  // 3. Body validation
  // 4. Process
  // 5. Response
}
```

## Testing Conventions

### Test File Structure
```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'bun:test'
import { render, screen } from '@testing-library/react'

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('should do something', () => {
    // Arrange
    const props = { ... }

    // Act
    render(<Component {...props} />)

    // Assert
    expect(screen.getByText('...')).toBeInTheDocument()
  })
})
```

### Mock Conventions
```typescript
// Declare mock functions BEFORE mock.module()
const mockFn = vi.fn()

// Module mock
mock.module('@/lib/db', () => ({
  db: { model: { method: mockFn } }
}))

// Restore after tests
afterAll(() => {
  mock.restore()
})
```

## Documentation Standards

### JSDoc Comments
```typescript
/**
 * Formats a date to a human-readable string
 * @param date - The date to format
 * @param format - Optional format string
 * @returns Formatted date string
 */
export function formatDate(date: Date, format?: string): string {
  // ...
}
```

### Component Props Documentation
```typescript
interface ButtonProps {
  /** Button display variant */
  variant?: 'default' | 'outline'
  /** Button size preset */
  size?: 'default' | 'sm'
  /** Optional click handler */
  onClick?: () => void
}
```

## Error Handling Patterns

### API Routes
```typescript
try {
  // Process
} catch (error) {
  const status = error instanceof ValidationError ? 400 : 500
  const response = createApiError(
    'User-friendly message',
    'ERROR_CODE',
    error.details
  )
  return NextResponse.json(response, { status })
}
```

### Client Components
```typescript
try {
  // Action
} catch (error) {
  toast.error('Something went wrong')
  console.error('Context:', error)
}
```

## Performance Conventions

### React Compiler Awareness
- **Avoid** manual `useMemo`/`useCallback` for simple cases
- React Compiler auto-optimizes most scenarios
- Use manual memoization only for expensive computations

### Dynamic Imports
```typescript
const ChartComponent = dynamic(
  () => import('@/components/charts/line-chart'),
  { ssr: false, loading: () => <Skeleton /> }
)
```

---

*Last updated: 2026-01-09*
