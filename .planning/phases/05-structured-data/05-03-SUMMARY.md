---
phase: 05-structured-data
plan: 03
subsystem: seo
tags: [json-ld, schema.org, search-action, navigation, blog-search, structured-data]

# Dependency graph
requires:
  - "05-01: Clean json-ld/ directory as single source of truth"
provides:
  - "WebSite schema with SearchAction potentialAction targeting /blog?q="
  - "NavigationJsonLd component emitting SiteNavigationElement with 5 nav items"
  - "Blog ?q= search filter combining with existing category filter"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "SearchAction urlTemplate uses hardcoded production URL (not siteConfig.url per Pitfall 4)"
    - "NavigationJsonLd derives nav items from navConfig (single source of truth in site.ts)"
    - "Blog search uses nuqs useQueryState for URL-synced client-side filtering"

key-files:
  created:
    - "src/components/seo/json-ld/navigation-json-ld.tsx"
  modified:
    - "src/components/seo/json-ld/website-json-ld.tsx"
    - "src/app/layout.tsx"
    - "src/app/blog/_components/blog-list.tsx"
    - "src/lib/__tests__/json-ld-schemas.test.ts"

key-decisions:
  - "SearchAction targets /blog?q= with client-side filtering -- no server-side search needed since posts are already loaded"
  - "NavigationJsonLd uses hardcoded https://richardwhudsonjr.com prefix per Pitfall 4 (siteConfig.url can resolve to localhost)"
  - "Blog search is minimal per D-12 -- no debouncing needed for client-side .includes() filtering against loaded posts"

patterns-established:
  - "Blog search and category filter compose independently via separate nuqs query params"

requirements-completed: [SD-02, SD-07]

# Metrics
duration: 2min
completed: 2026-04-08
---

# Phase 5 Plan 03: SearchAction + Navigation + Blog Search Summary

**WebSite schema with SearchAction targeting /blog?q=, NavigationJsonLd with SiteNavigationElement for 5 nav items, and functional blog search filter**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-08T23:55:18Z
- **Completed:** 2026-04-08T23:57:46Z
- **Tasks:** 2
- **Files modified:** 5 (1 created, 4 modified)

## Accomplishments
- WebSite schema updated with potentialAction SearchAction pointing to /blog?q={search_term_string}
- New NavigationJsonLd component emitting SiteNavigationElement with all 5 nav items from navConfig
- NavigationJsonLd wired into root layout.tsx alongside PersonJsonLd and WebsiteJsonLd
- Blog list page supports ?q= parameter for client-side search by title and excerpt
- Search input renders above category filter with type="search" for native clear button
- Category and search filters combine independently (both applied simultaneously)
- 6 new unit tests for WebSite SearchAction and NavigationJsonLd schema structure
- All 18 tests passing, zero TypeScript errors

## Task Commits

Each task was committed atomically:

1. **Task 1 (RED): Add tests for WebSite SearchAction and NavigationJsonLd** - `4c1a1ec` (test)
2. **Task 1 (GREEN): Add SearchAction to WebSite schema and create NavigationJsonLd** - `c49b0b6` (feat)
3. **Task 2: Add ?q= search filter to blog list page** - `00619e2` (feat)

## Files Created/Modified
- `src/components/seo/json-ld/website-json-ld.tsx` - Added potentialAction with SearchAction and EntryPoint urlTemplate
- `src/components/seo/json-ld/navigation-json-ld.tsx` - NEW: SiteNavigationElement schema deriving items from navConfig
- `src/app/layout.tsx` - Added NavigationJsonLd import and render in structured data section
- `src/app/blog/_components/blog-list.tsx` - Added useQueryState('q'), combined category+search filter, search input UI
- `src/lib/__tests__/json-ld-schemas.test.ts` - 6 new tests: 3 for WebSite SearchAction, 3 for NavigationJsonLd

## Decisions Made
- **SearchAction target URL:** Uses hardcoded `https://richardwhudsonjr.com/blog?q={search_term_string}` per Pitfall 4 from RESEARCH.md (siteConfig.url can resolve to localhost in some environments).
- **Blog search depth (D-12):** Minimal approach -- client-side `.includes()` against title and excerpt of already-loaded posts. No debouncing needed since filtering is synchronous against in-memory data.
- **Search + category composition:** Both filters apply independently via separate nuqs query params (?q= and ?category=). URL is fully shareable.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All SD-01 through SD-07 requirements now complete across Plans 01-03
- Phase 5 structured data is fully implemented
- json-ld/ directory contains: person, website, project, breadcrumb, faq, navigation components
- Blog has functional search via ?q= parameter

## Self-Check: PASSED

- src/components/seo/json-ld/navigation-json-ld.tsx: FOUND
- src/components/seo/json-ld/website-json-ld.tsx contains potentialAction: VERIFIED
- src/app/layout.tsx contains NavigationJsonLd: VERIFIED
- src/app/blog/_components/blog-list.tsx contains useQueryState('q'): VERIFIED
- Commit 4c1a1ec: FOUND
- Commit c49b0b6: FOUND
- Commit 00619e2: FOUND
- TypeScript: zero errors
- Tests: 18/18 passing

---
*Phase: 05-structured-data*
*Completed: 2026-04-08*
