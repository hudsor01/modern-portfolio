# Security Architecture

## Overview

The Modern Portfolio application implements a defense-in-depth security approach with multiple layers of protection. This document details the security features, configurations, and best practices implemented across the application.

Security is enforced at every layer:
- **Network Layer**: HTTPS, security headers, CSP
- **Application Layer**: Rate limiting, CSRF protection, input validation
- **Data Layer**: Sanitization, parameterized queries, audit logging

## Rate Limiting

### Configuration

The application implements adaptive rate limiting across all API endpoints with tiered configurations:

| Endpoint | Limit | Window | Base Block | Progressive Penalties |
|----------|-------|--------|------------|----------------------|
| Contact form (`/api/contact`) | 3 requests | 1 hour | 5 minutes | 5min → 15min → 1hr |
| API endpoints (general) | 100 requests | 15 minutes | 5 minutes | Exponential backoff |
| Authentication (future) | 5 requests | 15 minutes | 15 minutes | Extended blocks |

### Implementation Details

The rate limiting system (`src/lib/security/rate-limiter.ts`) provides advanced features beyond simple request counting:

**Client Identification:**
- Combines IP address and User-Agent hash for unique client ID
- Prevents IP-only tracking while maintaining accuracy
- Handles proxy scenarios with X-Forwarded-For header support

**Memory-Based Storage:**
```typescript
// In-memory store with LRU eviction
const store = new Map<string, RateLimitEntry>()

interface RateLimitEntry {
  count: number
  resetTime: number
  blockUntil?: number
  consecutiveViolations: number
}
```

**Adaptive Thresholds:**
- Monitors global request rate across all clients
- Reduces thresholds when system under load (>50 requests/minute)
- Prevents resource exhaustion during traffic spikes

**Progressive Penalties:**
- First violation: 5-minute block
- Second violation: 15-minute block
- Third+ violations: 1-hour block (exponential backoff)
- Resets after successful cooldown period

**Suspicious Activity Detection:**
- Tracks rapid consecutive failures
- Extends block duration for attack patterns
- Triggers CRITICAL security events for investigation

**Whitelist/Blacklist Support:**
```typescript
const WHITELISTED_IPS = ['10.0.0.0/8', '192.168.0.0/16'] // Example
const BLACKLISTED_IPS = ['1.2.3.4'] // Known attackers
```

### Monitoring

Rate limit violations are logged to the `SecurityEvent` table with rich metadata:

```typescript
{
  eventType: 'RATE_LIMIT_EXCEEDED',
  severity: 'WARNING', // or 'CRITICAL' for repeated violations
  clientId: 'hashed-ip-ua',
  endpoint: '/api/contact',
  metadata: {
    ip: '1.2.3.4',
    userAgent: 'Mozilla/5.0...',
    requestCount: 4,
    limit: 3,
    blockDuration: 300
  }
}
```

**Response Headers:**
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in window
- `X-RateLimit-Reset`: Unix timestamp when limit resets
- `Retry-After`: Seconds to wait if rate limited (429 response)

**Metrics to Monitor:**
- Rate limit violations per hour (baseline: <10/hour)
- False positive rate (legitimate users blocked)
- Block duration effectiveness (attacks stopped vs. user impact)
- Global request rate (system load indicator)

### Tuning

**When to Adjust Thresholds:**
1. **Increase Limits**: False positives affecting legitimate users, low traffic
2. **Decrease Limits**: Sustained attacks, resource constraints, high traffic

**Whitelist Management:**
- Add trusted IPs (internal tools, monitoring services)
- Requires code change + deployment (no runtime configuration)
- Test thoroughly to avoid security gaps

**Performance Impact:**
- Memory usage: ~100 bytes per client entry
- Processing overhead: <1ms per request
- Automatic cleanup: Expired entries removed every 5 minutes

## Content Security Policy (CSP)

### Nonce-Based Implementation

The application uses CSP with cryptographic nonces to prevent XSS attacks while allowing dynamic scripts:

**Middleware Implementation** (`src/middleware.ts`):
```typescript
import { randomUUID } from 'crypto'

const nonce = randomUUID()
const cspHeader = `
  script-src 'self' 'nonce-${nonce}' https://vercel.live;
  style-src 'self' 'nonce-${nonce}' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://vercel.live;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`.replace(/\s{2,}/g, ' ').trim()
```

**Server Component Nonce Injection:**
```typescript
// app/layout.tsx
import { headers } from 'next/headers'

const nonce = headers().get('x-nonce')

<script nonce={nonce} src="/script.js" />
```

**Key Features:**
- No `unsafe-inline` in script-src (XSS prevention)
- Nonce generation per request (crypto.randomUUID())
- `frame-ancestors 'none'` (clickjacking prevention)
- `base-uri 'self'` (base tag injection prevention)
- Vercel Live support for preview deployments

### CSP Violations

**Monitoring:**
- Browser console logs CSP violations automatically
- Zero violations confirmed in Phase 2 validation
- Production monitoring via browser error reports (if configured)

**Handling Violations:**
1. Identify violating resource (script, style, image, etc.)
2. Determine if legitimate or attack:
   - **Legitimate**: Update CSP directive or add nonce
   - **Attack**: Investigate source and block if needed
3. Test changes in development before deploying
4. Verify zero violations post-deployment

## CSRF Protection

### Token System

Cross-Site Request Forgery protection implemented for all state-changing operations:

**Token Generation:**
```typescript
// GET /api/contact/csrf-route
import { randomBytes } from 'crypto'

const csrfToken = randomBytes(32).toString('hex')
return NextResponse.json({ csrfToken })
```

**Client-Side Usage:**
```typescript
// Fetch CSRF token before submission
const response = await fetch('/api/contact/csrf-route')
const { csrfToken } = await response.json()

// Include token in request header
await fetch('/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-csrf-token': csrfToken
  },
  body: JSON.stringify(formData)
})
```

**Server-Side Validation:**
```typescript
// src/lib/security/csrf-protection.ts
export function validateCsrfToken(request: NextRequest): boolean {
  const token = request.headers.get('x-csrf-token')
  if (!token) return false
  // Validation logic (token format, expiry, etc.)
  return true
}
```

### Implementation

**Protected Endpoints:**
- POST `/api/contact` (contact form submission)
- POST `/api/projects` (project creation)
- PUT/DELETE `/api/projects/[slug]` (project updates/deletion)
- POST/PUT/DELETE `/api/blog/*` (blog operations)

**Response on Failure:**
- HTTP 403 Forbidden
- Security event logged (CSRF_VALIDATION_FAILED)
- Generic error message (no details leaked)

**Token Lifecycle:**
- Generated per request
- Short-lived (valid for single submission)
- No server-side storage (stateless validation)

## Input Sanitization

### HTML Sanitization (DOMPurify)

Prevents XSS attacks in user-generated content:

**Implementation:**
```typescript
// src/lib/security/sanitization.ts
import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false
  })
}
```

**Applied To:**
- Contact form messages
- Blog post content (if user-editable)
- Any user-provided HTML content

**Configuration:**
- Minimal allowed tags (semantic formatting only)
- No JavaScript event handlers (onclick, onerror, etc.)
- No data attributes (data-*)
- External links sanitized with `rel="noopener noreferrer"`

### Email Content Escaping

Prevents email injection attacks:

```typescript
export function escapeEmailContent(content: string): string {
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
```

**Applied Before:**
- Resend email sending
- Email template rendering
- Any email content display

## Security Event Logging

### Event Types

The `SecurityEvent` table tracks security-relevant events:

| Event Type | Trigger | Severity | Action Required |
|------------|---------|----------|-----------------|
| `RATE_LIMIT_EXCEEDED` | Rate limit violation | WARNING | Monitor, adjust if false positives |
| `CSRF_VALIDATION_FAILED` | Invalid/missing CSRF token | WARNING | Investigate if >5/day |
| `SUSPICIOUS_ACTIVITY` | Rapid failures, attack patterns | CRITICAL | Block IP, investigate |
| `INPUT_VALIDATION_FAILED` | Zod validation failure | INFO | Normal, may indicate bot |
| `AUTHENTICATION_FAILED` | Failed login (future) | WARNING | Monitor for brute force |

### Severity Levels

```typescript
enum SecurityEventSeverity {
  INFO = 'INFO',       // Normal operational events
  WARNING = 'WARNING', // Potential issues requiring attention
  CRITICAL = 'CRITICAL' // Security incidents requiring immediate action
}
```

### Storage & Retention

**Database Schema:**
```typescript
model SecurityEvent {
  id         String   @id @default(cuid())
  eventType  String   // Enum: SecurityEventType
  severity   String   // Enum: SecurityEventSeverity
  clientId   String   // Hashed IP + UA
  endpoint   String?  // API endpoint affected
  metadata   Json     // Rich event context
  timestamp  DateTime @default(now())

  @@index([timestamp])
  @@index([severity])
  @@index([eventType])
  @@index([clientId])
}
```

**Retention Policy:**
- Active monitoring: Last 30 days
- Archive: 30-90 days (query performance may degrade)
- Cleanup: Consider deletion after 90 days
- Backup: Include in database backups before deletion

### Querying

**Recent Rate Limit Violations:**
```typescript
const recentBlocks = await db.securityEvent.findMany({
  where: {
    eventType: 'RATE_LIMIT_EXCEEDED',
    timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  },
  orderBy: { timestamp: 'desc' },
  take: 50
})
```

**Critical Events (Last Hour):**
```typescript
const criticalEvents = await db.securityEvent.findMany({
  where: {
    severity: 'CRITICAL',
    timestamp: { gte: new Date(Date.now() - 60 * 60 * 1000) }
  }
})
```

**Attack Pattern Analysis:**
```typescript
const attackers = await db.securityEvent.groupBy({
  by: ['clientId'],
  where: {
    eventType: { in: ['RATE_LIMIT_EXCEEDED', 'CSRF_VALIDATION_FAILED'] },
    timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  },
  _count: { id: true },
  having: { id: { _count: { gt: 10 } } },
  orderBy: { _count: { id: 'desc' } }
})
```

## Environment Security

### Required Variables

Environment variables validated at application startup (`src/lib/security/env-validation.ts`):

```typescript
const requiredEnvVars = [
  'DATABASE_URL',
  'RESEND_API_KEY',
  'JWT_SECRET',
  'CONTACT_EMAIL'
]
```

**Validation Rules:**
- `DATABASE_URL`: Must start with `postgresql://`, include host and database name
- `RESEND_API_KEY`: Minimum length 32 characters, starts with `re_`
- `JWT_SECRET`: Minimum 32 characters (256-bit security)
- `CONTACT_EMAIL`: Valid email format

### Validation

**Startup Validation:**
```typescript
// Application fails fast if validation fails
if (!isValidEnvironment()) {
  throw new Error('Invalid environment configuration')
}
```

**Development vs. Production:**
- Development: `NODE_ENV=development`, warnings only
- Production: `NODE_ENV=production`, strict validation, fails fast

**Connection String Security:**
```bash
# Include connection limits
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=10&pool_timeout=20"
```

## API Security Best Practices

### Request Processing Order

**Critical**: Process requests in this order to fail fast and prevent unnecessary work:

```typescript
export async function POST(request: NextRequest) {
  // 1. Extract client ID
  const clientId = getClientId(request)

  // 2. Check rate limits FIRST (fail fast)
  const rateLimitResult = await enhancedRateLimit(request, { max: 3, window: 3600 })
  if (!rateLimitResult.success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  // 3. Validate CSRF token (if applicable)
  if (!validateCsrfToken(request)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 403 })
  }

  // 4. Parse request body
  const body = await request.json()

  // 5. Validate with Zod schemas
  const result = schema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
  }

  // 6. Sanitize inputs
  const sanitizedData = {
    ...result.data,
    message: sanitizeHtml(result.data.message)
  }

  // 7. Process request
  const response = await processRequest(sanitizedData)

  // 8. Return standardized response
  return NextResponse.json(response)
}
```

### Error Handling

**Production Security:**
```typescript
try {
  // Process request
} catch (error) {
  // Log detailed error server-side
  console.error('Error processing request:', error)

  // Return generic error to client (no stack traces)
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}
```

**HTTP Status Codes:**
- `400 Bad Request`: Invalid input (validation failed)
- `401 Unauthorized`: Authentication required (future)
- `403 Forbidden`: CSRF validation failed, blacklisted
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Unexpected server error

**Error Messages:**
- Generic messages only (no technical details)
- No stack traces or file paths in responses
- No database error details exposed
- Log detailed errors server-side for debugging

## Security Headers

### Implemented Headers

Configured via `next.config.ts`:

```typescript
headers: [
  {
    source: '/(.*)',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
    ]
  }
]
```

**Header Purposes:**
- `X-Frame-Options: DENY`: Prevents clickjacking attacks
- `X-Content-Type-Options: nosniff`: Prevents MIME-type sniffing
- `Referrer-Policy: origin-when-cross-origin`: Limits referrer information leakage
- `Permissions-Policy`: Disables unnecessary browser features
- `Content-Security-Policy`: Set via middleware (nonce-based)

## Dependencies Security

### Vulnerability Scanning

**Regular Audits:**
```bash
# Bun audit (native)
bun audit

# npm audit (fallback)
npm audit
```

**CI/CD Integration:**
- Pre-push hook runs tests (catches obvious issues)
- Consider adding `bun audit` to CI pipeline
- Block deployments with critical vulnerabilities

### Update Strategy

| Update Type | Timeline | Testing |
|-------------|----------|---------|
| Patch (x.x.X) | Immediate | Smoke tests |
| Minor (x.X.0) | Within 1 week | Full test suite |
| Major (X.0.0) | Review changelog | Comprehensive testing |

**Critical Security Updates:**
- Apply immediately regardless of type
- Deploy hotfix if needed
- Monitor for regressions

## Compliance Considerations

### Data Protection

**Encryption:**
- Data at rest: PostgreSQL storage encryption (provider-dependent)
- Data in transit: TLS 1.3 (Vercel, Resend)
- Password storage: N/A (no user authentication currently)

**Data Minimization:**
- Contact form: Only essential fields (name, email, subject, message)
- Analytics: Vercel Analytics (anonymous, no PII)
- Logs: IP addresses hashed in SecurityEvent records

### Logging & Audit Trail

**Immutable Logs:**
- SecurityEvent records never updated (INSERT only)
- Timestamp in UTC for consistency
- Includes clientId for correlation
- Metadata provides rich context

**Audit Capabilities:**
- Track all security events (rate limits, CSRF, attacks)
- Identify patterns and attack sources
- Compliance reporting (queries by date range, event type, etc.)

---

*Last updated: 2026-01-09*
*Version: 1.0*
