import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";

/**
 * Next.js Middleware for Supabase Authentication
 * 
 * This middleware runs on every request and handles:
 * - Automatic session refresh
 * - Auth state synchronization between client and server
 * - Route protection for authenticated/unauthenticated users
 * - Cookie management for SSR compatibility
 * 
 * Key responsibilities:
 * 1. Refresh expired auth tokens automatically
 * 2. Sync auth state between client and server
 * 3. Protect routes based on authentication status
 * 4. Handle auth redirects and callbacks
 * 
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */

/**
 * Protected route patterns
 * 
 * Define which routes require authentication.
 * Users will be redirected to login if not authenticated.
 */
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/admin',
  // Add your protected routes here
] as const;

/**
 * Auth route patterns
 * 
 * Define routes that are only for unauthenticated users.
 * Authenticated users will be redirected away from these routes.
 */
const authRoutes = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
] as const;

/**
 * Public route patterns that bypass all auth checks
 * 
 * These routes are accessible to everyone regardless of auth status.
 */
const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/pricing',
  '/blog',
  // Add your public routes here
] as const;

/**
 * Admin route patterns that require admin role
 * 
 * These routes require both authentication and admin privileges.
 */
const adminRoutes = [
  '/admin',
  // Add your admin routes here
] as const;

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Set cookies in the request for Server Components
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          
          // Set cookies in the response for the browser
          supabaseResponse = NextResponse.next({
            request,
          });
          
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // Log auth errors for debugging (only in development)
  if (userError && process.env.NODE_ENV === 'development') {
    console.warn('Auth middleware error:', userError.message);
  }

  const { pathname } = request.nextUrl;

  // Handle auth callback routes (OAuth, magic links, etc.)
  if (pathname.startsWith('/auth/callback')) {
    // Let the callback route handle the auth flow
    return supabaseResponse;
  }

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if the current route is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if the current route requires admin access
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Allow public routes for everyone
  if (isPublicRoute && !isProtectedRoute) {
    return supabaseResponse;
  }

  // Handle protected routes
  if (isProtectedRoute) {
    if (!user) {
      // Redirect unauthenticated users to login
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Check admin routes
    if (isAdminRoute) {
      // Get user role from your database or user metadata
      // This is a simplified example - implement according to your auth setup
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        // Redirect non-admin users to dashboard or show 403
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/dashboard';
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  // Handle auth routes (login, signup, etc.)
  if (isAuthRoute && user) {
    // Redirect authenticated users away from auth pages
    const redirectUrl = request.nextUrl.clone();
    
    // Check if there's a redirect destination
    const redirectTo = request.nextUrl.searchParams.get('redirectTo');
    
    if (redirectTo && !authRoutes.some(route => redirectTo.startsWith(route))) {
      // Redirect to the intended destination
      redirectUrl.pathname = redirectTo;
      redirectUrl.search = '';
    } else {
      // Default redirect for authenticated users
      redirectUrl.pathname = '/dashboard';
      redirectUrl.search = '';
    }
    
    return NextResponse.redirect(redirectUrl);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}

/**
 * Middleware Configuration
 * 
 * Configure which routes the middleware should run on.
 * This uses Next.js matcher patterns to include/exclude specific paths.
 * 
 * The current configuration:
 * - Runs on all routes except static files and API routes
 * - Excludes Next.js internal routes (_next)
 * - Excludes common static file extensions
 * - Includes auth callback routes for OAuth flows
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml (SEO files)
     * - images, videos, documents (static assets)
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};

/**
 * Usage Notes:
 * 
 * 1. Route Protection:
 *    - Add new protected routes to the `protectedRoutes` array
 *    - Add new auth routes to the `authRoutes` array
 *    - Add new public routes to the `publicRoutes` array
 * 
 * 2. Role-Based Access:
 *    - Modify the admin check logic to match your user role system
 *    - You can add more role checks (moderator, premium, etc.)
 * 
 * 3. Custom Redirects:
 *    - Modify redirect URLs to match your app's navigation structure
 *    - Consider using environment variables for redirect URLs
 * 
 * 4. Performance:
 *    - The middleware runs on every request, so keep logic minimal
 *    - Database queries should be limited and cached when possible
 *    - Consider using user metadata for role checks instead of DB queries
 * 
 * 5. Debugging:
 *    - Auth errors are logged in development mode
 *    - Add more logging if needed for production debugging
 *    - Use Supabase Auth logs for detailed auth flow analysis
 * 
 * Example route structure:
 * ```
 * /                     -> Public (homepage)
 * /about               -> Public
 * /login               -> Auth only (redirects if authenticated)
 * /signup              -> Auth only (redirects if authenticated)
 * /dashboard           -> Protected (requires authentication)
 * /profile             -> Protected (requires authentication)
 * /admin               -> Admin only (requires admin role)
 * /auth/callback       -> OAuth callback (always accessible)
 * ```
 */
