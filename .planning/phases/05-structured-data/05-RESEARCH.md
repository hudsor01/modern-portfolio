# Phase 5: Structured Data - Research

**Researched:** 2026-04-08
**Domain:** JSON-LD structured data / schema.org / Google rich results
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Consolidate all structured data into `src/components/seo/json-ld/` as the single authoritative source.
- **D-02:** Remove duplicate/scattered implementations: `structured-data.tsx` exports (WebsiteStructuredData, PersonStructuredData, ArticleStructuredData, ProjectStructuredData), `person-schema.tsx`, `home-page-schema.tsx`. Migrate any unique properties from these into the `json-ld/` versions before deletion.
- **D-03:** Keep `structured-data.tsx` only for the generic `StructuredData` wrapper component and the `safeJsonLdStringify` re-export — these are shared infrastructure, not schema definitions.
- **D-05:** Project schema type — use CreativeWork (aligns with ROADMAP spec and the nature of RevOps case studies). The existing `json-ld/project-json-ld.tsx` already uses CreativeWork.
- **D-06:** FAQ content hardcoded directly in page component files. No database or centralized config needed.
- **D-07:** Claude drafts FAQ Q&A pairs based on existing page content and project context. User can edit after implementation.
- **D-08:** Keep full Person schema details: credentials (SalesLoft, HubSpot certs), location (Plano/DFW), awards ($4.8M revenue, 432% growth, 2217% network expansion), professional memberships.
- **D-09:** Replace placeholder phone `+1-555-REVOPS` with real number: `+1-214-566-0279`.
- **D-10:** Remove both `organization-json-ld.tsx` and `local-business-json-ld.tsx` from `src/components/seo/json-ld/`. Neither is required by SD-01 through SD-07. LocalBusiness contains fabricated aggregate ratings (5.0 stars, 15 reviews) which is a Google spam risk.
- **D-11:** Add blog search support via `?q=` parameter on the existing `/blog` page to satisfy SearchAction target URL. WebSite schema on homepage will include `SearchAction` pointing to `/blog?q={search_term}`.

### Claude's Discretion

- **D-04:** Whether to keep SEOProvider/GlobalSEO as orchestrators (rewired to use consolidated json-ld/ components) or remove them in favor of direct imports per page.
- **D-12:** Whether blog search is a minimal query filter on the existing blog index or a more polished experience.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SD-01 | All pages emit valid JSON-LD Person schema for Richard Hudson | `json-ld/person-json-ld.tsx` is the authoritative source; needs phone update (D-09); already emitted in `layout.tsx` for global coverage |
| SD-02 | WebSite schema with SearchAction on homepage | SearchAction sitelinks searchbox was deprecated by Google Nov 2024 — no longer shows in SERP; WebSite schema itself stays for site name signal; SearchAction markup is harmless but non-functional for rich results; blog `?q=` filter still a useful feature to implement per D-11 |
| SD-03 | BreadcrumbList schema on all nested pages | `blog-json-ld.tsx` already embeds BreadcrumbList inside BlogPosting; project pages need standalone `BreadcrumbList` JSON-LD; about/resume/contact are top-level (no breadcrumb needed) |
| SD-04 | Article schema on blog post pages with author, datePublished, dateModified | `BlogPostJsonLd` in `blog-json-ld.tsx` already uses `BlogPosting` (valid subtype of Article per Google) with all required fields; already wired in `blog/[slug]/page.tsx` |
| SD-05 | CreativeWork/Project schema on project case study pages | `json-ld/project-json-ld.tsx` uses `CreativeWork`; 8 of 14 dedicated pages already use it; 6 are missing it: `cac-unit-economics`, `commission-optimization`, `customer-lifetime-value`, `multi-channel-attribution`, `partner-performance`, `revenue-operations-center`; dynamic `[slug]` page also missing |
| SD-06 | FAQ schema on relevant pages (about, project details) | FAQPage schema defined and reusable in `blog-json-ld.tsx`; CRITICAL: Google restricted FAQ rich results to government/health sites in Aug 2023 — no rich result for this portfolio; schema is still valid markup and provides knowledge-graph signal, but expectation must be managed |
| SD-07 | SiteNavigationElement schema for main navigation | No existing implementation; `navConfig.mainNav` in `src/lib/site.ts` has all 5 nav items (Home, About, Projects, Resume, Contact); new `navigation-json-ld.tsx` component needed in `json-ld/` |
</phase_requirements>

---

## Summary

Phase 5 is largely a consolidation and gap-fill phase. The codebase already has a substantial JSON-LD foundation: `PersonJsonLd` and `WebsiteJsonLd` are wired into the root layout, `BlogPostJsonLd` covers Article + BreadcrumbList for blog posts, and `ProjectJsonLd` (CreativeWork) is deployed on 8 of 14 project pages. The primary work is: (1) consolidating scattered duplicate schemas into `json-ld/`, (2) adding missing schemas to 6 project pages and the dynamic `[slug]` route, (3) creating a new `NavigationJsonLd` component for SD-07, (4) adding FAQ schema to about and project detail pages, (5) deleting spam-risk components (Organization, LocalBusiness), and (6) adding `?q=` search filtering to the blog index.

Two ecosystem changes discovered during research have significant planning impact: Google deprecated the Sitelinks Search Box (visual SERP feature) in November 2024, so `SearchAction` in `WebSiteJsonLd` will not produce a rich result — only the underlying blog filter feature matters. More importantly, Google restricted FAQ rich results to government/health sites in August 2023, so `FAQPage` schema will not generate visible rich results for this portfolio — it provides only knowledge-graph signals.

**Primary recommendation:** Do the consolidation work in a clear sequence — delete spam-risk files first, migrate unique properties from duplicates into `json-ld/` authoritative versions, then add the missing schemas to pages that lack them. Keep all implementation within the existing component pattern: standalone React server components returning `<script type="application/ld+json">` with `safeJsonLdStringify` and nonce prop.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| schema.org vocabulary | N/A | Structured data types | Google's required vocabulary for all JSON-LD |
| `safeJsonLdStringify` | (internal) | XSS-safe JSON serialization | Project utility in `src/lib/json-ld-utils.ts` — already used by all components |
| nuqs | 2.8.6 | URL state management for blog `?q=` param | Already installed; `useQueryState` already in use for `?category=` param |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Next.js `headers()` | 16.x | Read CSP nonce for inline scripts | Already used in `layout.tsx` for nonce on JSON-LD scripts |

### No Additional Libraries Needed
This phase is pure schema composition and React component work. No npm installs required.

**Version verification:** No new packages.

---

## Architecture Patterns

### Existing Pattern — Follow Exactly
Every JSON-LD schema is a standalone React server component in `src/components/seo/json-ld/`:

```typescript
// Source: existing project pattern (verified in codebase)
// Pattern used by person-json-ld.tsx, website-json-ld.tsx, project-json-ld.tsx
import { safeJsonLdStringify } from '@/lib/json-ld-utils'

export function ThingJsonLd({ nonce }: { nonce?: string | null }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Thing',
    // ...
  }

  return (
    <script
      type="application/ld+json"
      nonce={nonce ?? undefined}
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
    />
  )
}
```

**Rules derived from codebase scan:**
- Always import from `@/lib/json-ld-utils`, never `./structured-data`
- Always accept `{ nonce?: string | null }` as prop
- Always use `nonce ?? undefined` (not direct `nonce`) to avoid `null` being passed to DOM
- Never use raw `JSON.stringify` — only `safeJsonLdStringify`
- Components in `json-ld/` are server-safe (no `'use client'` marker)

### Recommended Project Structure (after consolidation)
```
src/components/seo/
├── json-ld/                     # AUTHORITATIVE — all schemas live here
│   ├── person-json-ld.tsx       # SD-01: Person (update phone, stays in layout.tsx)
│   ├── website-json-ld.tsx      # SD-02: WebSite + SearchAction (add potentialAction)
│   ├── project-json-ld.tsx      # SD-05: CreativeWork + breadcrumb embed
│   ├── navigation-json-ld.tsx   # SD-07: SiteNavigationElement (NEW)
│   └── breadcrumb-json-ld.tsx   # SD-03: Standalone BreadcrumbList (NEW)
│   # DELETED: organization-json-ld.tsx, local-business-json-ld.tsx
├── blog-json-ld.tsx             # Blog/BlogPosting/FAQ (keep as-is — SD-04 covered)
├── structured-data.tsx          # Keep ONLY StructuredData wrapper + safeJsonLdStringify re-export
│   # DELETED from structured-data.tsx: WebsiteStructuredData, PersonStructuredData,
│   #   ArticleStructuredData, ProjectStructuredData
│   # DELETED entirely: person-schema.tsx, home-page-schema.tsx
└── global-seo.tsx               # Fate per D-04 (Claude's discretion)
└── seo-provider.tsx             # Fate per D-04 (Claude's discretion)
```

### Pattern 2: Standalone BreadcrumbList
Google's documentation specifies BreadcrumbList as standalone structured data, not nested inside other schemas. The current `BlogPostJsonLd` embeds breadcrumb as a property (`breadcrumb: { '@type': 'BreadcrumbList', ...}`), which is technically valid schema.org but Google's examples show standalone. Both approaches are accepted by the Rich Results Test.

For project pages, add a standalone `BreadcrumbListJsonLd` component:

```typescript
// Source: Google BreadcrumbList documentation (verified)
// [CITED: developers.google.com/search/docs/appearance/structured-data/breadcrumb]
export function BreadcrumbListJsonLd({
  items,
  nonce,
}: {
  items: Array<{ name: string; item: string }>
  nonce?: string | null
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  }
  return (
    <script
      type="application/ld+json"
      nonce={nonce ?? undefined}
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
    />
  )
}
```

### Pattern 3: SiteNavigationElement
No existing implementation found in codebase. `navConfig.mainNav` in `src/lib/site.ts` already defines the 5 nav items and must be the source of truth.

```typescript
// Source: schema.org SiteNavigationElement + navConfig pattern
// [CITED: schemantra.com/schema_list/SiteNavigationElement]
import { navConfig } from '@/lib/site'

export function NavigationJsonLd({ nonce }: { nonce?: string | null }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: navConfig.mainNav.map(item => item.title),
    url: navConfig.mainNav.map(item => `https://richardwhudsonjr.com${item.href}`),
  }
  // ... render script tag
}
```

### Pattern 4: WebSite + SearchAction
The Sitelinks Search Box visual feature was deprecated by Google in November 2024 [VERIFIED: developers.google.com/search/blog/2024/10/sitelinks-search-box]. The markup itself does not cause errors, but will not produce a visual rich result. Including it as specified in D-11 is the right call — it exercises the blog `?q=` filter and keeps markup valid.

```typescript
// Source: schema.org SearchAction pattern (canonical form)
// [CITED: support.google.com/webmasters/thread/23990386]
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Richard Hudson - Senior Revenue Operations Specialist',
  url: 'https://richardwhudsonjr.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://richardwhudsonjr.com/blog?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}
```

### Pattern 5: FAQPage
```typescript
// Source: Google FAQPage docs (verified) + existing BlogFAQJsonLd pattern in codebase
// [CITED: developers.google.com/search/docs/appearance/structured-data/faqpage]
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}
```

### Blog Search (`?q=`) Implementation
The blog index already uses `nuqs` v2 `useQueryState` for `?category=` filtering. Adding `?q=` is additive — add a second `useQueryState('q', { defaultValue: '' })` and filter posts by title/excerpt match. D-12 grants Claude's discretion on depth.

### Anti-Patterns to Avoid
- **Raw `JSON.stringify`:** Never use it for JSON-LD — use `safeJsonLdStringify` to prevent `</script>` injection.
- **Fabricated data in schemas:** The LocalBusiness schema has `aggregateRating: { ratingValue: '5.0', reviewCount: '15' }` with no real reviews. This violates Google's spam policies. It is being deleted (D-10).
- **Duplicate Person schemas:** Currently `layout.tsx` emits `PersonJsonLd` (from `json-ld/`) AND `about/page.tsx` emits `PersonSchema` (from `person-schema.tsx`). This produces two different Person schemas for the same entity. Consolidate to one source and ensure about page uses the canonical `PersonJsonLd`.
- **`'use client'` on JSON-LD components:** `seo-provider.tsx` is a client component that renders schema — it runs post-hydration, which can delay structured data availability. All new `json-ld/` components must be server components (no `'use client'`).
- **Hardcoded `http://localhost:3000` URLs:** `siteConfig.url` uses `process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'`. JSON-LD must use production URL `https://richardwhudsonjr.com` directly, not `siteConfig.url`, or environment must be guaranteed correct.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| XSS-safe JSON serialization | Custom escaping logic | `safeJsonLdStringify` from `src/lib/json-ld-utils.ts` | Already exists, OWASP-compliant, project standard |
| URL state for blog search | Custom URLSearchParams / useState | `nuqs` `useQueryState` | Already in codebase, handles SSR-safe URL state, shareable links |
| Schema validation | Custom validator | Google Rich Results Test (tool) | External validation is the authoritative check |

**Key insight:** All the infrastructure already exists. The work is schema composition and wiring, not building new utilities.

---

## Common Pitfalls

### Pitfall 1: FAQ Rich Results Won't Appear
**What goes wrong:** Implementing FAQPage schema, passing Rich Results Test, then seeing nothing in Google Search Console or SERP.
**Why it happens:** Google restricted FAQPage rich results to government and health sites in August 2023 [CITED: developers.google.com/search/blog/2023/08/howto-faq-changes]. This portfolio does not qualify.
**How to avoid:** Set correct expectations — FAQ schema is still valid, provides knowledge-graph signals, and passes the Rich Results Test tool, but will not produce a visible SERP feature for this site.
**Warning signs:** If Search Console shows "FAQ" under "Enhancements" but no impressions, that is normal for non-eligible sites.

### Pitfall 2: SearchAction Sitelinks Search Box Produces No SERP Element
**What goes wrong:** Adding SearchAction to WebSite schema expecting a search box to appear under the site name in Google results.
**Why it happens:** Google removed the sitelinks search box visual element in November 2024 [CITED: developers.google.com/search/blog/2024/10/sitelinks-search-box].
**How to avoid:** The markup is harmless — include it as specified in D-11. The value is the actual blog `?q=` filter feature it enables, not the rich result.
**Warning signs:** No SERP search box after deploy is expected, not a bug.

### Pitfall 3: Duplicate Person Schema Causes Conflicting Data
**What goes wrong:** `layout.tsx` renders `PersonJsonLd` globally and `about/page.tsx` renders `PersonSchema` — Google receives two different Person schemas on the about page with different properties (one includes phone, one has `url: https://richardwhudsonjr.com/about`, different `sameAs` values).
**Why it happens:** Two parallel implementations exist in the codebase (`json-ld/person-json-ld.tsx` vs `person-schema.tsx`).
**How to avoid:** Delete `person-schema.tsx` per D-02. About page must stop importing `PersonSchema`. The global `PersonJsonLd` from root layout already covers it.
**Warning signs:** Rich Results Test showing duplicate/conflicting Person entities.

### Pitfall 4: `siteConfig.url` Resolves to `localhost` in JSON-LD
**What goes wrong:** JSON-LD emitted in production contains `http://localhost:3000` as URL values.
**Why it happens:** `siteConfig.url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'` — if `NEXT_PUBLIC_SITE_URL` is not set in Vercel env, all schemas get localhost URLs.
**How to avoid:** The `json-ld/` components currently hardcode `https://richardwhudsonjr.com` directly (not via `siteConfig`). This is the correct pattern for this codebase — do not refactor to use `siteConfig.url` for schema URLs.
**Warning signs:** Google Search Console showing structured data errors about non-canonical URLs.

### Pitfall 5: BreadcrumbList Needs at Least 2 Items
**What goes wrong:** BreadcrumbList with only one item fails Google validation.
**Why it happens:** Google requires minimum two `ListItem` entries per Google's documentation [CITED: developers.google.com/search/docs/appearance/structured-data/breadcrumb].
**How to avoid:** The minimum breadcrumb for any nested page is: Home → Page Name (2 items). Blog posts already have Home → Blog → Post (3 items). Project pages need: Home → Projects → Project Name (3 items).
**Warning signs:** Rich Results Test "Missing required field: itemListElement (at least 2 items)" error.

### Pitfall 6: `'use client'` Blocks Server Rendering of JSON-LD
**What goes wrong:** JSON-LD scripts are not present in initial HTML response, causing Googlebot to miss them.
**Why it happens:** `SEOProvider` is a `'use client'` component — when schema is placed inside it, it only renders post-hydration.
**How to avoid:** All new `json-ld/` components must not have `'use client'`. Per D-04, Claude should assess whether `SEOProvider` / `GlobalSEO` should be removed in favor of direct `json-ld/` imports per page (removing the client-component wrapper is the cleaner solution).
**Warning signs:** Googlebot fetch tool showing empty schema while browser shows it.

### Pitfall 7: Organization/LocalBusiness Fabricated Ratings
**What goes wrong:** Google's spam policy flags `aggregateRating` without real reviews as manipulative markup.
**Why it happens:** `local-business-json-ld.tsx` has `ratingValue: '5.0', reviewCount: '15'` with no real review source.
**How to avoid:** Delete both files per D-10 and remove their imports from `layout.tsx`. This is already a locked decision.
**Warning signs:** Google Search Console manual action for "Structured data" spam.

---

## Code Examples

Verified patterns from codebase (no additional library docs needed):

### Person JSON-LD (update phone per D-09)
```typescript
// Source: src/components/seo/json-ld/person-json-ld.tsx (verified)
// Change: replace '+1-555-REVOPS' with '+1-214-566-0279'
telephone: '+1-214-566-0279',
```

### WebSite JSON-LD with SearchAction (update existing website-json-ld.tsx)
```typescript
// Source: schema.org SearchAction [CITED: support.google.com/webmasters/thread/23990386]
// Current website-json-ld.tsx is missing potentialAction — add it
potentialAction: {
  '@type': 'SearchAction',
  target: {
    '@type': 'EntryPoint',
    urlTemplate: 'https://richardwhudsonjr.com/blog?q={search_term_string}',
  },
  'query-input': 'required name=search_term_string',
},
```

### Standalone BreadcrumbList for Project Pages (new component)
```typescript
// Source: Google BreadcrumbList docs [CITED: developers.google.com/search/docs/appearance/structured-data/breadcrumb]
// For a project page: items = [{name:'Home', item:'https://richardwhudsonjr.com'}, {name:'Projects', item:'...'}, {name:'Project Title', item:'...'}]
```

### Blog Search `?q=` Filter (extend existing blog-list.tsx)
```typescript
// Source: existing pattern in blog-list.tsx (verified)
// nuqs already used for ?category= — add ?q= the same way
const [searchQuery, setSearchQuery] = useQueryState('q', { defaultValue: '' })
const filteredPosts = posts.filter(post =>
  !searchQuery || post.title.toLowerCase().includes(searchQuery.toLowerCase())
    || post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
)
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Sitelinks Search Box in SERP | Deprecated — no visual element | November 2024 | SearchAction markup stays harmless but produces no SERP feature |
| FAQ rich results for all sites | Only government/health sites eligible | August 2023 | FAQPage schema has no rich result value for this portfolio; still valid markup |
| Organization/LocalBusiness for consultants | Person + ProfilePage recommended | Ongoing | Remove fake-rating LocalBusiness; Person schema is the right type |
| Multiple scattered schema components | Consolidated `json-ld/` directory | This phase | Cleaner, single source of truth |

**Deprecated/outdated in codebase:**
- `src/components/seo/json-ld/organization-json-ld.tsx`: Remove per D-10 — not required by SD-01 through SD-07
- `src/components/seo/json-ld/local-business-json-ld.tsx`: Remove per D-10 — contains fabricated aggregate ratings (Google spam risk)
- `WebsiteStructuredData`, `PersonStructuredData`, `ArticleStructuredData`, `ProjectStructuredData` in `structured-data.tsx`: Remove per D-02
- `src/components/seo/person-schema.tsx`: Remove per D-02
- `src/components/seo/home-page-schema.tsx`: Remove per D-02 — ProfilePage schema with duplicate Person data

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | SiteNavigationElement schema provides knowledge-graph/sitelinks signals even without a specific Google rich result documented | Phase Requirements SD-07, Architecture Patterns | Low risk — markup is harmless if Google ignores it; no Search Console error expected |
| A2 | BlogPosting type is treated equivalent to Article by Google's rich results system | Phase Requirements SD-04 | Low risk — Google documentation confirms Article/NewsArticle/BlogPosting all use the same property guidelines [CITED: article structured data docs] |
| A3 | Embedding BreadcrumbList as a property inside BlogPosting (current pattern) passes Rich Results Test | Architecture Patterns | Low risk — if Rich Results Test rejects it, the fix is to emit a standalone BreadcrumbList script tag alongside the BlogPosting tag |

---

## Open Questions

1. **SEOProvider / GlobalSEO fate (D-04)**
   - What we know: Both are client components that render JSON-LD. `SEOProvider` uses `WebsiteStructuredData` and `PersonStructuredData` from `structured-data.tsx` (the duplicates being deleted). After D-02, `SEOProvider`'s schema rendering becomes empty.
   - What's unclear: Whether either component is used anywhere in the codebase after the deletions.
   - Recommendation: `grep -rn "SEOProvider\|GlobalSEO"` across app routes before deciding fate. If no page imports them after schema deletions, delete both. If they wrap page content for other reasons, keep the shell but remove schema rendering.

2. **Dynamic `[slug]` project route needs JSON-LD**
   - What we know: `src/app/projects/[slug]/page.tsx` passes `initialProject` to `ProjectDetailClientBoundary`. That component has no JSON-LD.
   - What's unclear: Whether the dynamic route is ever reached for projects (the `generateStaticParams` excludes 11 named slugs, so the `[slug]` route handles anything not in that list).
   - Recommendation: Add `ProjectJsonLd` to `src/app/projects/[slug]/page.tsx` (the server component) alongside `ProjectStructuredData` from project data, not inside the client boundary.

3. **Blog post BreadcrumbList: standalone vs embedded**
   - What we know: `BlogPostJsonLd` already embeds `breadcrumb: { '@type': 'BreadcrumbList', ... }` inside the BlogPosting schema. Google's docs show standalone as the canonical form.
   - What's unclear: Whether the embedded pattern passes Rich Results Test in practice.
   - Recommendation: Keep the embedded form (existing, working code); add standalone `BreadcrumbListJsonLd` only to pages that have no existing breadcrumb (project pages, about page if added).

---

## Environment Availability

Step 2.6: SKIPPED (no external dependencies — this phase is pure code/component work, no CLI tools, databases, or external services needed beyond the existing Next.js/Vercel stack).

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 |
| Config file | `vitest.config.mts` |
| Quick run command | `npm test` (vitest run --passWithNoTests) |
| Full suite command | `npm run test:coverage` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SD-01 | PersonJsonLd emits valid JSON-LD with correct phone | unit | `npm test -- --reporter=verbose` | ❌ Wave 0 |
| SD-02 | WebsiteJsonLd contains potentialAction SearchAction | unit | `npm test -- --reporter=verbose` | ❌ Wave 0 |
| SD-03 | BreadcrumbListJsonLd generates correct itemListElement order | unit | `npm test -- --reporter=verbose` | ❌ Wave 0 |
| SD-04 | BlogPostJsonLd includes datePublished, author, headline | unit | `npm test -- --reporter=verbose` | Already covered by existing component |
| SD-05 | ProjectJsonLd outputs CreativeWork type | unit | `npm test -- --reporter=verbose` | ❌ Wave 0 |
| SD-06 | FAQPage schema structure validation | unit | `npm test -- --reporter=verbose` | ❌ Wave 0 |
| SD-07 | NavigationJsonLd contains all 5 nav items | unit | `npm test -- --reporter=verbose` | ❌ Wave 0 |
| SD-01..07 | safeJsonLdStringify never produces raw `</script>` in output | unit | `npm test` | Implicitly tested by json-ld-utils coverage |

**Note:** Vitest config includes only `src/**/__tests__/**/*.test.ts(x)`. New JSON-LD tests must live at `src/lib/__tests__/json-ld-schemas.test.ts` or a dedicated `src/components/seo/__tests__/` directory (would require vitest config update to include component tests). Simplest path: `src/lib/__tests__/json-ld-schemas.test.ts` testing the schema output of the pure data objects (not rendering).

### Sampling Rate
- **Per task commit:** `npm test`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `src/lib/__tests__/json-ld-schemas.test.ts` — covers SD-01 through SD-07 schema structure assertions

*(No framework install needed — Vitest 4.1.0 already configured)*

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | — |
| V3 Session Management | no | — |
| V4 Access Control | no | — |
| V5 Input Validation | partial | `safeJsonLdStringify` escapes `</` sequences for all JSON-LD output; blog `?q=` search input uses nuqs URL state (no server-side eval) |
| V6 Cryptography | no | — |

### Known Threat Patterns for JSON-LD

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| `</script>` injection via user content in JSON-LD | Tampering | `safeJsonLdStringify` (already used by all components) |
| CSP violation from inline `<script>` tags | Tampering | `nonce` prop passed to all JSON-LD `<script>` elements — existing pattern in codebase |
| Fabricated structured data (spam) | Repudiation | Delete `local-business-json-ld.tsx` with fake `aggregateRating` per D-10 |

---

## Sources

### Primary (HIGH confidence)
- [VERIFIED: codebase grep] `src/components/seo/json-ld/` — all 5 files read directly; exact component implementations confirmed
- [VERIFIED: codebase grep] `src/app/layout.tsx` — PersonJsonLd, WebsiteJsonLd, LocalBusinessJsonLd, OrganizationJsonLd wired in root layout
- [VERIFIED: codebase grep] `src/app/projects/*/page.tsx` — 8 of 14 project pages have ProjectJsonLd; 6 confirmed missing
- [CITED: developers.google.com/search/docs/appearance/structured-data/breadcrumb] BreadcrumbList required properties
- [CITED: developers.google.com/search/docs/appearance/structured-data/article] Article/BlogPosting — no required properties, recommended fields listed
- [CITED: developers.google.com/search/docs/appearance/structured-data/faqpage] FAQPage required properties + restriction to government/health sites

### Secondary (MEDIUM confidence)
- [CITED: developers.google.com/search/blog/2024/10/sitelinks-search-box] — Sitelinks Search Box deprecated November 2024; SearchAction markup harmless but produces no rich result
- [CITED: developers.google.com/search/blog/2023/08/howto-faq-changes] — FAQ rich results restricted to government/health sites August 2023
- [CITED: developers.google.com/search/docs/appearance/structured-data/profile-page] — ProfilePage schema for creator profiles; Person as mainEntity

### Tertiary (LOW confidence)
- [ASSUMED] SiteNavigationElement provides sitelinks influence signal — Google has not documented this as producing a specific rich result, but schema.org definition supports the type and it is a recognized structured data type

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies, everything verified in package.json and codebase
- Architecture: HIGH — all patterns read directly from existing production code
- Pitfalls: HIGH for items with Google official blog citations; MEDIUM for SiteNavigationElement behavior

**Research date:** 2026-04-08
**Valid until:** 2026-07-08 (90 days — JSON-LD/schema.org standards are stable; Google rich results policies can change but infrequently)
