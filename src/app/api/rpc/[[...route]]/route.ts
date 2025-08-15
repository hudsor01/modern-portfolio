/**
 * Next.js API Route Handler for Hono RPC
 * Integrates Hono RPC application with Next.js App Router
 */

import { handle } from '@hono/vercel'
import { rpcApp } from '@/server/rpc/app'

// Configure Hono for Vercel deployment
export const runtime = 'nodejs'

// Export HTTP method handlers for Next.js
export const GET = handle(rpcApp)
export const POST = handle(rpcApp)
export const PUT = handle(rpcApp)
export const DELETE = handle(rpcApp)
export const PATCH = handle(rpcApp)
export const OPTIONS = handle(rpcApp)