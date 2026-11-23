import type { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  // Required for iOS Safari notch / safe-area handling. Lost when the raw
  // <meta name="viewport"> was dropped from layout.tsx; restored here.
  viewportFit: 'cover',
  // Light-only site; the CSS :root color-scheme matches.
  colorScheme: 'light',
  themeColor: '#ffffff',
}
