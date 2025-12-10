# Postgres MCP

## Overview
PostgreSQL MCP for running queries, inspecting schemas, and assisting with migrations or data fixes.

## Installation
```bash
npx @anthropic/mcp-server-postgres
```

Configuration
- `POSTGRES_URL` or `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`.
- Optional: read-only role for safety in prod.

Capabilities
- Run SELECT/INSERT/UPDATE/DELETE with safety prompts.
- Inspect tables, columns, indexes, constraints.
- Assist with migration planning and verification.

Example Usage
- Validate a migration by comparing row counts/index presence.
- Generate a safe rollback script for a recent schema change.
- Investigate a production incident with read-only queries.

Best Practices
- Prefer read-only role for analysis; elevate only when needed.
- Always wrap destructive operations in transactions.
- Log queries for audit and revert when working in prod.
