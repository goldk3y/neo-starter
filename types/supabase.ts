/**
 * Supabase Database Types
 * 
 * This file contains TypeScript definitions for your Supabase database schema.
 * These types are used to provide type safety when working with Supabase clients.
 * 
 * In a real application, these types would be auto-generated using:
 * ```bash
 * npx supabase gen types typescript --project-id your-project-id --schema public > types/supabase.ts
 * ```
 * 
 * For this starter template, we've manually created types that match the
 * Drizzle schema defined in lib/db/schema.ts
 * 
 * @see https://supabase.com/docs/guides/api/rest/generating-types
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/**
 * Database interface representing the complete database schema
 */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          email_verified: string | null
          name: string | null
          avatar: string | null
          bio: string | null
          role: "admin" | "user" | "moderator"
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          email_verified?: string | null
          name?: string | null
          avatar?: string | null
          bio?: string | null
          role?: "admin" | "user" | "moderator"
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          email_verified?: string | null
          name?: string | null
          avatar?: string | null
          bio?: string | null
          role?: "admin" | "user" | "moderator"
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string | null
          excerpt: string | null
          status: "draft" | "published" | "archived"
          featured: boolean
          view_count: number
          author_id: string
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content?: string | null
          excerpt?: string | null
          status?: "draft" | "published" | "archived"
          featured?: boolean
          view_count?: number
          author_id: string
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string | null
          excerpt?: string | null
          status?: "draft" | "published" | "archived"
          featured?: boolean
          view_count?: number
          author_id?: string
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      comments: {
        Row: {
          id: string
          content: string
          post_id: string
          author_id: string
          parent_id: string | null
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          post_id: string
          author_id: string
          parent_id?: string | null
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          post_id?: string
          author_id?: string
          parent_id?: string | null
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "admin" | "user" | "moderator"
      post_status: "draft" | "published" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

/**
 * Schema type for direct table access
 */
export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

/**
 * Insert type for tables
 */
export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

/**
 * Update type for tables
 */
export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

/**
 * Enum types for easier access
 */
export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

/**
 * Convenient type aliases for common operations
 */

// User types
export type User = Tables<"users">
export type UserInsert = TablesInsert<"users">
export type UserUpdate = TablesUpdate<"users">
export type UserRole = Enums<"user_role">

// Post types
export type Post = Tables<"posts">
export type PostInsert = TablesInsert<"posts">
export type PostUpdate = TablesUpdate<"posts">
export type PostStatus = Enums<"post_status">

// Comment types
export type Comment = Tables<"comments">
export type CommentInsert = TablesInsert<"comments">
export type CommentUpdate = TablesUpdate<"comments">

/**
 * Extended types with relationships
 * 
 * These types include related data that's commonly fetched together.
 * Use these for queries that include joins or nested data.
 */

export interface PostWithAuthor extends Post {
  author: Pick<User, "id" | "name" | "avatar" | "email">
}

export interface PostWithAuthorAndComments extends PostWithAuthor {
  comments: CommentWithAuthor[]
}

export interface CommentWithAuthor extends Comment {
  author: Pick<User, "id" | "name" | "avatar">
}

export interface CommentWithReplies extends CommentWithAuthor {
  replies: CommentWithAuthor[]
}

export interface UserWithStats extends User {
  _count: {
    posts: number
    comments: number
  }
}

/**
 * Auth-related types
 * 
 * These types extend Supabase's built-in auth types with our custom user data.
 */

export interface AuthUser {
  id: string
  email: string
  email_confirmed_at?: string
  phone?: string
  user_metadata?: {
    name?: string
    avatar?: string
    [key: string]: any
  }
  app_metadata?: {
    role?: UserRole
    [key: string]: any
  }
}

export interface AuthSession {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  user: AuthUser
}

/**
 * API Response types
 * 
 * Common response patterns for API routes and server actions.
 */

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * Real-time types
 * 
 * Types for Supabase real-time subscriptions.
 */

export interface RealtimePayload<T = any> {
  schema: string
  table: string
  commit_timestamp: string
  eventType: "INSERT" | "UPDATE" | "DELETE"
  new?: T
  old?: T
  errors?: string[]
}

/**
 * Storage types
 * 
 * Types for Supabase Storage operations.
 */

export interface StorageObject {
  name: string
  id: string
  updated_at: string
  created_at: string
  last_accessed_at: string
  metadata: {
    eTag: string
    size: number
    mimetype: string
    cacheControl: string
    lastModified: string
    contentLength: number
    httpStatusCode: number
  }
}

export interface UploadResponse {
  path: string
  id: string
  fullPath: string
}

/**
 * Query types
 * 
 * Helper types for building type-safe queries.
 */

export type QueryFilter<T> = {
  [K in keyof T]?: T[K] | { in: T[K][] } | { not: T[K] }
}

export type QuerySort<T> = {
  [K in keyof T]?: "asc" | "desc"
}

export interface QueryOptions<T> {
  filter?: QueryFilter<T>
  sort?: QuerySort<T>
  limit?: number
  offset?: number
}

/**
 * Usage Examples:
 * 
 * 1. Basic CRUD operations:
 * ```typescript
 * import type { User, UserInsert, UserUpdate } from '@/types/supabase'
 * 
 * const newUser: UserInsert = {
 *   email: 'user@example.com',
 *   name: 'John Doe',
 *   role: 'user'
 * }
 * 
 * const userUpdate: UserUpdate = {
 *   name: 'Jane Doe'
 * }
 * ```
 * 
 * 2. Type-safe queries:
 * ```typescript
 * import type { PostWithAuthor } from '@/types/supabase'
 * 
 * const posts: PostWithAuthor[] = await supabase
 *   .from('posts')
 *   .select('*, author:users(id, name, avatar, email)')
 *   .eq('status', 'published')
 * ```
 * 
 * 3. Real-time subscriptions:
 * ```typescript
 * import type { RealtimePayload, Post } from '@/types/supabase'
 * 
 * const subscription = supabase
 *   .channel('posts')
 *   .on('postgres_changes', {
 *     event: 'INSERT',
 *     schema: 'public',
 *     table: 'posts'
 *   }, (payload: RealtimePayload<Post>) => {
 *     console.log('New post:', payload.new)
 *   })
 *   .subscribe()
 * ```
 * 
 * 4. API responses:
 * ```typescript
 * import type { ApiResponse, PaginatedResponse, Post } from '@/types/supabase'
 * 
 * export async function GET(): Promise<Response> {
 *   const response: PaginatedResponse<Post> = {
 *     data: posts,
 *     pagination: {
 *       page: 1,
 *       limit: 10,
 *       total: 100,
 *       totalPages: 10
 *     }
 *   }
 *   
 *   return Response.json(response)
 * }
 * ```
 */

/**
 * Type generation command:
 * 
 * To regenerate these types from your actual Supabase database:
 * 
 * ```bash
 * # Install the Supabase CLI
 * npm install -g supabase
 * 
 * # Generate types
 * supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > types/supabase.ts
 * 
 * # Or using npx (without global install)
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > types/supabase.ts
 * ```
 * 
 * You can also set up automatic type generation in your CI/CD pipeline
 * to keep types in sync with your database schema changes.
 */
