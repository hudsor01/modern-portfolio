import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { FAQPageJsonLd } from '@/components/seo/json-ld/faq-json-ld'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'
import { RevOpsMaturityScorecard } from './_components/revops-maturity-scorecard'

const PATH = '/tools/revops-maturity-scorecard'
const TITLE = 'RevOps Maturity Scorecard — Score Your Revenue Operations (Free, No Email)'
const DESCRIPTION =
  'Free RevOps maturity assessment. Score your revenue operations across process, data, technology, and alignment in two minutes — get your maturity level, percentile, and the single highest-ROI next move. No email required.'

const FAQS: Array<{ question: string; answer: string }> = [
  {
    question: 'What is RevOps maturity?',
    answer:
      'RevOps maturity is how systematic and repeatable your revenue engine is across four pillars: process (documented, followed motions), data (clean and trusted), technology (an integrated, right-sized stack), and alignment (Sales, Marketing, and CS on one number). Higher maturity means more predictable revenue and less reliance on heroics.',
  },
  {
    question: 'What are the levels of revenue operations maturity?',
    answer:
      'This scorecard uses five levels: 1 Ad-hoc (heroics and spreadsheets), 2 Emerging (inconsistent process), 3 Defined (documented and mostly followed), 4 Managed (process, data, and tools reinforce each other), and 5 Optimized (a strategic, automated, aligned engine). Most B2B teams land between Emerging and Defined.',
  },
  {
    question: 'How do I assess my RevOps maturity?',
    answer:
      'Rate your team honestly on 16 statements across the four pillars. The scorecard averages each pillar, rolls them into an overall level, shows your weakest pillar, and gives you the single highest-ROI next move. It takes about two minutes and requires no email.',
  },
  {
    question: 'What is the most common RevOps maturity mistake?',
    answer:
      'Buying technology that is more mature than your data and process can support — automating a broken process just produces broken outputs faster, and AI or attribution tools inherit whatever quality your CRM data already has. The scorecard flags this "tools you can\'t feed" gap when your technology score outruns your data or process score.',
  },
  {
    question: 'What is the average RevOps maturity level?',
    answer:
      'Published B2B benchmarks put the median team around level 2.4 of 5 — Emerging to Defined — and only roughly 7% of teams operate at level 5. Your percentile in the scorecard is a directional estimate against those benchmarks, not an audited sample.',
  },
  {
    question: 'Why is the scorecard free with no email gate?',
    answer:
      'A maturity score is only useful if you can act on it immediately. Gating the result behind a form adds friction and tempts inflated benchmarks. This one runs entirely in your browser, shows your result instantly, and never asks for an email.',
  },
]

export const metadata = genMeta({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  ogTitle: 'RevOps Maturity Scorecard',
  subtitle: 'Score your revenue operations in 2 minutes',
  ogAlt: 'RevOps Maturity Scorecard',
  keywords: [
    'revops maturity',
    'revops maturity model',
    'revops maturity assessment',
    'revenue operations maturity model',
    'revenue operations maturity assessment',
    'revops maturity scorecard',
    'how mature is my revops',
  ],
})

export default function RevOpsMaturityScorecardPage() {
  return (
    <>
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'RevOps Maturity Scorecard', url: canonicalUrl(PATH) },
        ]}
      />
      <FAQPageJsonLd faqs={FAQS} />

      <div className="min-h-screen bg-background">
        <Navbar />
        <main id="main-content" className="max-w-6xl mx-auto px-6 lg:px-8 pt-24 pb-20 lg:pt-32">
          <header className="mb-10 max-w-3xl">
            <p className="text-sm text-muted-foreground mb-3">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>{' '}
              / RevOps Maturity Scorecard
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
              RevOps Maturity Scorecard
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Where does your revenue engine actually stand? Rate your team across the four pillars
              that drive RevOps maturity — <strong>process, data, technology, and alignment</strong>{' '}
              — and get your maturity level, your percentile, and the single highest-ROI move to
              make next. Two minutes, no email.
            </p>
          </header>

          <RevOpsMaturityScorecard />

          <section className="mt-16 max-w-3xl">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Why your weakest pillar is your ceiling
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                RevOps maturity isn’t an average you can buy your way out of — it’s gated by your
                weakest pillar. A best-in-class tech stack sitting on dirty CRM data produces
                confident, automated, wrong answers. That’s why the scorecard points you at the
                lowest-scoring pillar instead of the one that’s most fun to improve.
              </p>
              <p>
                The most expensive mistake is buying <strong>technology</strong> more mature than
                your <strong>data</strong> and <strong>process</strong> can support. Automating a
                broken process just makes broken outputs faster; AI and attribution tools inherit
                whatever quality your data already has. The scorecard flags this “tools you can’t
                feed” gap when it sees it.
              </p>
              <p>
                The honest order of operations is almost always the same: document the process,
                clean the data, then let technology automate what’s now repeatable — with alignment
                making sure every team is optimizing the same revenue number.
              </p>
            </div>
          </section>

          <section className="mt-12 max-w-3xl">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Frequently asked questions
            </h2>
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
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Related reading &amp; tools
            </h2>
            <ul className="space-y-2 text-primary">
              <li>
                <Link href="/tools/pipeline-coverage-calculator" className="hover:underline">
                  Pipeline Coverage Calculator — how much pipeline you really need
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/complete-guide-revenue-operations-strategy"
                  className="hover:underline"
                >
                  The complete guide to revenue operations strategy
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/stop-guessing-how-we-slashed-forecast-variance-by-34-in-90-days"
                  className="hover:underline"
                >
                  How we slashed forecast variance by 34% in 90 days
                </Link>
              </li>
              <li>
                <Link href="/projects/revenue-operations-center" className="hover:underline">
                  Case study: Revenue Operations Command Center
                </Link>
              </li>
            </ul>
          </section>
        </main>
      </div>
    </>
  )
}
