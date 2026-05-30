import Link from 'next/link'

// Sitewide internal-link surface. Every page (including the handful Google has
// actually indexed) renders this footer, so these links create crawl paths +
// distribute what little authority the site has down into the category hubs
// and cornerstone posts — directly targeting the "Discovered – currently not
// indexed" backlog. Curated to GSC-confirmed-live URLs only (no 404 risk).
const FOOTER_SECTIONS: ReadonlyArray<{
  heading: string
  links: ReadonlyArray<{ label: string; href: string }>
}> = [
  {
    heading: 'Explore',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Projects', href: '/projects' },
      { label: 'Résumé', href: '/resume' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Revenue Operations',
    links: [
      { label: 'All articles', href: '/blog' },
      { label: 'RevOps insights', href: '/blog/category/revenue-operations' },
    ],
  },
  {
    heading: 'Popular guides',
    links: [
      {
        label: 'Lead scoring models that work',
        href: '/blog/lead-scoring-models-that-actually-work',
      },
      {
        label: 'Multi-touch attribution',
        href: '/blog/multi-touch-attribution-modeling-best-practices',
      },
      {
        label: 'Revenue intelligence platforms',
        href: '/blog/stop-guessing-how-revenue-intelligence-platforms-slash-forecast-errors-by-40',
      },
      {
        label: 'Customer churn analysis (Python)',
        href: '/blog/advanced-customer-churn-analysis-python',
      },
    ],
  },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand / intro column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-display text-lg font-semibold text-foreground">
              Richard Hudson
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Revenue Operations — forecasting, pipeline, and GTM analytics for B2B SaaS.
            </p>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <nav key={section.heading} aria-label={section.heading}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {section.heading}
              </h2>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-muted-foreground">
          <p>© {currentYear} Richard Hudson. All rights reserved.</p>
          <a
            href="https://hudsondigitalsolutions.com"
            target="_blank"
            // Intentionally `noopener` only (not `noreferrer`): this is an owned
            // cross-promotion link to the business site, and keeping the Referer
            // header lets Hudson Digital Solutions' analytics attribute the
            // referral traffic from here. `noopener` still closes the
            // window.opener security hole.
            rel="noopener"
            className="hover:text-primary transition-colors"
          >
            Built by Hudson Digital Solutions
          </a>
        </div>
      </div>
    </footer>
  )
}
