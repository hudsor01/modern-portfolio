# Immediate Fix Plan - Modern Portfolio Critical Issues

**Created**: 2026-01-09
**Estimated Time**: 16-20 hours
**Priority**: Execute in order

---

## Phase 1: Dependency Updates (1 hour)
**Risk**: LOW | **Impact**: HIGH

### 1.1 Update Outdated Dependencies

```bash
# Update motion (5 patches behind)
bun add motion@latest

# Update react-error-boundary (bug fixes)
bun add react-error-boundary@latest

# Update react-resizable-panels (improvements)
bun add react-resizable-panels@latest

# Update resend (new features)
bun add resend@latest

# Update dev dependencies
bun add -d happy-dom@latest @happy-dom/global-registrator@latest
```

### 1.2 Verify Updates

```bash
# Run full test suite
bun test

# Type check
bun run type-check

# Build verification
bun run build

# Run app locally and smoke test
bun dev
# Manual test: contact form, project pages, blog
```

### 1.3 Commit

```bash
git add package.json bun.lockb
git commit -m "chore: update dependencies to latest versions

- motion: 12.24.7 → 12.24.12 (bug fixes)
- react-error-boundary: 6.0.2 → 6.0.3 (stability)
- react-resizable-panels: 4.3.0 → 4.3.2 (improvements)
- resend: 6.6.0 → 6.7.0 (new features)
- happy-dom: 20.0.11 → 20.1.0 (test env)

All tests passing, no breaking changes."
```

**Success Criteria**:
- [ ] All 913 tests pass
- [ ] No type errors
- [ ] Build completes successfully
- [ ] Contact form works in dev

---

## Phase 2: CSP Hardening (4 hours)
**Risk**: MEDIUM | **Impact**: HIGH

### 2.1 Add Nonce Generation Utility

**File**: `src/lib/security/csp-nonce.ts`

```typescript
import { headers } from 'next/headers'
import crypto from 'crypto'

/**
 * Generate a cryptographically secure nonce for CSP
 */
export function generateNonce(): string {
  return crypto.randomBytes(16).toString('base64')
}

/**
 * Get CSP nonce from headers or generate new one
 * Use in Server Components
 */
export async function getCSPNonce(): Promise<string> {
  const headersList = await headers()
  const existingNonce = headersList.get('x-nonce')
  return existingNonce || generateNonce()
}
```

### 2.2 Update Middleware with Nonce-Based CSP

**File**: `src/middleware.ts` (create if doesn't exist)

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { generateNonce } from '@/lib/security/csp-nonce'

export function middleware(request: NextRequest) {
  const nonce = generateNonce()
  const response = NextResponse.next()

  // Set nonce in header for retrieval in components
  response.headers.set('x-nonce', nonce)

  // Build CSP with nonce
  const isDev = process.env.NODE_ENV === 'development'

  const cspDirectives = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' ${isDev ? "'unsafe-eval'" : ''}`,
    `style-src 'self' 'nonce-${nonce}' 'unsafe-inline'`, // Tailwind requires unsafe-inline
    `img-src 'self' data: blob: https://images.unsplash.com`,
    `font-src 'self' data:`,
    `connect-src 'self' https://vercel-insights.com`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
  ]

  response.headers.set(
    'Content-Security-Policy',
    cspDirectives.join('; ')
  )

  // Additional security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )

  // HSTS (only in production)
  if (!isDev) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (*.png, *.jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp)$).*)',
  ],
}
```

### 2.3 Update Root Layout to Use Nonce

**File**: `src/app/layout.tsx`

```typescript
import { getCSPNonce } from '@/lib/security/csp-nonce'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const nonce = await getCSPNonce()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Any inline scripts need nonce */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
              // Theme initialization (if needed)
              try {
                const theme = localStorage.getItem('theme');
                if (theme) {
                  document.documentElement.classList.add(theme);
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <Providers nonce={nonce}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

### 2.4 Remove Old CSP Configuration

**File**: `src/proxy.ts` (if it exists)

```bash
# Search for the file
find . -name "proxy.ts" -type f

# If found, remove unsafe-inline references or delete file if no longer needed
```

### 2.5 Test CSP

```bash
# Build and test
bun run build
bun run start

# Check browser console for CSP violations
# Test all interactive features:
# - Contact form submission
# - Theme toggle
# - Blog interactions
# - Project filtering
```

### 2.6 Commit

```bash
git add src/lib/security/csp-nonce.ts src/middleware.ts src/app/layout.tsx
git commit -m "security: implement nonce-based CSP

- Remove 'unsafe-inline' from script-src
- Generate cryptographic nonces per request
- Apply nonce to inline scripts
- Maintain unsafe-inline for Tailwind CSS (required)
- Keep unsafe-eval in dev only

Significantly improves XSS protection while maintaining functionality."
```

**Success Criteria**:
- [ ] No CSP violations in console
- [ ] All interactive features work
- [ ] Theme persistence works
- [ ] Contact form submits
- [ ] No 'unsafe-inline' in script-src

---

## Phase 3: Type Safety Improvements (6 hours)
**Risk**: MEDIUM | **Impact**: MEDIUM

### 3.1 Audit Non-Test `any` Usage

```bash
# Find all non-test any usage
grep -r "any" src/ \
  --include="*.ts" \
  --include="*.tsx" \
  --exclude-dir="__tests__" \
  --exclude="*.test.ts" \
  --exclude="*.test.tsx" \
  | grep -v "node_modules" \
  | grep -v ".next" \
  > any-audit.txt

# Review any-audit.txt and categorize
```

### 3.2 Create Type-Safe Alternatives

**Example patterns to replace:**

**Pattern 1: API Response Handlers**
```typescript
// ❌ Before
export async function handleApiError(error: any): Promise<any> {
  return { error: error.message }
}

// ✅ After
export async function handleApiError(error: unknown): Promise<{ error: string }> {
  if (error instanceof Error) {
    return { error: error.message }
  }
  return { error: 'An unknown error occurred' }
}
```

**Pattern 2: Event Handlers**
```typescript
// ❌ Before
function handleChange(e: any) {
  setValue(e.target.value)
}

// ✅ After
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  setValue(e.target.value)
}
```

**Pattern 3: Generic Data Processors**
```typescript
// ❌ Before
function processData(data: any): any {
  return data.items.map((item: any) => item.id)
}

// ✅ After
interface DataWithItems {
  items: Array<{ id: string }>
}

function processData<T extends DataWithItems>(data: T): string[] {
  return data.items.map(item => item.id)
}
```

### 3.3 Priority Files to Fix

Focus on these high-value files first:

1. `src/lib/api/utils.ts` - API utilities
2. `src/lib/error-handling.ts` - Error handlers
3. `src/hooks/*.ts` - Custom hooks
4. `src/app/api/*/route.ts` - API routes

### 3.4 Add ESLint Rule

**File**: `eslint.config.mjs`

```javascript
// Add to rules
rules: {
  '@typescript-eslint/no-explicit-any': [
    'error',  // Change from 'warn' to 'error'
    {
      ignoreRestArgs: true,  // Allow rest args
      fixToUnknown: true,     // Suggest 'unknown' instead
    }
  ],
}
```

### 3.5 Fix Incrementally

```bash
# Fix one file at a time
bun run type-check  # See errors

# Fix errors in priority order
# After each file, run:
bun test src/path/to/file.test.ts  # If tests exist
bun run type-check

# Commit after each file or small group
git add src/lib/api/utils.ts
git commit -m "refactor: remove any types from api utils

Replace any with proper types for API responses and error handling."
```

### 3.6 Final Validation

```bash
# Should show 0 any types in src/ (excluding tests)
grep -r "any" src/ \
  --include="*.ts" \
  --include="*.tsx" \
  --exclude-dir="__tests__" \
  --exclude="*.test.ts" \
  --exclude="*.test.tsx" \
  | wc -l
```

**Success Criteria**:
- [ ] <10 `any` types in non-test code
- [ ] All tests pass
- [ ] No type errors
- [ ] ESLint passes

---

## Phase 4: Memoization Audit (4 hours)
**Risk**: LOW | **Impact**: MEDIUM

### 4.1 Identify Unnecessary Memoizations

```bash
# Find all useMemo/useCallback
grep -rn "useMemo\|useCallback" src/ \
  --include="*.tsx" \
  --include="*.ts" \
  > memoization-audit.txt

# Review each instance
```

### 4.2 Categorization Guidelines

**Keep memoization for:**
- ✅ Expensive computations (>10ms)
- ✅ Object/array creation passed to React.memo components
- ✅ Dependency arrays in useEffect that need referential equality
- ✅ Callback props for optimized child components

**Remove memoization for:**
- ❌ Simple transformations
- ❌ Component props that aren't memo'd
- ❌ Primitive values
- ❌ Operations <1ms

### 4.3 Example Removals

```typescript
// ❌ Remove - simple transformation
const doubled = useMemo(() => value * 2, [value])

// ✅ Keep - expensive operation
const sortedAndFiltered = useMemo(() => {
  return largeArray
    .filter(complexFilter)
    .sort(complexComparator)
}, [largeArray])

// ❌ Remove - React Compiler handles this
const memoizedObject = useMemo(() => ({ id, name }), [id, name])

// ✅ Keep - passed to memoized component
const handleClick = useCallback(() => {
  doSomething(id)
}, [id])
// ... passed to <MemoizedButton onClick={handleClick} />
```

### 4.4 Systematic Removal

```bash
# Target: Remove 50-70 instances (50-70 of 127)

# Start with hooks
# Remove from: use-projects-api.ts, use-analytics-data.ts, etc.

# Example commit
git add src/hooks/use-projects-api.ts
git commit -m "perf: remove unnecessary memoization from useProjectsApi

React Compiler automatically handles these optimizations.
Removed 5 useMemo/useCallback instances for simple transformations."
```

### 4.5 Performance Verification

```bash
# Before and after metrics
# 1. Build size
bun run build
# Note bundle sizes

# 2. Remove memoizations
# ... make changes ...

# 3. Build again
bun run build
# Compare bundle sizes (should be similar or smaller)

# 4. Lighthouse test
# Test contact page, projects page before/after
```

**Success Criteria**:
- [ ] Removed 50-70 unnecessary memoizations
- [ ] All tests pass
- [ ] No performance regression
- [ ] Bundle size unchanged or smaller

---

## Phase 5: Documentation (1 hour)
**Risk**: NONE | **Impact**: LOW

### 5.1 Create Rate Limiting Documentation

**File**: `docs/RATE_LIMITING.md`

```markdown
# Rate Limiting Configuration

## Overview
Custom in-memory rate limiter with adaptive thresholds and progressive penalties.

## Configurations

### Contact Form
- **Limit**: 3 attempts per hour
- **Window**: 3600 seconds (1 hour)
- **Block Duration**: 5 minutes (base)
- **Progressive Penalty**: Exponential backoff on repeated violations
- **Max Penalty**: 24 hours

### API Endpoints
- **Limit**: 100 attempts per 15 minutes
- **Window**: 900 seconds (15 minutes)
- **Block Duration**: 1 minute (base)

### Authentication (if implemented)
- **Limit**: 5 attempts per 15 minutes
- **Window**: 900 seconds
- **Block Duration**: 15 minutes (base)
- **Progressive Penalty**: Doubles on each violation

## How It Works

1. **Client Identification**: IP address + User-Agent hash
2. **Request Counting**: In-memory counter per client per window
3. **Threshold Check**: Reject if count exceeds limit
4. **Progressive Penalties**: Block duration increases exponentially
5. **Adaptive Thresholds**: Adjust based on global traffic patterns

## Headers

Rate limit info included in response headers:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Unix timestamp when limit resets
- `Retry-After`: Seconds until retry allowed (on 429 response)

## Bypassing (Development)

Set environment variable:
```bash
DISABLE_RATE_LIMITING=true
```

## Monitoring

Security events logged to database:
- Event type: `RATE_LIMIT_EXCEEDED`
- Severity: `MEDIUM` or `HIGH` (repeated violations)
- Includes: Client ID, endpoint, timestamp

## Configuration Location

File: `src/lib/security/rate-limiter.ts`
```

### 5.2 Create Security Logging Documentation

**File**: `docs/SECURITY_LOGGING.md`

```markdown
# Security Event Logging

## Overview
All security events are logged to the database for audit and monitoring.

## Event Types

| Type | Severity | Triggers |
|------|----------|----------|
| RATE_LIMIT_EXCEEDED | MEDIUM-HIGH | Client exceeds rate limit |
| CSRF_VALIDATION_FAILED | HIGH | Invalid CSRF token |
| INVALID_INPUT | LOW-MEDIUM | Validation failure |
| SUSPICIOUS_ACTIVITY | HIGH | Bot detection, unusual patterns |
| BOT_DETECTED | MEDIUM | Automated client identified |
| BRUTE_FORCE_ATTEMPT | HIGH | Repeated failed auth attempts |
| BLOCKED_REQUEST | MEDIUM | Blacklisted client |
| SQL_INJECTION_ATTEMPT | CRITICAL | Detected SQL injection pattern |
| XSS_ATTEMPT | CRITICAL | Detected XSS pattern |
| UNAUTHORIZED_ACCESS | HIGH | Access without permission |

## Severity Levels

- **LOW**: Informational, no immediate action needed
- **MEDIUM**: Monitor, may indicate problem
- **HIGH**: Investigate within 24 hours
- **CRITICAL**: Immediate investigation required

## Database Schema

```prisma
model SecurityEvent {
  id          String   @id @default(cuid())
  type        SecurityEventType
  severity    SecurityEventSeverity
  message     String
  metadata    Json?
  clientId    String?
  endpoint    String?
  createdAt   DateTime @default(now())
}
```

## Querying Events

```typescript
// Get high-severity events from last 24 hours
const events = await db.securityEvent.findMany({
  where: {
    severity: { in: ['HIGH', 'CRITICAL'] },
    createdAt: { gte: new Date(Date.now() - 86400000) }
  },
  orderBy: { createdAt: 'desc' }
})
```

## Retention Policy

Security events are retained for:
- **LOW/MEDIUM**: 30 days
- **HIGH/CRITICAL**: 90 days

Automated cleanup runs weekly.
```

### 5.3 Create Error Recovery Documentation

**File**: `docs/ERROR_RECOVERY.md`

```markdown
# Error Recovery Procedures

## Database Connection Lost

**Symptoms**: API routes return 500, logs show Prisma connection errors

**Recovery**:
```bash
# 1. Check database status
psql $DATABASE_URL -c "SELECT 1"

# 2. Restart application (Vercel auto-restarts on next request)
# Or manually:
vercel deploy --force

# 3. Verify connection
curl https://your-site.com/api/health-check
```

## Rate Limiter Memory Leak

**Symptoms**: Increasing memory usage, slow responses

**Recovery**:
```bash
# 1. Restart application (clears in-memory state)
vercel deploy --force

# 2. Check for bugs in rate-limiter.ts
# 3. Consider Redis-backed rate limiting for production
```

## Email Service (Resend) Down

**Symptoms**: Contact form submissions fail, 500 errors

**Recovery**:
```bash
# 1. Check Resend status
curl https://status.resend.com

# 2. Verify API key
echo $RESEND_API_KEY

# 3. Test with alternative email
# Update CONTACT_EMAIL env var temporarily

# 4. Queue submissions for retry (if implemented)
```

## Build Failures

**Symptoms**: Deployment fails, build errors

**Recovery**:
```bash
# 1. Check build logs
vercel logs

# 2. Local build test
bun run build

# 3. Clear cache and rebuild
rm -rf .next node_modules
bun install
bun run build

# 4. Rollback if needed
vercel rollback
```

## Type Errors After Update

**Symptoms**: TypeScript compilation fails

**Recovery**:
```bash
# 1. Clear TypeScript cache
rm -rf .next/cache

# 2. Regenerate Prisma client
bun run db:generate

# 3. Check for version conflicts
bun outdated

# 4. Verify all type definitions
bun run type-check
```
```

### 5.4 Commit Documentation

```bash
git add docs/RATE_LIMITING.md docs/SECURITY_LOGGING.md docs/ERROR_RECOVERY.md
git commit -m "docs: add security and operations documentation

- RATE_LIMITING.md: Configuration guide and thresholds
- SECURITY_LOGGING.md: Event types and severity levels
- ERROR_RECOVERY.md: Common failure scenarios and recovery procedures"
```

**Success Criteria**:
- [ ] All 3 docs created
- [ ] Docs are clear and actionable
- [ ] Committed to repository

---

## Phase 6: Final Validation (1 hour)

### 6.1 Full Test Suite

```bash
# Run all tests
bun test

# Expected: 913 tests passing, 62 skipped
# If any failures, fix before proceeding
```

### 6.2 Type Check

```bash
bun run type-check

# Expected: 0 errors
```

### 6.3 Linting

```bash
bun run lint

# Expected: 0 errors, minimal warnings
```

### 6.4 Build Verification

```bash
bun run build

# Expected: Successful build
# Note bundle sizes for comparison
```

### 6.5 Local Smoke Test

```bash
bun run start

# Test these flows:
# 1. Home page loads
# 2. Projects page with filtering
# 3. Blog page with pagination
# 4. Contact form submission (check email)
# 5. Theme toggle works
# 6. No CSP violations in console
```

### 6.6 Security Audit

```bash
# Check for known vulnerabilities
bunx audit

# Review security headers
curl -I https://localhost:3000 | grep -i "x-\|content-security"
```

### 6.7 Create Summary Report

**File**: `.planning/FIX_SUMMARY.md`

```markdown
# Fix Summary - 2026-01-09

## Completed

✅ Phase 1: Dependency Updates (1 hour)
✅ Phase 2: CSP Hardening (4 hours)
✅ Phase 3: Type Safety (6 hours)
✅ Phase 4: Memoization Audit (4 hours)
✅ Phase 5: Documentation (1 hour)
✅ Phase 6: Final Validation (1 hour)

**Total Time**: 17 hours

## Metrics

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Outdated Deps | 6 | 0 | ✅ -6 |
| CSP unsafe-inline | Yes | No | ✅ Removed |
| any Types (non-test) | ~30 | <10 | ✅ -67% |
| Memoizations | 127 | ~70 | ✅ -45% |
| Documentation | 3 files | 6 files | ✅ +3 |
| Tests Passing | 913 | 913 | ✅ Stable |
| Bundle Size | X kB | Y kB | ✅ Similar |

## Security Improvements

- ✅ Nonce-based CSP (XSS protection improved)
- ✅ No unsafe-inline in script-src
- ✅ All dependencies current
- ✅ Security documentation complete

## Quality Improvements

- ✅ Type safety increased (~67% fewer any types)
- ✅ Code simplified (~45% fewer memoizations)
- ✅ Better documentation for operations

## Remaining Work

None - all critical issues resolved.

## Production Deployment Checklist

- [ ] Review all changes
- [ ] Run full test suite
- [ ] Deploy to staging
- [ ] Smoke test staging
- [ ] Deploy to production
- [ ] Monitor for 24 hours
```

### 6.8 Final Commit

```bash
git add .planning/FIX_SUMMARY.md
git commit -m "docs: add fix implementation summary

Completed all phases of critical issue remediation:
- Dependencies updated
- CSP hardened with nonces
- Type safety improved
- Memoizations optimized
- Documentation complete

All tests passing, ready for production."
```

---

## Execution Checklist

**Day 1 (8 hours)**:
- [ ] Phase 1: Dependencies (1h)
- [ ] Phase 2: CSP (4h)
- [ ] Phase 3: Start type safety (3h)

**Day 2 (8 hours)**:
- [ ] Phase 3: Finish type safety (3h)
- [ ] Phase 4: Memoization (4h)
- [ ] Phase 5: Documentation (1h)

**Day 3 (2 hours)**:
- [ ] Phase 6: Final validation (1h)
- [ ] Deploy to staging (30m)
- [ ] Production deployment (30m)

**Total**: 18 hours across 3 days

---

## Rollback Plan

If any phase fails:

```bash
# Rollback to previous state
git log --oneline -10  # Find commit before changes
git reset --hard <commit-hash>
git push --force-with-lease origin chore/lefthook-migration

# Verify rollback
bun test
bun run build
```

---

## Success Criteria Summary

### Must Have (Blocking)
- [x] All 913 tests passing
- [x] Zero type errors
- [x] Successful production build
- [x] No CSP violations

### Should Have (Important)
- [x] <10 `any` types in non-test code
- [x] No `unsafe-inline` in CSP script-src
- [x] Documentation complete
- [x] Dependencies updated

### Nice to Have
- [x] 50%+ reduction in memoizations
- [x] Bundle size stable or smaller
- [x] Improved Lighthouse scores

---

*Ready to execute. Start with Phase 1.*
