import { createId as createId2 } from '@paralleldrive/cuid2'

// Drizzle replacement for Prisma's @default(cuid()). Prisma 7 emits cuid v1
// (e.g. `cmkdsj5vh000sl8br1ibux8w6`); cuid2 is the maintained successor and
// what new IDs will look like (e.g. `tz4a98xxat96iws9zmbrgj3a`). Both are
// 24–25-char alphanumeric strings; existing v1 IDs in the DB are unaffected.
export const createId = createId2
