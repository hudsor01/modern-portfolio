/**
 * Database client configuration for the modern portfolio blog system
 * Provides singleton Prisma client instance with error handling and connection pooling
 * Updated for Prisma 7 with driver adapter pattern
 *
 * Supports two modes:
 * - Local dev: USE_LOCAL_DB=true → Direct PostgreSQL connection
 * - Production: USE_LOCAL_DB unset → Neon serverless adapter
 */

import 'server-only'
import type { PrismaClient } from '@/generated/prisma/client'
import { logger } from '@/lib/logger'
import { env } from '@/lib/env-validation'

// Determine if we're using local database (dev container) or Neon (production)
const useLocalDb = env.USE_LOCAL_DB

// Environment validation - runs at module load time
function validateDatabaseEnvironment() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    const error = new Error(
      'DATABASE_URL environment variable is required but not set.\n' +
        '\nRequired Setup:\n' +
        '1. Copy .env.example to .env\n' +
        '2. Set DATABASE_URL to your PostgreSQL connection string\n' +
        '   Example: postgresql://user:password@localhost:5432/portfolio\n' +
        '3. For production, add connection pooling: ?connection_limit=10&pool_timeout=20\n' +
        '\nSee .env.example for complete configuration.'
    )
    logger.error('Database configuration error', error)
    throw error
  }

  // Basic validation of connection string format
  if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
    const error = new Error(
      'DATABASE_URL must be a valid PostgreSQL connection string starting with postgresql:// or postgres://\n' +
        `Current value: ${databaseUrl.substring(0, 20)}...`
    )
    logger.error('Database configuration error', error)
    throw error
  }

  // Log successful validation in development
  if (process.env.NODE_ENV === 'development') {
    logger.info(
      `Database environment validated successfully (mode: ${useLocalDb ? 'local' : 'neon'})`
    )
  }
}

// Validate environment immediately on module import
// Skip in test environment or during CI builds (SKIP_DB_VALIDATION=true)
if (process.env.NODE_ENV !== 'test' && process.env.SKIP_DB_VALIDATION !== 'true') {
  validateDatabaseEnvironment()
}

// Extend global type to include prisma client for development hot-reload prevention
declare global {
  var __prisma: PrismaClient | undefined
}

/**
 * Create Prisma client with appropriate adapter
 * - Local: Direct connection (standard Prisma)
 * - Production: Neon serverless adapter (HTTP-based)
 */
function createPrismaClient(): PrismaClient {
  // Lazy require — avoids evaluating Prisma runtime at module load time.
  // The generated client has side effects on import (runtime init, WASM check)
  // that produce prisma:error logs in build workers that never query the DB.
  const { PrismaClient: PrismaClientClass } = require('@/generated/prisma/client')

  const logLevel: Array<'info' | 'query' | 'warn' | 'error'> =
    process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']

  if (useLocalDb) {
    // Local development: Use pg adapter for standard PostgreSQL
    const { PrismaPg } = require('@prisma/adapter-pg')
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL || '',
    })
    logger.info('Using pg adapter (local dev)')
    return new PrismaClientClass({
      adapter,
      log: logLevel,
    })
  } else {
    // Production: Use Neon serverless adapter
    const { PrismaNeon } = require('@prisma/adapter-neon')
    const adapter = new PrismaNeon({
      connectionString: process.env.DATABASE_URL || '',
    })
    logger.info('Using Neon serverless adapter (production)')
    return new PrismaClientClass({
      adapter,
      log: logLevel,
    })
  }
}

/**
 * Get or create singleton PrismaClient.
 * Called on first property access via the Proxy below.
 */
function getClient(): PrismaClient {
  if (!global.__prisma) {
    global.__prisma = createPrismaClient()
  }
  return global.__prisma
}

/**
 * Lazy-initialized Prisma client.
 * PrismaClient + Neon adapter are only created on first actual use,
 * not at module load time. This prevents build workers from
 * instantiating adapters they never query.
 */
export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return Reflect.get(getClient(), prop)
  },
})

// Database connection helper
export async function connectDB() {
  try {
    await db.$connect()
  } catch (error) {
    logger.error(
      'Database connection failed',
      error instanceof Error ? error : new Error('Unknown error')
    )
    throw error
  }
}

// Graceful shutdown
export async function disconnectDB() {
  try {
    await db.$disconnect()
  } catch (error) {
    logger.error(
      'Database disconnection failed',
      error instanceof Error ? error : new Error('Unknown error')
    )
    throw error
  }
}

// Health check
export async function checkDBHealth() {
  try {
    await db.$queryRaw`SELECT 1`
    return { status: 'healthy', timestamp: new Date().toISOString() }
  } catch (error) {
    logger.error(
      'checkDBHealth probe failed',
      error instanceof Error ? error : new Error(String(error))
    )
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }
  }
}

// Export types for TypeScript support
export type Database = typeof db
