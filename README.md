# 🚀 Neo

**The ultimate Next.js starter template** — Modern, fast, and production-ready with cutting-edge technologies.

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-SSR-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Bun](https://img.shields.io/badge/Bun-fast-fbf0df?style=flat-square&logo=bun)](https://bun.sh/)

## ✨ Features

- 🏗️ **Next.js 15** — Latest React framework with App Router and Turbopack
- ⚛️ **React 19** — Latest React with improved performance and concurrent features
- 🎨 **Tailwind CSS v4** — Cutting-edge styling with CSS variables and dark mode
- 🌓 **Dark Mode** — Built-in theme switching with next-themes (defaults to dark)
- 🔐 **Authentication** — Complete Supabase auth with SSR, OAuth, and role-based access
- 🗃️ **Database** — Type-safe Supabase + Drizzle ORM with auto-generated types
- 🛡️ **Security** — Route protection, middleware guards, and RLS policies
- 🎭 **UI Components** — 11 pre-installed shadcn/ui components with Lucide icons
- ✨ **Animations** — Motion library for smooth, performant interactions
- 🔒 **Type Safety** — Full TypeScript with Zod validation and T3 Env
- ⚡ **Performance** — Optimized fonts, images, and server-side rendering
- 🛠️ **Developer Experience** — Biome linting, comprehensive docs, and examples

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- [Supabase](https://supabase.com/) account (optional)

### Installation

```bash
# Clone the repository
git clone <your-repo-url> my-app
cd my-app

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run the development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 🏗️ Tech Stack

### Core
- **[Next.js 15.5.2](https://nextjs.org/)** — React framework with App Router and Turbopack
- **[React 19](https://reactjs.org/)** — Latest React with improved performance
- **[TypeScript 5](https://typescriptlang.org/)** — Type safety and developer experience
- **[Bun](https://bun.sh/)** — Fast JavaScript runtime and package manager

### Styling & UI
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Utility-first CSS framework with CSS variables
- **[next-themes](https://github.com/pacocoursey/next-themes)** — Perfect dark mode with system detection
- **[shadcn/ui](https://ui.shadcn.com/)** — Beautifully designed accessible components
- **[Lucide Icons](https://lucide.dev/)** — Beautiful & consistent icon library
- **[Motion](https://motion.dev/)** — Production-ready animation library
- **[Geist Font](https://vercel.com/font)** — Optimized typography from Vercel

### Database & Backend
- **[Supabase](https://supabase.com/)** — Database, authentication, and real-time features
- **[@supabase/ssr](https://supabase.com/docs/guides/auth/server-side/nextjs)** — Server-side rendering support
- **[Drizzle ORM](https://orm.drizzle.team/)** — Type-safe database toolkit
- **[PostgreSQL](https://www.postgresql.org/)** — Robust relational database

### Developer Tools
- **[Biome](https://biomejs.dev/)** — Fast linter and formatter
- **[T3 Env](https://env.t3.gg/)** — Type-safe environment variables
- **[Zod](https://zod.dev/)** — TypeScript-first schema validation

## 📁 Project Structure

```
neo/
├── app/                    # Next.js App Router
│   ├── favicon.ico        # App favicon
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   │   ├── alert.tsx     # Alert component
│   │   ├── avatar.tsx    # Avatar component
│   │   ├── badge.tsx     # Badge component
│   │   ├── button.tsx    # Button component
│   │   ├── card.tsx      # Card component
│   │   ├── dialog.tsx    # Dialog/Modal component
│   │   ├── dropdown-menu.tsx # Dropdown menu component
│   │   ├── input.tsx     # Input component
│   │   ├── sonner.tsx    # Toast notification component
│   │   ├── switch.tsx    # Switch/Toggle component
│   │   └── tabs.tsx      # Tabs component
│   ├── mode-toggle.tsx   # Theme toggle component
│   └── theme-provider.tsx # Theme provider wrapper
├── hooks/                # Custom React hooks (ready for use)
├── lib/                  # Utility functions and configurations
│   ├── db/               # Database configuration
│   │   ├── index.ts      # Database connection
│   │   └── schema.ts     # Database schema definitions
│   ├── supabase/         # Supabase client configuration
│   │   ├── client.ts     # Client-side Supabase client
│   │   └── server.ts     # Server-side Supabase client
│   ├── auth.ts           # Authentication utilities
│   ├── env.ts            # Environment variable validation
│   └── utils.ts          # Shared utilities
├── types/                # TypeScript type definitions
│   └── supabase.ts       # Database types (auto-generated)
├── drizzle/              # Database migrations (auto-generated)
├── public/               # Static assets
├── .env.example          # Environment variables template
├── middleware.ts         # Next.js auth middleware
├── biome.json           # Biome configuration
├── components.json      # shadcn/ui configuration
├── drizzle.config.ts    # Drizzle ORM configuration
├── next.config.ts       # Next.js configuration
└── tsconfig.json        # TypeScript configuration
```

## 🌓 Dark Mode & Theming

Neo comes with a comprehensive dark mode implementation using [next-themes](https://github.com/pacocoursey/next-themes), providing seamless theme switching with proper SSR support.

### Features
- **🌙 Dark mode by default** — Launches in dark theme for better UX
- **🔄 Smooth transitions** — No flash of unstyled content (FOUC)
- **🖥️ System preference detection** — Automatically respects user's OS setting
- **💾 Persistence** — Remembers user's theme choice across sessions
- **⚡ SSR compatible** — No hydration mismatches

### Theme Toggle
The theme toggle is located on the homepage below "Hello World" and provides three options:
- **Light** — Clean, bright interface
- **Dark** — Easy on the eyes (default)
- **System** — Follows OS preference

### Implementation Details
```tsx
// Theme provider wraps the entire app
<ThemeProvider
  attribute="class"
  defaultTheme="dark"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

The theme system uses CSS classes (`.dark`) to toggle styles, making it compatible with Tailwind CSS's dark mode utilities.

## 🔧 Configuration

### Environment Variables

Neo includes a comprehensive `.env.example` file with all necessary environment variables. Copy it to `.env.local` and configure:

```bash
# Copy the environment template
cp .env.example .env.local
```

**Required variables:**
```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
DATABASE_URL=postgresql://postgres:password@host:5432/postgres
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Optional services** (uncomment and configure as needed):
- OpenAI API for AI features
- Stripe for payment processing  
- Resend for transactional emails
- Analytics (Google Analytics, PostHog)
- Error monitoring (Sentry)

The `.env.example` file includes detailed documentation for each variable with setup instructions.

### Database Setup

Neo comes with a complete Drizzle ORM setup for Supabase. Follow these steps to get your database running:

1. **Create a [Supabase](https://supabase.com/) project**
   - Sign up at [supabase.com](https://supabase.com/)
   - Create a new project
   - Wait for the project to be ready

2. **Configure environment variables**
   ```bash
   # Copy the example file
   cp .env.example .env.local
   
   # Add your Supabase credentials to .env.local:
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
   ```

3. **Set up your database schema**
   ```bash
   # Generate migration files from your schema
   bunx drizzle-kit generate
   
   # Apply migrations to your database
   bunx drizzle-kit migrate
   
   # Optional: Open Drizzle Studio to view your data
   bunx drizzle-kit studio
   ```

4. **Example schema included**
   - `usersTable` - User accounts and profiles
   - `postsTable` - Content management
   - `commentsTable` - User comments with threading
   - Full relationships and type inference

## 🔐 Authentication & Security

Neo includes a complete Supabase authentication system with advanced features:

### Authentication Features
- **Email/Password Authentication** — Traditional signup and login
- **OAuth Integration** — Google, GitHub, Discord, Facebook, Twitter
- **Magic Links** — Passwordless authentication via email
- **Password Reset** — Secure password recovery flow
- **Email Verification** — Account verification system
- **Session Management** — Automatic token refresh and persistence

### Security Features
- **Route Protection** — Next.js middleware with automatic redirects
- **Role-based Access Control** — Admin, moderator, user roles with hierarchy
- **Row Level Security** — Database-level access control via Supabase
- **CSRF Protection** — Built-in security measures with SameSite cookies
- **Type-safe Auth** — Full TypeScript integration throughout

### Server-Side Rendering
- **SSR Compatible** — Full @supabase/ssr integration with Next.js App Router
- **Cookie-based Sessions** — Secure session persistence across server/client
- **Automatic Refresh** — Token refresh without user interaction via middleware
- **Client/Server Sync** — Consistent auth state everywhere with no hydration issues
- **Multiple Client Types** — Specialized clients for Server Components, API routes, and Server Actions

### Usage Examples

**Sign up a new user:**
```typescript
import { signUp } from '@/lib/auth'

const result = await signUp('user@example.com', 'password123', {
  name: 'John Doe'
})
```

**Protect API routes:**
```typescript
import { requireAuth } from '@/lib/auth'

export async function POST() {
  const user = await requireAuth() // Throws if not authenticated
  // Handle authenticated request
}
```

**Check user permissions:**
```typescript
import { checkUserRole } from '@/lib/auth'

const canModerate = await checkUserRole('moderator')
```

**Use in components:**
```typescript
import { getCurrentUser } from '@/lib/supabase/server'

export default async function ProtectedPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  
  return <div>Welcome, {user.email}!</div>
}
```

### Authentication Utilities

The `lib/auth.ts` file provides comprehensive authentication utilities:

**User Management:**
- `signUp()` - Register new users with email verification
- `signIn()` - Authenticate with email/password
- `signInWithOAuth()` - OAuth authentication (Google, GitHub, Discord, etc.)
- `signOut()` - Secure sign out
- `resetPassword()` - Password recovery
- `updatePassword()` - Password updates

**Profile Management:**
- `getCurrentUserProfile()` - Get user profile data
- `createUserProfile()` - Create user profiles
- `updateUserProfile()` - Update user information

**Authorization:**
- `requireAuth()` - Protect API routes (throws if not authenticated)
- `requireRole()` - Role-based protection (admin, moderator, user)
- `checkUserRole()` - Check user permissions
- `isUserActive()` - Check account status

**Admin Functions:**
- `banUser()` - Deactivate user accounts
- `unbanUser()` - Reactivate accounts
- `validatePassword()` - Password strength validation

### Pre-installed Components

Neo comes with essential shadcn/ui components ready to use:

- **Button** — All interaction types and variants
- **Input** — Text inputs and form controls  
- **Card** — Content containers and layouts
- **Dialog** — Modals, confirmations, and overlays
- **Alert** — Notifications and status messages
- **Badge** — Labels and status indicators
- **Tabs** — Content organization and navigation
- **Avatar** — User profiles and images
- **Sonner** — Modern toast notifications
- **Switch** — Toggle controls and settings
- **Dropdown Menu** — Context menus and actions

### Adding More Components

Add additional shadcn/ui components as needed:

```bash
bunx shadcn@latest add table
bunx shadcn@latest add select
bunx shadcn@latest add checkbox
```

## 📜 Available Scripts

```bash
# Development
bun dev          # Start development server with Turbopack
bun build        # Build for production
bun start        # Start production server

# Code Quality
bun lint         # Lint code with Biome
bun format       # Format code with Biome

# Database
bunx drizzle-kit generate    # Generate database migrations
bunx drizzle-kit migrate     # Apply database migrations
bunx drizzle-kit studio     # Open Drizzle Studio
```

## 🎨 Customization

### Theming

Neo includes a comprehensive design system with CSS variables that automatically adapt to light and dark modes. The theme system is built with [next-themes](https://github.com/pacocoursey/next-themes) and Tailwind CSS v4.

#### Color System
Customize colors in `app/globals.css` for both light and dark modes:

```css
/* Light mode (default) */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  /* ... */
}

/* Dark mode */
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  /* ... */
}
```

#### Using Dark Mode in Components
Apply dark mode styles using Tailwind's `dark:` prefix:

```tsx
<div className="bg-white dark:bg-black text-black dark:text-white">
  Content that adapts to theme
</div>
```

#### Changing Default Theme
Update the default theme in `app/layout.tsx`:

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="light" // Change to "light", "dark", or "system"
  enableSystem
  disableTransitionOnChange
>
```

### Typography

Fonts are configured in `app/layout.tsx`. Replace Geist with your preferred fonts:

```tsx
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com/)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Manual Deployment

```bash
# Build the application
bun build

# Start the production server
bun start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the incredible React framework
- [Supabase](https://supabase.com/) for the powerful backend-as-a-service platform
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [shadcn](https://twitter.com/shadcn) for the beautiful and accessible UI components
- [Drizzle Team](https://orm.drizzle.team/) for the type-safe ORM
- [T3 Stack](https://create.t3.gg/) for environment variable patterns
- [Vercel](https://vercel.com/) for fonts and deployment infrastructure

---

<div align="center">
  <p>Built with ❤️ using <strong>Neo</strong></p>
  <p>
    <a href="#-quick-start">Get Started</a> ·
    <a href="#-features">Features</a> ·
    <a href="#-tech-stack">Tech Stack</a>
  </p>
</div>
