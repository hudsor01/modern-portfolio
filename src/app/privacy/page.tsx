import Link from 'next/link'
import type { ReactNode } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { formatDate } from '@/lib/data-formatters'
import { generateMetadata as genMeta } from '@/app/shared-metadata'
import { PRIVACY_POLICY_LAST_UPDATED } from './policy-date'

// Statements on this page describe what the code does today, except the ones
// marked below as owner commitments: manual practices that no code enforces
// (currently only deleting contact emails from the owner's inbox). Keep those
// worded as commitments ("I delete ...") and never as automatic behaviour. When the
// contact flow (src/lib/email-service.ts, including contact storage in
// persistSubmission/buildContactSubmissionRow), the retention purge
// (src/app/api/cron/purge-contact-submissions/route.ts and its vercel.json
// schedule), analytics (src/app/layout.tsx) or Sentry config
// (instrumentation-client.ts, sentry.shared.ts) changes, update this page and
// PRIVACY_POLICY_LAST_UPDATED in the same change.

const PATH = '/privacy'
const CONTACT_EMAIL = 'hudsor01@icloud.com'

export const dynamic = 'force-static'

export const metadata = genMeta({
  title: 'Privacy Policy',
  description:
    'What richardwhudsonjr.com collects: contact messages (emailed, stored 24 months), cookie-free Vercel analytics and Sentry error reports. No cookies or ads.',
  path: PATH,
  ogTitle: 'Privacy Policy',
  subtitle: 'richardwhudsonjr.com',
})

const LAST_UPDATED_LABEL = formatDate(PRIVACY_POLICY_LAST_UPDATED, { month: 'long' })

// Global `p` styles set body copy to --font-size-base; list items match it.
const LIST_CLASS = 'list-disc pl-6 space-y-2 text-(length:--font-size-base)'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="mb-4">{title}</h2>
      <div className="space-y-4 text-muted-foreground leading-relaxed">{children}</div>
    </section>
  )
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-link">
      {children}
    </a>
  )
}

function Email() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className="text-link">
      {CONTACT_EMAIL}
    </a>
  )
}

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Privacy Policy', url: canonicalUrl(PATH) },
        ]}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <main
          id="main-content"
          tabIndex={-1}
          className="max-w-3xl mx-auto px-6 lg:px-8 pt-24 pb-20 lg:pt-32"
        >
          <header>
            <h1 className="mb-4">Privacy Policy</h1>
            <p>
              Last updated <time dateTime={PRIVACY_POLICY_LAST_UPDATED}>{LAST_UPDATED_LABEL}</time>
            </p>
            <p className="mt-6">
              This is my personal portfolio site. It collects very little: what you choose to send
              through the contact form, cookie-free visit statistics, and error reports when
              something breaks. Nothing is sold, and there is no advertising or cross-site tracking.
            </p>
          </header>

          <Section title="The contact form">
            <p>The form on the contact page asks for:</p>
            <ul className={LIST_CLASS}>
              <li>Your name, email address and message (required)</li>
              <li>A phone number (optional)</li>
              <li>
                A company name (optional). It is stored with your message but is not included in the
                emails.
              </li>
            </ul>
            <p>When you press Send, two emails go out through Resend, an email delivery service:</p>
            <ul className={LIST_CLASS}>
              <li>
                One to me, containing your name, email address, phone number (if given), your
                message and the time it was sent. Replying to it replies to you.
              </li>
              <li>
                An automatic confirmation to the address you entered, which quotes your message back
                to you.
              </li>
            </ul>
            <p>
              Each message you send is also stored in the site&apos;s database, hosted by Neon: your
              name, email address, company, phone number and message, plus whether the email to me
              was delivered. Your IP address and browser user agent are not stored with it. I use
              submissions only to reply to you, and I do not add you to any mailing list.
            </p>
            <p>
              To stop abuse, the server uses your IP address (and checks your browser&apos;s user
              agent for signs of automation) to limit the form to three messages an hour. That count
              is kept only in the server&apos;s memory, for a short time, and is never written to a
              database.
            </p>
          </Section>

          <Section title="Legal basis">
            <p>
              I handle what you send through the contact form on the basis of my legitimate interest
              in replying to messages you choose to send me (GDPR Article 6(1)(f)).
            </p>
          </Section>

          <Section title="Visit statistics">
            <p>
              The site uses{' '}
              <ExternalLink href="https://vercel.com/docs/analytics/privacy-policy">
                Vercel Web Analytics
              </ExternalLink>{' '}
              to count page views. Each page view records the page address, the referring site, an
              approximate location (country, region and city), and your browser, operating system
              and device type. It does not use cookies: according to Vercel, a visitor is recognized
              by a hash of the incoming request instead, and that visit record is discarded after 24
              hours, so visits cannot be tied to you over time.
            </p>
            <p>
              It also records a few anonymous actions: clicks on buttons and on project, article,
              tool and profile links (the email link is recorded as &ldquo;email&rdquo;, never the
              address); résumé downloads and previews; the first time you use a tool or start the
              contact form; a contact message that was sent successfully; and reaching the end of an
              article. Each action records only what was done, where on the page, and the page or
              link it led to. Nothing you type into a tool or the form is recorded.
            </p>
            <p>
              <ExternalLink href="https://vercel.com/docs/speed-insights/privacy-policy">
                Vercel Speed Insights
              </ExternalLink>{' '}
              records how fast pages load (Core Web Vitals), along with the page address and device
              type, so I can find slow pages.
            </p>
          </Section>

          <Section title="Error monitoring">
            <p>
              When something breaks, in your browser or on the server, an error report is sent to{' '}
              <ExternalLink href="https://sentry.io/privacy/">Sentry</ExternalLink>. A report
              describes the error, the page it happened on, and your browser and device type. Sentry
              also receives page-load performance timings and the site&apos;s own diagnostic log
              messages. The site configures Sentry not to collect cookies, user details, request
              bodies, or the request headers that carry IP addresses.
            </p>
            <p>
              Sentry Session Replay is on, but only for errors. Your browser keeps a short recording
              of the page layout and your clicks, scrolls and navigation, and sends it only if an
              error occurs. Recordings of visits without an error are never sent. In every
              recording, all text on the page and everything you type is masked, and images and
              media are blocked, so a replay shows the shape of the page, not its contents.
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              The site does not set cookies when you browse it. The analytics and error monitoring
              described above work without them.
            </p>
          </Section>

          <Section title="Hosting">
            <p>
              The site is hosted on{' '}
              <ExternalLink href="https://vercel.com/legal/privacy-notice">Vercel</ExternalLink>.
              Like any web host, Vercel processes your IP address and browser details in order to
              deliver pages to you.
            </p>
          </Section>

          <Section title="Processors">
            <p>These services process data on my behalf:</p>
            <ul className={LIST_CLASS}>
              <li>
                <ExternalLink href="https://resend.com/legal/privacy-policy">Resend</ExternalLink>:
                email delivery
              </li>
              <li>
                <ExternalLink href="https://www.databricks.com/legal/privacynotice">
                  Neon
                </ExternalLink>
                : database storage of contact submissions
              </li>
              <li>
                <ExternalLink href="https://vercel.com/legal/privacy-notice">Vercel</ExternalLink>:
                hosting and cookie-free analytics
              </li>
              <li>
                <ExternalLink href="https://sentry.io/privacy/">Sentry</ExternalLink>: error reports
              </li>
            </ul>
          </Section>

          <Section title="How long data is kept">
            <ul className={LIST_CLASS}>
              <li>
                Contact submissions stored in the site&apos;s database are deleted automatically
                once they are 24 months old. A deletion job runs daily.
              </li>
              <li>
                I delete contact emails from my inbox within 24 months. This is a manual practice.
              </li>
              <li>
                Resend, Neon, Vercel and Sentry keep their own records, including backups, for the
                periods set out in their own policies.
              </li>
              <li>Rate-limit counts exist only in server memory and disappear on their own.</li>
            </ul>
          </Section>

          <Section title="Your choices">
            <p>
              You can ask me to delete your contact form submission (the copy stored in the
              site&apos;s database and the emails in my inbox), or ask what I have, by writing to{' '}
              <Email />. I will respond within 30 days. If you prefer, you can skip the form and
              email me directly.
            </p>
          </Section>

          <Section title="Changes">
            <p>
              If what the site collects changes, this page will change with it, and the date at the
              top will be updated. Questions are welcome at <Email />.
            </p>
          </Section>

          <p className="mt-12">
            <Link href="/contact" className="text-link">
              Back to contact
            </Link>
          </p>
        </main>
      </div>
    </>
  )
}
