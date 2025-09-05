import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";
import type { Database } from "@/types/supabase";

/**
 * Supabase Client-Side Configuration
 * 
 * This file creates a Supabase client for use in Client Components, 
 * browser contexts, and client-side operations.
 * 
 * Following the official Supabase Next.js guide:
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */

/**
 * Create Supabase client for client-side operations
 * 
 * This function creates a new Supabase client instance for browser usage.
 * It's the recommended pattern from the official Supabase documentation.
 * 
 * Usage in Client Components:
 * ```tsx
 * 'use client'
 * import { createClient } from '@/lib/supabase/client'
 * 
 * export default function ClientComponent() {
 *   const supabase = createClient()
 *   // Use supabase client...
 * }
 * ```
 */
export function createClient() {
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Type helper for Supabase client
 * 
 * Use this type when you need to type a Supabase client instance,
 * for example in React Context or custom hooks.
 */
export type SupabaseClient = ReturnType<typeof createClient>;

/**
 * Re-export commonly used types for convenience
 */
export type { Database } from "@/types/supabase";

/**
 * Usage Examples:
 * 
 * 1. Authentication:
 * ```tsx
 * import { createClient } from '@/lib/supabase/client'
 * 
 * const supabase = createClient()
 * 
 * // Sign in with email/password
 * const { data, error } = await supabase.auth.signInWithPassword({
 *   email: 'user@example.com',
 *   password: 'password123'
 * })
 * 
 * // Sign in with OAuth
 * const { data, error } = await supabase.auth.signInWithOAuth({
 *   provider: 'google'
 * })
 * 
 * // Sign out
 * await supabase.auth.signOut()
 * ```
 * 
 * 2. Database Operations:
 * ```tsx
 * import { createClient } from '@/lib/supabase/client'
 * 
 * const supabase = createClient()
 * 
 * // Fetch data
 * const { data: posts } = await supabase
 *   .from('posts')
 *   .select('*')
 *   .eq('status', 'published')
 * 
 * // Insert data
 * const { data, error } = await supabase
 *   .from('posts')
 *   .insert({ title: 'Hello World', content: '...' })
 * ```
 */
