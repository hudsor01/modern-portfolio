import { logger } from '@/lib/logger'

export const BASE_METRICS = new Map<string, number>([
  ['base_revenue', 2500000],
  ['base_partners', 150],
  ['base_deals', 200],
  ['churn_baseline', 2.0],
  ['growth_trend', 0.12],
])

export function getBaseMetric(map: Map<string, number>, key: string): number {
  const value = map.get(key)
  if (value === undefined) {
    const error = new Error(`Base metric '${key}' not initialized`)
    logger.error(error.message, error, { availableKeys: Array.from(map.keys()) })
    throw error
  }
  return value
}
