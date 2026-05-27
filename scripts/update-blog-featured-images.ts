/**
 * One-off: replace duplicated/off-theme featuredImage URLs across all
 * published blog posts with unique, topical Unsplash photos.
 *
 * Why: production DB had ~9 Unsplash URLs reused across 27 posts. One of
 * those URLs (`photo-1590479773265-7464e5d48118`) rendered as a literal
 * yellow "UNDER CONSTRUCTION" laptop screen — visible on 4 cards. Two
 * others rendered as dated COVID-19 dashboards (Portuguese case counts,
 * country-by-country death tables). One was a hiring/recruiting
 * dashboard mislabeled as a sales pipeline. Each post now gets its own
 * visually-verified, on-theme photo.
 *
 * Idempotent: re-running just sets the same URLs again. Safe to remove
 * after the production update is verified.
 *
 * Usage: `bun run scripts/update-blog-featured-images.ts`
 */
// Build our own Drizzle client here — `@/db` uses 'server-only' which
// rejects script execution outside Next.js's server context.
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { eq, sql } from 'drizzle-orm'
import { blogPosts } from '@/db/schema'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not set')
}
const db = drizzle(neon(process.env.DATABASE_URL), { schema: { blogPosts } })

const IMG_PARAMS = 'w=1200&h=630&fit=crop&q=80'
const u = (id: string) => `https://images.unsplash.com/photo-${id}?${IMG_PARAMS}`

interface ImageUpdate {
  slug: string
  photoId: string
  alt: string
}

// All 27 mappings visually verified — each photo opened locally before
// assignment. See debug/blog-under-construction PR for the side-by-side
// preview that produced these picks.
const UPDATES: ImageUpdate[] = [
  {
    slug: 'stop-guessing-how-we-crushed-forecasting-errors-by-34-in-one-quarter',
    photoId: '1542744173-05336fcc7ad4',
    alt: 'Analyst reviewing dashboard with charts on MacBook Pro',
  },
  {
    slug: 'why-92-of-your-sdrs-fail-at-objection-handling-and-the-one-framework-that-fixes-',
    photoId: '1758876202189-0fbc277dfed9',
    alt: 'SDR taking a call at her desk with laptop open',
  },
  {
    slug: 'stop-guessing-how-we-slashed-forecast-variance-by-34-in-90-days',
    photoId: '1555421689-491a97ff2040',
    alt: 'Hands working at an iMac on a clean desk',
  },
  {
    slug: 'the-12-numbers-your-ceo-actually-needs-stop-wasting-their-time-with-vanity-metri',
    photoId: '1757405981650-a7fcfa3fb9d8',
    alt: 'Executive presenting a data diagram in a boardroom',
  },
  {
    slug: 'stop-chasing-one-contact-how-multi-threading-automation-doubles-your-pipeline',
    photoId: '1517048676732-d65bc937f952',
    alt: 'Multiple people writing notes at a long table',
  },
  {
    slug: 'the-60-day-rule-how-to-get-new-sdrs-to-quota-before-they-quit',
    photoId: '1557804506-669a67965ba0',
    alt: 'Team training session at a whiteboard with sticky notes',
  },
  {
    slug: 'the-4-2m-you-left-on-the-table-why-your-closed-lost-deals-are-actually-sleeping-',
    photoId: '1758519288372-045de3f65147',
    alt: 'Two professionals reviewing documents over coffee',
  },
  {
    slug: 'stop-using-generic-scripts-the-4-step-objection-handling-framework-that-lifted-o',
    photoId: '1758518727077-ffb66ffccced',
    alt: 'Three professionals in active discussion in a modern office',
  },
  {
    slug: 'the-4-2m-leak-why-your-first-revops-hire-must-fix-data-before-headcount',
    photoId: '1686061593213-98dad7c599b9',
    alt: 'Analytics dashboard close-up showing cohort and trend data',
  },
  {
    slug: 'the-23-revenue-leak-you-re-ignoring-how-to-resurrect-dead-deals',
    photoId: '1600880292203-757bb62b4baf',
    alt: 'Two colleagues celebrating a closed deal with a high-five at their desk',
  },
  {
    slug: 'stop-hiring-a-revops-team-until-you-fix-these-three-broken-gears',
    photoId: '1622675363311-3e1904dc1885',
    alt: 'Diverse team collaborating around a conference table covered in laptops',
  },
  {
    slug: 'stop-ignoring-your-dead-opportunities-how-we-revived-4-2m-in-lost-revenue-with-o',
    photoId: '1758691736484-4914d363a3cc',
    alt: 'Sales leader presenting a sales-value chart to colleagues',
  },
  {
    slug: 'stop-wasting-20-hours-a-week-the-real-way-to-connect-zoominfo-and-salesloft',
    photoId: '1766074903100-bc435aa4c60d',
    alt: 'Laptop showing a video conference alongside a spreadsheet',
  },
  {
    slug: 'stop-guessing-how-revenue-intelligence-platforms-slash-forecast-errors-by-40',
    photoId: '1762330470070-249e7c23c8c0',
    alt: 'AI assistant "ask anything" interface on a dark UI',
  },
  {
    slug: 'stop-showing-your-ceo-50-metrics-the-12-numbers-that-actually-drive-revenue-grow',
    photoId: '1763038311036-6d18805537e5',
    alt: 'Woman analyzing charts and graphs on a laptop',
  },
  {
    slug: 'stop-feeding-the-beast-how-i-cut-rep-admin-time-by-5-hours-weekly-without-breaki',
    photoId: '1542744095-fcf48d80b0fd',
    alt: 'Sales reps collaborating over a laptop in a meeting room',
  },
  {
    slug: 'the-87-failure-rate-why-your-sdrs-lose-deals-before-you-even-pitch',
    photoId: '1626863905121-3b0c0ed7b94c',
    alt: 'Sales rep on a headset call in a busy call center',
  },
  {
    slug: 'stop-guessing-how-we-turned-call-coaching-into-a-revenue-engine-using-gong-and-s',
    photoId: '1642177437932-75d846ad48f3',
    alt: 'Close-up of an audio mixing board lit in studio purple and red',
  },
  {
    slug: 'pipeline-velocity-the-8-week-bleed-killing-your-q4-revenue',
    photoId: '1704265586142-db3e17d0dea0',
    alt: 'Stopwatch on a black background',
  },
  {
    slug: 'stop-guessing-at-data-how-zoominfo-and-salesloft-automate-4-2m-in-lost-revenue',
    photoId: '1580983559367-0dc2f8934365',
    alt: 'Person using a laptop showing a sales analytics page',
  },
  {
    slug: 'stop-guessing-how-to-slash-forecast-variance-by-60-in-90-days',
    photoId: '1767424412548-1a1ac7f4b9bc',
    alt: 'Trading-style candlestick charts on a tablet and monitor',
  },
  {
    slug: 'lead-scoring-models-that-actually-work',
    photoId: '1758685734643-db77920292bc',
    alt: 'Professor writing complex mathematical equations on a chalkboard',
  },
  {
    slug: 'salesforce-revenue-analytics-implementation',
    photoId: '1759752394755-1241472b589d',
    alt: 'Hands typing on a MacBook showing a dark enterprise dashboard',
  },
  {
    slug: 'multi-touch-attribution-modeling-best-practices',
    photoId: '1586936893354-362ad6ae47ba',
    alt: 'Team mapping a customer journey with sticky notes on a wall',
  },
  {
    slug: 'advanced-customer-churn-analysis-python',
    photoId: '1573496528681-9b0f4fb0c660',
    alt: "O'Reilly Python book in shallow focus",
  },
  {
    slug: 'building-high-performance-sales-dashboards',
    photoId: '1686061592689-312bbfb5c055',
    alt: 'Analytics dashboard with sparkline charts and cohort grid',
  },
  {
    slug: 'complete-guide-revenue-operations-strategy',
    photoId: '1559526324-4b87b5e36e44',
    alt: 'Open MacBook on a clean desk',
  },
]

async function main() {
  let updated = 0
  let skipped = 0
  for (const { slug, photoId, alt } of UPDATES) {
    // Bump updatedAt: Drizzle has no $onUpdate hook on this column, so a
    // bare .set() leaves updatedAt stale. Sitemap.ts reads it into the
    // <lastmod> field, and Google only re-crawls when <lastmod> moves —
    // without this, the whole point of swapping the image is invisible
    // to Search Console. Same reason scripts/touch-blog-lastmod.ts exists.
    const result = await db
      .update(blogPosts)
      .set({ featuredImage: u(photoId), featuredImageAlt: alt, updatedAt: sql`NOW()` })
      .where(eq(blogPosts.slug, slug))
      .returning({ slug: blogPosts.slug, featuredImage: blogPosts.featuredImage })

    if (result.length === 0) {
      console.warn(`  ⚠ skipped (slug not found): ${slug}`)
      skipped++
    } else {
      console.log(`  ✓ ${slug}`)
      updated++
    }
  }

  console.log(`\nUpdated ${updated} blog posts (${skipped} not found).`)
  // Exit nonzero if any slug was missing — otherwise a typo or schema
  // drift hides behind a clean exit and the operator declares success.
  return skipped
}

main()
  .then((skipped) => process.exit(skipped > 0 ? 1 : 0))
  .catch((err) => {
    console.error('update-blog-featured-images failed:', err)
    process.exit(1)
  })
