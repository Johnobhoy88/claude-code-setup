---
paths:
  - "backend/**/*.js"
  - "backend/**/*.ts"
  - "backend/template.yaml"
---

# Backend Development Rules

## Architecture

AWS Lambda functions deployed via SAM (Serverless Application Model).

**Template:** `backend/template.yaml`

## Lambda Functions

| Function | Endpoint | Purpose |
|----------|----------|---------|
| `validate-token` | POST /validate-token | Verify JWT tokens, check usage |
| `analyze-project` | POST /analyze | AI-powered project analysis |
| `generate-token` | POST /generate-token | Create tokens for subscribers |

## Handler Pattern

```javascript
export const handler = async (event) => {
  console.log('Request received');

  try {
    const body = JSON.parse(event.body || '{}');
    // ... validation
    // ... business logic
    return response(200, { data });
  } catch (error) {
    console.error('Error:', error);
    return response(500, { error: 'Internal server error' });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}
```

## Environment Variables

Required in Lambda:
- `ANTHROPIC_API_KEY` - Claude API key
- `TOKENS_TABLE` - DynamoDB table name
- `SUPABASE_URL` - Database URL
- `SUPABASE_KEY` - Database key

## AI Integration

Uses Claude via `@anthropic-ai/sdk`:
```javascript
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const message = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 400,
  messages: [{ role: 'user', content: prompt }]
});
```

## Deployment

```bash
cd backend
sam build
sam deploy --guided  # First time
sam deploy           # Subsequent
```

## Don't Do

- Don't return raw error messages to clients (security)
- Don't skip token validation on any endpoint
- Don't use synchronous operations for I/O
