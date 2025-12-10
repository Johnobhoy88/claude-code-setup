# Context7 MCP

## Overview

Context7 provides up-to-date documentation lookup for libraries and frameworks. Instead of relying on potentially outdated training data, it fetches current documentation directly.

## Package

`@upstash/context7-mcp`

## Use Cases

- Looking up current API documentation
- Finding library-specific examples
- Checking latest version features
- Understanding framework conventions

## Configuration

```json
{
  "context7": {
    "command": "npx",
    "args": ["-y", "@upstash/context7-mcp"]
  }
}
```

## Best Practices

1. Use for any library/framework questions
2. Prefer over general knowledge for API specifics
3. Great for checking deprecations and new features
4. Combine with filesystem MCP for code updates

## When to Recommend

- All projects (essential)
- Especially useful for projects using multiple libraries
- Critical for staying current with fast-moving frameworks (React, Next.js, etc.)
