import { defineConfig } from "drizzle-kit";
import "dotenv/config";

/**
 * Drizzle Kit Configuration
 * 
 * This file configures Drizzle Kit for database operations like:
 * - Generating migrations: `bunx drizzle-kit generate`
 * - Applying migrations: `bunx drizzle-kit migrate`  
 * - Pushing schema changes: `bunx drizzle-kit push`
 * - Opening Drizzle Studio: `bunx drizzle-kit studio`
 * 
 * @see https://orm.drizzle.team/docs/get-started/supabase-new
 */
export default defineConfig({
  // Output directory for generated migration files
  out: "./drizzle",
  
  // Path to your database schema file(s)
  schema: "./lib/db/schema.ts",
  
  // Database dialect - PostgreSQL for Supabase
  dialect: "postgresql",
  
  // Database connection credentials
  dbCredentials: {
    // Supabase connection string from environment variables
    // Format: postgresql://postgres:[password]@[host]:5432/postgres
    url: process.env.DATABASE_URL!,
  },
  
  // Optional: Enable verbose logging for debugging
  verbose: true,
  
  // Optional: Enable strict mode for better type safety
  strict: true,
});
