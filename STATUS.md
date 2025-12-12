# Project Status

*Last updated: 2025-12-12*

## What This Is

CLI tool that configures Claude Code in 5 minutes. User pays, answers questionnaire, gets complete setup (MCPs, CLAUDE.md, skills, hooks).

## Live URLs

| Component | URL |
|-----------|-----|
| **Frontend** | https://master.d3l1xef9qaygam.amplifyapp.com/ |
| **API Gateway** | (check AWS console for endpoints) |
| **Custom Domain** | `claude-setup.is-a.dev` (PR pending) |

## What's Deployed

### Frontend (Amplify)
- [x] Next.js 14 SSR app running
- [x] Landing page with glass UI design
- [x] Pricing tiers displayed ($2.99 / $9.99)

### Backend (Lambda)
- [x] 10 Lambda functions deployed
- [x] `validate-token` - JWT verification
- [x] `analyze-project` - AI-powered analysis
- [x] `generate-token` - Token creation
- [x] `checkout` - Stripe checkout session
- [x] `stripe-webhook` - Payment processing

### Database
- [x] DynamoDB table: `highlandai_tokens`
- [x] RDS PostgreSQL available

### CLI
- [x] 136 tests passing
- [x] Commander.js + Inquirer.js setup
- [ ] NOT published to npm yet

## What's NOT Done

- [ ] E2E flow untested (Landing → Stripe → Token → CLI)
- [ ] CLI not on npm (`@highland-ai/claude-setup`)
- [ ] Custom domain pending (waiting on is-a.dev PR)
- [ ] /start, /checkout, /success pages unverified

## Tech Stack

| Layer | Tech |
|-------|------|
| CLI | Node.js, Commander.js, Inquirer.js |
| Frontend | Next.js 14, Tailwind CSS |
| Backend | AWS Lambda, API Gateway |
| Database | DynamoDB, RDS PostgreSQL |
| Payments | Stripe |
| AI | Claude API |

## Quick Commands

```bash
# CLI
cd cli && npm test

# Frontend
cd frontend && npm run dev

# Check AWS
aws amplify list-apps
aws lambda list-functions
```
