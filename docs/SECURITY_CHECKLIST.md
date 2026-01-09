# Security Checklist

## Pre-Deployment Security Review

### Code Security

- [ ] **All dependencies up to date** (no critical vulnerabilities)
  - Run: `bun audit`
  - Review: Check for high/critical severity issues
  - Action: Update vulnerable packages before deploying

- [ ] **No hardcoded secrets in codebase**
  - Check: `.env` files not committed (git grep for API keys)
  - Verify: Secrets stored in Vercel environment variables
  - Command: `git log -p | grep -i "api_key\|secret\|password"`

- [ ] **All API endpoints have rate limiting**
  - Review: `/api/**/route.ts` files use `enhancedRateLimit`
  - Verify: Rate limits configured appropriately
  - Check: Contact form (3/hr), general API (100/15min)

- [ ] **All user inputs validated with Zod schemas**
  - Check: POST/PUT routes have schema validation
  - Verify: `safeParse` used (not `parse`)
  - Ensure: Error responses don't leak validation details

- [ ] **HTML content sanitized with DOMPurify**
  - Review: User-generated content passes through `sanitizeHtml`
  - Check: Contact form messages, blog content
  - Verify: Allowed tags minimal (no script, iframe, etc.)

- [ ] **CSRF protection on all state-changing endpoints**
  - Verify: POST/PUT/DELETE routes validate CSRF token
  - Check: `x-csrf-token` header required
  - Test: Requests without token return 403

- [ ] **SQL injection prevention** (Prisma ORM)
  - Verify: No raw SQL queries with user input
  - Use: Prisma's parameterized queries only
  - Check: No `$queryRaw` with unvalidated input

### Configuration Security

- [ ] **CSP nonce-based implementation active**
  - Verify: Middleware generates nonces (`crypto.randomUUID()`)
  - Check: No `unsafe-inline` in CSP headers
  - Test: Browser console shows zero CSP violations

- [ ] **Security headers configured**
  - `X-Frame-Options: DENY` (clickjacking prevention)
  - `X-Content-Type-Options: nosniff` (MIME-type sniffing)
  - `Content-Security-Policy`: nonce-based
  - `Referrer-Policy: origin-when-cross-origin`
  - Verify: `curl -I https://your-domain.com | grep X-Frame-Options`

- [ ] **Environment variables validated at startup**
  - Run: Application starts without env validation errors
  - Check: `src/lib/security/env-validation.ts` passes
  - Verify: Required variables present in Vercel

- [ ] **HTTPS enforced in production**
  - Verify: Vercel handles SSL/TLS (automatic)
  - Check: `NEXT_PUBLIC_SITE_URL` uses `https://`
  - Test: HTTP requests redirect to HTTPS

- [ ] **Database connection pooling configured**
  - Verify: `connection_limit=10` in DATABASE_URL
  - Check: `pool_timeout=20` set
  - Format: `postgresql://...?connection_limit=10&pool_timeout=20`

### Testing & Validation

- [ ] **All 891 tests passing**
  - Run: `bun test`
  - Verify: 891 passing, 62 skipped (intentional)
  - If fails: Fix failures before deploying

- [ ] **Zero TypeScript errors**
  - Run: `bun run type-check`
  - Expected: 0 errors
  - If fails: Fix type errors before deploying

- [ ] **Lint checks passing**
  - Run: `bun run lint`
  - Expected: 0 errors, <10 warnings
  - If fails: Fix lint errors

- [ ] **Build successful**
  - Run: `bun run build`
  - Verify: No errors or critical warnings
  - Check: Build output size reasonable (<2MB)

- [ ] **Security event logging tested**
  - Verify: SecurityEvent records created for violations
  - Check: Severity levels assigned correctly (INFO/WARNING/CRITICAL)
  - Test: Rate limit violation logs to database

### Documentation

- [ ] **SECURITY.md updated with any new features**
  - New security features documented
  - Configuration examples included
  - Monitoring guidance provided

- [ ] **OPERATIONS.md reflects current procedures**
  - Error recovery steps accurate
  - Deployment procedures current
  - Contact information up to date

- [ ] **API_REFERENCE.md includes security requirements**
  - Rate limits documented per endpoint
  - CSRF token requirements specified
  - Authentication requirements noted (if applicable)

- [ ] **CHANGELOG.md documents security-related changes**
  - Security fixes noted
  - Breaking changes highlighted
  - Migration steps provided

## Runtime Security Monitoring

### Daily Checks

- [ ] **Application health check passing**
  - Endpoint: `GET /api/health-check`
  - Expected: `200 OK` response with `{ "status": "healthy" }`
  - Command: `curl https://your-domain.com/api/health-check`

- [ ] **No critical security events**
  - Query: `SecurityEvent WHERE severity='CRITICAL' AND timestamp > 24h ago`
  - Expected: Zero critical events
  - Action: Investigate immediately if any found
  - Command:
    ```typescript
    await db.securityEvent.findMany({
      where: {
        severity: 'CRITICAL',
        timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    })
    ```

- [ ] **Rate limit violations within normal range**
  - Query: `SecurityEvent WHERE eventType='RATE_LIMIT_EXCEEDED'`
  - Baseline: <10 per hour (adjust based on traffic)
  - Action: Investigate spikes or sustained high rates

- [ ] **CSRF validation failures investigated**
  - Query: `SecurityEvent WHERE eventType='CSRF_VALIDATION_FAILED'`
  - Baseline: <5 per day
  - Action: Investigate if >5 per day (possible attack)

### Weekly Checks

- [ ] **Review dependency vulnerabilities**
  - Run: `bun audit`
  - Action: Update packages with vulnerabilities
  - Priority: Critical > High > Medium
  - Schedule: Within 7 days for high/critical

- [ ] **Review security event trends**
  - Analyze: Weekly SecurityEvent patterns
  - Look for: Emerging attack patterns, false positives
  - Query: Group by eventType, clientId, and count
  - Document: Unusual patterns for investigation

- [ ] **Database performance review**
  - Check: Slow query logs (queries >1s)
  - Verify: Connection pool not exhausted
  - Review: Table sizes and growth rates
  - Action: Optimize slow queries or add indexes

- [ ] **Error rate analysis**
  - Review: 5xx errors in Vercel function logs
  - Investigate: Spikes or sustained elevated rates
  - Target: <1% error rate
  - Action: Fix recurring errors

### Monthly Checks

- [ ] **Comprehensive security audit**
  - Review: All security configurations
  - Verify: No drift from security baseline
  - Check: Rate limits, CSP, CSRF, sanitization
  - Update: Documentation if configuration changed

- [ ] **Rate limit threshold review**
  - Analyze: False positive rate (legitimate users blocked)
  - Review: Attack prevention effectiveness
  - Adjust: Thresholds if needed (increase or decrease)
  - Document: Rationale for changes

- [ ] **Backup verification**
  - Test: Database backup restoration
  - Verify: Backup process functional
  - Check: Backups within retention period
  - Action: Fix backup issues immediately

- [ ] **Security documentation review**
  - Update: SECURITY.md with changes
  - Verify: Procedures still accurate
  - Check: Links and references valid
  - Review: Code examples current

## Incident Response Checklist

### Security Incident Detected

- [ ] **Identify attack type**
  - Review: SecurityEvent logs for patterns
  - Classify:
    - DDoS: High volume rate limit violations
    - XSS: Input validation failures, suspicious content
    - SQL injection: Database errors, query failures
    - Brute force: Repeated authentication failures
    - CSRF: Token validation failures

- [ ] **Assess severity**
  - **CRITICAL**: Data breach, system compromise, service down
    - Action: Immediate response required
    - Timeline: Contain within 1 hour
  - **HIGH**: Active attack, service disruption, security bypass
    - Action: Respond within 4 hours
    - Timeline: Contain within 24 hours
  - **MEDIUM**: Suspicious activity, repeated failures
    - Action: Investigate within 24 hours
    - Timeline: Resolve within 1 week
  - **LOW**: Single violation, likely mistake
    - Action: Log and monitor
    - Timeline: Review in next weekly check

- [ ] **Contain threat**
  - **Block attacking IPs**:
    ```typescript
    // Add to rate-limiter blacklist
    const BLACKLISTED_IPS = ['1.2.3.4', '5.6.7.8']
    ```
  - **Isolate affected systems**: Disable endpoints if needed
  - **Increase rate limits temporarily**: If DDoS, lower thresholds
  - **Revoke access tokens**: If credentials compromised
  - **Deploy emergency patch**: If critical vulnerability

- [ ] **Investigate scope**
  - Query full extent of attack in logs:
    ```typescript
    const attackEvents = await db.securityEvent.findMany({
      where: {
        clientId: suspiciousClientId,
        timestamp: { gte: incidentStartTime }
      },
      orderBy: { timestamp: 'asc' }
    })
    ```
  - Check data integrity: Any unauthorized modifications?
  - Review related security events: Same attacker, multiple vectors?
  - Identify attack timeline: When started, duration, current status?

- [ ] **Remediate**
  - **Deploy security patches**: Fix exploited vulnerabilities
  - **Update security rules**: Adjust CSP, rate limits, validation
  - **Fix vulnerabilities**: Code changes, dependency updates
  - **Rotate secrets**: API keys, JWT secret if compromised
  - **Strengthen defenses**: Additional security layers if needed

- [ ] **Document incident**
  - Record timeline:
    - Detection: When and how discovered
    - Containment: Steps taken, time to contain
    - Resolution: Final fix, time to resolve
  - Note attack vectors:
    - Entry point: How attacker gained access
    - Exploited vulnerability: What was exploited
    - Attacker information: IP, user agent, patterns
  - Document resolution steps:
    - Patches deployed
    - Configuration changes
    - Lessons learned
  - Create post-mortem report

- [ ] **Monitor for recurrence**
  - Watch for same attack patterns (24-48 hours intense monitoring)
  - Verify security measures effective (attack stopped?)
  - Adjust defenses as needed (attacker adaptation?)
  - Schedule follow-up review (1 week, 1 month)

### Application Outage

- [ ] **Verify database connectivity**
  - Command: `bunx prisma db execute --stdin <<< "SELECT 1"`
  - Check: Connection pool availability
  - Review: Recent database changes or migrations

- [ ] **Check environment variables**
  - Vercel dashboard → Settings → Environment Variables
  - Verify: All required variables present
  - Check: No typos or formatting issues

- [ ] **Review recent deployments**
  - Identify: Last known good deployment
  - Compare: Changes in failing deployment
  - Consider: Rollback if regression identified

- [ ] **Check rate limit false positives**
  - Query: Recent RATE_LIMIT_EXCEEDED events
  - Verify: Not blocking legitimate traffic
  - Action: Whitelist IPs or increase thresholds if needed

- [ ] **Review error logs**
  - Vercel function logs: Check for stack traces
  - SecurityEvent table: Look for attack patterns
  - Application logs: Identify error sources

- [ ] **Consider rollback if deployment-related**
  - Vercel dashboard → Deployments
  - Promote previous stable deployment
  - Verify rollback successful

## Security Improvement Backlog

Ideas for future security enhancements (not required now):

### Authentication & Authorization
- [ ] Add Supabase/Clerk authentication for admin features
- [ ] Implement role-based access control (RBAC)
- [ ] Add session management for authenticated users
- [ ] Implement brute force protection for auth endpoints
- [ ] Add two-factor authentication (2FA) for admin

### Bot & Spam Prevention
- [ ] Implement CAPTCHA for contact form (if spam becomes issue)
- [ ] Add honeypot fields to forms (bot detection)
- [ ] Implement rate limit exemptions for trusted users
- [ ] Add behavioral analysis (mouse movement, typing patterns)

### Content Security
- [ ] Implement content security policy reporting endpoint
- [ ] Add subresource integrity (SRI) for external scripts
- [ ] Implement automated CSP violation alerting
- [ ] Add DOM-based XSS prevention for client-side rendering

### API Security
- [ ] Implement API key authentication for external integrations
- [ ] Add OAuth2 support for third-party access
- [ ] Implement request signing for API calls
- [ ] Add GraphQL rate limiting (if GraphQL added)

### Monitoring & Logging
- [ ] Add automated security scanning in CI/CD pipeline
- [ ] Implement log aggregation service (Datadog, LogRocket)
- [ ] Add real-time security alerting (PagerDuty, Slack)
- [ ] Implement automated threat intelligence feeds
- [ ] Add user behavior analytics (UBA)

### Infrastructure
- [ ] Implement DDoS protection (Cloudflare, AWS Shield)
- [ ] Add Web Application Firewall (WAF)
- [ ] Implement automated backup testing
- [ ] Add disaster recovery procedures
- [ ] Implement blue-green deployments for zero downtime

### Compliance & Privacy
- [ ] Add GDPR compliance features (data export, deletion)
- [ ] Implement privacy policy and consent management
- [ ] Add data retention policies
- [ ] Implement audit logging for compliance
- [ ] Add data encryption at rest

---

*Last updated: 2026-01-09*
*Version: 1.0*
