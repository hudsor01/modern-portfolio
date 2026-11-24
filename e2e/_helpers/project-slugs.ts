import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Case-study routes, discovered from `src/app/projects/<slug>/page.tsx` so a new
 * or removed project changes every count here instead of breaking a hard-coded 14.
 * Not a spec: Playwright only collects `*.spec.ts`.
 */
const PROJECTS_DIR = join(process.cwd(), 'src/app/projects')

export const PROJECT_SLUGS_ON_DISK: string[] = readdirSync(PROJECTS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== '[slug]')
  .filter((d) => existsSync(join(PROJECTS_DIR, d.name, 'page.tsx')))
  .map((d) => d.name)
  .sort()

export const PROJECT_COUNT = PROJECT_SLUGS_ON_DISK.length
