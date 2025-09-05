import { 
  boolean, 
  integer, 
  pgEnum, 
  pgTable, 
  text, 
  timestamp, 
  uuid, 
  varchar 
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Database Schema Definition
 * 
 * This file defines your database structure using Drizzle ORM's schema syntax.
 * Each table is defined with columns, constraints, and relationships.
 * 
 * Key features demonstrated:
 * - Primary keys and foreign keys
 * - Enums for controlled values
 * - Timestamps with defaults
 * - Relationships between tables
 * - Type inference for TypeScript
 * 
 * @see https://orm.drizzle.team/docs/get-started/supabase-new
 */

/**
 * Enums - Define controlled vocabularies
 * 
 * PostgreSQL enums provide type safety and database-level validation.
 * They're perfect for status fields, user roles, etc.
 */
export const userRoleEnum = pgEnum("user_role", [
  "admin", 
  "user", 
  "moderator"
]);

export const postStatusEnum = pgEnum("post_status", [
  "draft", 
  "published", 
  "archived"
]);

/**
 * Users Table
 * 
 * Core user entity with authentication and profile information.
 * Designed to work with Supabase Auth or custom authentication.
 */
export const usersTable = pgTable("users", {
  // Primary key - UUID is recommended for distributed systems
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Authentication fields
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified"),
  
  // Profile information
  name: varchar("name", { length: 255 }),
  avatar: text("avatar"), // URL to profile image
  bio: text("bio"),
  
  // Role and permissions
  role: userRoleEnum("role").default("user").notNull(),
  
  // Account status
  isActive: boolean("is_active").default(true).notNull(),
  
  // Timestamps - Essential for auditing
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Posts Table
 * 
 * Example content table demonstrating relationships and more complex fields.
 * Perfect for blogs, social media, or any content-driven application.
 */
export const postsTable = pgTable("posts", {
  // Primary key
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Content fields
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content"),
  excerpt: text("excerpt"),
  
  // Metadata
  status: postStatusEnum("status").default("draft").notNull(),
  featured: boolean("featured").default(false).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  
  // Foreign key to users table
  authorId: uuid("author_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  
  // Timestamps
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Comments Table
 * 
 * Demonstrates many-to-one relationships and hierarchical data.
 * Shows how to handle user-generated content with moderation.
 */
export const commentsTable = pgTable("comments", {
  // Primary key
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Content
  content: text("content").notNull(),
  
  // Relationships
  postId: uuid("post_id")
    .references(() => postsTable.id, { onDelete: "cascade" })
    .notNull(),
  authorId: uuid("author_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  
  // Hierarchical comments (replies)
  parentId: uuid("parent_id"),
  
  // Moderation
  isApproved: boolean("is_approved").default(false).notNull(),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Relationships Definition
 * 
 * Define how tables relate to each other for type-safe joins.
 * This enables Drizzle's relational query API with automatic type inference.
 */

// User relationships
export const usersRelations = relations(usersTable, ({ many }) => ({
  // One user can have many posts
  posts: many(postsTable),
  
  // One user can have many comments
  comments: many(commentsTable),
}));

// Post relationships  
export const postsRelations = relations(postsTable, ({ one, many }) => ({
  // Each post belongs to one author
  author: one(usersTable, {
    fields: [postsTable.authorId],
    references: [usersTable.id],
  }),
  
  // One post can have many comments
  comments: many(commentsTable),
}));

// Comment relationships
export const commentsRelations = relations(commentsTable, ({ one, many }) => ({
  // Each comment belongs to one post
  post: one(postsTable, {
    fields: [commentsTable.postId],
    references: [postsTable.id],
  }),
  
  // Each comment belongs to one author
  author: one(usersTable, {
    fields: [commentsTable.authorId],
    references: [usersTable.id],
  }),
  
  // Parent comment for replies (self-referencing)
  parent: one(commentsTable, {
    fields: [commentsTable.parentId],
    references: [commentsTable.id],
  }),
  
  // Child comments (replies)
  replies: many(commentsTable),
}));

/**
 * Type Inference Helpers
 * 
 * These types are automatically inferred from your schema and provide
 * type safety throughout your application.
 */

// Insert types - for creating new records
export type InsertUser = typeof usersTable.$inferInsert;
export type InsertPost = typeof postsTable.$inferInsert;
export type InsertComment = typeof commentsTable.$inferInsert;

// Select types - for reading existing records
export type SelectUser = typeof usersTable.$inferSelect;
export type SelectPost = typeof postsTable.$inferSelect;
export type SelectComment = typeof commentsTable.$inferSelect;

/**
 * Usage Examples:
 * 
 * 1. Create a new user:
 * ```typescript
 * const newUser: InsertUser = {
 *   email: "user@example.com",
 *   name: "John Doe",
 *   role: "user"
 * };
 * await db.insert(usersTable).values(newUser);
 * ```
 * 
 * 2. Query with relationships:
 * ```typescript
 * const userWithPosts = await db.query.usersTable.findFirst({
 *   where: eq(usersTable.id, userId),
 *   with: {
 *     posts: true
 *   }
 * });
 * ```
 * 
 * 3. Complex query with filters:
 * ```typescript
 * const publishedPosts = await db
 *   .select()
 *   .from(postsTable)
 *   .where(eq(postsTable.status, "published"))
 *   .orderBy(desc(postsTable.createdAt));
 * ```
 */
