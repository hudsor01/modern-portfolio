# Roadmap - v1.2 Google Search Indexing Optimization

## Milestone Overview

Improve SEO signals, structured data, metadata, and search engine discoverability for richardwhudsonjr.com. The site already has basic SEO foundations (robots.txt, sitemap.xml, blog JSON-LD, OG tags on blog pages). This milestone makes every page crawlable, correctly described, and actively indexed.

**Phase numbering continues from v1.1 (ended at Phase 5). v1.2 starts at Phase 5.**

---

## Phases

- [ ] **Phase 5: Structured Data** - All pages emit valid JSON-LD schemas (Person, WebSite, Article, BreadcrumbList, Project, FAQ, Navigation)
- [ ] **Phase 5.1: Structured Data Bug Fixes** - Fix SearchAction localhost URL, add BreadcrumbList to 7 missing project pages, add Blog to navConfig, fix GitHub URL typo
- [ ] **Phase 6: Metadata & Open Graph** - Every page has unique title, meta description, canonical URL, OG markup, Twitter card, and dynamic OG images
- [ ] **Phase 7: Sitemap & Indexing** - Dynamic sitemap with live blog posts, optimized robots.txt, Search Console verified, IndexNow wired to publish events
- [ ] **Phase 8: Technical SEO** - Semantic HTML heading hierarchy, internal link structure, Core Web Vitals audited, resource hints added, image alt text complete

---

## Phase Details

### Phase 5: Structured Data
**Goal**: Every page type emits valid, Google-parseable JSON-LD structured data that enables rich results in search
**Depends on**: Nothing (pure additions, no breaking changes to existing pages)
**Requirements**: SD-01, SD-02, SD-03, SD-04, SD-05, SD-06, SD-07
**Success Criteria** (what must be TRUE):
  1. Google's Rich Results Test passes for homepage (Person + WebSite + SearchAction schemas)
  2. Blog post pages show valid Article schema with author, datePublished, dateModified — verifiable in Rich Results Test
  3. Project case study pages emit CreativeWork/Project schema — parseable without errors
  4. All nested pages (blog posts, projects, about) include BreadcrumbList schema reflecting the actual URL path
  5. Google Search Console shows zero structured data errors after crawl
**Plans:** 3 plans
Plans:
- [x] 05-01-PLAN.md — Consolidate schemas, delete duplicates/spam-risk, update Person phone
- [x] 05-02-PLAN.md — Add BreadcrumbList, CreativeWork to projects, FAQ to about page
- [x] 05-03-PLAN.md — WebSite SearchAction, NavigationJsonLd, blog search filter
**UI hint**: yes

### Phase 5.1: Structured Data Bug Fixes
**Goal**: Fix 4 integration bugs found in Phase 5 audit — broken SearchAction URL, missing BreadcrumbList on 7 project pages, Blog omitted from navigation schema, wrong GitHub URL in blog publisher
**Depends on**: Phase 5 (fixes bugs in Phase 5 output)
**Requirements**: SD-02, SD-03, SD-04, SD-07
**Gap Closure**: Closes gaps from v1.2 milestone audit
**Success Criteria** (what must be TRUE):
  1. SearchAction urlTemplate uses hardcoded `https://richardwhudsonjr.com/blog?q={search_term_string}` — not siteConfig.url
  2. All 14 dedicated project pages + dynamic [slug] route emit BreadcrumbList JSON-LD
  3. NavigationJsonLd emits 6 nav items including Blog, matching actual Navbar
  4. BlogJsonLd publisher GitHub URL is `hudsor01` (not `rhudsor01`)
**Plans:** TBD

### Phase 6: Metadata & Open Graph
**Goal**: Every page presents a unique, accurate identity to search engines and social platforms — no missing titles, no duplicate descriptions, no untagged pages
**Depends on**: Phase 5 (structured data should be in place before social/OG signals)
**Requirements**: META-01, META-02, META-03, META-04, META-05
**Success Criteria** (what must be TRUE):
  1. Every page (home, about, blog index, each blog post, projects, each project, resume) has a distinct title and meta description — verifiable via browser DevTools or SEO browser extension
  2. Sharing any page URL on Twitter or LinkedIn renders a correct preview card with title, description, and image
  3. No page has a duplicate or missing canonical URL — verifiable by crawling with a tool like Screaming Frog or browser inspection
  4. Blog post and project URLs generate unique dynamic OG images (not the generic site fallback)
**Plans**: 2 plans
Plans:
- [ ] 06-01-PLAN.md — Complete metadata (title, description, OG, twitter, canonical) on all pages
- [ ] 06-02-PLAN.md — Dynamic OG image generation for blog posts and projects
**UI hint**: yes

### Phase 7: Sitemap & Indexing
**Goal**: Google can discover and index all content efficiently — dynamic sitemap reflects live posts, crawl directives are correct, and new content is submitted instantly on publish
**Depends on**: Phase 5 (structured data in place), Phase 6 (canonical URLs established before sitemap submission)
**Requirements**: IDX-01, IDX-02, IDX-03, IDX-04
**Success Criteria** (what must be TRUE):
  1. The /sitemap.xml response includes all published blog posts with accurate lastmod timestamps — verifiable by fetching the sitemap after a new post is published
  2. Robots.txt correctly allows crawling of all public pages and blocks any admin/API paths — verifiable by Google's robots.txt tester in Search Console
  3. Google Search Console shows the site as verified and the sitemap as successfully submitted with zero errors
  4. Publishing a new blog post triggers an IndexNow ping — verifiable via server logs or IndexNow API response
**Plans**: 2 plans
Plans:
- [ ] 06-01-PLAN.md — Complete metadata (title, description, OG, twitter, canonical) on all pages
- [ ] 06-02-PLAN.md — Dynamic OG image generation for blog posts and projects

### Phase 8: Technical SEO
**Goal**: The site's HTML structure, internal navigation, performance metrics, and media are all optimized for search ranking signals
**Depends on**: Phase 6 (pages fully structured before performance audit), Phase 7 (indexing pipeline in place)
**Requirements**: TSEO-01, TSEO-02, TSEO-03, TSEO-04, TSEO-05
**Success Criteria** (what must be TRUE):
  1. Every page has exactly one h1, with h2-h6 used in correct hierarchical order — verifiable via browser heading outline tool or accessibility checker
  2. Related blog posts and projects link to each other via contextually relevant anchor text — at least 2 internal links per content page
  3. Lighthouse or PageSpeed Insights scores LCP under 2.5s, CLS under 0.1, and INP under 200ms on the live Vercel deployment
  4. All images across the site have descriptive, non-empty alt attributes — zero alt-text violations in axe or Lighthouse accessibility audit
**Plans**: 2 plans
Plans:
- [ ] 06-01-PLAN.md — Complete metadata (title, description, OG, twitter, canonical) on all pages
- [ ] 06-02-PLAN.md — Dynamic OG image generation for blog posts and projects
**UI hint**: yes

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 5. Structured Data | 3/3 | Complete | 2026-04-08 |
| 5.1 Structured Data Bug Fixes | 0/? | Not started | — |
| 6. Metadata & Open Graph | 0/? | Not started | — |
| 7. Sitemap & Indexing | 0/? | Not started | — |
| 8. Technical SEO | 0/? | Not started | — |

---
*Roadmap created: 2026-04-08*
*Milestone: v1.2 Google Search Indexing Optimization*
