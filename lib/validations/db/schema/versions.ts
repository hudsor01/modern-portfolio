import { pgTable, text, timestamp, uuid, varchar, jsonb, integer } from "drizzle-orm/pg-core"

export const contentVersions = pgTable("content_versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  contentId: uuid("content_id").notNull(),
  contentType: varchar("content_type", { length: 50 }).notNull(), // 'post' or 'project'
  version: integer("version").notNull(),
  data: jsonb("data").notNull(),
  createdBy: uuid("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  comment: text("comment"),
  status: varchar("status", { length: 50 }).notNull().default("draft"), // draft, pending, published
})

export const workflowStates = pgTable("workflow_states", {
  id: uuid("id").defaultRandom().primaryKey(),
  contentId: uuid("content_id").notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  assignedTo: uuid("assigned_to"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  contentId: uuid("content_id").notNull(),
  userId: uuid("user_id").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

