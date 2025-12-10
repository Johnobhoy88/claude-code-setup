# React Framework Guide

## Overview

React applications (non-Next.js) using Vite or Create React App. This covers SPAs and client-side React development.

## Recommended MCPs

- **context7** (essential) - React documentation
- **memory** (essential) - Component patterns and decisions
- **filesystem** (essential) - File operations
- **puppeteer** (recommended) - Component testing and debugging

## CLAUDE.md Template for React

```markdown
# CLAUDE.md

## Project Overview

React SPA for [purpose]. Built with Vite and TypeScript.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: [Tailwind CSS/CSS Modules/styled-components]
- **State**: [Zustand/Redux/React Query]
- **Routing**: React Router v6

## Project Structure

- `src/`
  - `components/` - Reusable UI components
  - `pages/` - Page-level components
  - `hooks/` - Custom React hooks
  - `lib/` - Utilities and helpers
  - `types/` - TypeScript types
  - `store/` - State management
  - `api/` - API client functions

## Coding Conventions

- Functional components only (no class components)
- Custom hooks for reusable logic
- TypeScript strict mode
- Props interfaces above component
- Named exports preferred

## Component Pattern

\`\`\`tsx
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant, children, onClick }: ButtonProps) {
  return (
    <button className={styles[variant]} onClick={onClick}>
      {children}
    </button>
  );
}
\`\`\`

## Common Commands

- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run test` - Run tests
```

## Key Patterns

### Custom Hooks

```tsx
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

### Component Composition

```tsx
// Compound component pattern
function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}

Card.Header = function CardHeader({ children }) {
  return <div className="card-header">{children}</div>;
};

Card.Body = function CardBody({ children }) {
  return <div className="card-body">{children}</div>;
};

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

### Error Boundaries

```tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

## Common Mistakes to Avoid

1. Prop drilling instead of context or state management
2. useEffect for derived state (use useMemo instead)
3. Missing dependency arrays in hooks
4. Not memoizing expensive computations
5. Inline function definitions causing re-renders
6. Not handling loading and error states
