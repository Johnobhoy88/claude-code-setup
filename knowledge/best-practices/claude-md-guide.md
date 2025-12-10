# CLAUDE.md Best Practices Guide

## Purpose

CLAUDE.md is the primary way to give Claude Code context about your project. A well-written CLAUDE.md dramatically improves Claude's ability to help you effectively.

## Essential Sections

### 1. Project Overview

Start with a clear, concise description of what the project does.

```markdown
## Project Overview

This is a [type of project] that [main purpose]. 
Built with [main technologies].
```

**Good example:**
```markdown
## Project Overview

A SaaS dashboard for managing customer subscriptions. 
Built with Next.js 14, TypeScript, Supabase, and Stripe.
```

**Bad example:**
```markdown
## Project Overview

This is my project.
```

### 2. Tech Stack

List the key technologies so Claude knows what tools are available.

```markdown
## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL), Edge Functions
- **Payments**: Stripe
- **Deployment**: Vercel
```

### 3. Project Structure

Help Claude navigate your codebase.

```markdown
## Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable React components
- `lib/` - Utility functions and shared code
- `types/` - TypeScript type definitions
```

### 4. Coding Conventions

Tell Claude how you want code written.

```markdown
## Coding Conventions

- Use TypeScript strict mode
- Prefer functional components with hooks
- Use Tailwind for styling (no CSS modules)
- Name files in kebab-case
- Use named exports (not default)
```

### 5. Common Commands

List commands Claude might need to run.

```markdown
## Common Commands

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run test` - Run tests
- `npm run lint` - Lint code
```

### 6. MCP-Specific Guidance

If you have MCPs installed, explain how to use them.

```markdown
## Available MCPs

- **filesystem**: Use for all file operations
- **memory**: Store important decisions and context
- **github**: Use for PR creation and review
```

## Pro Tips

### Be Specific, Not Generic

❌ "Write clean code"
✅ "Use early returns to reduce nesting. Max function length: 50 lines."

### Include Examples

❌ "Follow our component pattern"
✅ "Components should look like this: [example code]"

### Update Regularly

Keep CLAUDE.md current as your project evolves. Outdated instructions cause confusion.

### Don't Over-Document

Focus on what Claude needs to know, not everything about the project. Too much information is as bad as too little.

## Template

```markdown
# CLAUDE.md

## Project Overview

[One paragraph describing the project]

## Tech Stack

- **Frontend**: [technologies]
- **Backend**: [technologies]
- **Database**: [technology]
- **Deployment**: [platform]

## Project Structure

- `src/` - [description]
- `tests/` - [description]

## Coding Conventions

- [Convention 1]
- [Convention 2]
- [Convention 3]

## Common Commands

- `npm run dev` - [description]
- `npm run test` - [description]

## Important Notes

[Any critical information Claude should know]
```
