# SQLite MCP

## Overview
SQLite MCP for local database operations, quick prototyping, and lightweight app storage.

## Installation
```bash
npx @anthropic/mcp-server-sqlite
```

Configuration
- `SQLITE_PATH` pointing to the database file.
- Optional: set working directory where DB files live.

Capabilities
- Run SQL queries against local SQLite files.
- Create/inspect tables, indexes, and pragmas.
- Export/import data for debugging or migration prep.

Example Usage
- Inspect a local dev DB schema and constraints.
- Run ad-hoc queries during CLI/app development.
- Prototype a migration before porting to Postgres.

Best Practices
- Work on copies of DB files; avoid locking shared files.
- Use transactions for bulk changes.
- Keep backups before schema updates.
