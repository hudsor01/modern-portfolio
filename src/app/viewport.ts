import type { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  // Required for iOS Safari notch / safe-area handling. Lost when the raw
  // <meta name="viewport"> was dropped from layout.tsx; restored here.
  viewportFit: 'cover',
  // Site supports both — browsers pick the matching themeColor below.
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}
