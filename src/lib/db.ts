/**
 * Database client configuration for the modern portfolio blog system
 * Provides singleton Prisma client instance with error handling and connection pooling
 * Updated for Prisma 7 with driver adapter pattern
 */

import 'server-only'
import { PrismaClient } from '@/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { logger } from '@/lib/logger'

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

// Check if we're in a CI build environment without a real database
const isCI = process.env.CI === 'true'
const hasDbUrl = !!process.env.DATABASE_URL

// Validate environment immediately on module import
// Skip in test environment and during CI builds without DATABASE_URL
if (process.env.NODE_ENV !== 'test' && hasDbUrl) {
  validateDatabaseEnvironment()
}

// Extend global type to include prisma client for development hot-reload prevention
declare global {
  var prisma: PrismaClient | undefined
}

// Use placeholder for CI builds without DATABASE_URL to allow build to complete
const connectionString = process.env.DATABASE_URL || (isCI ? 'postgresql://placeholder:placeholder@localhost:5432/placeholder' : '')

// Create the PostgreSQL adapter with connection string
const adapter = new PrismaNeon({
  connectionString,
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
