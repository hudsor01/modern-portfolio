import Link from 'next/link'
import type { TrailItem } from '@/data/tools'

export function ToolBreadcrumb({ trail }: { trail: readonly TrailItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3">
      <ol className="flex flex-wrap items-center gap-x-2 text-base text-muted-foreground">
        {trail.flatMap((item, i) => {
          const isLast = i === trail.length - 1
          const nodes = []
          if (i > 0) {
            nodes.push(
              <li key={`sep-${item.path}`} aria-hidden="true">
                ›
              </li>
            )
          }
          nodes.push(
            isLast ? (
              <li key={item.path} aria-current="page">
                {item.name}
              </li>
            ) : (
              <li key={item.path}>
                <Link href={item.path} className="hover:text-primary">
                  {item.name}
                </Link>
              </li>
            )
          )
          return nodes
        })}
      </ol>
    </nav>
  )
}
