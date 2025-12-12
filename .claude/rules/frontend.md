---
paths:
  - "frontend/**/*.tsx"
  - "frontend/**/*.ts"
  - "frontend/**/*.css"
---

# Frontend Development Rules

## Architecture

Next.js 14 with App Router, deployed on Vercel.

**Entry:** `frontend/src/app/page.tsx`

## Directory Structure

```
frontend/src/
├── app/                 # App Router pages
│   ├── page.tsx         # Landing page
│   ├── start/           # Onboarding flow
│   ├── api/             # API routes
│   └── layout.tsx       # Root layout
├── components/          # Reusable components
├── lib/                 # Utilities
└── styles/              # Global CSS
```

## Component Patterns

### Server Components (default)
No directive needed. Use for static content and data fetching.

### Client Components
Add `'use client'` at top when using:
- Event handlers (onClick, onChange)
- React hooks (useState, useEffect)
- Browser APIs

```tsx
'use client'

export default function InteractiveComponent() {
  const [state, setState] = useState();
  // ...
}
```

## Styling

Uses Tailwind CSS with custom design tokens in `globals.css`:

```css
:root {
  --color-primary: #D4A574;      /* Highland gold */
  --bg: #0F0F0F;                  /* Dark background */
  --text-primary: #FFFFFF;
  --text-secondary: #A0A0A0;
}
```

Glass morphism pattern:
```tsx
<div className="glass rounded-2xl p-8">
  {/* content */}
</div>
```

## API Routes

```typescript
// app/api/example/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  // ... handle
  return NextResponse.json({ success: true });
}
```

## Don't Do

- Don't use `'use client'` unless necessary
- Don't use CSS modules - use Tailwind only
- Don't use default exports for components (use named)
- Don't hardcode API URLs - use environment variables
