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
  // raw `project` value is never drawn.
  const projectParam = searchParams.get('project') ?? ''
  if (/^[a-z0-9-]{1,100}$/.test(projectParam)) {
    const project = showcaseProjects.find((p) => p.slug === projectParam)
    if (project) {
      return new ImageResponse(
        projectOgCard({
          project,
          title: searchParams.get('title') ? title : project.title,
          subtitle: searchParams.get('subtitle') ? subtitle : project.description,
        }),
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

const PANEL_BAR_SCALE = 3.76

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
              width: '440px',
              backgroundColor: '#fcfdff',
              border: '1px solid #d5d8db',
              borderRadius: '16px',
              padding: '32px',
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
