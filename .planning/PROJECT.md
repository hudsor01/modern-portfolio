# Modern Portfolio - Security Remediation

## What This Is

A comprehensive security and quality remediation project for the modern-portfolio codebase. This project addresses critical technical debt including outdated dependencies, CSP vulnerabilities, type safety gaps, and performance optimizations. The goal is production-ready security hardening without changing user-facing functionality.

## Core Value

**Security hardening through dependency updates and nonce-based CSP implementation.** If everything else is deferred, the portfolio must have current dependencies and XSS-resistant Content Security Policy in production.

## Requirements

### Validated

<!-- Existing capabilities confirmed through codebase mapping -->

- ✓ Next.js 16 + React 19 + TypeScript portfolio with App Router — existing
- ✓ Blog system with categories, tags, RSS, and SEO optimization — existing
- ✓ Project showcase with metrics, charts, and case studies — existing
- ✓ Contact form with rate limiting (3/hr) and CSRF protection — existing
- ✓ 913 passing tests with 80% coverage target — existing
- ✓ Production security (CSRF tokens, input sanitization, security headers) — existing
- ✓ PostgreSQL + Prisma 7 with 18+ database models — existing
- ✓ Resend email integration with auto-reply — existing
- ✓ Vercel Analytics and custom SEO tracking — existing

### Active

<!-- Current remediation scope - prioritized by security impact -->

- [ ] **Phase 1: Update Dependencies** — Update 6 outdated packages (motion, resend, react-error-boundary, etc.)
- [ ] **Phase 2: Implement Nonce-Based CSP** — Remove `unsafe-inline` from script-src, add middleware with nonce generation
- [ ] **Phase 3: Improve Type Safety** — Reduce non-test `any` types from ~30 to <10, add stricter ESLint rules
- [ ] **Phase 4: Optimize Memoization** — Remove 50-70 unnecessary useMemo/useCallback instances (React Compiler handles these)
- [ ] **Phase 5: Create Security Documentation** — Document rate limiting configs, security logging strategy, error recovery
- [ ] **Phase 6: Final Validation** — Full test suite, type check, build verification, security audit

### Out of Scope

- No new features — Pure remediation, zero feature additions
- No UI/UX changes — All user-facing behavior stays identical
- No major architectural rewrites — Incremental improvements only
- No database schema changes — Focus on application layer security
- No deployment infrastructure changes — Use existing Vercel setup

## Context

### Current State
- **Codebase**: 445 TypeScript files across Next.js 16 App Router structure
- **Test Coverage**: 913 tests passing, 62 intentionally skipped, 80% coverage
- **Security Posture**: A rating with minor improvements needed
- **Risk Level**: LOW - production-ready with identified optimizations

### Critical Review Findings
- 6 packages with available patch/minor updates (low risk)
- CSP uses `unsafe-inline` for scripts (Next.js limitation, can be improved)
- ~230 `any` types total (~30 in non-test code needing fixes)
- 127 memoization instances (50-70 unnecessary with React Compiler)
- Missing documentation for rate limiting, security logging, error recovery

### Why This Matters
The portfolio is already production-ready, but these improvements:
1. **Reduce attack surface** - Nonce-based CSP prevents XSS injection
2. **Ensure currency** - Updated dependencies get security patches
3. **Improve maintainability** - Type safety catches bugs at compile-time
4. **Optimize performance** - Remove redundant React optimizations
5. **Enable operations** - Documentation helps with incident response

## Constraints

- **Test Stability**: All 913 tests must pass after each phase
- **Zero Downtime**: Changes must be deployable without service interruption
- **No Breaking Changes**: Public APIs and user flows stay identical
- **Bun Runtime**: All commands use Bun (not npm/yarn)
- **TypeScript Strict Mode**: Maintain all strict type checking options

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Prioritize Phases 1-2 over 3-6 | Security (deps + CSP) more critical than optimization | — Pending |
| Use nonce-based CSP vs hash-based | Nonce simpler for dynamic content, Next.js 16 supports it | — Pending |
| Keep Bun runtime vs migrate to Node | Bun 30% faster, native TS, project already uses it | ✓ Good |
| Gradual type safety vs big bang | Incremental fixes prevent massive refactoring session | — Pending |

---
*Last updated: 2026-01-09 after project initialization*
