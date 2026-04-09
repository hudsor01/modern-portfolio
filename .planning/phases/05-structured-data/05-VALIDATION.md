---
phase: 5
slug: structured-data
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-08
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | SD-01 | — | N/A | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| 05-01-02 | 01 | 1 | SD-02 | — | N/A | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| 05-01-03 | 01 | 1 | SD-03 | — | N/A | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| 05-01-04 | 01 | 1 | SD-04 | — | N/A | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| 05-01-05 | 01 | 1 | SD-05 | — | N/A | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| 05-01-06 | 01 | 1 | SD-06 | — | N/A | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| 05-01-07 | 01 | 1 | SD-07 | — | N/A | unit | `npx vitest run` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] JSON-LD output snapshot tests for each schema type
- [ ] Existing test infrastructure covers framework needs

*Existing vitest infrastructure is in place. Wave 0 adds schema-specific test files.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Google Rich Results Test passes for homepage | SD-01, SD-02 | Requires external Google tool | Copy homepage URL into search.google.com/test/rich-results |
| Google Search Console zero errors | All | Requires authenticated Google account | Check Search Console > Enhancements after deploy |
| Blog search ?q= parameter works | SD-02 | Requires running application | Navigate to /blog?q=test and verify filtered results |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
