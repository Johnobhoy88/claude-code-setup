# Highland AI - Claude Code Setup Tool

**Micro-SaaS product for automating Claude Code configuration**

## Overview

A CLI tool that sets up Claude Code in 5 minutes instead of 2 hours. Uses AI-powered matching to recommend the perfect MCPs, skills, and templates for your project.

## Project Structure

```
claude-code-setup/
├── cli/                    # Node.js CLI tool (@highland-ai/claude-setup)
├── backend/               # AWS Lambda functions for AI matching
├── frontend/              # Highland AI integration pages (Next.js)
├── database/              # Supabase schemas and migrations
├── playbooks/             # Knowledge base for intelligent matching
├── docs/                  # Documentation
└── scripts/               # Deployment and utility scripts
```

## Product Tiers

### Free Tier
- **Price**: $0
- **Features**: Basic setup, 3 essential MCPs, generic template
- **Usage**: `npx @highland-ai/claude-setup`

### One-Time Purchase
- **Price**: $9.99
- **Features**: Smart AI matching, 70+ MCPs, custom templates
- **Usage**: `npx @highland-ai/claude-setup --token YOUR_TOKEN`

### Monthly Subscription
- **Price**: $24.99/month
- **Features**: Everything + unlimited installs, cloud sync, dashboard access
- **Usage**: Unlimited tokens via dashboard

## Tech Stack

### CLI Tool
- **Runtime**: Node.js 18+
- **Framework**: Commander.js + Inquirer.js
- **Package**: Published to npm as `@highland-ai/claude-setup`

### Backend (AWS Lambda)
- **Runtime**: Node.js 20.x
- **AI**: Claude 3.5 Sonnet API
- **Storage**: S3 for templates, DynamoDB for caching (optional)
- **API**: API Gateway REST API

### Frontend (Highland AI Integration)
- **Framework**: Next.js 14 (App Router)
- **Hosting**: Vercel (shared with Highland AI main site)
- **Payments**: Stripe (shared account)
- **Database**: Supabase (shared instance)

### Database
- **Primary**: Supabase (PostgreSQL)
- **Tables**: install_tokens, subscribers, claude_configs, mcp_templates

## Quick Start

### Development Setup

1. **Install dependencies**
   ```bash
   cd cli && npm install
   cd ../backend && npm install
   cd ../frontend && npm install
   ```

2. **Set up environment variables**
   ```bash
   # Copy .env.example files
   cp cli/.env.example cli/.env
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. **Run locally**
   ```bash
   # CLI tool
   cd cli && npm run dev

   # Backend (Lambda local)
   cd backend && npm run dev

   # Frontend
   cd frontend && npm run dev
   ```

### Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for full deployment instructions.

## Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [API Documentation](./docs/API.md)
- [Playbooks Guide](./docs/PLAYBOOKS.md)
- [Contributing](./docs/CONTRIBUTING.md)

## License Model

Uses **one-time install tokens** for licensing:
- Tokens generated on purchase (Stripe webhook)
- Tokens validated by Lambda function
- One-time use (consumed on first install)
- Monthly subscribers get unlimited token generation

See [ONE_TIME_TOKEN_MODEL.md](../ONE_TIME_TOKEN_MODEL.md) for details.

## Intelligent Matching

AI-powered setup using:
- **Framework playbooks**: Next.js, Python, React, etc.
- **Integration playbooks**: GitHub, Notion, Slack, etc.
- **Use case playbooks**: Web dev, ML, document processing, etc.

See [INTELLIGENT_MCP_MATCHING.md](../INTELLIGENT_MCP_MATCHING.md) for details.

## Revenue Model

| Tier | Price | Target Users | Features |
|------|-------|--------------|----------|
| Free | $0 | Trial users | 3 MCPs, basic setup |
| One-Time | $9.99 | Solo developers | AI matching, 70+ MCPs |
| Monthly | $24.99/mo | Power users | Unlimited + cloud sync |

**Projected Revenue (Year 1)**:
- Conservative: $20K
- Base Case: $55K
- Optimistic: $110K

**Profit Margin**: 95-97% (when integrated with Highland AI infrastructure)

## Development Timeline

- **Week 1-2**: Build CLI tool (20-30 hours)
- **Week 3**: Product page for Highland AI site (10 hours)
- **Week 4**: Payment integration + webhooks (5 hours)
- **Week 5-6**: Dashboard for monthly subscribers (20-30 hours)
- **Week 7**: Launch (Product Hunt, Reddit, email)

**Total**: 4-7 weeks (55-85 hours)

## Support

- **Documentation**: https://highlandai.com/products/claude-setup/docs
- **Email**: support@highlandai.com
- **Discord**: [Highland AI Community](https://discord.gg/highlandai)

## Contributing

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for:
- How to submit playbooks
- Testing guidelines
- Code style guide

## Links

- **Product Page**: https://highlandai.com/products/claude-setup
- **npm Package**: https://www.npmjs.com/package/@highland-ai/claude-setup
- **GitHub**: https://github.com/highlandai/claude-code-setup
- **Dashboard**: https://highlandai.com/dashboard/claude-setup

---

**Built by Highland AI** | [highlandai.com](https://highlandai.com)
