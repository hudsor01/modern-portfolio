# Operations Runbook

## Overview

This runbook provides operational procedures for maintaining and troubleshooting the Modern Portfolio application. It covers monitoring, error recovery, deployment procedures, database maintenance, and incident response.

**Target Audience**: DevOps engineers, site reliability engineers, and maintainers.

## Monitoring

### Key Metrics

**Application Health:**
- `/api/health-check` endpoint status (200 OK expected)
- Response times:
  - P50 (median): <200ms
  - P95: <500ms
  - P99: <1000ms
- Error rates by endpoint (<1% target)
- Test suite status (891 tests passing)

**Security Metrics:**
- Rate limit violations per hour (baseline: <10/hour)
- CSRF validation failures per day (baseline: <5/day)
- Suspicious activity events (CRITICAL severity)
- Failed authentication attempts (future feature)

**Database:**
- Connection pool utilization (max 10 connections)
- Query performance (slow query log >1s)
- Database size and growth rate
- Active connections vs. available

**Infrastructure (Vercel):**
- Deployment success rate
- Build duration
- Function invocation count
- Function duration

### Monitoring Tools

**Vercel Analytics:**
- Core Web Vitals: LCP, FID, CLS
- Real-user monitoring (RUM)
- Error tracking
- Traffic patterns

**Database:**
- Prisma Studio: `bun run db:studio` (localhost:5555)
- Direct queries via `bunx prisma db execute`
- Connection pool metrics (PostgreSQL provider dashboard)

**Logs:**
- Server-side: Vercel function logs
- Security: `SecurityEvent` table queries
- Application: Console logs in development

**Tests:**
- Pre-push hook: `bun test` (891 tests)
- CI/CD: Automated on pull requests
- Manual: `bun test` for full suite

## Error Recovery Procedures

### Application Crashes

**Symptoms:**
- 502 Bad Gateway errors
- 503 Service Unavailable errors
- Container restarts in Vercel logs
- Unresponsive endpoints

**Recovery Steps:**

1. **Check Vercel deployment logs**:
   - Navigate to Vercel dashboard → Deployments
   - Review latest deployment logs for errors
   - Check function invocation logs for stack traces

2. **Verify DATABASE_URL connectivity**:
   ```bash
   # Test connection from local machine
   bunx prisma db execute --stdin <<< "SELECT 1"

   # Expected: Query successful
   # If fails: Database unreachable or credentials invalid
   ```

3. **Check environment variables**:
   - Vercel dashboard → Settings → Environment Variables
   - Verify all required variables present:
     - `DATABASE_URL`
     - `RESEND_API_KEY`
     - `JWT_SECRET`
     - `CONTACT_EMAIL`
   - Check for typos or missing values

4. **Review recent deployments**:
   - Identify last known good deployment
   - Compare with current failing deployment
   - Consider rollback if regression identified

5. **Check SecurityEvent table for attack patterns**:
   ```typescript
   // Via Prisma Studio or direct query
   SELECT eventType, severity, COUNT(*) as count
   FROM "SecurityEvent"
   WHERE timestamp > NOW() - INTERVAL '1 hour'
   GROUP BY eventType, severity
   ORDER BY count DESC;
   ```
   - Look for CRITICAL events
   - Identify coordinated attacks (same clientId)
   - Check for resource exhaustion patterns

### Database Connection Issues

**Symptoms:**
- Prisma timeout errors: `P2024: Timed out fetching connection`
- Slow query responses (>5s)
- Connection pool exhausted messages
- Intermittent 500 errors on database operations

**Recovery Steps:**

1. **Check connection pool exhaustion**:
   ```typescript
   // Default Prisma configuration
   // Connection limit: 10
   // Timeout: 20 seconds
   // Pool timeout: 20 seconds
   ```
   - Review active connections in PostgreSQL dashboard
   - Look for long-running queries blocking pool

2. **Verify DATABASE_URL includes connection parameters**:
   ```bash
   # Recommended format
   DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=10&pool_timeout=20"
   ```

3. **Check for long-running queries**:
   - PostgreSQL provider dashboard → Query performance
   - Identify queries >1s execution time
   - Consider adding indexes or optimizing queries

4. **Increase connection pool if sustained high load**:
   - Modify `connection_limit` in DATABASE_URL
   - Monitor impact on database server resources
   - Typical range: 10-20 connections for portfolio site

5. **Review query performance with Prisma Studio**:
   ```bash
   bun run db:studio
   ```
   - Examine slow queries
   - Check for N+1 query patterns
   - Verify indexes on frequently queried fields

### Rate Limit False Positives

**Symptoms:**
- Legitimate users reporting "Too many requests" errors
- 429 HTTP status codes for normal usage patterns
- Customer complaints about form submission failures

**Recovery Steps:**

1. **Identify blocked client**:
   ```typescript
   const events = await db.securityEvent.findMany({
     where: {
       eventType: 'RATE_LIMIT_EXCEEDED',
       timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
     },
     select: {
       clientId: true,
       metadata: true,
       timestamp: true
     },
     orderBy: { timestamp: 'desc' },
     take: 50
   })

   // Examine metadata for IP addresses and user agents
   console.log(events.map(e => e.metadata))
   ```

2. **Extract IP address from metadata**:
   ```typescript
   // metadata structure:
   {
     ip: '1.2.3.4',
     userAgent: 'Mozilla/5.0...',
     requestCount: 4,
     limit: 3,
     blockDuration: 300
   }
   ```

3. **Evaluate if IP should be whitelisted**:
   - Is it an internal tool? (monitoring, CI/CD)
   - Is it a legitimate high-volume user? (rare for portfolio)
   - Is it from a known trusted network?

4. **Add to whitelist** (requires code change + deployment):
   ```typescript
   // src/lib/security/rate-limiter.ts
   const WHITELISTED_IPS = [
     '10.0.0.0/8',     // Internal network
     '192.168.0.0/16', // Private network
     '1.2.3.4'         // Specific trusted IP
   ]
   ```
   - Deploy change
   - Verify whitelist effective
   - Monitor for abuse

5. **Consider adjusting thresholds if widespread**:
   - Increase window duration
   - Increase request limit
   - Reduce block duration
   - Test changes in development first

### Email Delivery Failures

**Symptoms:**
- Contact form submissions not received
- Successful form submission but no email
- Resend dashboard showing failed deliveries
- Users reporting "Message sent" but no receipt

**Recovery Steps:**

1. **Verify RESEND_API_KEY is valid**:
   - Check Vercel environment variables
   - Confirm key hasn't been regenerated
   - Test key with Resend dashboard or API

2. **Check Resend dashboard for delivery status**:
   - Navigate to resend.com/emails
   - Filter by date/time of reported failure
   - Review bounce reasons, spam filters, or blocks

3. **Verify CONTACT_EMAIL is correct**:
   - Check environment variable spelling
   - Confirm email address is active
   - Test email delivery to that address

4. **Review contact form submissions in database**:
   ```typescript
   // Note: ContactSubmission model may not exist yet
   // This is an example for when it's implemented
   const recent = await db.contactSubmission.findMany({
     where: {
       createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
     },
     orderBy: { createdAt: 'desc' },
     take: 20
   })

   console.log(recent)
   ```

5. **Check for email validation errors in server logs**:
   - Vercel function logs for `/api/contact` route
   - Look for Resend API errors
   - Check for rate limiting from Resend (100 emails/day free tier)

### CSP Violations

**Symptoms:**
- Browser console CSP errors
- Blocked resources (scripts, styles, images)
- Broken functionality (buttons not working, styles missing)
- User reports of missing features

**Recovery Steps:**

1. **Review error details in browser console**:
   ```
   Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'self' 'nonce-abc123'..."
   ```

2. **Identify violating resource**:
   - Script: Third-party library, inline script
   - Style: Inline styles, external stylesheet
   - Image: External image source
   - Font: External font source

3. **Determine if legitimate or attack**:

   **If Legitimate:**
   - Update CSP directive in middleware
   - Add nonce to inline scripts/styles
   - Whitelist trusted external sources
   - Example:
     ```typescript
     // src/middleware.ts
     const cspHeader = `
       script-src 'self' 'nonce-${nonce}' https://trusted-cdn.com;
     `
     ```

   **If Attack:**
   - Investigate source of injection
   - Check for XSS vulnerabilities
   - Review sanitization implementation
   - Block malicious source

4. **Test in development before deploying**:
   ```bash
   bun dev
   # Open browser console
   # Verify zero CSP violations
   # Test all functionality
   ```

5. **Verify zero violations after fix**:
   - Deploy to production
   - Monitor browser console
   - Check multiple pages/features
   - Confirm no user reports

## Deployment Procedures

### Pre-Deployment Checklist

Run these checks before merging to `main`:

- [ ] **All tests passing**: `bun test`
  - Expected: 891 passing, 62 skipped (intentional)
  - If fails: Fix failures before deploying

- [ ] **Type check passing**: `bun run type-check`
  - Expected: 0 errors
  - If fails: Fix TypeScript errors

- [ ] **Lint check passing**: `bun run lint`
  - Expected: 0 errors, <10 warnings
  - If fails: Fix lint errors

- [ ] **Build successful**: `bun run build`
  - Expected: Successful build, no errors
  - If fails: Check for build-time errors

- [ ] **Database migrations ready** (if applicable):
  ```bash
  # Development
  bun run db:migrate

  # Production (run after deployment)
  bun run db:migrate:deploy
  ```

- [ ] **Environment variables configured in Vercel**:
  - All required variables present
  - No typos or formatting issues
  - Secrets rotated if needed

- [ ] **Security documentation reviewed**:
  - No new security holes introduced
  - Rate limits appropriate for changes
  - CSP updated if new external resources

### Deployment Process

**Automatic Deployment** (recommended):

1. **Merge to `main` branch**:
   ```bash
   git checkout main
   git merge feature-branch
   git push origin main
   ```
   - Triggers automatic Vercel deployment
   - Pre-push hook runs tests (must pass)

2. **Monitor deployment progress**:
   - Vercel dashboard → Deployments
   - Watch build logs for errors
   - Typical build time: 2-3 minutes

3. **Verify deployment URL loads successfully**:
   - Click "Visit" in Vercel dashboard
   - Check for 200 OK response
   - Verify page renders correctly

4. **Run smoke tests**:
   - Homepage loads: `/`
   - Projects page loads: `/projects`
   - Contact form submits: `/contact` (test entry)
   - Blog pages load: `/blog`
   - API health check: `/api/health-check`

5. **Check `/api/health-check` endpoint**:
   ```bash
   curl https://your-domain.com/api/health-check

   # Expected response:
   {
     "status": "healthy",
     "timestamp": "2026-01-09T12:00:00.000Z"
   }
   ```

6. **Monitor error rates for 15 minutes post-deployment**:
   - Vercel Analytics → Real-time
   - Look for error spikes
   - Check function logs for new errors
   - If errors detected, consider rollback

### Rollback Procedure

If deployment issues detected:

1. **Navigate to Vercel dashboard → Deployments**

2. **Find previous stable deployment**:
   - Identified by "Production" badge
   - Check timestamp before issues started
   - Verify it was working correctly

3. **Click "Promote to Production"**:
   - Instant rollback (no rebuild)
   - Previous deployment becomes active
   - Traffic routes to stable version

4. **Verify rollback successful**:
   - Visit production URL
   - Run smoke tests
   - Check error rates normalized

5. **Investigate root cause before re-deploying**:
   - Review failed deployment logs
   - Identify breaking changes
   - Fix issues in development
   - Test thoroughly before retry

## Database Maintenance

### Migrations

**Development Environment:**
```bash
# Create migration from schema changes
bun run db:migrate

# Generates migration files in prisma/migrations/
# Applies migration to development database
```

**Production Environment:**
```bash
# Apply pending migrations
bun run db:migrate:deploy

# Run after deployment
# Non-interactive (CI/CD friendly)
# Fails if schema drift detected
```

**Best Practices:**
- Always test migrations in development first
- Backup database before major migrations
- Review generated SQL before applying
- Consider downtime for destructive changes

### Backup & Restore

**Automated Backups** (PostgreSQL provider-dependent):
- Daily automated backups (verify with provider)
- Retention: 7-30 days (check provider settings)
- Point-in-time recovery (if supported)

**Manual Backup** (before major migrations):
```bash
# Backup entire database
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup specific table
pg_dump $DATABASE_URL -t SecurityEvent > security_events_backup.sql
```

**Restore from Backup**:
```bash
# Restore entire database (CAUTION: overwrites existing data)
psql $DATABASE_URL < backup_20260109_120000.sql

# Restore specific table
psql $DATABASE_URL < security_events_backup.sql
```

### Data Cleanup

**SecurityEvent Table** (grows over time):
```typescript
// Delete events older than 90 days
await db.securityEvent.deleteMany({
  where: {
    timestamp: { lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
  }
})

// Archive before deletion (optional)
const oldEvents = await db.securityEvent.findMany({
  where: {
    timestamp: { lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
  }
})
// Export to JSON, CSV, or external storage
```

**Considerations:**
- Run cleanup during low-traffic periods
- Archive critical events before deletion
- Monitor query performance after cleanup
- Consider partitioning for large tables

## Troubleshooting

### Common Issues

#### Issue: Tests failing in CI

**Symptoms:**
- Pre-push hook blocks commit
- `bun test` exits with failures
- CI pipeline fails on test step

**Fix:**
1. Run `bun test` locally to reproduce
2. Review failure messages
3. Fix broken tests or code
4. Ensure all 891 tests pass
5. If persistent: Check for environment-specific issues

#### Issue: Build fails with type errors

**Symptoms:**
- `bun run build` fails
- TypeScript compilation errors
- Type mismatch errors

**Fix:**
1. Run `bun run type-check` for detailed errors
2. Review error messages
3. Common causes:
   - Missing type imports
   - Prisma schema changes (run `bun run db:generate`)
   - Strict type violations
   - Invalid prop types
4. Fix errors and retry build

#### Issue: Rate limit blocking development

**Symptoms:**
- 429 responses during testing
- Form submissions blocked locally
- API endpoints returning rate limit errors

**Fix:**
1. Temporarily increase thresholds in `src/lib/security/rate-limiter.ts`
2. Or whitelist development IP (127.0.0.1, localhost)
3. Or restart dev server to clear in-memory rate limits
4. Remember: Rate limits auto-expire after block period

#### Issue: CSP blocking local resources

**Symptoms:**
- Console errors for inline scripts/styles
- Features not working in development
- "Refused to execute inline script" errors

**Fix:**
1. Verify nonce is being passed to scripts/styles
2. Check middleware is generating nonces
3. Ensure `x-nonce` header present in responses
4. Verify Server Components receive nonce prop
5. Add nonce attribute to inline scripts: `<script nonce={nonce}>`

### Debug Commands

```bash
# View security events
bun run db:studio
# Navigate to SecurityEvent table in browser

# Check database connection
bunx prisma db execute --stdin <<< "SELECT NOW()"

# Validate environment variables
bun run type-check
# Runs env-validation.ts at build time

# Test contact form endpoint
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: $(curl -s http://localhost:3000/api/contact/csrf-route | jq -r .csrfToken)" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "Test message content"
  }'

# Check rate limit headers
curl -I http://localhost:3000/api/contact

# View recent logs (Vercel)
# Vercel dashboard → Deployments → [deployment] → Functions → Logs

# Generate Prisma client after schema changes
bun run db:generate

# Run full CI pipeline locally
bun run ci:full
```

## Incident Response

### Security Incident Detected

**Process:**

1. **Identify** attack type:
   - Review SecurityEvent table
   - Analyze patterns (IP addresses, timestamps, event types)
   - Classify: DDoS, XSS attempt, SQL injection, brute force, etc.

2. **Contain** threat:
   - Block attacking IPs (add to blacklist in rate-limiter)
   - Increase rate limits temporarily if DDoS
   - Disable affected endpoints if critical vulnerability
   - Isolate compromised systems (if data breach)

3. **Investigate** scope:
   ```typescript
   // Query attack patterns
   const attackEvents = await db.securityEvent.findMany({
     where: {
       severity: { in: ['WARNING', 'CRITICAL'] },
       timestamp: { gte: incidentStartTime }
     },
     orderBy: { timestamp: 'asc' }
   })

   // Group by attacker
   const attackers = await db.securityEvent.groupBy({
     by: ['clientId'],
     where: { severity: 'CRITICAL' },
     _count: { id: true },
     orderBy: { _count: { id: 'desc' } }
   })
   ```
   - Check data integrity (database tampering?)
   - Review unauthorized access attempts
   - Identify compromised accounts (if auth enabled)

4. **Remediate**:
   - Deploy security patches immediately
   - Update security rules (CSP, rate limits, validation)
   - Fix exploited vulnerabilities
   - Rotate secrets if compromised (API keys, JWT secret)
   - Update dependencies if vulnerability in package

5. **Document** incident:
   - Timeline: When detected, contained, resolved
   - Attack vector: How attacker exploited system
   - Impact: Data accessed, services disrupted, users affected
   - Resolution: Steps taken, patches deployed
   - Lessons learned: How to prevent recurrence

6. **Monitor** for recurrence:
   - Watch for same attack patterns
   - Verify security measures effective
   - Adjust defenses based on attacker adaptation
   - Consider additional security layers if needed

### Application Outage

**Process:**

1. Check deployment status (Vercel dashboard)
2. Verify database connectivity (pg_isready, Prisma Studio)
3. Review environment variables (typos, missing values)
4. Check recent deployments (regression?)
5. Review SecurityEvent table (attack in progress?)
6. Consider rollback if deployment-related
7. Monitor recovery and error rates

### Contact Information

**Security Incidents:**
- Email: [Value from CONTACT_EMAIL environment variable]
- Severity: Immediate response for CRITICAL events

**System Outages:**
- Vercel Support: vercel.com/support
- Status Page: vercel-status.com

**Database Issues:**
- PostgreSQL Provider Support (check your provider)
- Escalation: High priority for data loss or corruption

---

*Last updated: 2026-01-09*
*Version: 1.0*
