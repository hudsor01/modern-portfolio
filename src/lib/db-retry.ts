/**
 * Retry a read on transient failures before letting the error propagate.
 *
 * The blog routes are `force-dynamic` and deliberately re-throw DB errors as
 * HTTP 500 (returning null would trigger notFound() → a soft-404 that the
 * /blog/* CDN rule caches for 24h). The downside: a single transient neon-http
 * hiccup during one of the rare crawls Google gives a low-authority site turns
 * into a 5xx that Search Console penalizes ("Server error (5xx)"). Wrapping the
 * read in a short retry absorbs those blips; only a sustained outage still 500s,
 * preserving the no-soft-404 intent.
 *
 * Pure/generic — no DB import — so it can wrap any async read and be unit-tested
 * without a database.
 */
export async function withDbRetry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  delaysMs: readonly number[] = [120, 360]
): Promise<T> {
  let lastError: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      const delay = delaysMs[i]
      if (delay !== undefined && delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }
  throw lastError
}
