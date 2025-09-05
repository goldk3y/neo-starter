import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Environment Variables Validation
 * 
 * This file uses T3 Env to provide type-safe environment variable validation.
 * It ensures all required environment variables are present and properly typed
 * at build time, preventing runtime errors from missing configuration.
 * 
 * Features:
 * - Type-safe environment variables
 * - Build-time validation
 * - Separate client/server variable handling
 * - Runtime checks in development
 * - Automatic type inference
 * 
 * @see https://env.t3.gg/docs/nextjs
 */
export const env = createEnv({
  /**
   * Server-side Environment Variables
   * 
   * These variables are only available on the server and are not
   * exposed to the client bundle. Perfect for sensitive data like
   * API keys, database connections, and secrets.
   */
  server: {
    // Database connection
    DATABASE_URL: z
      .string()
      .url("DATABASE_URL must be a valid PostgreSQL connection string")
      .describe("PostgreSQL database connection string for Supabase"),
    
    // Supabase server configuration
    SUPABASE_SERVICE_ROLE_KEY: z
      .string()
      .min(1, "SUPABASE_SERVICE_ROLE_KEY is required for server operations")
      .describe("Supabase service role key for admin operations"),
    
    SUPABASE_JWT_SECRET: z
      .string()
      .optional()
      .describe("Supabase JWT secret for token verification"),
    
    // Environment detection
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development")
      .describe("Current environment"),
    
    // Optional: Analytics and monitoring
    SENTRY_DSN: z
      .string()
      .url()
      .optional()
      .describe("Sentry DSN for error monitoring"),
    
    // Optional: Email service
    RESEND_API_KEY: z
      .string()
      .optional()
      .describe("Resend API key for transactional emails"),
    
    // Optional: OpenAI integration
    OPENAI_API_KEY: z
      .string()
      .optional()
      .describe("OpenAI API key for AI features"),
    
    // Optional: Payment processing
    STRIPE_SECRET_KEY: z
      .string()
      .optional()
      .describe("Stripe secret key for payment processing"),
    
    STRIPE_WEBHOOK_SECRET: z
      .string()
      .optional()
      .describe("Stripe webhook secret for event verification"),
  },

  /**
   * Client-side Environment Variables
   * 
   * These variables are exposed to the client bundle and must be
   * prefixed with NEXT_PUBLIC_. Only include non-sensitive data
   * that's safe to expose to end users.
   */
  client: {
    // Supabase client configuration
    NEXT_PUBLIC_SUPABASE_URL: z
      .string()
      .url("NEXT_PUBLIC_SUPABASE_URL must be a valid Supabase project URL")
      .describe("Supabase project URL"),
    
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z
      .string()
      .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required for client operations")
      .describe("Supabase anonymous/public key"),
    
    // Optional: Analytics
    NEXT_PUBLIC_GA_MEASUREMENT_ID: z
      .string()
      .optional()
      .describe("Google Analytics measurement ID"),
    
    NEXT_PUBLIC_POSTHOG_KEY: z
      .string()
      .optional()
      .describe("PostHog project key for analytics"),
    
    NEXT_PUBLIC_POSTHOG_HOST: z
      .string()
      .url()
      .optional()
      .describe("PostHog instance URL"),
    
    // Optional: Payment processing (public keys only)
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
      .string()
      .optional()
      .describe("Stripe publishable key for client-side payment processing"),
    
    // Application configuration
    NEXT_PUBLIC_APP_URL: z
      .string()
      .url()
      .default("http://localhost:3000")
      .describe("Application base URL"),
  },

  /**
   * Runtime Environment Variables
   * 
   * Variables that are available at runtime but need special handling.
   * Useful for variables that might not be available during build time.
   */
  runtimeEnv: {
    // Server variables
    DATABASE_URL: process.env.DATABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    SENTRY_DSN: process.env.SENTRY_DSN,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    
    // Client variables  
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  /**
   * Skip validation during build
   * 
   * Set to true if you want to skip validation during build time.
   * Useful for Docker builds or CI/CD where env vars might not be available.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Makes it so that empty strings are treated as undefined.
   * This is useful for optional environment variables.
   */
  emptyStringAsUndefined: true,
});

/**
 * Usage Examples:
 * 
 * 1. Type-safe server-side usage:
 * ```typescript
 * import { env } from "@/lib/env";
 * 
 * // ✅ Type-safe and validated
 * const dbUrl = env.DATABASE_URL;
 * 
 * // ❌ TypeScript error - not defined in schema
 * const invalidVar = env.SOME_INVALID_VAR;
 * ```
 * 
 * 2. Client-side usage:
 * ```typescript
 * import { env } from "@/lib/env";
 * 
 * // ✅ Available on client
 * const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
 * 
 * // ❌ TypeScript error - server-only variable
 * const dbUrl = env.DATABASE_URL;
 * ```
 * 
 * 3. Conditional logic based on environment:
 * ```typescript
 * import { env } from "@/lib/env";
 * 
 * if (env.NODE_ENV === "development") {
 *   console.log("Running in development mode");
 * }
 * ```
 */

/**
 * Type exports for use throughout the application
 */
export type Env = typeof env;
