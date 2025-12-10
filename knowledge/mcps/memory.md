# Memory MCP

## Overview

Memory MCP provides persistent memory across Claude Code sessions using a knowledge graph structure. It allows Claude to remember context, decisions, and project-specific information between conversations.

## Package

`@modelcontextprotocol/server-memory`

## Use Cases

- Remembering project architecture decisions
- Tracking ongoing tasks and progress
- Storing user preferences and coding style
- Maintaining context across sessions

## Configuration

```json
{
  "memory": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-memory"]
  }
}
```

## Best Practices

1. Use to store important project decisions
2. Record architectural choices and rationale
3. Track recurring patterns in the codebase
4. Remember user preferences for code style

## When to Recommend

- All projects (essential)
- Long-running projects benefit most
- Team projects where context sharing matters
- Complex projects with many architectural decisions
