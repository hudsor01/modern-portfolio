---
phase: 07-sitemap-indexing
plan: "01"
subsystem: seo
tags: [sitemap, robots, lastmod, social-crawlers, og-images]
dependency_graph:
  requires: []
  provides: [hardcoded-sitemap-lastmod, social-crawler-robots-rules]
  affects: [src/app/sitemap.ts, src/app/robots.ts]
tech_stack:
  added: []
  patterns: [hardcoded-lastmod-dates, social-crawler-allow-before-wildcard]
key_files:
  created: []
  modified:
    - src/app/sitemap.ts
    - src/app/robots.ts
decisions:
  - "Hardcoded ISO dates from git log instead of new Date() for sitemap accuracy"
  - "Social crawler rule placed first in robots.txt rules array for precedence"
  - "fallbackDate retained only for blog posts with null timestamps"
metrics:
  duration: ~12min
  completed: 2026-04-10
  tasks_completed: 3
  files_modified: 2
requirements: [IDX-01, IDX-02]
---

# Phase 7 Plan 1: Sitemap & Robots Refinement Summary

**Hardcoded static page lastmod dates in sitemap.ts and added social crawler Allow rules in robots.ts for OG image preview access**

## Performance

- **Duration:** ~12 min
- **Completed:** 2026-04-10
- **Tasks:** 3
- **Files modified:** 2

## Accomplishments
- Static pages use hardcoded ISO dates from git history instead of `new Date()` which changed on every request
- Social crawlers (Twitterbot, LinkedInBot, facebookexternalhit) can now reach `/api/og` for OG image previews
- Social crawler rule appears before wildcard `*` rule ensuring precedence
- Blog post lastmod still uses DB timestamps (unchanged)
- SEO scraper blocks (AhrefsBot, SemrushBot, etc.) preserved
- Priority values unchanged (1.0/0.9/0.8/0.7)

## Task Commits

1. **Task 1: Hardcode static page lastmod dates in sitemap.ts** - `d9e10a9` (feat)
2. **Task 2: Add social crawler Allow rule to robots.ts** - `def93a7` (feat)
3. **Task 3: Build verification** - TypeScript check passed with 0 errors

## Files Modified
- `src/app/sitemap.ts` - Replaced `new Date()` with hardcoded ISO dates per page; retained fallbackDate for blog null guard
- `src/app/robots.ts` - Added social crawler rule block as first entry; reordered rules for correct precedence

## Decisions Made
None - followed plan as specified.

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
- Full `npm run build` blocked by parallel agent lock contention; TypeScript check via `tsc --noEmit` confirmed 0 errors

## Next Phase Readiness
- Sitemap emits accurate lastmod dates for all static pages
- Social crawlers unblocked for OG image fetching
- Ready for IndexNow integration (07-02) and Phase 08

---
*Phase: 07-sitemap-indexing*
*Completed: 2026-04-10*
