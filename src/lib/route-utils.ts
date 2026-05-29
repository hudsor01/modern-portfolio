import type { Route } from 'next'
import type { NextLinkHref } from '@/types/next-types'

/**
 * Safely converts a string to a Next.js Route type
 */
export function asRoute(path: string): Route<string> {
  return path as Route<string>
}

/**
 * Safely gets a stable key for route objects in lists
 */
export function getRouteKey(route: NextLinkHref, fallback: string | number): string {
  if (typeof route === 'string') {
    return route
  }
  if (typeof route === 'object' && route !== null && 'pathname' in route) {
    return String((route as { pathname: string }).pathname)
  }
  return String(fallback)
}
