---
paths:
  - "cli/**/*.js"
  - "cli/**/*.ts"
---

# CLI Development Rules

## Architecture

The CLI uses Commander.js for argument parsing and Inquirer.js for interactive prompts.

**Entry point:** `cli/src/index.js`

## Module Responsibilities

| Module | Purpose |
|--------|---------|
| `index.js` | Entry point, main flow orchestration |
| `prompts.js` | All interactive user prompts |
| `validators.js` | Token and input validation |
| `analyzers.js` | Project analysis, API calls |
| `generators.js` | CLAUDE.md template generation |
| `installers.js` | MCP installation and config writing |
| `utils.js` | Helpers, error handling, display |

## Coding Patterns

### Error Handling
```javascript
try {
  const result = await riskyOperation();
} catch (err) {
  handleError(err);  // Use centralized handler from utils.js
  process.exit(1);
}
```

### Spinner Usage
```javascript
import ora from 'ora';
const spinner = ora('Doing something...').start();
// ... work
spinner.succeed('Done');  // or spinner.fail('Failed: reason')
```

### Prompts
All prompts go in `prompts.js`. Use Inquirer.js patterns:
```javascript
import { select, input, confirm } from '@inquirer/prompts';
```

## Testing

- Tests in `cli/src/__tests__/`
- Property-based tests use `fast-check`
- Run: `cd cli && npm test`

## Don't Do

- Don't use `console.log` directly - use `chalk` for colored output
- Don't hardcode API URLs - use environment variables
- Don't skip error handling on async operations
