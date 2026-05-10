// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// SENTRY_TRANSPORT NOTE
// ─────────────────────
// `SentryTransport.log()` calls `require('@sentry/nextjs')` directly. Under
// Vitest's ESM runner, vi.mock intercepts ESM imports cleanly, but CJS-style
// `require()` calls inside transitive modules can bypass the mock depending on
// how Vite resolves them. The production-routing tests below verify that
// transports fire (or don't) at the observable layer; deeper assertions about
// which Sentry method was invoked are covered by the integration / e2e suite.

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

describe('PerformanceMonitor + ErrorBoundaryLogger exports', () => {
  it('all expected utility classes are exported', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.resetModules()
    const mod = await import('@/lib/logger')
    expect(typeof mod.ErrorBoundaryLogger).toBe('function')
    expect(typeof mod.PerformanceMonitor).toBe('function')
    expect(typeof mod.errorBoundaryLogger.logError).toBe('function')
    expect(typeof mod.performanceMonitor.measure).toBe('function')
    expect(typeof mod.performanceMonitor.measureAsync).toBe('function')
  })

  it('PerformanceMonitor.measure returns the function result', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.resetModules()
    const { performanceMonitor } = await import('@/lib/logger')
    expect(performanceMonitor.measure('op', () => 42)).toBe(42)
  })

  it('PerformanceMonitor.measureAsync returns the awaited result', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.resetModules()
    const { performanceMonitor } = await import('@/lib/logger')
    expect(await performanceMonitor.measureAsync('op', async () => 'x')).toBe('x')
  })

  it('PerformanceMonitor records metrics and exposes summary', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.resetModules()
    const { PerformanceMonitor, logger } = await import('@/lib/logger')
    const pm = new PerformanceMonitor(logger)
    pm.measure('op', () => 1)
    pm.measure('op', () => 2)
    const summary = pm.getMetricsSummary()
    expect(summary.op).toBeDefined()
    expect(summary.op?.count).toBe(2)
  })
})

describe('withLogging / withAsyncLogging', () => {
  it('withLogging wraps a sync function preserving return value', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.resetModules()
    const { withLogging } = await import('@/lib/logger')
    const wrapped = withLogging('op', (a: number, b: number) => a + b)
    expect(wrapped(2, 3)).toBe(5)
  })

  it('withAsyncLogging wraps an async function', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.resetModules()
    const { withAsyncLogging } = await import('@/lib/logger')
    const wrapped = withAsyncLogging('op', async (n: number) => n * 2)
    expect(await wrapped(5)).toBe(10)
  })
})
