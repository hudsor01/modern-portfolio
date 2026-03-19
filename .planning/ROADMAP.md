# Roadmap - v1.1 Security & Quality Hardening

## Milestone Overview
Harden the portfolio site's security posture, establish test coverage for critical services, reduce tech debt, and optimize performance. Derived from comprehensive codebase audit (2026-03-18).

---

## Phase 1: Security Hardening
**Goal:** Eliminate XSS attack surfaces, centralize CSRF enforcement, strengthen CSP, and validate security headers.
**Depends on:** Nothing (independent)
**Requirements:** R1, R2, R3, R4, R5
**Plans:** 1/3 plans executed

Plans:
- [ ] 01-01-PLAN.md — XSS hardening (safe JSON-LD serializer) + CSRF enforcement on 3 unprotected routes
- [ ] 01-02-PLAN.md — Edge middleware for CSP nonce injection + env validation centralization
- [ ] 01-03-PLAN.md — Playwright security header E2E test suite

### Scope
- Audit and secure all 10+ dangerouslySetInnerHTML usages across SEO and blog components
- Centralize CSRF middleware to enforce on all POST/PUT/DELETE API routes
- Verify and strengthen CSP nonce implementation in edge middleware
- Centralize 74+ process.env accesses into validated env config
- Add tests verifying security headers are correctly applied

---

## Phase 2: Critical Test Coverage
**Goal:** Establish Vitest unit test infrastructure and comprehensive coverage for the 3 largest untested core services, sanitization pipeline, and CSRF flow.
**Depends on:** Nothing (independent, can run parallel with Phase 1)
**Requirements:** R6, R7, R8, R9, R10
**Plans:** 3/3 plans complete

Plans:
- [ ] 02-01-PLAN.md — Vitest infrastructure setup + EnhancedRateLimiter unit tests (R6)
- [ ] 02-02-PLAN.md — AnalyticsDataService (R7) + API core utilities (R8) unit tests
- [ ] 02-03-PLAN.md — HTML sanitization/XSS prevention (R9) + CSRF token flow (R10) unit tests

### Scope
- Set up unit test framework (Vitest or Bun test runner)
- Unit tests for EnhancedRateLimiter: eviction, analytics, penalties, state transitions
- Unit tests for DataGenerator: metric calculations, edge cases, boundary conditions
- Unit tests for API core: response helpers, error formatting, header application
- Integration tests for markdown-to-HTML rendering with XSS prevention
- Tests for CSRF token generation, rotation, and validation

---

## Phase 3: Tech Debt Reduction
**Goal:** Decompose oversized files, eliminate code duplication, and replace fragile patterns.
**Depends on:** Phase 2 (tests needed before safe refactoring)
**Requirements:** R11, R12, R13, R14, R15
**Plans:** 4/4 plans complete

Plans:
- [ ] 03-01-PLAN.md — Decompose rate-limiter.ts (712 LOC) into subdirectory modules (R11)
- [ ] 03-02-PLAN.md — Decompose data-service.ts (654 LOC) into subdirectory modules (R11)
- [ ] 03-03-PLAN.md — Decompose api-core.ts (618 LOC) + deduplicate header logic (R11, R12)
- [ ] 03-04-PLAN.md — Logger migration in search.ts (R13) + remove react-hook-form (R14) + close R15

### Scope
- Decompose rate-limiter.ts (712 LOC) into focused modules
- Decompose data-service.ts (654 LOC) and api-core.ts (618 LOC)
- Consolidate cache-control/rate-limit header logic into single source of truth
- Replace all console.log/error calls with structured logger
- Remove duplicate form library (keep one of React Hook Form or TanStack React Form)
- Replace regex-based markdown parsing with established library (remark/marked)

---

## Phase 4: Performance Optimization
**Goal:** Reduce client bundle size and improve load times through lazy loading and code splitting.
**Depends on:** Phase 3 (cleaner modules make splitting easier)
**Requirements:** R16, R17, R18, R19
**Plans:** 2/3 plans executed

Plans:
- [ ] 04-01-PLAN.md — Fix Recharts lazy loading: remove sub-exports, consolidate chart-components.tsx, update 30 chart files (R16, R18)
- [ ] 04-02-PLAN.md — Swiper lazy loading via next/dynamic + delete dead code files (R16)
- [ ] 04-03-PLAN.md — Bundle analyzer setup + rate limiter metrics endpoint (R17, R19)

### Scope
- Lazy load Recharts components with next/dynamic (ssr: false)
- Lazy load Swiper carousel components
- Run bundle analysis and set size budgets
- Code-split project pages for independent route loading
- Add /api/security/metrics endpoint for rate limiter visibility

---

## Phase 5: Operational Readiness
**Goal:** Document operational procedures and establish monitoring baselines.
**Depends on:** Phase 1 (security must be solid first)
**Requirements:** R20, R21, R22
**Plans:** None yet

### Scope
- Document Neon PostgreSQL backup and restore procedures
- Create incident response runbook (CSRF attacks, rate limit issues, DB outages)
- Define SLOs (99.9% availability target) and error budget tracking
- Verify Sentry alerting covers all critical paths
