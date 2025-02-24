import { pgTable, text, timestamp, uuid, varchar, boolean, integer } from "drizzle-orm/pg-core"
import { createInsertSchema } from "drizzle-zod"

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at", { mode: "date" }),
  authorId: varchar("author_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  url: text("url").notNull(),
  size: integer("size").notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  width: integer("width"),
  height: integer("height"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const contacts = pgTable("contacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const subscribers = pgTable("subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
  unsubscribedAt: timestamp("unsubscribed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Zod Schemas for validation
export const insertContactSchema = createInsertSchema(contacts)
export const insertSubscriberSchema = createInsertSchema(subscribers)
export const insertMediaSchema = createInsertSchema(media)
export const insertPostSchema = createInsertSchema(posts)

export type Contact = typeof contacts.$inferSelect
export type Subscriber = typeof subscribers.$inferSelect
export type Media = typeof media.$inferSelect
export type Post = typeof posts.$inferSelect

