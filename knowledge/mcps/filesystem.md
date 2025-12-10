# Filesystem MCP

## Overview

Filesystem MCP provides secure file system access for reading and writing project files. It's the foundation for any code editing and project navigation tasks.

## Package

`@modelcontextprotocol/server-filesystem`

## Use Cases

- Reading source code files
- Writing and modifying code
- Navigating project structure
- Creating new files and directories

## Configuration

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project"]
  }
}
```

Note: The project path should be the root directory of your project.

## Best Practices

1. Always specify the project root path
2. Use for all file operations
3. Combine with memory MCP to track file changes
4. Essential for any code modification tasks

## Security

- Access is limited to the specified directory
- Cannot access files outside the project root
- Respects .gitignore patterns

## When to Recommend

- All projects (essential)
- Required for any code editing workflow
- Foundation MCP that others depend on
