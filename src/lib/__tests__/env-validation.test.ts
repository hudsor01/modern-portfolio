import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

/**
 * env-validation runs the Zod schema at module import time and throws on
 * invalid configuration. To test each scenario in isolation we must:
 *   1. stub process.env with the scenario's values
 *   2. vi.resetModules() so the next dynamic import re-runs top-level validation
 *   3. import('@/lib/env-validation') and assert on what it exposes
 */

async function importEnvModule() {
  vi.resetModules()
  return import('@/lib/env-validation')
}

describe('env-validation', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('getValidatedEnv', () => {
    it('accepts a minimal dev environment with defaults', async () => {
      vi.stubEnv('NODE_ENV', 'development')
      vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000')

      const mod = await importEnvModule()
      const env = mod.getValidatedEnv()

      expect(env.NODE_ENV).toBe('development')
      expect(env.FROM_EMAIL).toBe('contact@richardwhudsonjr.com')
      expect(env.TO_EMAIL).toBe('hello@richardwhudsonjr.com')
      expect(env.ALLOWED_ORIGINS).toEqual([])
      expect(env.USE_LOCAL_DB).toBe(false)
    })

    it('rejects DATABASE_URL that is not a postgres connection string', async () => {
      vi.stubEnv('NODE_ENV', 'development')
      vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000')
      vi.stubEnv('DATABASE_URL', 'mysql://user:pass@host/db')

      await expect(importEnvModule()).rejects.toThrow(
        /DATABASE_URL must be a valid PostgreSQL connection string/
      )
    })

    it('accepts postgres:// and postgresql:// URLs', async () => {
      vi.stubEnv('NODE_ENV', 'development')
      vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000')
      vi.stubEnv('DATABASE_URL', 'postgres://user:pass@host/db')

      const mod = await importEnvModule()
      expect(mod.env.DATABASE_URL).toBe('postgres://user:pass@host/db')
    })

    it('rejects invalid email in FROM_EMAIL', async () => {
      vi.stubEnv('NODE_ENV', 'development')
      vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000')
      vi.stubEnv('FROM_EMAIL', 'not-an-email')

      await expect(importEnvModule()).rejects.toThrow(/FROM_EMAIL/)
    })

    it('splits ALLOWED_ORIGINS csv into a trimmed array', async () => {
      vi.stubEnv('NODE_ENV', 'development')
      vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000')
      vi.stubEnv('ALLOWED_ORIGINS', 'https://a.com, https://b.com , https://c.com')

      const mod = await importEnvModule()
      expect(mod.env.ALLOWED_ORIGINS).toEqual(['https://a.com', 'https://b.com', 'https://c.com'])
    })

    it('transforms USE_LOCAL_DB="true" into boolean true', async () => {
      vi.stubEnv('NODE_ENV', 'development')
      vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000')
      vi.stubEnv('USE_LOCAL_DB', 'true')

      const mod = await importEnvModule()
      expect(mod.env.USE_LOCAL_DB).toBe(true)
    })

    it('rejects non-URL NEXT_PUBLIC_SITE_URL', async () => {
      vi.stubEnv('NODE_ENV', 'development')
      vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'not-a-url')

      await expect(importEnvModule()).rejects.toThrow(/NEXT_PUBLIC_SITE_URL/)
    })

    it('rejects short JWT_SECRET', async () => {
      vi.stubEnv('NODE_ENV', 'development')
      vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000')
      vi.stubEnv('JWT_SECRET', 'too-short')

      await expect(importEnvModule()).rejects.toThrow(/JWT_SECRET must be at least 32 characters/)
    })

    it('rejects JWT_EXPIRES_IN in the wrong format', async () => {
      vi.stubEnv('NODE_ENV', 'development')
      vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000')
      vi.stubEnv('JWT_EXPIRES_IN', '1 hour')

      await expect(importEnvModule()).rejects.toThrow(/JWT_EXPIRES_IN/)
    })
  })

  describe('production security checks', () => {
    it('rejects non-HTTPS site URL in production', async () => {
      vi.stubEnv('NODE_ENV', 'production')
      vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'http://insecure.example.com')

      await expect(importEnvModule()).rejects.toThrow(/HTTPS/)
    })

    it('accepts HTTPS site URL in production', async () => {
      vi.stubEnv('NODE_ENV', 'production')
      vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://richardwhudsonjr.com')

      const mod = await importEnvModule()
      expect(mod.env.NEXT_PUBLIC_SITE_URL).toBe('https://richardwhudsonjr.com')
    })
  })
})
