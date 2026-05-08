// Drizzle client. Replaces the previous Prisma client (Prisma 7 was dropped
// after the prisma/prisma#28588 regression caused /blog/[slug] queries inside
// React cache() to suspend indefinitely on Vercel + adapter-neon).
//
// Public surface stays: `import { db } from '@/lib/db'` works as before.
export * from '@/db'
export { db } from '@/db'
