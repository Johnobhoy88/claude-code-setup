# Sentry MCP

## Overview
Sentry MCP for error tracking, issue triage, and release health insights.

## Installation
```bash
npx @anthropic/mcp-server-sentry
```

Configuration
- `SENTRY_AUTH_TOKEN` with project read/access.
- `SENTRY_ORG` and `SENTRY_PROJECT` identifiers.

Capabilities
- List and filter issues/events by project or release.
- Pull stack traces, tags, breadcrumbs for debugging.
- Create comments or assignments on issues.

Example Usage
- Fetch top errors for the latest release to prioritize fixes.
- Inspect a specific event’s stack trace and tags.
- Comment/assign an issue to an on-call engineer.

Best Practices
- Use least-privilege tokens scoped to specific projects.
- Filter by environment/release to avoid noisy results.
- Link issue URLs in summaries for quick navigation.
