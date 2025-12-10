# Instruction Patterns for CLAUDE.md

## Effective Instruction Patterns

### Pattern 1: Constraint-Based

Tell Claude what NOT to do as well as what to do.

```markdown
## Constraints

- DO NOT use `any` type in TypeScript
- DO NOT use inline styles
- DO NOT commit directly to main branch
- ALWAYS use async/await over .then()
```

### Pattern 2: Priority-Based

Help Claude understand what matters most.

```markdown
## Priorities

1. **Security first** - Always validate input, sanitize output
2. **Type safety** - No `any`, use strict TypeScript
3. **Performance** - Consider bundle size and load time
4. **Readability** - Clear code over clever code
```

### Pattern 3: Context-Aware

Give Claude context about the project state.

```markdown
## Current State

- We're in early development, prioritize speed over perfection
- The auth system is complete, don't modify it
- Database schema is finalized, migrations are expensive
```

### Pattern 4: Role-Based

Tell Claude what role to play.

```markdown
## Your Role

Act as a senior developer on this project. You should:
- Suggest improvements proactively
- Question architectural decisions that seem wrong
- Prioritize maintainability over quick fixes
```

### Pattern 5: Example-Driven

Show Claude exactly what you want.

```markdown
## Component Pattern

All components should follow this pattern:

\`\`\`tsx
interface Props {
  // Props here
}

export function ComponentName({ prop1, prop2 }: Props) {
  // Implementation
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
\`\`\`
```

### Pattern 6: Decision Framework

Help Claude make decisions autonomously.

```markdown
## Decision Framework

When choosing between options:
1. Prefer built-in solutions over third-party libraries
2. Prefer composition over inheritance
3. Prefer explicit over implicit
4. When in doubt, ask before implementing
```

## Anti-Patterns to Avoid

### ❌ Vague Instructions

```markdown
Write good code.
```

### ❌ Contradictory Instructions

```markdown
Always use TypeScript strict mode.
It's okay to use `any` when needed.
```

### ❌ Too Many Instructions

Overwhelming Claude with hundreds of rules makes it harder to follow any of them.

### ❌ Outdated Instructions

Instructions that reference old patterns or deprecated APIs cause confusion.

## Combining Patterns

The best CLAUDE.md files combine multiple patterns:

```markdown
## Development Guidelines

### Priorities (Priority-Based)
1. Security
2. Type safety
3. Performance

### Constraints (Constraint-Based)
- No `any` types
- No inline styles
- No console.log in production code

### When Unsure (Decision Framework)
- Check existing code for patterns
- Prefer simpler solutions
- Ask if the change affects more than 3 files

### Example (Example-Driven)
[Code example here]
```
