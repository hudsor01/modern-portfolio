# Roadmap: Modern Portfolio Security Remediation

## Overview

Security and quality remediation journey for the modern-portfolio codebase. Starting with critical security updates (dependencies + CSP hardening), moving through code quality improvements (type safety + memoization optimization), and finishing with documentation and comprehensive validation. Each phase maintains test stability and zero downtime.

## Domain Expertise

None

## Phases

- [x] **Phase 1: Update Dependencies** - Update 6 outdated packages to latest versions
- [x] **Phase 2: Implement Nonce-Based CSP** - Remove unsafe-inline, add middleware with nonce generation
- [ ] **Phase 3: Improve Type Safety** - Reduce non-test any types from ~30 to <10
- [ ] **Phase 4: Optimize Memoization** - Remove 50-70 unnecessary useMemo/useCallback instances
- [ ] **Phase 5: Create Security Documentation** - Document rate limiting, security logging, error recovery
- [ ] **Phase 6: Final Validation** - Full test suite, type check, build verification, security audit

## Phase Details

### Phase 1: Update Dependencies ✅
**Goal**: Update 6 outdated packages (motion, resend, react-error-boundary, react-resizable-panels, happy-dom) to latest patch/minor versions
**Depends on**: Nothing (first phase)
**Research**: Unlikely (standard package updates, established patterns)
**Plans**: 1 plan executed

Plans:
- ✅ Plan 01-01: Update 6 outdated packages (motion 12.24.7→12.24.12, react-error-boundary 6.0.2→6.0.3, react-resizable-panels 4.3.0→4.3.2, resend 6.6.0→6.7.0, happy-dom 20.0.11→20.1.0, @happy-dom/global-registrator 20.0.11→20.1.0) - All 891 tests passing, type check passed, build successful

### Phase 2: Implement Nonce-Based CSP ✅
**Goal**: Remove `unsafe-inline` from script-src, implement middleware with nonce generation for XSS protection
**Depends on**: Phase 1
**Research**: Completed (Next.js 16 middleware patterns, nonce implementation with App Router)
**Research topics**: Next.js 16 middleware API for CSP headers, nonce generation patterns, React Server Components compatibility with nonce injection
**Plans**: 2 completed (originally estimated 3, merged 02-03 into 02-02)

Plans:
- ✅ Plan 02-01: CSP Middleware & Nonce Infrastructure - Created middleware.ts with crypto.randomUUID() nonce generation, verified CSP has no unsafe-inline, 891 tests passing
- ✅ Plan 02-02: Component Nonce Integration & CSP Validation - Converted 4 JSON-LD components to Server Components with nonce support, verified zero CSP violations in dev environment, all 891 tests passing

### Phase 3: Improve Type Safety
**Goal**: Reduce non-test `any` types from ~30 to <10, add stricter ESLint rules
**Depends on**: Phase 2
**Research**: Unlikely (TypeScript patterns, internal code refactoring)
**Plans**: TBD

Plans:
- TBD (determined during planning)

### Phase 4: Optimize Memoization
**Goal**: Remove 50-70 unnecessary useMemo/useCallback instances (React Compiler handles these automatically)
**Depends on**: Phase 3
**Research**: Unlikely (code cleanup, internal refactoring)
**Plans**: TBD

Plans:
- TBD (determined during planning)

### Phase 5: Create Security Documentation
**Goal**: Document rate limiting configurations, security logging strategy, error recovery procedures
**Depends on**: Phase 4
**Research**: Unlikely (writing documentation, no technical unknowns)
**Plans**: TBD

Plans:
- TBD (determined during planning)

### Phase 6: Final Validation
**Goal**: Full test suite (913 tests), type check, build verification, comprehensive security audit
**Depends on**: Phase 5
**Research**: Unlikely (running existing tests, verification procedures)
**Plans**: TBD

Plans:
- TBD (determined during planning)

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Update Dependencies | 1/1 | ✅ Complete | 2026-01-09 |
| 2. Implement Nonce-Based CSP | 2/2 | ✅ Complete | 2026-01-09 |
| 3. Improve Type Safety | 0/TBD | Not started | - |
| 4. Optimize Memoization | 0/TBD | Not started | - |
| 5. Create Security Documentation | 0/TBD | Not started | - |
| 6. Final Validation | 0/TBD | Not started | - |
