# Slack MCP

## Overview
Slack MCP for sending messages, reading channels/threads, and managing workflows or alerts.

## Installation
```bash
npx @anthropic/mcp-server-slack
```

Configuration
- `SLACK_BOT_TOKEN` (xoxb-...), `SLACK_APP_TOKEN` if required.
- Scopes: chat:write, channels:history, groups:history, users:read, reactions:write as needed.

Capabilities
- Post messages to channels/DMs and threads.
- Read channel history and thread replies.
- Manage reactions and simple workflow triggers.

Example Usage
- Post deployment status updates to #releases.
- Summarize recent errors from a channel thread.
- Add reactions to ack alerts in #oncall.

Best Practices
- Limit scopes to least privilege per workspace.
- Use channel IDs instead of names to avoid ambiguity.
- Avoid spamming; batch updates and thread replies.
