---
phase: 05-structured-data
plan: 02
subsystem: seo
tags: [json-ld, schema.org, breadcrumb, faq, creative-work, structured-data]

# Dependency graph
requires:
  - "05-01: Clean json-ld/ directory as single source of truth"
provides:
  - "BreadcrumbListJsonLd reusable component for any nested page"
  - "FAQPageJsonLd reusable component for any page with FAQ content"
  - "All 14 dedicated project pages + dynamic [slug] route emit CreativeWork JSON-LD"
  - "All project pages + about page emit BreadcrumbList JSON-LD"
  - "About page emits FAQPage JSON-LD with 4 professional Q&A pairs"
affects: [05-03]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Client pages use inline safeJsonLdStringify for JSON-LD (no server component imports in use-client files)"
    - "Server pages use json-ld/ component imports directly (ProjectJsonLd, BreadcrumbListJsonLd)"
    - "All breadcrumb URLs hardcoded to https://richardwhudsonjr.com (never siteConfig.url)"

key-files:
  created:
    - "src/components/seo/json-ld/breadcrumb-json-ld.tsx"
    - "src/components/seo/json-ld/faq-json-ld.tsx"
  modified:
    - "src/app/projects/cac-unit-economics/page.tsx"
    - "src/app/projects/commission-optimization/page.tsx"
    - "src/app/projects/customer-lifetime-value/page.tsx"
    - "src/app/projects/multi-channel-attribution/page.tsx"
    - "src/app/projects/partner-performance/page.tsx"
    - "src/app/projects/revenue-operations-center/page.tsx"
    - "src/app/projects/[slug]/page.tsx"
    - "src/app/about/page.tsx"
    - "src/lib/__tests__/json-ld-schemas.test.ts"

key-decisions:
  - "Used inline safeJsonLdStringify in 6 client pages rather than server component imports -- Next.js App Router cannot render server components inside use-client page files"
  - "Used server component imports (ProjectJsonLd, BreadcrumbListJsonLd) for dynamic [slug] route which is already a server component"
  - "FAQ content drafted with 4 Q&A pairs covering RevOps role, certifications, achievements, and location per D-06/D-07"

patterns-established:
  - "Client pages: wrap existing JSX in fragment, prepend inline JSON-LD script tags"
  - "Server pages: import and render json-ld/ components before client boundary"
  - "Breadcrumb hierarchy: Home > Projects > Project Name (3 items) or Home > Page (2 items)"

requirements-completed: [SD-03, SD-05, SD-06]

# Metrics
duration: 5min
completed: 2026-04-08
---

# Phase 5 Plan 02: Page-Level Schema Wiring Summary

**BreadcrumbList + CreativeWork on all project pages, FAQPage on about page, with 6 new unit tests validating schema structure**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-08T23:44:37Z
- **Completed:** 2026-04-08T23:49:48Z
- **Tasks:** 2
- **Files modified:** 11 (2 created, 9 modified)

## Accomplishments
- Created BreadcrumbListJsonLd and FAQPageJsonLd reusable components following project json-ld/ patterns
- All 14 dedicated project pages + dynamic [slug] route now emit CreativeWork JSON-LD
- All project pages + about page emit BreadcrumbList JSON-LD with correct hierarchy
- About page has FAQPage JSON-LD with 4 professional Q&A pairs
- 6 unit tests added for BreadcrumbList and FAQ schema structure validation
- All production URLs use https://richardwhudsonjr.com (no localhost)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create BreadcrumbListJsonLd and FAQPageJsonLd components with tests** - `85b4f24` (feat)
2. **Task 2: Wire ProjectJsonLd + BreadcrumbListJsonLd to 6 missing project pages, dynamic [slug] route, and add FAQ to about page** - `ddc8666` (feat)

## Files Created/Modified
- `src/components/seo/json-ld/breadcrumb-json-ld.tsx` - Standalone BreadcrumbList schema component with items prop
- `src/components/seo/json-ld/faq-json-ld.tsx` - Standalone FAQPage schema component with faqs prop
- `src/app/projects/cac-unit-economics/page.tsx` - Added inline CreativeWork + BreadcrumbList JSON-LD
- `src/app/projects/commission-optimization/page.tsx` - Added inline CreativeWork + BreadcrumbList JSON-LD
- `src/app/projects/customer-lifetime-value/page.tsx` - Added inline CreativeWork + BreadcrumbList JSON-LD
- `src/app/projects/multi-channel-attribution/page.tsx` - Added inline CreativeWork + BreadcrumbList JSON-LD
- `src/app/projects/partner-performance/page.tsx` - Added inline CreativeWork + BreadcrumbList JSON-LD
- `src/app/projects/revenue-operations-center/page.tsx` - Added inline CreativeWork + BreadcrumbList JSON-LD
- `src/app/projects/[slug]/page.tsx` - Added ProjectJsonLd + BreadcrumbListJsonLd server components
- `src/app/about/page.tsx` - Added FAQPageJsonLd + BreadcrumbListJsonLd
- `src/lib/__tests__/json-ld-schemas.test.ts` - 6 new tests for BreadcrumbList and FAQ schema validation

## Decisions Made
- **Client vs server JSON-LD rendering:** 6 dedicated project pages are `'use client'` components, so JSON-LD is rendered inline using `safeJsonLdStringify` rather than importing server components. The dynamic `[slug]` route is a server component, so it uses `ProjectJsonLd` and `BreadcrumbListJsonLd` component imports directly.
- **FAQ content per D-06/D-07:** Drafted 4 Q&A pairs for about page covering: RevOps role definition, Richard's certifications, achievements ($4.8M revenue, 432% growth, 2217% expansion), and location (Plano, TX).
- **Breadcrumb depth:** Project pages use 3-level breadcrumbs (Home > Projects > Project Name). About page uses 2-level (Home > About), matching Google's minimum requirement.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed TypeScript strict array access errors in tests**
- **Found during:** Task 2 (TypeScript compilation check)
- **Issue:** `npx tsc --noEmit` flagged array index access as "Object is possibly 'undefined'" for test assertions like `data.itemListElement[0].position`
- **Fix:** Added non-null assertions (`!`) to array index access in test assertions where indices are known to exist
- **Files modified:** src/lib/__tests__/json-ld-schemas.test.ts
- **Verification:** `npx tsc --noEmit` passes with zero errors
- **Committed in:** ddc8666 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Minor TypeScript strictness fix. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All project pages and about page now have complete structured data
- BreadcrumbListJsonLd and FAQPageJsonLd components ready for reuse in Plan 03 (WebSite SearchAction, NavigationJsonLd)
- json-ld/ directory now contains: person, website, project, breadcrumb, faq components
- No blockers for Plan 03

## Self-Check: PASSED

- src/components/seo/json-ld/breadcrumb-json-ld.tsx: FOUND
- src/components/seo/json-ld/faq-json-ld.tsx: FOUND
- Commit 85b4f24: FOUND
- Commit ddc8666: FOUND
- All 14 project pages + [slug] have CreativeWork: VERIFIED
- All project pages + about have BreadcrumbList: VERIFIED
- About page has FAQPage: VERIFIED
- TypeScript: zero errors
- Tests: 12/12 passing

---
*Phase: 05-structured-data*
*Completed: 2026-04-08*
