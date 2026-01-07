/**
 * Database client configuration for the modern portfolio blog system
 * Provides singleton Prisma client instance with error handling and connection pooling
 * Updated for Prisma 7 with driver adapter pattern
 */

import 'server-only'
import { PrismaClient, Prisma } from '@/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { logger } from '@/lib/monitoring/logger'

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
    logger.info('Database environment validated successfully')
  }
}

// Validate environment immediately on module import
validateDatabaseEnvironment()

// Re-export all types and enums from Prisma
export * from '@/prisma/client'
export { Prisma }

// Extend global type to include prisma client for development hot-reload prevention
declare global {
  var prisma: PrismaClient | undefined
}

// Create the PostgreSQL adapter with validated connection string
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

export const db =
  global.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') global.prisma = db

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
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }
  }
}

// Export types for TypeScript support
export type Database = typeof db
