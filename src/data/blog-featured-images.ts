/**
 * Canonical blog featured-image mapping. The 27 entries below are the
 * single source of truth for which Unsplash photo each post uses. They
 * are consumed by:
 *
 *   - drizzle/seed.ts                              — for the 6 overlapping seeded posts
 *   - scripts/update-blog-featured-images.ts       — to sync the prod DB
 *
 * Adding/removing a post: add/remove an entry here, then re-run
 * scripts/update-blog-featured-images.ts against prod and re-seed dev.
 *
 * Alt-text guideline: each `alt` is rendered both as the <img alt> for
 * screen readers AND as a visible <figcaption> overlay on the hero (see
 * src/app/blog/_components/blog-post-layout.tsx). Write alts that are
 * (a) accessible (describe what the image shows) AND (b) topically
 * coherent (work as a one-line caption for the post). Don't write pure
 * visual descriptions like "professor at chalkboard" — they read as
 * stock-photo placeholders under topical post titles.
 */

import { unsplashUrl } from '@/lib/unsplash'

export interface BlogFeaturedImage {
  readonly slug: string
  readonly photoId: string
  readonly alt: string
  /**
   * `true` for posts that only exist in `drizzle/seed.ts` (DRAFT/SCHEDULED
   * staging) and are not in the prod DB. `scripts/update-blog-featured-images.ts`
   * skips these so a clean prod run still exits 0.
   */
  readonly seedOnly?: true
}

export const BLOG_FEATURED_IMAGES: readonly BlogFeaturedImage[] = [
  {
    slug: 'stop-guessing-how-we-crushed-forecasting-errors-by-34-in-one-quarter',
    photoId: '1542744173-05336fcc7ad4',
    alt: 'Sales forecasting analytics dashboard on a MacBook',
  },
  {
    slug: 'why-92-of-your-sdrs-fail-at-objection-handling-and-the-one-framework-that-fixes-',
    photoId: '1758876202189-0fbc277dfed9',
    alt: 'Sales development rep on an active prospect call',
  },
  {
    slug: 'stop-guessing-how-we-slashed-forecast-variance-by-34-in-90-days',
    photoId: '1555421689-491a97ff2040',
    alt: 'Analyst tightening a sales forecast at her workstation',
  },
  {
    slug: 'the-12-numbers-your-ceo-actually-needs-stop-wasting-their-time-with-vanity-metri',
    photoId: '1757405981650-a7fcfa3fb9d8',
    alt: 'Executive presenting the core revenue metrics that matter to a CEO',
  },
  {
    slug: 'stop-chasing-one-contact-how-multi-threading-automation-doubles-your-pipeline',
    photoId: '1517048676732-d65bc937f952',
    alt: 'Buying committee collaborating around a long table — multi-threading in action',
  },
  {
    slug: 'the-60-day-rule-how-to-get-new-sdrs-to-quota-before-they-quit',
    photoId: '1557804506-669a67965ba0',
    alt: 'New SDR cohort in an onboarding training session',
  },
  {
    slug: 'the-4-2m-you-left-on-the-table-why-your-closed-lost-deals-are-actually-sleeping-',
    photoId: '1758519288372-045de3f65147',
    alt: 'Two reps reviewing a closed-lost deal that deserves a second look',
  },
  {
    slug: 'stop-using-generic-scripts-the-4-step-objection-handling-framework-that-lifted-o',
    photoId: '1758518727077-ffb66ffccced',
    alt: 'Sales team working through an objection-handling discussion',
  },
  {
    slug: 'the-4-2m-leak-why-your-first-revops-hire-must-fix-data-before-headcount',
    photoId: '1686061593213-98dad7c599b9',
    alt: 'RevOps analyst inspecting a real-time revenue data dashboard',
  },
  {
    slug: 'the-23-revenue-leak-you-re-ignoring-how-to-resurrect-dead-deals',
    photoId: '1600880292203-757bb62b4baf',
    alt: 'Sales pair celebrating a revived deal at their desk',
  },
  {
    slug: 'stop-hiring-a-revops-team-until-you-fix-these-three-broken-gears',
    photoId: '1622675363311-3e1904dc1885',
    alt: 'Distributed RevOps team collaborating on laptops in a working session',
  },
  {
    slug: 'stop-ignoring-your-dead-opportunities-how-we-revived-4-2m-in-lost-revenue-with-o',
    photoId: '1758691736484-4914d363a3cc',
    alt: 'Sales leader presenting recovered-revenue charts to the team',
  },
  {
    slug: 'stop-wasting-20-hours-a-week-the-real-way-to-connect-zoominfo-and-salesloft',
    photoId: '1766074903100-bc435aa4c60d',
    alt: 'Connected sales-tech tools running side-by-side on a laptop',
  },
  {
    slug: 'stop-guessing-how-revenue-intelligence-platforms-slash-forecast-errors-by-40',
    photoId: '1762330470070-249e7c23c8c0',
    alt: 'AI sales-assistant interface answering a revenue-intelligence query',
  },
  {
    slug: 'stop-showing-your-ceo-50-metrics-the-12-numbers-that-actually-drive-revenue-grow',
    photoId: '1763038311036-6d18805537e5',
    alt: 'Analyst focused on the twelve revenue charts that actually move the business',
  },
  {
    slug: 'stop-feeding-the-beast-how-i-cut-rep-admin-time-by-5-hours-weekly-without-breaki',
    photoId: '1542744095-fcf48d80b0fd',
    alt: 'Reps in a working session redesigning their daily admin workflow',
  },
  {
    slug: 'the-87-failure-rate-why-your-sdrs-lose-deals-before-you-even-pitch',
    photoId: '1626863905121-3b0c0ed7b94c',
    alt: 'SDR on a discovery call wearing a sales headset',
  },
  {
    slug: 'stop-guessing-how-we-turned-call-coaching-into-a-revenue-engine-using-gong-and-s',
    photoId: '1642177437932-75d846ad48f3',
    alt: 'Sales-call audio waveforms in conversation-intelligence software',
  },
  {
    slug: 'pipeline-velocity-the-8-week-bleed-killing-your-q4-revenue',
    photoId: '1704265586142-db3e17d0dea0',
    alt: 'Stopwatch — pipeline velocity is a race against the clock',
  },
  {
    slug: 'stop-guessing-at-data-how-zoominfo-and-salesloft-automate-4-2m-in-lost-revenue',
    photoId: '1580983559367-0dc2f8934365',
    alt: 'RevOps analyst automating sales-data workflows on a laptop',
  },
  {
    slug: 'stop-guessing-how-to-slash-forecast-variance-by-60-in-90-days',
    photoId: '1767424412548-1a1ac7f4b9bc',
    alt: 'Multi-screen forecasting workstation tracking variance over time',
  },
  {
    slug: 'lead-scoring-models-that-actually-work',
    photoId: '1758685734643-db77920292bc',
    alt: 'Statistical lead-scoring model derivations written out on a chalkboard',
  },
  {
    slug: 'salesforce-revenue-analytics-implementation',
    photoId: '1759752394755-1241472b589d',
    alt: 'Enterprise revenue-analytics dashboard in active use',
  },
  {
    slug: 'multi-touch-attribution-modeling-best-practices',
    photoId: '1586936893354-362ad6ae47ba',
    alt: 'Team mapping a customer journey with sticky notes on a wall',
  },
  {
    slug: 'advanced-customer-churn-analysis-python',
    photoId: '1573496528681-9b0f4fb0c660',
    alt: "O'Reilly Python reference book — the stack behind churn modeling",
  },
  {
    slug: 'building-high-performance-sales-dashboards',
    photoId: '1686061592689-312bbfb5c055',
    alt: 'High-performance sales analytics dashboard with sparklines and cohort grid',
  },
  {
    slug: 'complete-guide-revenue-operations-strategy',
    photoId: '1559526324-4b87b5e36e44',
    alt: 'Open MacBook on a clean desk — the canvas for a RevOps strategy',
  },
  // Seed-only (not currently PUBLISHED in prod): drizzle/seed.ts stages
  // these for development against a fresh DB. Kept in the canonical
  // mapping so they're consistent if/when they ship.
  {
    slug: 'future-revenue-operations-technology',
    photoId: '1518186285589-2f7649de83e0',
    alt: 'Trading-style data screen — the next wave of RevOps tooling',
    seedOnly: true,
  },
  {
    slug: 'optimizing-customer-lifetime-value-calculations',
    photoId: '1551434678-e076c223a692',
    alt: 'Two analysts modeling customer lifetime value at adjacent workstations',
    seedOnly: true,
  },
] as const

/**
 * Resolved (URL + alt) record, keyed by slug. Built once at module load.
 * Throws on duplicate slugs so a copy-paste mistake fails loudly rather
 * than silently overwriting one entry with another (Object.fromEntries
 * keeps the last value, which would let one post's photo silently
 * vanish — exactly the regression class this whole module exists to
 * prevent).
 */
export const BLOG_FEATURED_IMAGE_BY_SLUG: Readonly<Record<string, { src: string; alt: string }>> =
  (() => {
    const seen = new Set<string>()
    const map: Record<string, { src: string; alt: string }> = {}
    for (const entry of BLOG_FEATURED_IMAGES) {
      if (seen.has(entry.slug)) {
        throw new Error(`Duplicate slug in BLOG_FEATURED_IMAGES: "${entry.slug}"`)
      }
      seen.add(entry.slug)
      map[entry.slug] = { src: unsplashUrl(entry.photoId, 'blog'), alt: entry.alt }
    }
    return map
  })()
