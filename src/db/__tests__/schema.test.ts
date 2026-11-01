// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { getTableColumns, is } from 'drizzle-orm'
import { PgTable, getTableConfig } from 'drizzle-orm/pg-core'
import { drizzle } from 'drizzle-orm/pg-proxy'
import * as schema from '@/db/schema'

// The production tables were created by Prisma, whose @updatedAt sets no
// database default. An INSERT that leaves updatedAt to SQL DEFAULT therefore
// fails with 23502 there, even though `.defaultNow()` makes it look fine on a
// freshly generated schema. These pin the runtime default that avoids that.
const tablesWithUpdatedAt = Object.values(schema as Record<string, unknown>)
  .filter((value): value is PgTable => is(value, PgTable))
  .filter((table) => 'updatedAt' in getTableColumns(table))

describe('updatedAt on the Prisma-created tables', () => {
  it('finds the six tables that carry the column', () => {
    expect(tablesWithUpdatedAt.length).toBeGreaterThanOrEqual(6)
  })

  it.each(tablesWithUpdatedAt.map((table) => [getTableConfig(table).name, table] as const))(
    '%s.updatedAt is NOT NULL with a runtime default',
    (_name, table) => {
      const column = getTableColumns(table).updatedAt
      expect(column?.notNull).toBe(true)
      expect(column?.defaultFn).toBeTypeOf('function')
    }
  )

  it('an insert that omits updatedAt binds a timestamp instead of SQL DEFAULT', () => {
    const db = drizzle(async () => ({ rows: [] }))
    const { sql, params } = db
      .insert(schema.authors)
      .values({ name: 'R', email: 'r@example.com', slug: 'r' })
      .toSQL()
    const columns = sql.match(/\(([^)]*)\) values/)?.[1]?.split(', ') ?? []
    const values = sql.match(/values \(([^)]*)\)/)?.[1]?.split(', ') ?? []
    const placeholder = values[columns.indexOf('"updatedAt"')]
    expect(placeholder).toMatch(/^\$\d+$/)
    expect(params[Number(placeholder?.slice(1)) - 1]).toBeTruthy()
  })
})
