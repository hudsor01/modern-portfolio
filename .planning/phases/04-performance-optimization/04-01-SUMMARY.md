---
phase: 04-performance-optimization
plan: 01
subsystem: ui
tags: [recharts, lazy-loading, bundle-optimization, code-splitting, next-dynamic]

requires:
  - phase: 03-api-infrastructure
    provides: api-core decomposed modules used by chart data services

provides:
  - lazy-charts.tsx as single source for Lazy* wrappers AND helper components (ChartWrapper, ChartGrid, etc.)
  - All 30 chart files with direct recharts sub-component imports (true code splitting)
  - chart-components.tsx deleted; its exports consolidated into lazy-charts.tsx

affects: [all project chart pages, bundle analysis, Core Web Vitals]

tech-stack:
  added: []
  patterns:
    - "Lazy chart pattern: import Lazy* wrappers from '@/components/charts/lazy-charts', import sub-components (Bar, Line, Area, etc.) from 'recharts' directly"
    - "Helper components (ChartWrapper, ChartGrid, ChartXAxis, ChartYAxis, StandardTooltip) live in lazy-charts.tsx, NOT a separate chart-components.tsx"

key-files:
  created: []
  modified:
    - src/components/charts/lazy-charts.tsx
    - src/app/projects/customer-lifetime-value/_components/CustomerSegmentChart.tsx
    - src/app/projects/customer-lifetime-value/_components/CLVTrendChart.tsx
    - src/app/projects/customer-lifetime-value/_components/CLVPredictionChart.tsx
    - src/app/projects/commission-optimization/_components/CommissionTierChart.tsx
    - src/app/projects/commission-optimization/_components/CommissionStructureChart.tsx
    - src/app/projects/commission-optimization/_components/ROIOptimizationChart.tsx
    - src/app/projects/commission-optimization/_components/PerformanceIncentiveChart.tsx
    - src/app/projects/deal-funnel/_components/ConversionChart.tsx
    - src/app/projects/revenue-operations-center/_components/OperationalMetricsChart.tsx
    - src/app/projects/revenue-operations-center/_components/RevenueOverviewChart.tsx
    - src/app/projects/revenue-operations-center/_components/PipelineHealthChart.tsx
    - src/app/projects/revenue-operations-center/_components/ForecastAccuracyChart.tsx
    - src/app/projects/partner-performance/_components/RevenueContributionChart.tsx
    - src/app/projects/partner-performance/_components/PartnerROIChart.tsx
    - src/app/projects/partner-performance/_components/PartnerTierChart.tsx
    - src/app/projects/lead-attribution/_components/LeadSourcePieChart.tsx
    - src/app/projects/lead-attribution/_components/TrendsChart.tsx
    - src/app/projects/multi-channel-attribution/_components/CustomerJourneyChart.tsx
    - src/app/projects/multi-channel-attribution/_components/AttributionModelChart.tsx
    - src/app/projects/multi-channel-attribution/_components/ChannelROIChart.tsx
    - src/app/projects/multi-channel-attribution/_components/TouchpointAnalysisChart.tsx
    - src/app/projects/revenue-kpi/_components/RevenueBarChart.tsx
    - src/app/projects/revenue-kpi/_components/TopPartnersChart.tsx
    - src/app/projects/revenue-kpi/_components/PartnerGroupPieChart.tsx
    - src/app/projects/revenue-kpi/_components/RevenueLineChart.tsx
    - src/app/projects/cac-unit-economics/_components/CACBreakdownChart.tsx
    - src/app/projects/cac-unit-economics/_components/UnitEconomicsChart.tsx
    - src/app/projects/cac-unit-economics/_components/PaybackPeriodChart.tsx
    - src/app/projects/churn-retention/_components/RetentionHeatmap.tsx
    - src/app/projects/churn-retention/_components/ChurnLineChart.tsx

key-decisions:
  - "Recharts sub-components (Bar, Line, Area, XAxis, etc.) import directly from 'recharts' in consumer files — not re-exported from lazy-charts.tsx"
  - "chart-components.tsx deleted; ChartWrapper/ChartGrid/ChartXAxis/ChartYAxis/StandardTooltip/ChartContainer/ChartTooltip consolidated into lazy-charts.tsx"
  - "lazy-charts.tsx retains one direct recharts import (Tooltip, CartesianGrid, XAxis, YAxis, ResponsiveContainer) for internal helper component use — this is NOT a re-export"

patterns-established:
  - "Lazy chart consumers: split imports into two lines — Lazy* from '@/components/charts/lazy-charts', sub-components from 'recharts'"
  - "Helper components (ChartWrapper etc.) also imported from '@/components/charts/lazy-charts', never from '@/lib/chart-components'"

requirements-completed: [R16, R18]

duration: 34min
completed: 2026-03-19
---

# Phase 04 Plan 01: Recharts Lazy Loading Fix Summary

**Removed static re-exports from lazy-charts.tsx that defeated code splitting, consolidated chart-components.tsx helpers, and updated all 30 chart consumer files to import recharts sub-components directly**

## Performance

- **Duration:** 34 min
- **Started:** 2026-03-19T15:04:46Z
- **Completed:** 2026-03-19T15:38:xx Z
- **Tasks:** 2
- **Files modified:** 32 (lazy-charts.tsx + 30 chart files + chart-components.tsx deleted)

## Accomplishments
- Removed `export { Area, Bar, Line, XAxis, ... } from 'recharts'` re-export block that pulled the full ~168KB recharts library eagerly into every bundle importing lazy-charts.tsx
- Consolidated all helper components from chart-components.tsx (ChartWrapper, ChartGrid, ChartXAxis, ChartYAxis, StandardTooltip, ChartContainer, ChartTooltip) into lazy-charts.tsx; deleted chart-components.tsx
- Updated all 30 chart consumer files: Lazy* wrappers from '@/components/charts/lazy-charts', sub-components from 'recharts' directly
- Build passes, TypeScript zero errors, 140/140 tests pass

## Task Commits

Each task was committed atomically:

1. **Task 1: Consolidate chart-components into lazy-charts and remove sub-exports** - `eb4926c` (feat, part of prior session) + final re-export removal in `14ada78`
2. **Task 2: Update all 30 chart files to import sub-components from recharts directly** - `14ada78` (feat)

## Files Created/Modified
- `src/components/charts/lazy-charts.tsx` - Removed re-export blocks (lines 154-192); added internal recharts import for helpers; consolidated ChartWrapper/ChartGrid/ChartXAxis/ChartYAxis/StandardTooltip/ChartContainer/ChartTooltip from chart-components.tsx
- `src/lib/chart-components.tsx` - DELETED; all exports moved to lazy-charts.tsx
- 30 chart files across 9 project directories - Split imports into Lazy* (lazy-charts) + sub-components (recharts)

## Decisions Made
- Recharts sub-components must be imported directly from 'recharts' in consumers — not re-exported through lazy-charts — so the dynamic() wrappers can actually defer the recharts bundle
- lazy-charts.tsx may have ONE direct recharts import (for internal helper implementations) but zero re-exports
- chart-components.tsx is the right candidate for deletion because it was already statically loading recharts; consolidating into lazy-charts.tsx keeps the helper colocation without adding new re-exports

## Deviations from Plan

**1. [Rule 1 - Bug] lazy-charts.tsx on disk had incomplete prior fix**
- **Found during:** Task 1 verification
- **Issue:** Commit eb4926c (04-03) had added recharts imports at top of lazy-charts.tsx but left the re-export block (lines 154-192) intact; the file was 392 lines with both old re-exports AND new helper components
- **Fix:** Rewrote lazy-charts.tsx removing the re-export block entirely, leaving only the internal import
- **Files modified:** src/components/charts/lazy-charts.tsx
- **Committed in:** 14ada78 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - incomplete prior fix)
**Impact on plan:** Required fixing incomplete prior work. No scope creep.

## Issues Encountered
- Prior commits (eb4926c, a96f0d7) had already done partial work on this plan — chart-components.tsx was deleted from git tracking but the file still existed untracked on disk; lazy-charts.tsx had imports added but re-exports not removed. Required understanding the state before proceeding.

## Next Phase Readiness
- Recharts lazy loading is now actually effective — dynamic() wrappers can defer the recharts bundle to chart-specific chunks
- All chart consumer files follow the new import pattern
- Ready for bundle analysis to measure the improvement (04-03 already added bundle-analyzer)

---
*Phase: 04-performance-optimization*
*Completed: 2026-03-19*

## Self-Check: PASSED

- lazy-charts.tsx: 1 `from 'recharts'` import, 0 re-exports - VERIFIED
- chart-components.tsx: deleted from disk and git - VERIFIED
- All 30 chart files: no '@/lib/chart-components' imports - VERIFIED
- TypeScript: 0 errors - VERIFIED
- Build: passes - VERIFIED
- Tests: 140/140 passing - VERIFIED
- Commit 14ada78: exists - VERIFIED
