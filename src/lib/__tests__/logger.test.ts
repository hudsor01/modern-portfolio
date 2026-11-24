// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// The Sentry transport uses a static ESM import of `@sentry/nextjs`, so
// `vi.mock('@sentry/nextjs')` intercepts it and routing is asserted directly.
const sentry = vi.hoisted(() => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  addBreadcrumb: vi.fn(),
}))
vi.mock('@sentry/nextjs', () => sentry)

beforeEach(() => {
  sentry.captureException.mockReset()
  sentry.captureMessage.mockReset()
  sentry.addBreadcrumb.mockReset()
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('logger development routing (ConsoleTransport)', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('NEXT_PHASE', '')
    vi.resetModules()
  })
  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('writes info to console in development', async () => {
    const { logger } = await import('@/lib/logger')
    logger.info('dev msg')
    expect(consoleSpy).toHaveBeenCalled()
    const out = String(consoleSpy.mock.calls[0]?.[0])
    expect(out).toContain('dev msg')
    expect(out).toContain('INFO')
  })

  it('writes warn with WARN level marker', async () => {
    const { logger } = await import('@/lib/logger')
    logger.warn('careful')
    const out = String(consoleSpy.mock.calls[0]?.[0])
    expect(out).toContain('WARN')
    expect(out).toContain('careful')
  })

  it('writes error including stack info in development', async () => {
    const { logger } = await import('@/lib/logger')
    logger.error('boom', new Error('detail'))
    const out = String(consoleSpy.mock.calls[0]?.[0])
    expect(out).toContain('ERROR')
    expect(out).toContain('boom')
    expect(out).toContain('detail')
  })

  it('writes debug when LOG_LEVEL=debug', async () => {
    vi.stubEnv('LOG_LEVEL', 'debug')
    vi.resetModules()
    const { logger } = await import('@/lib/logger')
    logger.debug('detail')
    const out = String(consoleSpy.mock.calls[0]?.[0])
    expect(out).toContain('DEBUG')
  })

  it('skips debug when LOG_LEVEL=info (default in dev=debug, must override)', async () => {
    vi.stubEnv('LOG_LEVEL', 'info')
    vi.resetModules()
    const { logger } = await import('@/lib/logger')
    logger.debug('detail')
    expect(consoleSpy).not.toHaveBeenCalled()
  })
})

describe('ConsoleTransport suppression in production', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('NEXT_PHASE', '')
    vi.resetModules()
  })
  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('does not write to console in production', async () => {
    const { logger } = await import('@/lib/logger')
    logger.info('msg')
    logger.warn('msg')
    logger.error('msg', new Error('x'))
    expect(consoleSpy).not.toHaveBeenCalled()
  })
})

describe('build-phase short-circuit', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('NEXT_PHASE', 'phase-production-build')
    vi.resetModules()
  })
  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('attaches no transports during a Next build', async () => {
    const { logger } = await import('@/lib/logger')
    // Should not throw and should not log anywhere
    expect(() => {
      logger.error('build-time problem', new Error('x'))
      logger.info('hi')
      logger.warn('warn')
    }).not.toThrow()
    expect(consoleSpy).not.toHaveBeenCalled()
  })
})

describe('createContextLogger', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('NEXT_PHASE', '')
    vi.resetModules()
  })
  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('binds the context name into the log entry context', async () => {
    const { createContextLogger } = await import('@/lib/logger')
    const ctxLogger = createContextLogger('TestCtx')
    ctxLogger.info('hi')
    const out = String(consoleSpy.mock.calls[0]?.[0])
    expect(out).toContain('TestCtx')
    expect(out).toContain('hi')
  })

  it('error helper accepts an Error in arg2', async () => {
    const { createContextLogger } = await import('@/lib/logger')
    const ctxLogger = createContextLogger('TestCtx')
    expect(() => ctxLogger.error('msg', new Error('boom'))).not.toThrow()
    const out = String(consoleSpy.mock.calls[0]?.[0])
    expect(out).toContain('msg')
    expect(out).toContain('boom')
  })

  it('error helper accepts a context object in arg2', async () => {
    const { createContextLogger } = await import('@/lib/logger')
    const ctxLogger = createContextLogger('TestCtx')
    expect(() => ctxLogger.error('msg', { extra: 'data' })).not.toThrow()
  })

  it('debug + info + warn helpers pass through without throwing', async () => {
    vi.stubEnv('LOG_LEVEL', 'debug')
    vi.resetModules()
    const { createContextLogger } = await import('@/lib/logger')
    const ctxLogger = createContextLogger('TestCtx')
    expect(() => {
      ctxLogger.debug('d')
      ctxLogger.info('i')
      ctxLogger.warn('w')
    }).not.toThrow()
  })
})

describe('LoggerImpl public API surface (smoke)', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('NEXT_PHASE', '')
    vi.resetModules()
  })

  it('startTimer returns a stop function that calls performance', async () => {
    const { logger } = await import('@/lib/logger')
    const stop = logger.startTimer('op')
    expect(typeof stop).toBe('function')
    expect(() => stop()).not.toThrow()
  })

  it('child logger inherits base context', async () => {
    const { logger } = await import('@/lib/logger')
    const child = logger.child({ requestId: 'abc' })
    expect(typeof child.info).toBe('function')
  })

  it('security helper logs without throwing', async () => {
    const { logger } = await import('@/lib/logger')
    expect(() => logger.security('csrf-violation')).not.toThrow()
  })

  it('request helper logs without throwing', async () => {
    const { logger } = await import('@/lib/logger')
    expect(() => logger.request({ id: '1', method: 'GET', url: '/x' })).not.toThrow()
  })
})

describe('SentryTransport routing (production)', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('NEXT_PHASE', '')
    vi.resetModules()
  })

  it('error with Error -> captureException with level error and extra', async () => {
    const { logger } = await import('@/lib/logger')
    logger.error('boom', new Error('detail'), { a: 1 })
    expect(sentry.captureException).toHaveBeenCalledTimes(1)
    const [err, opts] = sentry.captureException.mock.calls[0] as [Error, Record<string, unknown>]
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe('detail')
    expect(err.name).toBe('Error')
    expect(opts.level).toBe('error')
    expect(opts.extra).toMatchObject({ a: 1 })
  })

  it('fatal with Error -> captureException level fatal', async () => {
    const { logger } = await import('@/lib/logger')
    logger.fatal('dead', new Error('x'))
    expect(sentry.captureException).toHaveBeenCalledTimes(1)
    expect(sentry.captureException.mock.calls[0]?.[1]).toMatchObject({ level: 'fatal' })
  })

  it('error without Error -> captureMessage level error', async () => {
    const { logger } = await import('@/lib/logger')
    logger.error('no error object')
    expect(sentry.captureException).not.toHaveBeenCalled()
    expect(sentry.captureMessage).toHaveBeenCalledTimes(1)
    expect(sentry.captureMessage.mock.calls[0]?.[0]).toBe('no error object')
    expect(sentry.captureMessage.mock.calls[0]?.[1]).toMatchObject({ level: 'error' })
  })

  it('warn -> captureMessage level warning', async () => {
    const { logger } = await import('@/lib/logger')
    logger.warn('careful')
    expect(sentry.captureMessage).toHaveBeenCalledTimes(1)
    expect(sentry.captureMessage.mock.calls[0]?.[0]).toBe('careful')
    expect(sentry.captureMessage.mock.calls[0]?.[1]).toMatchObject({ level: 'warning' })
  })

  it('info and debug -> addBreadcrumb only', async () => {
    vi.stubEnv('LOG_LEVEL', 'debug')
    vi.resetModules()
    const { logger } = await import('@/lib/logger')
    logger.info('i')
    logger.debug('d')
    expect(sentry.addBreadcrumb).toHaveBeenCalledTimes(2)
    expect(sentry.addBreadcrumb.mock.calls[0]?.[0]).toMatchObject({ level: 'info' })
    expect(sentry.addBreadcrumb.mock.calls[1]?.[0]).toMatchObject({ level: 'debug' })
    expect(sentry.captureException).not.toHaveBeenCalled()
    expect(sentry.captureMessage).not.toHaveBeenCalled()
  })

  it('build phase calls no Sentry function', async () => {
    vi.stubEnv('NEXT_PHASE', 'phase-production-build')
    vi.resetModules()
    const { logger } = await import('@/lib/logger')
    logger.error('x', new Error('x'))
    logger.warn('w')
    logger.info('i')
    expect(sentry.captureException).not.toHaveBeenCalled()
    expect(sentry.captureMessage).not.toHaveBeenCalled()
    expect(sentry.addBreadcrumb).not.toHaveBeenCalled()
  })

  it('source imports Sentry statically and never require()s it', () => {
    const src = readFileSync(join(process.cwd(), 'src/lib/logger.ts'), 'utf8')
    expect(src).not.toMatch(/require\(\s*['"]@sentry\//)
    expect(src).toMatch(/^import \* as Sentry from '@sentry\/nextjs'$/m)
  })
})
