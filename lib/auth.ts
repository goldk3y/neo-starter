import { 
  createClient as createServerClient, 
  createRouteHandlerClient, 
  createActionClient,
  createAdminClient,
  getCurrentUser,
  getCurrentSession 
} from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import type { 
  User, 
  UserRole, 
  AuthUser, 
  AuthSession,
  ApiResponse 
} from "@/types/supabase";

/**
 * Authentication Utilities
 * 
 * This file provides a comprehensive set of authentication utilities
 * for both client-side and server-side operations.
 * 
 * Features:
 * - User authentication and management
 * - Role-based access control
 * - Session management
 * - Password utilities
 * - Profile management
 * 
 * @see https://supabase.com/docs/guides/auth
 */

/**
 * Authentication Errors
 */
export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * User Sign Up
 * 
 * Creates a new user account with email and password.
 * Optionally creates a user profile record.
 * 
 * @param email - User's email address
 * @param password - User's password
 * @param userData - Additional user profile data
 * @returns Promise with user data or error
 */
export async function signUp(
  email: string,
  password: string,
  userData?: {
    name?: string;
    redirectTo?: string;
  }
): Promise<ApiResponse<AuthUser>> {
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: userData?.redirectTo,
        data: {
          name: userData?.name,
        },
      },
    });

    if (error) {
      throw new AuthError(error.message, error.message);
    }

    // If user was created successfully, create profile record
    if (data.user && !error) {
      await createUserProfile(data.user.id, {
        email,
        name: userData?.name || null,
      });
    }

    return {
      data: data.user as AuthUser,
      message: 'Account created successfully. Please check your email to verify your account.',
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to create account',
    };
  }
}

/**
 * User Sign In
 * 
 * Authenticates user with email and password.
 * 
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise with user data or error
 */
export async function signIn(
  email: string,
  password: string
): Promise<ApiResponse<AuthUser>> {
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new AuthError(error.message, error.message);
    }

    return {
      data: data.user as AuthUser,
      message: 'Signed in successfully',
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to sign in',
    };
  }
}

/**
 * OAuth Sign In
 * 
 * Authenticates user with OAuth provider.
 * 
 * @param provider - OAuth provider (google, github, etc.)
 * @param redirectTo - URL to redirect after authentication
 * @returns Promise with error if any
 */
export async function signInWithOAuth(
  provider: 'google' | 'github' | 'discord' | 'facebook' | 'twitter',
  redirectTo?: string
): Promise<ApiResponse<null>> {
  try {
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw new AuthError(error.message, error.message);
    }

    return {
      message: `Redirecting to ${provider}...`,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to authenticate with OAuth',
    };
  }
}

/**
 * User Sign Out
 * 
 * Signs out the current user and clears the session.
 * 
 * @returns Promise with success message or error
 */
export async function signOut(): Promise<ApiResponse<null>> {
  try {
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new AuthError(error.message, error.message);
    }

    return {
      message: 'Signed out successfully',
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to sign out',
    };
  }
}

/**
 * Reset Password
 * 
 * Sends a password reset email to the user.
 * 
 * @param email - User's email address
 * @param redirectTo - URL to redirect after password reset
 * @returns Promise with success message or error
 */
export async function resetPassword(
  email: string,
  redirectTo?: string
): Promise<ApiResponse<null>> {
  try {
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo || `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw new AuthError(error.message, error.message);
    }

    return {
      message: 'Password reset email sent. Please check your inbox.',
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to send reset email',
    };
  }
}

/**
 * Update Password
 * 
 * Updates the user's password.
 * 
 * @param password - New password
 * @returns Promise with success message or error
 */
export async function updatePassword(password: string): Promise<ApiResponse<null>> {
  try {
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw new AuthError(error.message, error.message);
    }

    return {
      message: 'Password updated successfully',
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to update password',
    };
  }
}

/**
 * Get Current User (Server-side)
 * 
 * Retrieves the current authenticated user on the server.
 * This is a re-export for convenience.
 */
export { getCurrentUser, getCurrentSession };

/**
 * Get Current User Profile
 * 
 * Retrieves the current user's profile data from the database.
 * 
 * @returns Promise with user profile or null
 */
export async function getCurrentUserProfile(): Promise<User | null> {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return null;
    }

    const supabase = await createServerClient();
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error.message);
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Unexpected error fetching user profile:', error);
    return null;
  }
}

/**
 * Create User Profile
 * 
 * Creates a new user profile record in the database.
 * This is typically called after successful user registration.
 * 
 * @param userId - User's ID from auth
 * @param profileData - Profile data to create
 * @returns Promise with created profile or error
 */
export async function createUserProfile(
  userId: string,
  profileData: {
    email: string;
    name?: string | null;
    avatar?: string | null;
    bio?: string | null;
    role?: UserRole;
  }
): Promise<ApiResponse<User>> {
  try {
    const supabase = await createActionClient();
    
    const { data: profile, error } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: profileData.email,
        name: profileData.name || null,
        avatar: profileData.avatar || null,
        bio: profileData.bio || null,
        role: profileData.role || 'user',
      })
      .select()
      .single();

    if (error) {
      throw new AuthError(error.message, error.message);
    }

    return {
      data: profile,
      message: 'Profile created successfully',
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to create profile',
    };
  }
}

/**
 * Update User Profile
 * 
 * Updates the current user's profile data.
 * 
 * @param profileData - Profile data to update
 * @returns Promise with updated profile or error
 */
export async function updateUserProfile(
  profileData: {
    name?: string;
    avatar?: string;
    bio?: string;
  }
): Promise<ApiResponse<User>> {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new AuthError('User not authenticated');
    }

    const supabase = await createActionClient();
    
    const { data: profile, error } = await supabase
      .from('users')
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      throw new AuthError(error.message, error.message);
    }

    return {
      data: profile,
      message: 'Profile updated successfully',
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to update profile',
    };
  }
}

/**
 * Check User Role
 * 
 * Checks if the current user has the specified role or higher.
 * 
 * @param requiredRole - Required role to check
 * @param userRole - User's current role (optional, will fetch if not provided)
 * @returns Promise<boolean> - True if user has required role or higher
 */
export async function checkUserRole(
  requiredRole: UserRole,
  userRole?: UserRole
): Promise<boolean> {
  try {
    let role = userRole;
    
    if (!role) {
      const profile = await getCurrentUserProfile();
      if (!profile) {
        return false;
      }
      role = profile.role;
    }

    // Define role hierarchy
    const roleHierarchy: Record<UserRole, number> = {
      user: 1,
      moderator: 2,
      admin: 3,
    };

    return roleHierarchy[role] >= roleHierarchy[requiredRole];
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
}

/**
 * Require Authentication
 * 
 * Throws an error if the user is not authenticated.
 * Use this in API routes or server actions that require authentication.
 * 
 * @returns Promise<AuthUser> - The authenticated user
 * @throws AuthError if user is not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new AuthError('Authentication required', 'UNAUTHORIZED');
  }
  
  return user as AuthUser;
}

/**
 * Require Role
 * 
 * Throws an error if the user doesn't have the required role.
 * Use this in API routes or server actions that require specific permissions.
 * 
 * @param requiredRole - Required role to access the resource
 * @returns Promise<User> - The authenticated user with required role
 * @throws AuthError if user doesn't have required role
 */
export async function requireRole(requiredRole: UserRole): Promise<User> {
  const user = await requireAuth();
  const profile = await getCurrentUserProfile();
  
  if (!profile) {
    throw new AuthError('User profile not found', 'PROFILE_NOT_FOUND');
  }
  
  const hasRole = await checkUserRole(requiredRole, profile.role);
  
  if (!hasRole) {
    throw new AuthError(
      `Access denied. Required role: ${requiredRole}`,
      'INSUFFICIENT_PERMISSIONS'
    );
  }
  
  return profile;
}

/**
 * Is User Active
 * 
 * Checks if the user account is active and not suspended.
 * 
 * @param userId - User ID to check (optional, uses current user if not provided)
 * @returns Promise<boolean> - True if user is active
 */
export async function isUserActive(userId?: string): Promise<boolean> {
  try {
    let targetUserId = userId;
    
    if (!targetUserId) {
      const user = await getCurrentUser();
      if (!user) {
        return false;
      }
      targetUserId = user.id;
    }

    const supabase = await createServerClient();
    const { data: profile, error } = await supabase
      .from('users')
      .select('is_active')
      .eq('id', targetUserId)
      .single();

    if (error) {
      console.error('Error checking user status:', error.message);
      return false;
    }

    return profile?.is_active ?? false;
  } catch (error) {
    console.error('Unexpected error checking user status:', error);
    return false;
  }
}

/**
 * Ban User
 * 
 * Deactivates a user account. Requires admin privileges.
 * 
 * @param userId - User ID to ban
 * @returns Promise with success message or error
 */
export async function banUser(userId: string): Promise<ApiResponse<null>> {
  try {
    await requireRole('admin');

    const supabase = await createActionClient();
    
    const { error } = await supabase
      .from('users')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      throw new AuthError(error.message, error.message);
    }

    return {
      message: 'User banned successfully',
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to ban user',
    };
  }
}

/**
 * Unban User
 * 
 * Reactivates a user account. Requires admin privileges.
 * 
 * @param userId - User ID to unban
 * @returns Promise with success message or error
 */
export async function unbanUser(userId: string): Promise<ApiResponse<null>> {
  try {
    await requireRole('admin');

    const supabase = await createActionClient();
    
    const { error } = await supabase
      .from('users')
      .update({
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      throw new AuthError(error.message, error.message);
    }

    return {
      message: 'User unbanned successfully',
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to unban user',
    };
  }
}

/**
 * Password Validation Utility
 * 
 * Validates password strength according to security best practices.
 * 
 * @param password - Password to validate
 * @returns Object with validation result and feedback
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
} {
  const errors: string[] = [];
  let score = 0;

  // Length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    score += 1;
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  // Number check
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  // Special character check
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    score += 1;
  }

  // Determine strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 4) {
    strength = 'strong';
  } else if (score >= 3) {
    strength = 'medium';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

/**
 * Usage Examples:
 * 
 * 1. Sign up new user:
 * ```typescript
 * const result = await signUp('user@example.com', 'password123', {
 *   name: 'John Doe'
 * })
 * 
 * if (result.error) {
 *   console.error(result.error)
 * } else {
 *   console.log('User created:', result.data)
 * }
 * ```
 * 
 * 2. Protect API route:
 * ```typescript
 * export async function POST() {
 *   try {
 *     const user = await requireAuth()
 *     // Handle authenticated request
 *   } catch (error) {
 *     return Response.json({ error: error.message }, { status: 401 })
 *   }
 * }
 * ```
 * 
 * 3. Check user permissions:
 * ```typescript
 * const canModerate = await checkUserRole('moderator')
 * if (canModerate) {
 *   // Show moderation controls
 * }
 * ```
 * 
 * 4. Update user profile:
 * ```typescript
 * const result = await updateUserProfile({
 *   name: 'Jane Doe',
 *   bio: 'Software developer'
 * })
 * ```
 */
