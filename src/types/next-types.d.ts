import type { ComponentProps } from 'react'

declare module 'next/link' {
  export default function Link(props: ComponentProps<'a'>): JSX.Element
}

// Add NextLinkHref type for use with navigation links
import type { Route } from 'next'
export type NextLinkHref = Route<string>

declare global {
  // Add route types
  interface ProjectPageProps {
    params: {
      slug: string
    }
    searchParams?: Record<string, string | string[] | undefined>
  }
}
