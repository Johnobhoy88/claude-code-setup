# Next.js Framework Guide

## Overview

Next.js 14+ with App Router is the recommended setup for React applications. This guide covers best practices for Claude Code assistance.

## Recommended MCPs

- **context7** (essential) - Up-to-date Next.js documentation
- **memory** (essential) - Remember project patterns
- **filesystem** (essential) - File operations
- **puppeteer** (recommended) - Visual testing and debugging
- **sequential-thinking** (recommended) - Complex component logic

## CLAUDE.md Template for Next.js

```markdown
# CLAUDE.md

## Project Overview

Next.js 14 application using App Router with [purpose].

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Database**: [Supabase/Prisma/etc]
- **Deployment**: Vercel

## Project Structure

- `app/` - App Router pages, layouts, and API routes
- `app/api/` - API route handlers
- `components/` - Reusable React components
- `lib/` - Utility functions and configurations
- `types/` - TypeScript type definitions

## Coding Conventions

- Use Server Components by default
- Add 'use client' only when needed (interactivity, hooks)
- Prefer named exports over default exports
- Use TypeScript strict mode - no `any`
- Style with Tailwind utility classes

## File Naming

- Components: PascalCase (`UserProfile.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Routes: kebab-case folders (`user-profile/page.tsx`)

## Data Fetching

- Server Components: fetch directly in component
- Client Components: use SWR or React Query
- API Routes: for mutations and external API calls

## Common Commands

- `npm run dev` - Start dev server (localhost:3000)
- `npm run build` - Production build
- `npm run lint` - ESLint check
- `npm run type-check` - TypeScript check
```

## Key Patterns

### Server vs Client Components

```tsx
// Server Component (default) - no directive needed
async function ServerComponent() {
  const data = await fetch('...');
  return <div>{data}</div>;
}

// Client Component - needs directive
'use client';
function ClientComponent() {
  const [state, setState] = useState();
  return <button onClick={() => setState(...)}>Click</button>;
}
```

### API Routes

```tsx
// app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ users: [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ created: true });
}
```

### Loading and Error States

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <div>Loading...</div>;
}

// app/dashboard/error.tsx
'use client';
export default function Error({ error, reset }) {
  return <button onClick={reset}>Try again</button>;
}
```

## Common Mistakes to Avoid

1. Using 'use client' unnecessarily
2. Fetching data in Client Components when Server Components work
3. Not using loading.tsx and error.tsx
4. Importing server-only code in Client Components
5. Not leveraging Next.js Image component
