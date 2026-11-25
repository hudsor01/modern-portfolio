import Link from 'next/link'
import { ArrowRight, Calculator, ClipboardCheck, type LucideIcon } from 'lucide-react'
import type { ToolEntry, ToolIcon } from '@/data/tools'

const ICONS: Record<ToolIcon, LucideIcon> = { Calculator, ClipboardCheck }

export function ToolCard({ tool }: { tool: ToolEntry }) {
  const Icon = ICONS[tool.icon]
  return (
    <article className="group relative flex h-full flex-col bg-card border border-border rounded-2xl p-6 lg:p-7 shadow-sm transition-all duration-500 ease-out motion-reduce:transition-none hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 motion-reduce:hover:translate-y-0 focus-within:border-primary/40">
      {/* Decorative duplicate of the card link: it sits above the stretched overlay (z-10) so the
          tile stays a real hover target, and navigates so a click or tap on the icon opens the tool.
          Hidden from assistive tech and the tab order; the named "Open tool" link below is the one. */}
      <Link
        href={tool.href}
        data-slot="tool-icon"
        aria-hidden="true"
        tabIndex={-1}
        className="relative z-10 mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/8 text-primary"
      >
        <Icon className="size-5" aria-hidden="true" />
      </Link>
      <h2 className="mb-3 text-lg font-semibold">{tool.name}</h2>
      <p className="text-base mb-5">{tool.summary}</p>
      <dl className="mb-6 space-y-4 border-t border-border pt-4">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            You get
          </dt>
          <dd className="text-base text-foreground">{tool.outcome}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Takes
          </dt>
          <dd className="text-base text-foreground">{tool.effort}</dd>
        </div>
      </dl>
      <Link
        href={tool.href}
        aria-label={`Open tool: ${tool.name}`}
        className="mt-auto inline-flex min-h-[44px] items-center justify-center gap-1.5 self-start rounded-lg bg-primary px-4 py-2 text-base font-semibold text-primary-foreground shadow-sm transition-all duration-300 ease-out hover:bg-primary/95 hover:shadow-md after:absolute after:inset-0 after:content-['']"
      >
        Open tool
        <ArrowRight
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    </article>
  )
}
