# Project Information

## Commands

- Build: `npm run build`
- Development server: `npm run dev`
- Type checking: `npm run typecheck`
- Linting: `npm run lint`

## Next.js 15 Route Types Fix

To fix TypeScript errors with Link components, use these patterns:

```tsx
// Import the helper types and functions
import type { Route } from 'next'
import type { NextLinkHref } from '@/types/next-types'
import { asRoute, getRouteKey } from '@/lib/utils'

// In component props or type definitions
type Props = {
  href: NextLinkHref;
}

// For static routes
<Link href={'/about' as Route<string>}>About</Link>
// OR
<Link href={asRoute('/about')}>About</Link>

// For dynamic routes from variables
<Link href={asRoute(`/projects/${project.slug}`)}>View Project</Link>

// For keys in map operations
{items.map((item, index) => (
  <div key={getRouteKey(item.href, index)}>
    <Link href={item.href}>...</Link>
  </div>
))}
```

This pattern works with Next.js 15's updated type definitions where `href` must be a `Route` or `UrlObject` type instead of a plain string.