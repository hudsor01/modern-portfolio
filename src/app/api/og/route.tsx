import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import { OG_CARD_BACKGROUND } from '@/lib/og-card'
import { type ShowcaseProject, showcaseProjects } from '@/data/projects'
import { buildProjectPreview } from '@/lib/project-preview'

// No `runtime = 'edge'` declaration — Fluid Compute (Node.js) is the current
// Vercel default and runs next/og ImageResponse natively. Edge runtime also
// triggered a "disables static generation" build warning on this dynamic
// route, which was load-bearing (query params mean it can't be static anyway).

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  // Extract and validate query params
  let title = searchParams.get('title') || 'Richard Hudson | Revenue Operations'
  let subtitle = searchParams.get('subtitle') || ''
  let category = searchParams.get('category') || ''

  // Input validation: truncate to max lengths (T-06-03 DoS mitigation)
  title = title.slice(0, 120)
  subtitle = subtitle.slice(0, 80)
  category = category.slice(0, 40)

  // Project result card. The slug is allow-listed, then matched exactly against
  // the catalog; anything else falls through to the standard card below. The
  // raw `project` value, `title` and `subtitle` are never drawn on this card.
  const projectParam = searchParams.get('project') ?? ''
  if (/^[a-z0-9-]{1,100}$/.test(projectParam)) {
    const project = showcaseProjects.find((p) => p.slug === projectParam)
    if (project) {
      return new ImageResponse(
        // The catalog is the only source of copy on a project card: a crafted
        // `title`/`subtitle` must not put attacker text next to a genuine
        // results panel and footer.
        projectOgCard({ project, title: project.title, subtitle: project.description }),
        {
          width: 1200,
          height: 630,
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=86400',
          },
        }
      )
    }
  }

  // Blog-card cover (`variant=card`): drawn at the 16:10 frame of a /blog card, in
  // type sized for a ~340px-wide thumbnail. The default card below is built for
  // 1200px social shares and shrinks to ~8px text in a card, so it stays as it is
  // and this is a separate layout. Social-share URLs never carry `variant`.
  if (searchParams.get('variant') === 'card') {
    return new ImageResponse(blogCoverCard({ title, category }), {
      width: COVER_WIDTH_PX,
      height: COVER_HEIGHT_PX,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=86400',
      },
    })
  }

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '1200px',
        height: '630px',
        backgroundColor: OG_CARD_BACKGROUND,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
      }}
    >
      {/* Top accent bar — solid primary (palette rule: no gradients). */}
      <div
        style={{
          width: '1200px',
          height: '8px',
          backgroundColor: '#1a1a2e',
          flexShrink: 0,
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '60px',
          justifyContent: 'center',
        }}
      >
        {/* Category badge */}
        {category && (
          <div
            style={{
              display: 'flex',
              marginBottom: '20px',
            }}
          >
            <span
              style={{
                fontSize: '18px',
                fontWeight: 600,
                // Accent/bronze approximating --color-accent (oklch 0.55 0.12 55)
                color: '#a66a30',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {category}
            </span>
          </div>
        )}

        {/* Title */}
        <div
          style={{
            fontSize: '48px',
            fontWeight: 700,
            color: '#1a1a2e',
            lineHeight: 1.2,
            marginBottom: '20px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              fontSize: '24px',
              fontWeight: 400,
              color: '#6b7280',
              marginBottom: '24px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {subtitle}
          </div>
        )}

        {/* Author line */}
        <div
          style={{
            fontSize: '28px',
            fontWeight: 600,
            color: '#374151',
            marginTop: 'auto',
          }}
        >
          Richard Hudson
        </div>

        {/* Domain footer */}
        <div
          style={{
            fontSize: '20px',
            fontWeight: 400,
            color: '#9ca3af',
            marginTop: '8px',
          }}
        >
          richardwhudsonjr.com
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=86400',
      },
    }
  )
}

// Results panel box (border-box): the bar track is what is left of the width after
// padding and border, and a bar at 100% fills it exactly.
const PANEL_WIDTH_PX = 440
const PANEL_PADDING_PX = 32
const PANEL_BORDER_PX = 1
const PANEL_BAR_SCALE = (PANEL_WIDTH_PX - 2 * PANEL_PADDING_PX - 2 * PANEL_BORDER_PX) / 100

function projectOgCard({
  project,
  title,
  subtitle,
}: {
  project: ShowcaseProject
  title: string
  subtitle: string
}) {
  const model = buildProjectPreview(project)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '1200px',
        height: '630px',
        backgroundColor: OG_CARD_BACKGROUND,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ width: '1200px', height: '8px', backgroundColor: '#1a1a2e', flexShrink: 0 }} />
      <div style={{ display: 'flex', flexDirection: 'row', flex: 1, padding: '60px', gap: '60px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '580px' }}>
          <div
            style={{
              display: 'block',
              fontSize: '20px',
              fontWeight: 600,
              color: '#8f4700',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '20px',
            }}
          >
            {project.client}
          </div>
          <div
            style={{
              display: 'block',
              fontSize: '48px',
              fontWeight: 700,
              color: '#1a1a2e',
              lineHeight: 1.2,
              lineClamp: 3,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'block',
              fontSize: '24px',
              fontWeight: 400,
              color: '#6b7280',
              marginTop: '20px',
              lineClamp: 2,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {subtitle}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto' }}>
            <div style={{ fontSize: '28px', fontWeight: 600, color: '#374151' }}>
              Richard Hudson
            </div>
            <div style={{ fontSize: '20px', fontWeight: 400, color: '#6b7280', marginTop: '8px' }}>
              richardwhudsonjr.com
            </div>
          </div>
        </div>
        {model.kind !== 'empty' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignSelf: 'center',
              width: `${PANEL_WIDTH_PX}px`,
              backgroundColor: '#fcfdff',
              border: `${PANEL_BORDER_PX}px solid #d5d8db`,
              borderRadius: '16px',
              padding: `${PANEL_PADDING_PX}px`,
              gap: '24px',
            }}
          >
            {model.kind === 'rows' && model.hasPaired && (
              <div
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}
              >
                <div style={{ width: '12px', height: '12px', backgroundColor: '#5b646f' }} />
                <div style={{ fontSize: '18px', color: '#4d5660', marginRight: '16px' }}>
                  Before
                </div>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#003b75' }} />
                <div style={{ fontSize: '18px', color: '#4d5660' }}>After</div>
              </div>
            )}
            {model.kind === 'rows' &&
              model.rows.map((row) => (
                <div key={row.metric} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div
                    style={{
                      display: 'block',
                      fontSize: '20px',
                      color: '#4d5660',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {row.metric}
                  </div>
                  <div style={{ fontSize: '28px', color: '#1a1a2e', marginTop: '4px' }}>
                    {row.kind === 'paired'
                      ? `${row.before} → ${row.after}`
                      : `${row.improvement} improvement`}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', marginTop: '8px' }}>
                    {row.kind === 'paired' ? (
                      [
                        <div
                          key="before"
                          style={{
                            height: '12px',
                            borderRadius: '6px',
                            backgroundColor: '#5b646f',
                            width: `${Math.round(row.beforeWidth * PANEL_BAR_SCALE)}px`,
                          }}
                        />,
                        <div
                          key="after"
                          style={{
                            height: '12px',
                            borderRadius: '6px',
                            marginTop: '4px',
                            backgroundColor: '#003b75',
                            width: `${Math.round(row.afterWidth * PANEL_BAR_SCALE)}px`,
                          }}
                        />,
                      ]
                    ) : (
                      <div
                        style={{
                          height: '12px',
                          borderRadius: '6px',
                          backgroundColor: '#2c6330',
                          width: `${Math.round(row.width * PANEL_BAR_SCALE)}px`,
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            {model.kind === 'metrics' &&
              model.items.map((item) => (
                <div key={item.label} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '44px', color: '#1a1a2e' }}>{item.value}</div>
                  <div style={{ fontSize: '20px', color: '#4d5660' }}>{item.label}</div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

// 16:10, the aspect of the /blog card cover frame, so object-contain leaves no bars.
const COVER_WIDTH_PX = 1200
const COVER_HEIGHT_PX = 750

function blogCoverCard({ title, category }: { title: string; category: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: `${COVER_WIDTH_PX}px`,
        height: `${COVER_HEIGHT_PX}px`,
        backgroundColor: OG_CARD_BACKGROUND,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          width: `${COVER_WIDTH_PX}px`,
          height: '16px',
          backgroundColor: '#1a1a2e',
          flexShrink: 0,
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '64px',
          justifyContent: 'center',
        }}
      >
        {category && (
          <div
            style={{
              display: 'block',
              fontSize: '48px',
              fontWeight: 700,
              color: '#8f4700',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '32px',
            }}
          >
            {category}
          </div>
        )}
        <div
          style={{
            display: '-webkit-box',
            fontSize: '96px',
            fontWeight: 700,
            color: '#1a1a2e',
            lineHeight: 1.12,
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '48px',
            fontWeight: 600,
            color: '#374151',
            marginTop: 'auto',
          }}
        >
          Richard Hudson
        </div>
      </div>
    </div>
  )
}
