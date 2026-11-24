import Link from 'next/link'
import type { TrailItem } from '@/data/tools'

/**
 * Separators are CSS pseudo-elements, not list items, so the <ol> holds exactly one <li>
 * per trail entry (matching the BreadcrumbList JSON-LD). `content: '›' / ''` gives the glyph
 * an empty alternative text so assistive tech does not announce it. Trail links use the
 * `text-link` underline so they read as links without hovering.
 */
const SEPARATOR = "not-first:before:mr-2 not-first:before:[content:'›'_/_'']"

export function ToolBreadcrumb({ trail }: { trail: readonly TrailItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3">
      <ol className="flex flex-wrap items-center gap-x-2 text-base text-muted-foreground">
        {trail.map((item, i) => {
          const isLast = i === trail.length - 1
          return isLast ? (
            <li key={item.path} aria-current="page" className={SEPARATOR}>
              {item.name}
            </li>
          ) : (
            <li key={item.path} className={SEPARATOR}>
              <Link href={item.path} className="text-link">
                {item.name}
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
