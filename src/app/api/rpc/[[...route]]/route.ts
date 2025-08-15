/**
 * Next.js API Route Handler for Hono RPC
 * Integrates Hono RPC application with Next.js App Router
 */

import { rpcApp } from '@/server/rpc/app'
import { Hono } from 'hono'
import { BlankEnv, BlankSchema } from 'hono/types'
import type { NextRequest } from 'next/server'

// Configure Hono for Vercel deployment
export const runtime = 'nodejs'

// Export HTTP method handlers for Next.js
export const GET = handle(rpcApp)
export const POST = handle(rpcApp)
export const PUT = handle(rpcApp)
export const DELETE = handle(rpcApp)
export const PATCH = handle(rpcApp)
export const OPTIONS = handle(rpcApp)

function handle(rpcApp: Hono<BlankEnv, BlankSchema, "/">) {
    return async (req: NextRequest) => {
        // Convert NextRequest to Hono's Request
        const url = req.nextUrl.clone()
        // Strip the /api/rpc prefix to get the relative path for Hono
        const pathname = url.pathname.replace(/^\/api\/rpc/, '') || '/'
        url.pathname = pathname
        
        // Hono expects a standard Request object
        const honoRes = await rpcApp.fetch(
            new Request(url, {
                method: req.method,
                headers: req.headers,
                body: req.body,
            }),
            {}
        )
        return honoRes
    }
}
