import { pgTable, text, timestamp, uuid, varchar, boolean, jsonb, integer, real } from "drizzle-orm/pg-core"

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  link: text("link"),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
})

export const userActivities = pgTable("user_activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  action: varchar("action", { length: 50 }).notNull(),
  resourceType: varchar("resource_type", { length: 50 }).notNull(),
  resourceId: uuid("resource_id").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const contentMetrics = pgTable("content_metrics", {
  id: uuid("id").defaultRandom().primaryKey(),
  contentId: uuid("content_id").notNull(),
  contentType: varchar("content_type", { length: 50 }).notNull(),
  views: integer("views").default(0),
  uniqueViews: integer("unique_views").default(0),
  averageTimeOnPage: integer("average_time_on_page").default(0),
  bounceRate: real("bounce_rate"),
  updatedAt: timestamp("updated_at").defaultNow(),
})

