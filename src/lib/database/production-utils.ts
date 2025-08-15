/**
 * Production-ready database utilities
 * Provides monitoring, health checks, connection pooling, and performance tracking
 */

import { db } from '../db'
// import type { Prisma } from '@prisma/client'

// =======================
// MONITORING & HEALTH
// =======================

export interface DatabaseHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  responseTime: number
  connections: {
    active: number
    idle: number
    total: number
  }
  performance: {
    avgQueryTime: number
    slowQueries: number
    totalQueries: number
  }
  errors: Array<{
    type: string
    count: number
    lastOccurred: string
  }>
}

export interface ConnectionPoolStats {
  size: number
  used: number
  waiting: number
  idle: number
  lifetime: number
}

export interface QueryPerformanceMetrics {
  operation: string
  duration: number
  timestamp: Date
  success: boolean
  error?: string
}

export class DatabaseMonitor {
  private static queryMetrics: QueryPerformanceMetrics[] = []
  private static errorCounts: Map<string, { count: number; lastOccurred: Date }> = new Map()
  private static readonly MAX_METRICS = 1000

  static async getHealth(): Promise<DatabaseHealth> {
    const startTime = Date.now()
    
    try {
      // Test basic connectivity
      await db.$queryRaw`SELECT 1`
      const responseTime = Date.now() - startTime

      // Get connection stats (PostgreSQL specific)
      const connectionStats = await db.$queryRaw<Array<{ 
        active: number
        idle: number 
        total: number 
      }>>`
        SELECT 
          COUNT(*) FILTER (WHERE state = 'active') as active,
          COUNT(*) FILTER (WHERE state = 'idle') as idle,
          COUNT(*) as total
        FROM pg_stat_activity 
        WHERE datname = current_database()
      `

      const connections = connectionStats[0] || { active: 0, idle: 0, total: 0 }

      // Calculate performance metrics
      const recentMetrics = this.queryMetrics.slice(-100)
      const successfulQueries = recentMetrics.filter(m => m.success)
      const avgQueryTime = successfulQueries.length > 0 
        ? successfulQueries.reduce((sum, m) => sum + m.duration, 0) / successfulQueries.length
        : 0
      
      const slowQueries = recentMetrics.filter(m => m.duration > 1000).length

      // Get error summary
      const errors = Array.from(this.errorCounts.entries()).map(([type, data]) => ({
        type,
        count: data.count,
        lastOccurred: data.lastOccurred.toISOString()
      }))

      // Determine overall health
      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
      
      if (responseTime > 5000 || avgQueryTime > 2000 || connections.active > 50) {
        status = 'degraded'
      }
      
      if (responseTime > 10000 || avgQueryTime > 5000 || connections.active > 100) {
        status = 'unhealthy'
      }

      return {
        status,
        timestamp: new Date().toISOString(),
        responseTime,
        connections,
        performance: {
          avgQueryTime,
          slowQueries,
          totalQueries: recentMetrics.length
        },
        errors
      }

    } catch (error) {
      const responseTime = Date.now() - startTime
      this.recordError('HEALTH_CHECK', error)

      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        responseTime,
        connections: { active: 0, idle: 0, total: 0 },
        performance: { avgQueryTime: 0, slowQueries: 0, totalQueries: 0 },
        errors: [{
          type: 'HEALTH_CHECK_FAILED',
          count: 1,
          lastOccurred: new Date().toISOString()
        }]
      }
    }
  }

  static recordQuery(operation: string, duration: number, success: boolean, error?: string): void {
    const metric: QueryPerformanceMetrics = {
      operation,
      duration,
      timestamp: new Date(),
      success,
      error
    }

    this.queryMetrics.push(metric)
    
    // Keep only recent metrics
    if (this.queryMetrics.length > this.MAX_METRICS) {
      this.queryMetrics = this.queryMetrics.slice(-this.MAX_METRICS)
    }

    // Record errors
    if (!success && error) {
      this.recordError(operation, error)
    }
  }

  static recordError(type: string, error: unknown): void {
    const errorType = error instanceof Error ? error.constructor.name : typeof error
    const key = `${type}_${errorType}`
    
    const existing = this.errorCounts.get(key)
    if (existing) {
      existing.count++
      existing.lastOccurred = new Date()
    } else {
      this.errorCounts.set(key, { count: 1, lastOccurred: new Date() })
    }
  }

  static getMetrics(): QueryPerformanceMetrics[] {
    return [...this.queryMetrics]
  }

  static clearMetrics(): void {
    this.queryMetrics = []
    this.errorCounts.clear()
  }
}

// =======================
// PERFORMANCE MONITORING
// =======================

export function withPerformanceMonitoring<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now()
  
  return fn()
    .then((result) => {
      const duration = Date.now() - startTime
      DatabaseMonitor.recordQuery(operation, duration, true)
      
      // Log slow queries
      if (duration > 1000) {
        console.warn(`Slow query detected: ${operation} took ${duration}ms`)
      }
      
      return result
    })
    .catch((error) => {
      const duration = Date.now() - startTime
      DatabaseMonitor.recordQuery(operation, duration, false, error.message)
      throw error
    })
}

// =======================
// CONNECTION MANAGEMENT
// =======================

export class ConnectionManager {
  private static reconnectAttempts = 0
  private static readonly MAX_RECONNECT_ATTEMPTS = 5
  private static readonly RECONNECT_DELAY = 1000

  static async ensureConnection(): Promise<void> {
    try {
      await db.$queryRaw`SELECT 1`
      this.reconnectAttempts = 0
    } catch (error) {
      console.error('Database connection lost, attempting to reconnect...', error)
      await this.reconnect()
    }
  }

  private static async reconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      throw new Error('Max reconnection attempts reached')
    }

    this.reconnectAttempts++
    const delay = this.RECONNECT_DELAY * Math.pow(2, this.reconnectAttempts - 1)
    
    console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS} in ${delay}ms`)
    
    await new Promise(resolve => setTimeout(resolve, delay))
    
    try {
      await db.$connect()
      await db.$queryRaw`SELECT 1`
      console.log('Database reconnection successful')
      this.reconnectAttempts = 0
    } catch (error) {
      console.error(`Reconnection attempt ${this.reconnectAttempts} failed:`, error)
      await this.reconnect()
    }
  }

  static async gracefulShutdown(): Promise<void> {
    console.log('Initiating graceful database shutdown...')
    
    try {
      await db.$disconnect()
      console.log('Database disconnected successfully')
    } catch (error) {
      console.error('Error during database disconnect:', error)
    }
  }
}

// =======================
// QUERY OPTIMIZATION
// =======================

// Type for PostgreSQL EXPLAIN ANALYZE output
interface ExplainAnalyzeResult {
  'QUERY PLAN': string;
}

// Type for pg_stat_statements result
interface SlowQueryResult {
  query: string;
  calls: bigint;
  total_exec_time: number;
  mean_exec_time: number;
  max_exec_time: number;
  rows: bigint;
}

export class QueryOptimizer {
  static async analyzeQuery(sql: string): Promise<ExplainAnalyzeResult[]> {
    try {
      return await db.$queryRawUnsafe(`EXPLAIN ANALYZE ${sql}`)
    } catch (error) {
      console.error('Query analysis failed:', error)
      return []
    }
  }

  static async getSlowQueries(limit = 10): Promise<SlowQueryResult[]> {
    try {
      return await db.$queryRaw`
        SELECT 
          query,
          calls,
          total_exec_time,
          mean_exec_time,
          max_exec_time,
          rows
        FROM pg_stat_statements 
        ORDER BY mean_exec_time DESC 
        LIMIT ${limit}
      `
    } catch (_error) {
      console.warn('pg_stat_statements not available for slow query analysis')
      return []
    }
  }

  static async updateTableStatistics(): Promise<void> {
    try {
      await db.$executeRaw`ANALYZE`
      console.log('Table statistics updated')
    } catch (error) {
      console.error('Failed to update table statistics:', error)
    }
  }
}

// =======================
// CACHE MANAGEMENT
// =======================

export class DatabaseCache {
  private static cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>()
  private static readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

  static set<T>(key: string, data: T, ttl = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  static get<T>(key: string): T | null {
    const cached = this.cache.get(key)
    
    if (!cached) {
      return null
    }

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key)
      return null
    }

    return cached.data as T
  }

  static invalidate(pattern?: string): void {
    if (pattern) {
      const regex = new RegExp(pattern)
      for (const key of this.cache.keys()) {
        if (regex.test(key)) {
          this.cache.delete(key)
        }
      }
    } else {
      this.cache.clear()
    }
  }

  static getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

// =======================
// MIDDLEWARE WRAPPER
// =======================

export function createDatabaseMiddleware() {
  return async <T>(operation: string, fn: () => Promise<T>): Promise<T> => {
    // Ensure connection
    await ConnectionManager.ensureConnection()
    
    // Check cache first
    const cacheKey = `${operation}_${JSON.stringify(fn.toString().slice(0, 100))}`
    const cached = DatabaseCache.get<T>(cacheKey)
    
    if (cached) {
      return cached as T
    }

    // Execute with performance monitoring
    const result = await withPerformanceMonitoring(operation, fn)
    
    // Cache result if it's a read operation
    if (operation.includes('FIND') || operation.includes('GET')) {
      DatabaseCache.set(cacheKey, result, 2 * 60 * 1000) // 2 minutes for read operations
    }
    
    // Invalidate cache if it's a write operation
    if (operation.includes('CREATE') || operation.includes('UPDATE') || operation.includes('DELETE')) {
      DatabaseCache.invalidate('FIND|GET')
    }

    return result
  }
}

// =======================
// BACKUP AUTOMATION
// =======================

export class BackupAutomation {
  static async scheduleBackup(intervalHours = 24): Promise<void> {
    console.log(`Scheduling automatic backups every ${intervalHours} hours`)
    
    setInterval(async () => {
      try {
        console.log('Starting scheduled backup...')
        const { createDatabaseBackup } = await import('../../../scripts/database-backup')
        await createDatabaseBackup()
        console.log('Scheduled backup completed successfully')
      } catch (error) {
        console.error('Scheduled backup failed:', error)
        DatabaseMonitor.recordError('SCHEDULED_BACKUP', error)
      }
    }, intervalHours * 60 * 60 * 1000)
  }

  static async retentionCleanup(retentionDays = 30): Promise<void> {
    try {
      const fs = await import('fs')
      const path = await import('path')
      
      const backupDir = path.join(process.cwd(), 'backups')
      if (!fs.existsSync(backupDir)) return

      const files = fs.readdirSync(backupDir)
      const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000)

      for (const file of files) {
        if (file.startsWith('backup-') && file.endsWith('.json')) {
          const filePath = path.join(backupDir, file)
          const stats = fs.statSync(filePath)
          
          if (stats.mtime < cutoffDate) {
            fs.unlinkSync(filePath)
            console.log(`Deleted old backup: ${file}`)
          }
        }
      }
    } catch (error) {
      console.error('Backup retention cleanup failed:', error)
    }
  }
}

// =======================
// ENVIRONMENT VALIDATION
// =======================

export function validateDatabaseEnvironment(): void {
  const requiredEnvVars = ['DATABASE_URL']
  const missing = requiredEnvVars.filter(env => !process.env[env])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  // Validate DATABASE_URL format
  const dbUrl = process.env.DATABASE_URL!
  if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection string')
  }

  console.log('✅ Database environment validation passed')
}

// All classes and functions are already exported above