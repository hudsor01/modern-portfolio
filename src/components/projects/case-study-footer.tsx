'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { showcaseProjects, type ShowcaseProject } from '@/data/projects'

const RELATED_COUNT = 3

/**
 * Up to three other case studies: same category first, then the rest, each in
 * catalog order so the choice is deterministic (no render-to-render shuffle).
 */
export function relatedCaseStudies(slug: string | undefined): ShowcaseProject[] {
  const current = showcaseProjects.find((p) => p.slug === slug)
  const others = showcaseProjects.filter((p) => p.slug !== slug)
  const sameCategory = current ? others.filter((p) => p.category === current.category) : []
  const rest = others.filter((p) => !sameCategory.includes(p))
  return [...sameCategory, ...rest].slice(0, RELATED_COUNT)
}

/**
 * Closing block for every case-study page (rendered by ProjectPageLayout):
 * links to related case studies plus a contact CTA. Case studies otherwise
 * linked only to the nav and footer, which left each one an internal-linking
 * dead end. Titles and client descriptors only; no figures, so the copy needs
 * no write-up sourcing.
 */
export function CaseStudyFooter() {
  const pathname = usePathname()
  const slug = pathname?.startsWith('/projects/') ? pathname.split('/')[2] : undefined
  const related = relatedCaseStudies(slug)
  if (related.length === 0) return null

  return (
    <section
      aria-labelledby="more-case-studies"
      data-testid="case-study-footer"
      className="mt-16 border-t border-border pt-12"
    >
      <h2 id="more-case-studies" className="mb-6">
        More case studies
      </h2>
      <ul className="grid gap-4 md:grid-cols-3">
        {related.map((project) => (
          <li key={project.slug}>
            <Link
              data-track="Project Click"
              data-track-location="case-study-related"
              href={`/projects/${project.slug}`}
              className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {project.client}
              </span>
              <span className="mt-2 font-semibold text-foreground group-hover:text-primary">
                {project.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          data-track="CTA Click"
          data-track-location="case-study-cta"
          href="/contact"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/95"
        >
          Start a conversation
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <Link
          data-track="CTA Click"
          data-track-location="case-study-cta"
          href="/projects"
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg px-5 py-2 text-base font-semibold text-link"
        >
          All case studies
        </Link>
      </div>
    </section>
  )
}
