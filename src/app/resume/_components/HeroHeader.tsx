/**
 * HeroHeader Component
 * Hero section with profile image, action buttons, and social links
 */

import { RESUME_PDF_PATH } from '@/lib/resume-pdf'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileDown, Mail, Globe, Eye } from 'lucide-react'
import { Github, Linkedin } from '@/components/ui/brand-icons'
import { AvailabilityBadge } from '@/components/ui/availability-badge'
import { SITE_ORIGIN } from '@/lib/absolute-url'
import { CONTACT, mailtoHref, telHref } from '@/lib/contact-info'
import { headline } from '../data/constants'

const socials = [
  { label: 'Email', href: mailtoHref, external: false, Icon: Mail },
  {
    label: 'LinkedIn',
    href: CONTACT.linkedin.url,
    external: true,
    Icon: Linkedin,
  },
  { label: 'GitHub', href: CONTACT.github.url, external: true, Icon: Github },
  { label: 'Website', href: SITE_ORIGIN, external: true, Icon: Globe },
]

interface HeroHeaderProps {
  showPdf: boolean
  isDownloading: boolean
  onDownloadResume: () => void
  onToggleView: () => void
}

export function HeroHeader({
  showPdf,
  isDownloading,
  onDownloadResume,
  onToggleView,
}: HeroHeaderProps) {
  // Above-the-fold; no in-view opacity gate (browser audit found
  // a 2-6s flash because IntersectionObserver hadn't fired yet).
  return (
    <div className="text-center space-y-8 max-w-4xl mx-auto animate-fade-in-up print:text-left print:max-w-none print:mx-0 print:space-y-0 print:animate-none! print:border-b-2 print:border-accent print:pb-2.5">
      <AvailabilityBadge className="mx-auto print:hidden" />
      <h1 className="mb-8 print:mb-0 print:text-4xl print:leading-tight">
        <span className="block hero-name-gradient print:text-primary!">Richard Hudson</span>
      </h1>

      {/* A tagline, not a section heading: a <p> with the h2 look, so the page's
          sections (About, Experience, Education, ...) are its H2s. */}
      <p className="look-h2 mx-auto mb-6 text-lg print:mx-0 print:mt-0.5 print:mb-0 print:text-lg print:leading-snug">
        <span className="inline-flex items-center rounded-full bg-primary/10 border border-border px-5 py-2 text-primary font-medium print:inline print:rounded-none print:border-0 print:bg-transparent print:p-0 print:text-accent-text">
          {headline}
        </span>
      </p>

      {/* Print-only contact line (the résumé PDF is printed from this page). Hidden on
          screen, and never the last child, so the space-y rhythm above is unchanged. */}
      <p
        data-print-contact
        className="hidden print:mt-1 print:mb-0 print:block print:text-sm print:leading-normal print:text-muted-foreground"
      >
        <span className="print:text-foreground">{CONTACT.location.display}</span>
        {' | '}
        <a href={telHref} className="print:text-foreground">
          {CONTACT.phone.display}
        </a>
        {' | '}
        <a href={mailtoHref} className="print:text-foreground">
          {CONTACT.email}
        </a>
        {' | '}
        <a href={CONTACT.linkedin.url} className="print:text-foreground">
          {CONTACT.linkedin.display}
        </a>
      </p>

      {/* Actions: Download is primary, Preview secondary, Connect tertiary */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 pt-8 print:hidden">
        <Button
          size="lg"
          className="min-h-[44px] px-6 w-full sm:w-auto"
          data-track="Resume Download"
          data-track-location="resume-hero"
          data-track-target={RESUME_PDF_PATH}
          onClick={onDownloadResume}
          disabled={isDownloading}
        >
          <FileDown className="w-5 h-5" aria-hidden="true" />
          {isDownloading ? 'Downloading...' : 'Download PDF'}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="min-h-[44px] px-6 w-full sm:w-auto aria-pressed:bg-muted"
          aria-pressed={showPdf}
          data-track="Resume Preview"
          data-track-location="resume-hero"
          data-track-target={showPdf ? 'close' : 'open'}
          onClick={onToggleView}
        >
          <Eye className="w-5 h-5" aria-hidden="true" />
          Preview PDF
        </Button>
        <Button asChild variant="ghost" size="lg" className="min-h-[44px] px-6 w-full sm:w-auto">
          <Link data-track="CTA Click" data-track-location="resume-hero" href="/contact">
            <Mail className="w-5 h-5" aria-hidden="true" />
            Let's Connect
          </Link>
        </Button>
      </div>

      {/* Social links */}
      <div className="flex justify-center gap-2 pt-6 print:hidden">
        {socials.map(({ label, href, external, Icon }) => (
          <a
            key={label}
            data-track={href.startsWith('mailto:') ? 'Email Click' : 'Outbound Click'}
            data-track-location="resume-hero"
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
            aria-label={label}
          >
            <Icon className="h-6 w-6" aria-hidden="true" />
          </a>
        ))}
      </div>
    </div>
  )
}
