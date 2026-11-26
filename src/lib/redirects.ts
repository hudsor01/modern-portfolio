import handWritten from '@/data/redirects.json'
import retired from '@/data/blog-retired-slugs.json'
import renames from '@/data/blog-slug-renames.json'
import { buildRedirectTable } from './redirect-table.mjs'

/** Every redirect, built once. next.config.js builds the same table from the same JSON. */
export const REDIRECTS = buildRedirectTable({
  handWritten,
  renames: renames as Record<string, string>,
  retired: retired as Record<string, string>,
})

/** source -> destination, for single-hop lookups in the proxy. */
export const REDIRECT_MAP: ReadonlyMap<string, string> = new Map(
  REDIRECTS.map(({ source, destination }) => [source, destination])
)

const BLOG_PREFIX = '/blog/'

/** Blog slugs (no prefix) that redirect; the sitemap must not list them. */
export const REDIRECTED_BLOG_SLUGS: ReadonlySet<string> = new Set(
  REDIRECTS.filter(({ source }) => source.startsWith(BLOG_PREFIX)).map(({ source }) =>
    source.slice(BLOG_PREFIX.length)
  )
)
