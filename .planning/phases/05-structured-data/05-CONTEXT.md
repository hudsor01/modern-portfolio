# Phase 5: Structured Data - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Every page type on richardwhudsonjr.com emits valid, Google-parseable JSON-LD structured data that enables rich results in search. This covers Person, WebSite+SearchAction, Article/BlogPosting, BreadcrumbList, CreativeWork (projects), FAQ, and SiteNavigationElement schemas.

</domain>

<decisions>
## Implementation Decisions

### Component Architecture
- **D-01:** Consolidate all structured data into `src/components/seo/json-ld/` as the single authoritative source. The `json-ld/` directory already has the most complete versions (person, website, project, organization, local-business).
- **D-02:** Remove duplicate/scattered implementations: `structured-data.tsx` exports (WebsiteStructuredData, PersonStructuredData, ArticleStructuredData, ProjectStructuredData), `person-schema.tsx`, `home-page-schema.tsx`. Migrate any unique properties from these into the `json-ld/` versions before deletion.
- **D-03:** Keep `structured-data.tsx` only for the generic `StructuredData` wrapper component and the `safeJsonLdStringify` re-export — these are shared infrastructure, not schema definitions.

### Claude's Discretion
- **D-04:** Whether to keep SEOProvider/GlobalSEO as orchestrators (rewired to use consolidated json-ld/ components) or remove them in favor of direct imports per page. Choose based on what produces cleaner code during implementation.
- **D-05:** Project schema type — use CreativeWork (aligns with ROADMAP spec and the nature of RevOps case studies, not downloadable software). The existing `json-ld/project-json-ld.tsx` already uses CreativeWork.

### FAQ Content
- **D-06:** FAQ content hardcoded directly in page component files. No database or centralized config needed for the small number of pages.
- **D-07:** Claude drafts FAQ Q&A pairs based on existing page content and project context. User can edit after implementation.

### Personal Information in Schemas
- **D-08:** Keep full Person schema details: credentials (SalesLoft, HubSpot certs), location (Plano/DFW), awards ($4.8M revenue, 432% growth, 2217% network expansion), professional memberships.
- **D-09:** Replace placeholder phone `+1-555-REVOPS` with real number: `+1-214-566-0279`.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Structured Data Standards
- No external specs — requirements fully captured in REQUIREMENTS.md (SD-01 through SD-07) and decisions above.

### Existing Code (read before modifying)
- `src/components/seo/json-ld/` — authoritative directory, consolidation target
- `src/components/seo/structured-data.tsx` — generic StructuredData wrapper + schemas to migrate
- `src/components/seo/blog-json-ld.tsx` — rich BlogPosting with breadcrumbs, FAQ, interaction stats
- `src/components/seo/home-page-schema.tsx` — ProfilePage schema to migrate/consolidate
- `src/components/seo/person-schema.tsx` — basic Person schema to migrate/remove
- `src/components/seo/global-seo.tsx` — GlobalSEO component (Claude decides fate per D-04)
- `src/components/seo/seo-provider.tsx` — SEOProvider wrapper (Claude decides fate per D-04)
- `src/lib/json-ld-utils.ts` — safeJsonLdStringify utility (keep as-is)
- `src/lib/site.ts` — siteConfig with author, links, URL constants

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `safeJsonLdStringify()` in `src/lib/json-ld-utils.ts` — XSS-safe JSON-LD serialization, used everywhere
- `StructuredData` wrapper component in `structured-data.tsx` — generic `<script type="application/ld+json">` with nonce support
- `siteConfig` in `src/lib/site.ts` — centralized author name, URL, links, description
- `NavigationBreadcrumbs` component in `src/components/navigation/` — visual breadcrumbs (not JSON-LD, but shows URL structure)
- CSP nonce pattern — all existing components accept `nonce` prop for Content Security Policy

### Established Patterns
- Each schema is a standalone React component returning a `<script type="application/ld+json">` tag
- All components use `safeJsonLdStringify()` for serialization (never raw `JSON.stringify`)
- Nonce is passed as optional prop `{ nonce?: string | null }`
- Hardcoded URLs use `https://richardwhudsonjr.com` (some via siteConfig, some directly)

### Integration Points
- `src/app/layout.tsx` — root layout, where global schemas (Person, WebSite) are rendered
- `src/app/blog/[slug]/page.tsx` — blog post pages, already has BlogPostJsonLd
- `src/app/blog/page.tsx` — blog index, already has BlogJsonLd
- `src/app/about/page.tsx` — about page, needs FAQ schema
- `src/app/projects/*/page.tsx` — individual project pages, need consolidated CreativeWork + breadcrumbs
- `src/components/projects/project-page-layout.tsx` — shared project layout with visual breadcrumbs

</code_context>

<specifics>
## Specific Ideas

- Phone number for Person schema: `+1-214-566-0279` (replaces placeholder)
- FAQ content to be drafted by Claude based on page context — not user-supplied
- Blog JSON-LD already has embedded BreadcrumbList — this pattern could extend to project pages, or standalone breadcrumb components could be created for all nested pages

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-structured-data*
*Context gathered: 2026-04-08*
