import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { FAQPageJsonLd } from '@/components/seo/json-ld/faq-json-ld'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import { ToolBreadcrumb } from '@/components/tools/tool-breadcrumb'
import { getTool, toolTrail, trailJsonLdItems } from '@/data/tools'
import { generateMetadata as genMeta } from '@/app/shared-metadata'
import { PipelineCoverageCalculator } from './_components/pipeline-coverage-calculator'

const TOOL = getTool('pipeline-coverage-calculator')
const TRAIL = toolTrail(TOOL)
const PATH = TOOL.href
const TITLE = 'Pipeline Coverage Calculator: Win-Rate-Driven, Not the 3× Rule'
const DESCRIPTION =
  'Free pipeline coverage calculator. Enter your win rate and revenue target to get the exact coverage ratio and qualified pipeline you actually need — driven by win rate, not the generic 3× rule.'

const FAQS: Array<{ question: string; answer: string }> = [
  {
    question: 'What is pipeline coverage?',
    answer:
      'Pipeline coverage is the ratio of open pipeline value to your revenue target for the period. A 4× coverage means you have four dollars of open pipeline for every dollar of quota. It tells you whether you have enough pipeline to realistically hit the number.',
  },
  {
    question: 'What is a good pipeline coverage ratio?',
    answer:
      'It depends entirely on your win rate: required coverage ≈ 1 ÷ win rate. A team that wins 25% of qualified opportunities needs about 4× coverage; at a 40% win rate you need ~2.5×; at 15% you need ~6.7×. The flat “3× rule” only happens to fit a ~33% win rate.',
  },
  {
    question: 'How do I calculate the pipeline I need to hit quota?',
    answer:
      'Required pipeline = revenue target ÷ win rate, optionally multiplied by a safety margin for slippage and timing. For a $1M target at a 25% win rate, you need $1,000,000 ÷ 0.25 = $4,000,000 of qualified pipeline.',
  },
  {
    question: 'Why is the 3× pipeline rule misleading?',
    answer:
      'Because it ignores win rate. Teams with a low win rate badly under-build pipeline if they trust 3×, and high-win-rate teams waste reps’ time over-building. Coverage should be derived from your actual win rate, not a one-size-fits-all constant.',
  },
  {
    question: 'Should I count all of my open pipeline?',
    answer:
      'No. Strip out stalled and zombie deals first — opportunities with no recent activity, no compelling event, or a long-past close date. Coverage should be measured against genuinely qualified pipeline, which is why this calculator includes a “% truly qualified” haircut.',
  },
]

export const metadata = genMeta({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  ogTitle: 'Pipeline Coverage Calculator',
  subtitle: 'Win-rate-driven, not the 3× rule',
  ogAlt: 'Pipeline Coverage Calculator',
  keywords: [
    'pipeline coverage calculator',
    'pipeline coverage ratio',
    'how much pipeline do I need',
    'sales pipeline coverage',
    'required pipeline coverage',
    'win rate coverage ratio',
  ],
})

export default function PipelineCoverageCalculatorPage() {
  return (
    <>
      <BreadcrumbListJsonLd items={trailJsonLdItems(TRAIL)} />
      <FAQPageJsonLd faqs={FAQS} />

      <div className="min-h-screen bg-background">
        <Navbar />
        <main
          id="main-content"
          tabIndex={-1}
          className="max-w-5xl mx-auto px-6 lg:px-8 pt-24 pb-20 lg:pt-32"
        >
          <header className="mb-10">
            <ToolBreadcrumb trail={TRAIL} />
            <h1 className="mb-4">Pipeline Coverage Calculator</h1>
            <p className="max-w-3xl">
              How much pipeline do you actually need to hit your number? Not 3× — that’s a guess.
              The honest answer is driven by your <strong>win rate</strong>. Enter yours below to
              get the coverage ratio and qualified pipeline you really need.
            </p>
          </header>

          <PipelineCoverageCalculator />

          <section className="mt-16 max-w-3xl">
            <h2 className="mb-4">Why the “3× pipeline” rule is wrong for most teams</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The 3× rule is everywhere because it’s easy to remember — but it’s only correct for
                a team winning roughly one in three qualified opportunities. The real relationship
                is simple: <strong>required coverage ≈ 1 ÷ win rate.</strong>
              </p>
              <p>
                If you win <strong>15%</strong> of opps, 3× coverage leaves you ~55% short of the
                pipeline you need — you’ll miss quota while believing you’re covered. If you win{' '}
                <strong>40%</strong>, 3× has your reps chasing 17% more pipeline than necessary,
                burning capacity that should go into working live deals.
              </p>
              <p>
                Coverage also only counts pipeline that can actually close. Stalled deals, no
                compelling event, close dates three quarters in the past — strip them out with the
                “% truly qualified” control, because covered-on-paper isn’t covered.
              </p>
            </div>
          </section>

          <section className="mt-12 max-w-3xl">
            <h2 className="mb-6">Frequently asked questions</h2>
            <dl className="space-y-6">
              {FAQS.map((faq) => (
                <div key={faq.question}>
                  <dt className="font-semibold text-foreground">{faq.question}</dt>
                  <dd className="mt-1 text-muted-foreground leading-relaxed">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-12 pt-8 border-t border-border max-w-3xl">
            <h2 className="mb-4">Related reading</h2>
            <ul className="space-y-2 text-primary">
              <li>
                <Link
                  href="/blog/stop-guessing-how-to-cut-sales-forecast-variance"
                  className="hover:underline"
                >
                  How we slashed forecast variance by 34% in 90 days
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/lead-scoring-models-that-actually-work"
                  className="hover:underline"
                >
                  Lead scoring models that actually work
                </Link>
              </li>
              <li>
                <Link href="/projects/forecast-pipeline-intelligence" className="hover:underline">
                  Case study: Forecast &amp; Pipeline Intelligence
                </Link>
              </li>
              <li>
                <Link href="/projects/deal-funnel" className="hover:underline">
                  Case study: Deal Funnel optimization
                </Link>
              </li>
            </ul>
          </section>
        </main>
      </div>
    </>
  )
}
