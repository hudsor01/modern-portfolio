import type { Route } from 'next'
import type { UrlObject } from 'url'
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
    return String(route.pathname)
  }
  return String(fallback)
}

/**
 * Convert all string paths in an array to Next.js Routes
 */
export function routeArray(paths: string[]): Route<string>[] {
  return paths.map(path => asRoute(path))
}

/**
 * Convert routes in a record to Next.js Routes
 */
export function routeRecord<T extends Record<string, string>>(routes: T): Record<keyof T, Route<string>> {
  const result: Record<string, Route<string>> = {}
  for (const key in routes) {
    result[key] = asRoute(routes[key])
  }
  return result as Record<keyof T, Route<string>>
}