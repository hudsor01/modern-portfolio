# Codebase Concerns

**Analysis Date:** 2026-01-08

## Tech Debt

**SSR/Hydration Mismatch in Blog Content Rendering:**
- Issue: Blog content sanitization happens client-side only, causing SSR-unsafe pattern
- Files: `src/app/blog/components/blog-content.tsx` (lines 186-200, 155-227)
- Why: DOMPurify requires `window` object, conditional sanitization based on `typeof window`
- Impact: Unsanitized HTML sent to client during SSR, then sanitized on hydration (potential XSS window, hydration mismatch)
- Fix approach: Move sanitization to server-side using isomorphic-dompurify (already installed) or server-only sanitization

**Duplicate Sanitization Configuration:**
- Issue: DOMPurify configuration repeated twice in same file with identical ALLOWED_TAGS/ALLOWED_ATTR
- Files: `src/app/blog/components/blog-content.tsx` (lines 159-161 vs 187-189)
- Why: Two separate rendering paths (sanitized HTML vs. markdown) with copy-pasted config
- Impact: Maintenance burden, risk of config drift
- Fix approach: Extract sanitization config to centralized utility in `src/lib/security/sanitization.ts`

**Large Files with Multiple Responsibilities:**
- Issue: Several files exceed 650+ lines suggesting SRP violations
- Files: `src/lib/security/rate-limiter.ts` (744 lines), `src/__tests__/backward-compatibility.test.ts` (753 lines), `src/types/blog.ts` (734 lines), `src/lib/analytics/data-service.ts` (665 lines)
- Why: Organic growth without refactoring
- Impact: Hard to navigate, test, and maintain
- Fix approach: Split rate-limiter into separate classes (LRUCache, RateLimitChecker, SecurityAnalyzer), split large test files by feature

**Hardcoded Configuration Values:**
- Issue: Rate limiter uses hardcoded cleanup intervals, batch sizes, ratios instead of config-driven approach
- Files: `src/lib/security/rate-limiter.ts` (lines 22-25): CLEANUP_INTERVAL=300000ms, EVICTION_BATCH_SIZE=50, EVICTION_TARGET_RATIO=0.7
- Why: Comments indicate "for now" suggesting temporary solution
- Impact: Can't tune performance without code changes, harder to test different configurations
- Fix approach: Move to centralized config in `src/lib/config/index.ts` with SecurityConfigSchema

## Known Bugs

**Contact Form Database Update Pattern:**
- Issue: Contact submission created, then updated twice (email sent status, email error status)
- Files: `src/app/api/contact/route.ts` (lines 66-91)
- Why: Progressive status updates as email sending progresses
- Impact: Three database queries instead of one, potential race conditions
- Workaround: Current pattern works but inefficient
- Fix: Single upsert with transaction, or batch updates

## Security Considerations

**Environment File Checked Into Repository:**
- Risk: Actual `.env` file exists in repository with live values
- Files: `/Users/richard/Developer/modern-portfolio/.env`
- Current mitigation: .env in .gitignore, but file exists locally
- Recommendations: Verify `.env` is not in git history, use git-secrets or similar tool, rotate any exposed credentials

**Unsafe-Eval in Development CSP:**
- Risk: Content Security Policy includes 'unsafe-eval' in development mode
- Files: `src/proxy.ts` (CSP configuration)
- Current mitigation: Marked as dev-only with isDev check
- Recommendations: Ensure dev mode never deployed to production, add CI check

**localStorage Usage Without Error Handling:**
- Risk: Reading localStorage with JSON.parse without try/catch could crash on corrupted data
- Files: `src/lib/utils/reading-progress-utils.ts`, `src/lib/utils/cross-tab-sync.ts`
- Current mitigation: None
- Recommendations: Wrap JSON.parse in try/catch with fallback to default values, validate parsed data with Zod

## Performance Bottlenecks

**Large Type Files:**
- Problem: Type definition files exceed 700+ lines
- Files: `src/types/blog.ts` (734 lines), `src/types/project.ts` (600+ lines)
- Measurement: Not measured (not runtime performance issue)
- Cause: All types for a domain in single file
- Improvement path: Split into subdirectories: `src/types/blog/post.ts`, `src/types/blog/author.ts`, etc.

**No Evidence of Query Optimization:**
- Problem: No visible use of Prisma `include` optimization or relation preloading strategies
- Files: `src/lib/database/operations.ts` (647 lines)
- Measurement: Not measured in production
- Cause: May not be performance issue yet at current scale
- Improvement path: Add query profiling, optimize N+1 patterns if discovered

## Fragile Areas

**None Identified:**
- The codebase shows consistent patterns with good error handling
- 913 passing tests indicate solid coverage
- No obvious fragile code detected

## Scaling Limits

**In-Memory Rate Limiting:**
- Current capacity: LRU cache with max 10,000 clients, cleanup every 5 minutes
- Limit: Single-server only (no distributed rate limiting)
- Symptoms at limit: Rate limits reset on server restart, can't share limits across instances
- Scaling path: Move to Redis for distributed rate limiting when horizontal scaling needed

**No Caching Layer:**
- Current capacity: Database query on every request
- Limit: PostgreSQL connection limit (configured at 10 for production)
- Symptoms at limit: Slow response times under high traffic
- Scaling path: Add Redis for caching frequently accessed data (blog posts, projects)

## Dependencies at Risk

**React Hot Toast (if used):**
- Not currently detected in dependencies - false alarm from earlier notes
- Sonner 2.0.7 is used instead (actively maintained)

**No Critical Dependency Issues:**
- Dependencies appear up-to-date
- Using latest stable versions (Next.js 16, React 19, Prisma 7)

## Missing Critical Features

**No Authentication System:**
- Problem: JWT_SECRET configured but no auth implementation
- Current workaround: Public-facing portfolio doesn't require auth
- Blocks: Can't add admin dashboard, protected content, user comments
- Implementation complexity: Medium (would need to add Supabase Auth or similar)

**No Distributed Tracing:**
- Problem: No observability for request flows across services
- Current workaround: Structured logging only
- Blocks: Hard to debug production issues, no performance insights
- Implementation complexity: Low (add OpenTelemetry or similar)

## Test Coverage Gaps

**Chart Components Excluded:**
- What's not tested: `src/components/charts/**`, `src/components/projects/**Chart.tsx`
- Risk: Chart rendering bugs undetected
- Priority: Low (visual components, better suited for E2E tests)
- Difficulty to test: Medium (requires mocking Recharts, testing visual output)

**UI-Heavy Components Excluded:**
- What's not tested: `src/components/navigation/**`, `src/components/seo/json-ld/**`
- Risk: Navigation or SEO bugs undetected
- Priority: Low (simple components, E2E tests cover navigation)
- Difficulty to test: Low (could add tests, intentionally excluded for focus on logic)

## Type Safety Issues

**Excessive any Usage:**
- Problem: 230+ uses of `any` type throughout codebase
- Files: Scattered across multiple files
- Risk: Runtime type errors not caught by TypeScript
- Priority: Medium (gradual improvement recommended)
- Fix: Audit `any` usages, replace with proper types or `unknown` with type guards

## Positive Findings

**No Critical Issues Found:**
- No TODO/FIXME comments indicating deferred work
- Comprehensive error handling across API routes
- 913 passing tests with 80% coverage threshold
- Well-structured architecture with clear layer separation
- Consistent validation patterns (Zod schemas)
- Security-hardened (rate limiting, CSRF, headers, sanitization)

**Code Quality Indicators:**
- Strict TypeScript mode enabled
- ESLint + Prettier enforced
- Pre-commit hooks with lint-staged
- Comprehensive test suite
- Detailed documentation

---

*Concerns audit: 2026-01-08*
*Update as issues are fixed or new ones discovered*
