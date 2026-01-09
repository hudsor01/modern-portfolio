# Roadmap: Modern Portfolio Security Remediation

## Overview

Security and quality remediation journey for the modern-portfolio codebase. Starting with critical security updates (dependencies + CSP hardening), moving through code quality improvements (type safety + memoization optimization), and finishing with documentation and comprehensive validation. Each phase maintains test stability and zero downtime.

## Domain Expertise

None

## Phases

- [ ] **Phase 1: Update Dependencies** - Update 6 outdated packages to latest versions
- [ ] **Phase 2: Implement Nonce-Based CSP** - Remove unsafe-inline, add middleware with nonce generation
- [ ] **Phase 3: Improve Type Safety** - Reduce non-test any types from ~30 to <10
- [ ] **Phase 4: Optimize Memoization** - Remove 50-70 unnecessary useMemo/useCallback instances
- [ ] **Phase 5: Create Security Documentation** - Document rate limiting, security logging, error recovery
- [ ] **Phase 6: Final Validation** - Full test suite, type check, build verification, security audit

## Phase Details

### Phase 1: Update Dependencies
**Goal**: Update 6 outdated packages (motion, resend, react-error-boundary, react-resizable-panels, happy-dom) to latest patch/minor versions
**Depends on**: Nothing (first phase)
**Research**: Unlikely (standard package updates, established patterns)
**Plans**: TBD

Plans:
- TBD (determined during planning)

### Phase 2: Implement Nonce-Based CSP
**Goal**: Remove `unsafe-inline` from script-src, implement middleware with nonce generation for XSS protection
**Depends on**: Phase 1
**Research**: Likely (Next.js 16 middleware patterns, nonce implementation with App Router)
**Research topics**: Next.js 16 middleware API for CSP headers, nonce generation patterns, React Server Components compatibility with nonce injection
**Plans**: TBD

Plans:
- TBD (determined during planning)

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
| 1. Update Dependencies | 0/TBD | Not started | - |
| 2. Implement Nonce-Based CSP | 0/TBD | Not started | - |
| 3. Improve Type Safety | 0/TBD | Not started | - |
| 4. Optimize Memoization | 0/TBD | Not started | - |
| 5. Create Security Documentation | 0/TBD | Not started | - |
| 6. Final Validation | 0/TBD | Not started | - |
