# Fetch MCP

## Overview
HTTP Fetch MCP for making API requests, web fetches, and lightweight scraping.

## Installation
```bash
npx @anthropic/mcp-server-fetch
```

Configuration
- Optional: `HTTP_PROXY`/`HTTPS_PROXY` if needed.
- Respect target API auth headers/tokens per request.

Capabilities
- Perform GET/POST/PUT/DELETE requests.
- Send custom headers, query params, and payloads.
- Fetch JSON/HTML for API calls or simple scraping.

Example Usage
- Call an internal REST endpoint and parse JSON response.
- Retrieve a public page and extract key data.
- Test a webhook endpoint with sample payloads.

Best Practices
- Avoid high-volume scraping; respect rate limits and robots.
- Redact secrets from logs/responses.
- Reuse common headers (auth/user-agent) consistently.
