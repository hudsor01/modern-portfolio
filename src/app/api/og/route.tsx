import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

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

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          backgroundColor: '#fafafa',
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
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=86400',
      },
    }
  )
}
