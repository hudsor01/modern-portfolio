# Phase 4: Performance Optimization - Context

**Gathered:** 2026-03-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Reduce client bundle size and improve load times through lazy loading heavy libraries (Recharts, Swiper), bundle analysis tooling, and adding a rate limiter metrics API endpoint. Does NOT include architectural changes, new features, or UI redesign.

</domain>

<decisions>
## Implementation Decisions

### Recharts lazy loading fix
- **Keep chart.tsx (shadcn/ui) as-is** — don't rewrite the shadcn primitive, it imports `* as RechartsPrimitive` and that's acceptable
- **Fix lazy-charts.tsx** — remove the direct sub-component re-exports (`Area`, `Bar`, `XAxis`, `Tooltip`, etc.) that defeat the lazy loading by pulling the entire recharts library eagerly
- **Consolidate chart-components.tsx into lazy-charts.tsx** — move shared helpers (CartesianGrid, XAxis, YAxis, ResponsiveContainer) into lazy-charts.tsx so there's one import source
- **Delete chart-components.tsx** after consolidation
- Components that need sub-components (Area, Bar, XAxis) import them alongside their Lazy* chart in their own file — tree-shaking handles the rest

### Swiper lazy loading
- **Claude's Discretion: approach** — Claude picks simplest lazy loading method (dynamic import at page level vs wrapper component)
- **Bundle swiper-navigation.tsx and use-swiper-autoplay.ts with ProjectSwiper** — they're only used alongside it, so they should be in the same dynamic boundary
- Swiper is only used on project detail pages — lazy load keeps it off the main bundle

### Bundle analysis & budgets
- **@next/bundle-analyzer** — official Next.js plugin, run on-demand via `ANALYZE=true next build`
- No CI integration needed, no size-limit package
- **Claude's Discretion: budget strictness** — Claude picks appropriate approach for a portfolio site (likely informational/soft targets rather than hard CI failures)

### Rate limiter metrics endpoint (R19)
- **Route:** `/api/security/metrics`
- **Data:** Full analytics from `RateLimiter.exportMetrics()` — total/blocked requests, unique clients, system load, top clients (anonymized), hourly/daily trends
- **Auth:** Secret header token — require `X-Metrics-Token` header matching an env var (e.g., `METRICS_API_TOKEN`)
- Add the env var to `env-validation.ts` as optional (endpoint returns 403 if not configured)

### Claude's Discretion
- Swiper lazy loading approach (dynamic wrapper vs page-level)
- Bundle budget strictness level
- Whether to code-split project pages further beyond lazy loading heavy libraries
- Loading skeleton design for Swiper

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Lazy loading targets
- `src/components/charts/lazy-charts.tsx` — Existing lazy chart wrappers + problematic sub-component re-exports
- `src/components/ui/chart.tsx` — shadcn/ui chart primitive (keep as-is, imports `* as RechartsPrimitive`)
- `src/lib/chart-components.tsx` — Shared chart helpers to consolidate into lazy-charts.tsx
- `src/components/projects/project-swiper.tsx` — Direct Swiper imports (~50KB), lazy loading target
- `src/components/projects/swiper-navigation.tsx` — Swiper dependency, bundle with ProjectSwiper
- `src/hooks/use-swiper-autoplay.ts` — Swiper dependency, bundle with ProjectSwiper

### Rate limiter (metrics endpoint source)
- `src/lib/rate-limiter/store.ts` — `RateLimiter.exportMetrics()` method provides the data
- `src/lib/env-validation.ts` — Add `METRICS_API_TOKEN` env var here

### Test safety net
- `vitest.config.mts` — Test configuration
- `src/lib/__tests__/` — 133 tests must keep passing

### Existing dynamic import patterns (reference for consistency)
- `src/app/projects/revenue-operations-center/page.tsx` — Uses `next/dynamic` for tab components
- `src/app/projects/customer-lifetime-value/_components/OverviewTab.tsx` — Uses lazy-charts imports

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lazy-charts.tsx` — Already has `next/dynamic` wrappers for 10 chart types with loading skeletons; needs sub-export cleanup
- `src/components/ui/skeleton.tsx` — Skeleton component used by lazy-charts for loading states
- `next/dynamic` — Already used in 14+ project page files for tab components

### Established Patterns
- `next/dynamic` with `{ ssr: false }` for client-only heavy components
- `ChartSkeleton` component for chart loading states
- Tab-based project pages already dynamically import tab content

### Integration Points
- 29 chart component files import from `lazy-charts.tsx` — sub-export removal will require updating these imports
- `project-swiper.tsx` used on project detail pages via direct import — needs dynamic boundary
- `env-validation.ts` needs new optional `METRICS_API_TOKEN` variable
- New API route at `src/app/api/security/metrics/route.ts`

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches beyond the locked decisions above.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-performance-optimization*
*Context gathered: 2026-03-19*
