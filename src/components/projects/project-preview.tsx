import { BarChart3 } from 'lucide-react'
import {
  buildProjectPreview,
  type PreviewRow,
  type PreviewSource,
  type ProjectPreviewModel,
  previewAriaLabel,
} from '@/lib/project-preview'

/**
 * Generated results preview for a project. Pure render: no hooks, no
 * randomness, so it is identical on server and client and safe inside the
 * client ProjectCard. The SVG holds shapes only; every word is HTML text so the
 * 12px floor holds at any width.
 */

type Size = 'card' | 'hero' | 'thumb'

interface ProjectPreviewProps {
  project: PreviewSource & { title: string }
  size: Size
  /** Pre-built model; pass it when the caller already needs it so it is built once. */
  model?: ProjectPreviewModel
  /** Id for the `role="img"` element, so a parent can reference its label with `aria-describedby`. */
  id?: string
}

/**
 * Hero fit budget. At 390px the frame is ~342px wide, so a 16:9 box is only
 * ~192px tall, but three paired rows need ~199px (3 x 45px rows + 2 x 16px gaps +
 * 32px padding). Below `md` the content therefore sizes the frame (in flow, with a
 * floor); from `md` (>= 672px wide, >= 378px tall, ample for the same content) it
 * fills a 16:9 box. Nothing can clip at any width.
 */
const HERO_CONTENT_CLASS =
  'relative flex flex-col justify-center gap-4 p-4 md:absolute md:inset-0 md:p-8'
const HERO_FRAME_CLASS =
  'relative min-h-40 overflow-hidden rounded-lg border bg-muted md:aspect-video md:min-h-0'

/** The generated-preview frame on the project detail hero. */
export function ProjectPreviewHero({ project }: { project: PreviewSource & { title: string } }) {
  return (
    <div data-slot="project-hero-frame" className={HERO_FRAME_CLASS}>
      <ProjectPreview size="hero" project={project} />
    </div>
  )
}

function LegendItems() {
  return (
    <>
      <span className="inline-flex items-center gap-1.5">
        <span className="size-2 bg-chart-4" />
        Before
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="size-2 bg-primary" />
        After
      </span>
    </>
  )
}

export function ProjectPreviewLegend({ variant }: { variant: 'card' | 'caption' }) {
  const className =
    variant === 'card'
      ? 'absolute top-3 right-12 flex items-center gap-3 text-xs text-muted-foreground'
      : 'mt-2 flex gap-4 text-xs text-muted-foreground'
  return (
    <div aria-hidden="true" data-slot="preview-legend" className={className}>
      <LegendItems />
    </div>
  )
}

function rowValue(row: PreviewRow): string {
  return row.kind === 'paired' ? `${row.before} → ${row.after}` : `${row.improvement} improvement`
}

function RowBars({ row, className }: { row: PreviewRow; className: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
      className={className}
    >
      {row.kind === 'paired' ? (
        <>
          <rect x={0} y={0} width={row.beforeWidth} height={4} className="fill-chart-4" />
          <rect x={0} y={6} width={row.afterWidth} height={4} className="fill-primary" />
        </>
      ) : (
        <rect x={0} y={3} width={row.width} height={4} className="fill-secondary" />
      )}
    </svg>
  )
}

function Thumb({ model }: { model: ProjectPreviewModel }) {
  if (model.kind === 'empty') {
    return (
      <div
        aria-hidden="true"
        data-slot="project-preview"
        data-size="thumb"
        data-kind="empty"
        className="absolute inset-0 p-2"
      />
    )
  }
  if (model.kind === 'metrics') {
    return (
      <div
        aria-hidden="true"
        data-slot="project-preview"
        data-size="thumb"
        data-kind="metrics"
        className="absolute inset-0 p-2"
      >
        <div className="flex h-full items-center justify-center">
          <BarChart3 aria-hidden="true" className="size-6 text-muted-foreground" />
        </div>
      </div>
    )
  }
  const heights = model.rows.map((r) => (r.kind === 'paired' ? 14 : 6))
  const total = heights.reduce((s, h) => s + h, 0) + 4 * (heights.length - 1)
  let y = (50 - total) / 2
  const groups = model.rows.map((r, i) => {
    const top = y
    y += (heights[i] as number) + 4
    return { r, top, key: `${r.metric}-${i}` }
  })
  return (
    <div
      aria-hidden="true"
      data-slot="project-preview"
      data-size="thumb"
      data-kind="rows"
      className="absolute inset-0 p-2"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 50 50"
        preserveAspectRatio="xMidYMid meet"
        className="size-full"
      >
        {groups.map(({ r, top, key }) =>
          r.kind === 'paired' ? (
            <g key={key}>
              <rect
                x={0}
                y={top}
                width={(r.beforeWidth / 100) * 50}
                height={6}
                className="fill-chart-4"
              />
              <rect
                x={0}
                y={top + 8}
                width={(r.afterWidth / 100) * 50}
                height={6}
                className="fill-primary"
              />
            </g>
          ) : (
            <g key={key}>
              <rect
                x={0}
                y={top}
                width={(r.width / 100) * 50}
                height={6}
                className="fill-secondary"
              />
            </g>
          )
        )}
      </svg>
    </div>
  )
}

export function ProjectPreview({ project, size, model: given, id }: ProjectPreviewProps) {
  const model = given ?? buildProjectPreview(project)

  if (size === 'thumb') return <Thumb model={model} />

  if (model.kind === 'empty') {
    return (
      <div
        aria-hidden="true"
        data-slot="project-preview"
        data-size={size}
        data-kind="empty"
        className="absolute inset-0"
      />
    )
  }

  const label = previewAriaLabel(model)
  const hero = size === 'hero'

  if (model.kind === 'metrics') {
    const grid = (
      <div data-slot="preview-metrics" className="grid grid-cols-3 gap-2">
        {model.items.map((item) => (
          <div key={`${item.label}-${item.value}`} className="flex min-w-0 flex-col gap-1">
            <span className="text-3xl font-semibold tracking-tight leading-tight tabular-nums text-foreground">
              {item.value}
            </span>
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    )
    return (
      <div
        id={id}
        role="img"
        aria-label={label}
        data-slot="project-preview"
        data-size={size}
        data-kind="metrics"
        className={
          hero
            ? HERO_CONTENT_CLASS
            : 'absolute inset-0 flex flex-col justify-center px-4 pt-12 pb-3'
        }
      >
        {hero ? <div className="mx-auto flex w-full max-w-xl flex-col gap-4">{grid}</div> : grid}
      </div>
    )
  }

  const rows = (
    <div data-slot="preview-rows" className={hero ? 'flex flex-col gap-4' : 'flex flex-col gap-3'}>
      {model.rows.map((row, i) => (
        <div key={`${row.metric}-${i}`} data-slot="preview-row" className="flex flex-col gap-1">
          <div
            className={
              hero
                ? 'flex items-baseline justify-between gap-2 text-base'
                : 'flex items-baseline justify-between gap-2 text-xs'
            }
          >
            <span className="min-w-0 truncate font-normal text-muted-foreground">{row.metric}</span>
            <span
              className={
                hero
                  ? 'shrink-0 text-lg font-semibold leading-snug tabular-nums text-foreground'
                  : 'shrink-0 font-semibold tabular-nums text-foreground'
              }
            >
              {rowValue(row)}
            </span>
          </div>
          <RowBars row={row} className={hero ? 'h-4 md:h-5 w-full' : 'h-4 w-full'} />
        </div>
      ))}
    </div>
  )

  return (
    <>
      {!hero && model.hasPaired ? <ProjectPreviewLegend variant="card" /> : null}
      <div
        id={id}
        role="img"
        aria-label={label}
        data-slot="project-preview"
        data-size={size}
        data-kind="rows"
        className={
          hero
            ? HERO_CONTENT_CLASS
            : 'absolute inset-0 flex flex-col justify-center px-4 pt-12 pb-3'
        }
      >
        {hero ? <div className="mx-auto flex w-full max-w-xl flex-col gap-4">{rows}</div> : rows}
      </div>
    </>
  )
}
