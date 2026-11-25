import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

// Post/Redirect/Get target for the progressive (no-JS / pre-hydration) contact
// form: on success `submitContactFormAction` answers with a 303 to this page, so a
// refresh or Back/Forward re-requests it with a GET and can never resend the
// message. The hydrated form shows its own success banner and never comes here.
// Static, noindex, and deliberately absent from the sitemap.

const PATH = '/contact/sent'

export const dynamic = 'force-static'

export const metadata = genMeta({
  title: 'Message Sent',
  description: 'Thanks for getting in touch. Your message reached Richard Hudson.',
  path: PATH,
  additional: { robots: { index: false, follow: true } },
})

export default function ContactSentPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-[70vh] grid place-items-center px-6 pt-24 pb-20 lg:pt-32"
      >
        <div className="text-center max-w-md">
          <CheckCircle className="mx-auto mb-6 h-12 w-12 text-success" aria-hidden="true" />
          <h1 className="mb-4">Message sent</h1>
          <p className="mb-8">
            Thanks for reaching out. Your message is on its way, and I&apos;ll get back to you soon.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link data-track="CTA Click" data-track-location="contact-sent" href="/">
                Back to home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link data-track="CTA Click" data-track-location="contact-sent" href="/contact">
                Back to contact
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
