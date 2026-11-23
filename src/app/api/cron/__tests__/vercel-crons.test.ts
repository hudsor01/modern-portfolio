// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

type Cron = { path: string; schedule: string }

const crons = (
  JSON.parse(readFileSync(path.join(process.cwd(), 'vercel.json'), 'utf8')) as { crons: Cron[] }
).crons

describe('vercel.json crons', () => {
  it('registers exactly the two expected crons', () => {
    expect(crons).toHaveLength(2)
  })

  it('keeps the hourly publish-scheduled cron unchanged', () => {
    expect(crons).toContainEqual({ path: '/api/cron/publish-scheduled', schedule: '0 * * * *' })
  })

  it('runs the contact purge daily, off the hour', () => {
    const purge = crons.find((c) => c.path === '/api/cron/purge-contact-submissions')
    expect(purge).toBeDefined()
    const match = purge?.schedule.match(/^(\d{1,2}) (\d{1,2}) \* \* \*$/)
    expect(match).not.toBeNull()
    expect(Number(match?.[1])).not.toBe(0)
  })

  it('has a route file on disk for every cron path', () => {
    for (const cron of crons) {
      expect(existsSync(path.join(process.cwd(), 'src/app', cron.path, 'route.ts'))).toBe(true)
    }
  })
})
