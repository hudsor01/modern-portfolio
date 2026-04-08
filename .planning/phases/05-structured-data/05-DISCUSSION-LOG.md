# Phase 5: Structured Data - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-08
**Phase:** 05-structured-data
**Areas discussed:** Component consolidation, Project schema type, FAQ content, Personal info in schemas

---

## Component Consolidation

| Option | Description | Selected |
|--------|-------------|----------|
| Consolidate into json-ld/ | Keep json-ld/ directory as single source of truth. Migrate best parts from scattered files, remove duplicates. | ✓ |
| Fresh rewrite | Delete all existing SEO components and rebuild from scratch. |  |
| Just fill gaps | Leave duplicates as-is, only add missing schemas. |  |

**User's choice:** Consolidate into json-ld/ (Recommended)
**Notes:** None

### Follow-up: SEOProvider/GlobalSEO

| Option | Description | Selected |
|--------|-------------|----------|
| Remove SEOProvider/GlobalSEO too | Each page imports specific json-ld components directly. |  |
| Keep SEOProvider as orchestrator | Rewire to use consolidated json-ld/ components. |  |

**User's choice:** "You decide" — deferred to Claude's discretion
**Notes:** None

---

## Project Schema Type

| Option | Description | Selected |
|--------|-------------|----------|
| CreativeWork | Matches case studies/portfolio pieces. ROADMAP specifies this. |  |
| SoftwareApplication | Current structured-data.tsx version with 'offers' and 'operatingSystem'. |  |
| CreativeWork with Project subtype | More semantically precise but less tested with Google. |  |

**User's choice:** "You decide" — deferred to Claude's discretion
**Notes:** None

---

## FAQ Content

### Source

| Option | Description | Selected |
|--------|-------------|----------|
| Hardcoded in page files | Define FAQ Q&A pairs directly in each page component. | ✓ |
| Centralized config file | Single JSON/TS file mapping page slugs to FAQ arrays. |  |
| Skip FAQ for now | Defer FAQ schema to later. |  |

**User's choice:** Hardcoded in page files (Recommended)
**Notes:** None

### Authorship

| Option | Description | Selected |
|--------|-------------|----------|
| Claude drafts them | Create Q&A pairs based on page content and context. | ✓ |
| User provides them | User supplies specific questions and answers. |  |

**User's choice:** Claude drafts based on project context and content
**Notes:** User said "based on the project's context and content, you should write one for me"

---

## Personal Info in Schemas

### Detail Level

| Option | Description | Selected |
|--------|-------------|----------|
| Keep credentials + location, drop phone | Certifications and DFW location help visibility. Drop placeholder phone. |  |
| Full details | Keep everything including address and phone. | ✓ |
| Minimal — name, title, links only | Strip to essentials only. |  |

**User's choice:** Full details
**Notes:** None

### Phone Number

| Option | Description | Selected |
|--------|-------------|----------|
| I'll add it myself later | Leave a TODO comment. |  |
| Use contact form URL instead | Point to contact page URL. |  |

**User's choice:** Provided real number: 214-566-0279
**Notes:** User typed the number directly

---

## Claude's Discretion

- SEOProvider/GlobalSEO: keep or remove (rewire or direct imports)
- Project schema type: CreativeWork recommended, user deferred

## Deferred Ideas

None — discussion stayed within phase scope
