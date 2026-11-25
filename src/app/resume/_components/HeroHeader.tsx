/**
 * HeroHeader Component
 * Hero section with profile image, action buttons, and social links
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileDown, Mail, Globe, Eye } from 'lucide-react'
import { Github, Linkedin } from '@/components/ui/brand-icons'
import { AvailabilityBadge } from '@/components/ui/availability-badge'

const socials = [
  { label: 'Email', href: 'mailto:hudsor01@icloud.com', external: false, Icon: Mail },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/hudsor01',
    external: true,
    Icon: Linkedin,
  },
  { label: 'GitHub', href: 'https://github.com/hudsor01', external: true, Icon: Github },
  { label: 'Website', href: 'https://richardwhudsonjr.com', external: true, Icon: Globe },
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
    <div className="text-center space-y-8 max-w-4xl mx-auto animate-fade-in-up">
      <AvailabilityBadge className="mx-auto" />
      <h1 className="mb-8">
        <span className="block hero-name-gradient">Richard Hudson</span>
      </h1>

      <h2 className="mx-auto mb-6 text-lg">
        <span className="inline-flex items-center rounded-full bg-primary/10 border border-border px-5 py-2 text-primary font-medium">
          Revenue Operations Professional
        </span>
      </h2>

      {/* Actions: Download is primary, Preview secondary, Connect tertiary */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 pt-8">
        <Button
          size="lg"
          className="min-h-[44px] px-6 w-full sm:w-auto"
          data-track="Resume Download"
          data-track-location="resume-hero"
          data-track-target="/Richard_Hudson_Revenue_Operations.pdf"
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
      <div className="flex justify-center gap-2 pt-6">
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
