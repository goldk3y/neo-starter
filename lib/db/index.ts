import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Database Connection Setup
 * 
 * This file establishes the connection to Supabase PostgreSQL database
 * using Drizzle ORM with the postgres-js driver.
 * 
 * Key considerations for Supabase:
 * - Connection pooling: If using "Transaction" pool mode, disable prepared statements
 * - Environment: Different connection strings for development vs production
 * - Performance: Connection is cached and reused across requests
 * 
 * @see https://orm.drizzle.team/docs/get-started/supabase-new
 */

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

/**
 * PostgreSQL connection configuration
 * 
 * Notes:
 * - `prepare: false` is required if using Supabase connection pooling in "Transaction" mode
 * - Remove this option if using "Session" mode or direct connection
 * - `max: 1` limits connection pool size for serverless environments
 */
const client = postgres(process.env.DATABASE_URL, {
  // Disable prepared statements for Supabase Transaction pooling mode
  prepare: false,
  
  // Limit connection pool size for serverless/edge environments
  max: 1,
  
  // Connection timeout (30 seconds)
  connect_timeout: 30,
  
  // Idle timeout (10 seconds) - helps with serverless cold starts
  idle_timeout: 10,
});

/**
 * Drizzle database instance
 * 
 * This is the main database object you'll use throughout your application.
 * It includes:
 * - All your schema definitions for type safety
 * - Query builder methods (select, insert, update, delete)
 * - Transaction support
 * - Migration utilities
 * 
 * Usage example:
 * ```typescript
 * import { db } from "@/lib/db";
 * 
 * const users = await db.select().from(usersTable);
 * ```
 */
export const db = drizzle(client, { 
  schema,
  
  // Enable logging in development for debugging
  logger: process.env.NODE_ENV === "development",
});

/**
 * Database client for advanced operations
 * 
 * Export the raw postgres client for operations that need direct SQL access:
 * - Custom migrations
 * - Database functions
 * - Raw SQL queries
 * - Connection management
 */
export { client };

/**
 * Type helper for inferring database types
 * 
 * This type represents the complete database schema and can be used
 * for type-safe operations across your application.
 */
export type Database = typeof db;
