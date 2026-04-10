---
phase: 05-structured-data
plan: 01
subsystem: seo
tags: [json-ld, schema.org, structured-data, person-schema, seo]

# Dependency graph
requires: []
provides:
  - "Clean json-ld/ directory as single source of truth for all JSON-LD schemas"
  - "Person schema with real phone number (+1-214-566-0279) on every page"
  - "structured-data.tsx reduced to generic StructuredData wrapper only"
  - "6 duplicate/spam-risk schema files deleted"
affects: [05-02, 05-03]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "All JSON-LD schemas live exclusively in src/components/seo/json-ld/"
    - "structured-data.tsx is infrastructure only (StructuredData wrapper + safeJsonLdStringify re-export)"
    - "Direct json-ld/ imports per page (no SEOProvider/GlobalSEO wrapper layer)"

key-files:
  created:
    - "src/lib/__tests__/json-ld-schemas.test.ts"
  modified:
    - "src/components/seo/json-ld/person-json-ld.tsx"
    - "src/components/seo/structured-data.tsx"
    - "src/app/layout.tsx"
    - "src/app/about/page.tsx"
    - "src/components/layout/home-page-content.tsx"

key-decisions:
  - "Removed SEOProvider and GlobalSEO entirely per D-04 -- both are use-client wrappers that delay JSON-LD rendering; after D-02 deletions their schema rendering was empty; no app route imports them"
  - "Removed unused skills import from about/page.tsx -- only consumer was the deleted PersonSchema JSX"

patterns-established:
  - "json-ld/ directory is the sole location for schema components; no schema logic in structured-data.tsx"
  - "Global schemas (Person, WebSite) rendered in layout.tsx head; page-specific schemas rendered in page components"

requirements-completed: [SD-01, SD-04]

# Metrics
duration: 3min
completed: 2026-04-08
---

# Phase 5 Plan 01: Schema Consolidation Summary

**Consolidated all JSON-LD into json-ld/ directory, deleted 6 duplicate/spam-risk files, and updated Person schema with real phone number +1-214-566-0279**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-08T23:34:11Z
- **Completed:** 2026-04-08T23:38:02Z
- **Tasks:** 2
- **Files modified:** 11 (1 created, 4 modified, 6 deleted)

## Accomplishments
- Person schema updated with real phone number (+1-214-566-0279), replacing placeholder +1-555-REVOPS
- 6 unit tests created for Person schema: phone number, type/context, awards, credentials, placeholder absence, XSS escaping
- 6 duplicate/spam-risk schema files deleted: person-schema.tsx, home-page-schema.tsx, global-seo.tsx, seo-provider.tsx, organization-json-ld.tsx, local-business-json-ld.tsx
- structured-data.tsx stripped to StructuredData wrapper + safeJsonLdStringify re-export only
- All consumer imports cleaned: layout.tsx, about/page.tsx, home-page-content.tsx
- Google spam risk eliminated (LocalBusiness with fabricated 5.0-star ratings removed)

## Task Commits

Each task was committed atomically:

1. **Task 1: Update Person schema phone number and create unit tests** - `9763bcb` (feat)
2. **Task 2: Delete duplicate schemas and remove imports from all consumers** - `1042549` (fix)

## Files Created/Modified
- `src/components/seo/json-ld/person-json-ld.tsx` - Updated telephone from placeholder to +1-214-566-0279
- `src/lib/__tests__/json-ld-schemas.test.ts` - 6 unit tests for Person schema structure and XSS safety
- `src/app/layout.tsx` - Removed LocalBusinessJsonLd and OrganizationJsonLd imports and JSX
- `src/app/about/page.tsx` - Removed PersonSchema import, JSX block, and unused skills import
- `src/components/layout/home-page-content.tsx` - Removed HomePageSchema import and JSX
- `src/components/seo/structured-data.tsx` - Stripped to StructuredData wrapper + re-export only
- `src/components/seo/person-schema.tsx` - DELETED
- `src/components/seo/home-page-schema.tsx` - DELETED
- `src/components/seo/global-seo.tsx` - DELETED
- `src/components/seo/seo-provider.tsx` - DELETED
- `src/components/seo/json-ld/organization-json-ld.tsx` - DELETED
- `src/components/seo/json-ld/local-business-json-ld.tsx` - DELETED

## Decisions Made
- **D-04 resolution:** Removed both SEOProvider and GlobalSEO entirely. Rationale: SEOProvider is a 'use client' component that delays JSON-LD rendering (Pitfall 6); after D-02 deletions its schema rendering was empty; grep confirmed no app route imports either component. Direct json-ld/ imports per page is cleaner.
- **Removed unused `skills` import from about/page.tsx:** The `skills` data import was only used by the deleted PersonSchema JSX, not by any remaining component on the about page.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed unused `skills` import from about/page.tsx**
- **Found during:** Task 2 (cleaning about/page.tsx)
- **Issue:** After removing PersonSchema JSX, the `import { skills } from '@/data/skills'` had no remaining consumers
- **Fix:** Removed the unused import line to prevent TypeScript unused-variable warnings
- **Files modified:** src/app/about/page.tsx
- **Verification:** `npx tsc --noEmit` passes with zero errors
- **Committed in:** 1042549 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor cleanup necessary for correctness. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- json-ld/ directory is the clean single source of truth, ready for Plan 02 (add SearchAction to WebSite, BreadcrumbList, NavigationJsonLd) and Plan 03 (FAQ schemas, blog search)
- Remaining json-ld/ components: person-json-ld.tsx, project-json-ld.tsx, website-json-ld.tsx
- blog-json-ld.tsx remains in seo/ (not in json-ld/) -- already complete for SD-04
- No blockers for next plans

## Self-Check: PASSED

- All 7 expected files: FOUND
- All 6 deleted files: CONFIRMED DELETED
- Commit 9763bcb: FOUND
- Commit 1042549: FOUND

---
*Phase: 05-structured-data*
*Completed: 2026-04-08*
