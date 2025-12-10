# GitHub MCP

## Overview

GitHub MCP provides integration with GitHub for repository management, pull request review, and issue tracking. Enables Claude to interact with your GitHub repositories.

## Package

`@modelcontextprotocol/server-github`

## Required Environment Variables

- `GITHUB_TOKEN`: Personal access token with repo permissions

## Use Cases

- Creating and reviewing pull requests
- Managing issues and labels
- Repository file operations
- Branch management
- Code review assistance

## Configuration

```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_TOKEN": "your-github-token"
    }
  }
}
```

## Getting a Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic) with `repo` scope
3. Copy token and use in configuration

## Best Practices

1. Use for PR creation and review workflows
2. Automate issue management
3. Great for code review assistance
4. Combine with filesystem for local + remote operations

## When to Recommend

- Projects hosted on GitHub
- Team collaboration workflows
- CI/CD integration needs
- Code review automation
