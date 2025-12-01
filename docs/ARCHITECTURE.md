# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Highland AI Website                      │
│                  (highlandai.com - Vercel)                   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          /products/claude-setup                       │  │
│  │  - Product landing page                              │  │
│  │  - Pricing (One-time $9.99 / Monthly $24.99)        │  │
│  │  - Stripe checkout integration                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   Stripe Checkout       │
              │   - One-time payment    │
              │   - Monthly subscription│
              └─────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   Stripe Webhook        │
              │   POST /api/webhook     │
              └─────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
    ┌──────────────────────┐  ┌──────────────────────┐
    │  Generate Token      │  │  Create Subscriber   │
    │  (One-time)          │  │  (Monthly)           │
    └──────────────────────┘  └──────────────────────┘
                │                       │
                ▼                       ▼
    ┌──────────────────────┐  ┌──────────────────────┐
    │  Email with CLI      │  │  Dashboard Access    │
    │  Command + Token     │  │  + Welcome Email     │
    └──────────────────────┘  └──────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │  User Runs CLI          │
              │  npx @highland-ai/      │
              │    claude-setup         │
              │    --token XXXX         │
              └─────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │  AWS Lambda             │
              │  validate-token         │
              │  - Verify JWT           │
              │  - Check if used        │
              │  - Mark as consumed     │
              └─────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │  AWS Lambda             │
              │  analyze-project        │
              │  - Call Claude API      │
              │  - Match playbooks      │
              │  - Return config        │
              └─────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │  CLI Applies Config     │
              │  - Install MCPs         │
              │  - Create CLAUDE.md     │
              │  - Setup skills         │
              └─────────────────────────┘
```

## Components

### 1. CLI Tool (@highland-ai/claude-setup)

**Location:** `cli/`
**Tech:** Node.js, Commander.js, Inquirer.js
**Published:** npm (public package)

**Responsibilities:**
- Interactive prompts for user input
- Token validation via API
- Project analysis (local or API-based)
- MCP installation
- Config file generation
- Skills setup

**Flow:**
```
npx @highland-ai/claude-setup --token XXXX
    ↓
Validate token with Lambda API
    ↓
Analyze project (call Lambda API)
    ↓
Receive recommendations
    ↓
Install MCPs locally
    ↓
Generate CLAUDE.md
    ↓
Done!
```

### 2. Backend (AWS Lambda)

**Location:** `backend/`
**Tech:** Node.js 20.x, AWS SAM, Lambda, API Gateway
**Deployed:** AWS (us-east-1)

**Functions:**

#### validate-token
- **Trigger:** API Gateway (POST /validate-token)
- **Purpose:** Validate and consume install tokens
- **Database:** Supabase (install_tokens table)
- **Response:** Token tier, email, validity

#### analyze-project
- **Trigger:** API Gateway (POST /analyze)
- **Purpose:** AI-powered project analysis
- **AI:** Claude 3.5 Sonnet API
- **Storage:** S3 (playbooks), DynamoDB (cache)
- **Response:** Recommended MCPs, skills, template

#### generate-token (Monthly only)
- **Trigger:** API Gateway (POST /generate-token)
- **Purpose:** Generate new tokens for monthly subscribers
- **Database:** Supabase (subscribers table)
- **Response:** New install token

### 3. Frontend (Highland AI Integration)

**Location:** `frontend/`
**Tech:** Next.js 14, React, Tailwind CSS
**Deployed:** Vercel (shared with Highland AI)

**Pages:**

#### /products/claude-setup
- Product landing page
- Features, pricing, demo video
- CTA to purchase

#### /products/claude-setup/checkout
- Stripe checkout integration
- One-time vs Monthly selection

#### /products/claude-setup/success
- Post-purchase page
- Display install command with token
- Terminal launcher button

#### /dashboard/claude-setup (Monthly only)
- Saved configurations
- MCP template browser
- Token generation
- Sync settings

**API Routes:**

#### /api/webhook/stripe
- Handle Stripe webhooks
- Generate tokens on purchase
- Send emails
- Create subscriber records

#### /api/checkout/create
- Create Stripe checkout session

#### /api/configs (Monthly only)
- CRUD for saved configurations

### 4. Database (Supabase)

**Location:** `database/`
**Tech:** PostgreSQL, Supabase
**Deployed:** Supabase (us-east-1)

**Tables:**

- `install_tokens`: One-time use tokens
- `subscribers`: Monthly subscription users
- `claude_configs`: Saved configurations
- `mcp_templates`: Pre-built MCP configs
- `usage_analytics`: Usage tracking (optional)

**RLS Policies:** Enforce user access control

### 5. Playbooks & Templates

**Location:** `playbooks/`
**Storage:** S3 (highland-ai-playbooks)

**Structure:**
```
playbooks/
├── frameworks/        # Next.js, Python, React, etc.
├── integrations/      # GitHub, Notion, Slack, etc.
├── use-cases/         # Web dev, ML, RAG, etc.
└── templates/         # CLAUDE.md templates
```

**Format:** JSON + Markdown

## Data Flow

### Purchase Flow (One-Time)

```
1. User clicks "Buy $9.99"
2. Stripe checkout session created
3. User completes payment
4. Stripe webhook → /api/webhook/stripe
5. Generate JWT token (24h expiry)
6. Store in install_tokens table (used: false)
7. Send email with command:
   npx @highland-ai/claude-setup --token eyJ0eXAi...
8. User runs command
9. CLI calls Lambda: POST /validate-token
10. Lambda checks token:
    - Valid JWT?
    - Not expired?
    - Not already used?
11. Mark token as used (used: true)
12. Return user tier and email
13. CLI proceeds with smart setup
14. Token can never be used again
```

### Purchase Flow (Monthly)

```
1. User clicks "Subscribe $24.99/month"
2. Stripe subscription checkout
3. User completes payment
4. Stripe webhook → /api/webhook/stripe
5. Create subscriber record in Supabase
6. Generate initial token
7. Send email with:
   - Dashboard link
   - Initial install command
8. User can generate unlimited new tokens from dashboard
9. Each setup consumes one token
10. Subscription renews monthly
```

### Smart Setup Flow

```
1. CLI prompts user: "Tell me about your project"
2. User: "I'm building a Next.js SaaS with Notion and GitHub"
3. CLI calls Lambda: POST /analyze
   {
     "userInput": "...",
     "tier": "onetime" | "monthly"
   }
4. Lambda calls Claude API with prompt:
   "Analyze this project description and extract:
    - Framework
    - Integrations
    - Use cases"
5. Claude returns structured JSON:
   {
     "framework": "nextjs",
     "integrations": ["notion", "github"],
     "useCases": ["web-dev"]
   }
6. Lambda queries playbooks:
   - frameworks/nextjs.json
   - integrations/notion.json
   - integrations/github.json
7. Combine recommendations:
   {
     "mcps": ["filesystem", "memory", "github", "notion"],
     "skills": ["web-dev-expert", "notion-integration"],
     "template": "nextjs-saas"
   }
8. Lambda renders CLAUDE.md template
9. Return to CLI
10. CLI displays recommendations
11. User confirms
12. CLI installs MCPs locally
13. CLI creates CLAUDE.md
14. Done!
```

## Security Architecture

### Token Security

**One-Time Tokens:**
- JWT with 24h expiration
- Unique JTI (JWT ID) for tracking
- Stored in database with `used` flag
- Consumed on first validation
- Cannot be reused

**Monthly Tokens:**
- Same as one-time, but unlimited generation
- Rate limited: 10 tokens/day per subscriber
- Tracked in database

### API Security

**Lambda Functions:**
- API Gateway with API keys (optional)
- CORS configured for highlandai.com only
- Input validation with Zod
- Rate limiting via AWS WAF (optional)

**Stripe Webhooks:**
- Signature verification required
- Webhook secret validated
- Idempotency handling

### Database Security

**Supabase RLS:**
- Row-level security enabled
- Service role for backend only
- Authenticated users can only access their own data
- Public reads disabled

## Scalability

### Current Capacity

**AWS Lambda:**
- 1,000 concurrent executions (default)
- Can handle 10,000+ requests/hour
- Auto-scales automatically

**Supabase Free Tier:**
- 500MB database storage
- 2GB bandwidth/month
- 50,000 monthly active users
- 500,000 API requests

**Vercel Free Tier:**
- 100GB bandwidth/month
- Unlimited requests
- Edge network (global CDN)

### Scaling Plan

**At 1,000 users/month:** Free tier is fine

**At 10,000 users/month:**
- Supabase: Upgrade to Pro ($25/month)
- Vercel: Stay on free tier
- AWS: Still in free tier

**At 100,000 users/month:**
- Supabase: Pro plan ($25/month)
- Vercel: Pro plan ($20/month)
- AWS Lambda: ~$100/month
- DynamoDB for playbook caching: $25/month

## Monitoring & Observability

### Metrics to Track

**Business Metrics:**
- Daily active users (DAU)
- Monthly active users (MAU)
- Conversion rate (free → paid)
- Churn rate (monthly subs)
- Average revenue per user (ARPU)

**Technical Metrics:**
- API response time (Lambda)
- Error rate
- Token validation success rate
- CLI installation success rate

**Tools:**
- CloudWatch (AWS Lambda logs)
- Vercel Analytics (frontend)
- Supabase Logs (database)
- Stripe Dashboard (payments)
- PostHog (optional, product analytics)

## Cost Structure

### Fixed Costs
- Domain: $12/year (existing)
- Hosting: $0-20/month (Vercel free tier)
- Database: $0-25/month (Supabase free tier)

### Variable Costs
- Stripe: 2.9% + $0.30 per transaction
- Claude API: ~$0.01 per setup
- AWS Lambda: $0.20 per 1,000 requests (after free tier)

### Profit Margin
**Base Case (1,000 setups/month):**
- Revenue: $9,990 (one-time) + $3,750 (monthly) = $13,740
- Costs: ~$500 (Stripe) + ~$10 (Claude API) + $25 (hosting) = $535
- **Net Profit: $13,205 (96% margin)**

## Disaster Recovery

### Backups
- **Database:** Supabase automatic daily backups
- **Code:** Git (GitHub)
- **Playbooks:** S3 versioning enabled
- **Configs:** Exported weekly to S3

### Rollback Strategy
- **Lambda:** Keep 3 previous versions
- **Frontend:** Vercel maintains deployment history
- **Database:** Point-in-time recovery (7 days)

### Uptime Targets
- **Frontend:** 99.9% (Vercel SLA)
- **Backend:** 99.5% (AWS Lambda SLA)
- **Database:** 99.9% (Supabase SLA)

---

**Architecture Review Date:** Every 3 months
**Last Updated:** 2024-01-18
**Next Review:** 2024-04-18
