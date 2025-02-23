import { Redis } from "@upstash/redis"
import { headers } from "next/headers"

type RateLimitConfig = {
  interval: number // in seconds
  limit: number
}

const configs: Record<string, RateLimitConfig> = {
  auth: {
    interval: 60 * 15, // 15 minutes
    limit: 5, // 5 attempts
  },
  contact: {
    interval: 60 * 60, // 1 hour
    limit: 3, // 3 submissions
  },
  newsletter: {
    interval: 60 * 60 * 24, // 24 hours
    limit: 1, // 1 subscription
  },
}

const redis = Redis.fromEnv()

export async function rateLimit(key: keyof typeof configs, identifier?: string) {
  try {
    const headersList = headers()
    const ip = headersList.get("x-forwarded-for") ?? "anonymous"
    const rateLimitKey = `rate-limit:${key}:${identifier ?? ip}`

    const config = configs[key]
    if (!config) {
      throw new Error(`Rate limit config not found for key: ${key}`)
    }

    const [response] = await redis.multi().incr(rateLimitKey).expire(rateLimitKey, config.interval).exec()

    const attempts = response as number

    return {
      success: attempts <= config.limit,
      limit: config.limit,
      remaining: Math.max(0, config.limit - attempts),
      reset: config.interval,
    }
  } catch (error) {
    console.error("Rate limit error:", error)
    // Fail open - allow the request if rate limiting fails
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: 0,
    }
  }
}

