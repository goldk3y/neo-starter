import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import type { Database } from "@/types/supabase";

/**
 * Supabase Server-Side Configuration
 * 
 * This file creates Supabase clients for server-side operations including:
 * - Server Components
 * - API Routes  
 * - Server Actions
 * - Middleware
 * 
 * Key features:
 * - Cookie-based session management for SSR
 * - Automatic session refresh on server
 * - Type-safe database operations
 * - Support for both read-only and read-write operations
 * 
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */

/**
 * Create Supabase client for Server Components
 * 
 * Use this for server-side data fetching in Server Components.
 * This client can read cookies but cannot modify them, making it
 * suitable for read-only operations.
 * 
 * Usage in Server Components:
 * ```tsx
 * import { createClient } from '@/lib/supabase/server'
 * 
 * export default async function Page() {
 *   const supabase = await createClient()
 *   const { data: posts } = await supabase.from('posts').select('*')
 *   return <div>{posts?.map(post => ...)}</div>
 * }
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        // Read cookies for authentication state
        getAll() {
          return cookieStore.getAll();
        },
        
        // Server Components are read-only, so we provide empty implementations
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Create Supabase client for API Routes
 * 
 * Use this in API routes where you need to read and write cookies.
 * This client can modify authentication state and is suitable for
 * authentication flows and user management.
 * 
 * Usage in API Routes:
 * ```tsx
 * import { createRouteHandlerClient } from '@/lib/supabase/server'
 * 
 * export async function POST(request: Request) {
 *   const supabase = await createRouteHandlerClient()
 *   
 *   const { data: user, error } = await supabase.auth.getUser()
 *   
 *   if (error) {
 *     return Response.json({ error: error.message }, { status: 401 })
 *   }
 *   
 *   // Perform authenticated operations
 *   return Response.json({ user })
 * }
 * ```
 */
export async function createRouteHandlerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        // Read all cookies
        getAll() {
          return cookieStore.getAll();
        },
        
        // Set multiple cookies (for auth state updates)
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}

/**
 * Create Supabase client for Server Actions
 * 
 * Use this in Server Actions where you need to modify authentication
 * state or perform mutations that require cookie updates.
 * 
 * Usage in Server Actions:
 * ```tsx
 * import { createActionClient } from '@/lib/supabase/server'
 * import { revalidatePath } from 'next/cache'
 * 
 * export async function createPost(formData: FormData) {
 *   const supabase = await createActionClient()
 *   
 *   const { data, error } = await supabase
 *     .from('posts')
 *     .insert({ title: formData.get('title') })
 *   
 *   if (error) {
 *     throw new Error(error.message)
 *   }
 *   
 *   revalidatePath('/posts')
 *   return data
 * }
 * ```
 */
export async function createActionClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        // Read all cookies
        getAll() {
          return cookieStore.getAll();
        },
        
        // Set multiple cookies with proper options
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, {
              ...options,
              // Ensure cookies are available across the app
              path: '/',
              // Set security options for production
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              httpOnly: false, // Allow client-side access for auth
            });
          });
        },
      },
    }
  );
}

/**
 * Create Supabase client with Service Role key
 * 
 * Use this for admin operations that bypass RLS (Row Level Security).
 * This should ONLY be used in server-side contexts where you need
 * elevated permissions.
 * 
 * ⚠️ SECURITY WARNING: This client bypasses all RLS policies!
 * Only use for trusted admin operations.
 * 
 * Usage for admin operations:
 * ```tsx
 * import { createAdminClient } from '@/lib/supabase/server'
 * 
 * export async function deleteUserAccount(userId: string) {
 *   const supabase = createAdminClient()
 *   
 *   // This bypasses RLS and can delete any user
 *   const { error } = await supabase
 *     .from('users')
 *     .delete()
 *     .eq('id', userId)
 *   
 *   return { error }
 * }
 * ```
 */
export async function createAdminClient() {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is required for admin operations. ' +
      'Add it to your environment variables.'
    );
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // For admin client, we don't need to set cookies
          // but the interface requires it
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Admin operations don't need cookie management
          }
        },
      },
      auth: {
        // Disable automatic token refresh for service role
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Helper function to get current user from server context
 * 
 * This is a convenience function that handles the common pattern
 * of getting the current authenticated user on the server.
 * 
 * Usage:
 * ```tsx
 * import { getCurrentUser } from '@/lib/supabase/server'
 * 
 * export default async function ProtectedPage() {
 *   const user = await getCurrentUser()
 *   
 *   if (!user) {
 *     redirect('/login')
 *   }
 *   
 *   return <div>Welcome, {user.email}!</div>
 * }
 * ```
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting user:', error.message);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Unexpected error getting user:', error);
    return null;
  }
}

/**
 * Helper function to get current session from server context
 * 
 * This retrieves the full session including access token,
 * which is useful for operations that need token information.
 * 
 * Usage:
 * ```tsx
 * import { getCurrentSession } from '@/lib/supabase/server'
 * 
 * export async function GET() {
 *   const session = await getCurrentSession()
 *   
 *   if (!session) {
 *     return Response.json({ error: 'Unauthorized' }, { status: 401 })
 *   }
 *   
 *   // Access token is available in session.access_token
 *   return Response.json({ user: session.user })
 * }
 * ```
 */
export async function getCurrentSession() {
  const supabase = await createClient();
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error.message);
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Unexpected error getting session:', error);
    return null;
  }
}

/**
 * Type exports for convenience
 */
export type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;
export type SupabaseAdminClient = Awaited<ReturnType<typeof createAdminClient>>;

/**
 * Usage Examples:
 * 
 * 1. Server Component Data Fetching:
 * ```tsx
 * import { createClient } from '@/lib/supabase/server'
 * 
 * export default async function PostsPage() {
 *   const supabase = await createClient()
 *   
 *   const { data: posts, error } = await supabase
 *     .from('posts')
 *     .select('*, author:users(name)')
 *     .eq('status', 'published')
 *     .order('created_at', { ascending: false })
 *   
 *   if (error) {
 *     throw new Error('Failed to fetch posts')
 *   }
 *   
 *   return (
 *     <div>
 *       {posts.map(post => (
 *         <article key={post.id}>
 *           <h2>{post.title}</h2>
 *           <p>By {post.author.name}</p>
 *         </article>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 * 
 * 2. API Route with Authentication:
 * ```tsx
 * import { createRouteHandlerClient } from '@/lib/supabase/server'
 * 
 * export async function POST(request: Request) {
 *   const supabase = await createRouteHandlerClient()
 *   const json = await request.json()
 *   
 *   // Check authentication
 *   const { data: { user }, error: authError } = await supabase.auth.getUser()
 *   
 *   if (authError || !user) {
 *     return Response.json({ error: 'Unauthorized' }, { status: 401 })
 *   }
 *   
 *   // Perform authenticated operation
 *   const { data, error } = await supabase
 *     .from('posts')
 *     .insert({ ...json, author_id: user.id })
 *     .select()
 *   
 *   if (error) {
 *     return Response.json({ error: error.message }, { status: 400 })
 *   }
 *   
 *   return Response.json({ data })
 * }
 * ```
 * 
 * 3. Server Action with Mutations:
 * ```tsx
 * import { createActionClient } from '@/lib/supabase/server'
 * import { revalidatePath } from 'next/cache'
 * import { redirect } from 'next/navigation'
 * 
 * export async function createPost(formData: FormData) {
 *   const supabase = await createActionClient()
 *   
 *   const { data: { user } } = await supabase.auth.getUser()
 *   
 *   if (!user) {
 *     redirect('/login')
 *   }
 *   
 *   const { data, error } = await supabase
 *     .from('posts')
 *     .insert({
 *       title: formData.get('title') as string,
 *       content: formData.get('content') as string,
 *       author_id: user.id
 *     })
 *   
 *   if (error) {
 *     throw new Error(error.message)
 *   }
 *   
 *   revalidatePath('/posts')
 *   redirect(`/posts/${data[0].id}`)
 * }
 * ```
 */
