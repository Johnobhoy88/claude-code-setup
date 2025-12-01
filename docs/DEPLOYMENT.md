# Deployment Guide

Complete deployment instructions for Highland AI Claude Code Setup Tool.

## Prerequisites

- [ ] AWS Account with $200 credits
- [ ] Vercel account (free tier)
- [ ] Supabase account (free tier)
- [ ] Stripe account
- [ ] npm account for CLI publishing
- [ ] Domain: highlandai.com (existing)

## Deployment Checklist

### Week 1-2: CLI Tool

#### 1. Build CLI Tool
```bash
cd cli/
npm install
npm run build
npm run test
```

#### 2. Test Locally
```bash
# Test the CLI
npm link
claude-setup --help
claude-setup
```

#### 3. Publish to npm
```bash
# Login to npm
npm login

# Publish (scoped package)
npm publish --access public
```

#### 4. Verify Installation
```bash
npx @highland-ai/claude-setup --version
```

### Week 3: Backend (AWS Lambda)

#### 1. Set Up AWS Credentials
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure credentials
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1)
```

#### 2. Install SAM CLI
```bash
# Install AWS SAM
pip install aws-sam-cli

# Verify
sam --version
```

#### 3. Create S3 Buckets
```bash
# Playbooks bucket
aws s3 mb s3://highland-ai-playbooks

# Templates bucket
aws s3 mb s3://highland-ai-templates

# Upload playbooks
cd playbooks/
aws s3 sync . s3://highland-ai-playbooks/

# Upload templates
cd templates/
aws s3 sync . s3://highland-ai-templates/
```

#### 4. Deploy Lambda Functions
```bash
cd backend/

# Build
sam build

# Deploy
sam deploy --guided

# Follow prompts:
# Stack Name: claude-setup-backend
# AWS Region: us-east-1
# Confirm changes: Y
# Allow SAM CLI IAM role creation: Y
```

#### 5. Save API Endpoint
```bash
# SAM will output API Gateway URL
# Save this for frontend .env:
# https://xxxxx.execute-api.us-east-1.amazonaws.com/prod/
```

### Week 4: Database (Supabase)

#### 1. Create Supabase Project
- Go to https://supabase.com
- Click "New Project"
- Name: `claude-setup`
- Database Password: (save this)
- Region: `us-east-1`

#### 2. Run Database Migrations
```bash
cd database/

# Copy schema
cat schemas/init.sql

# Paste into Supabase SQL Editor and run

# Then seed data
cat schemas/seed.sql
# Paste and run
```

#### 3. Save Credentials
```bash
# From Supabase Dashboard → Settings → API
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Week 5: Frontend (Vercel)

#### 1. Set Up Environment Variables
```bash
cd frontend/

# Copy .env.example
cp .env.example .env.local

# Fill in values:
# - Stripe keys
# - Supabase keys
# - Backend API URL
# - JWT secret
```

#### 2. Test Locally
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

#### 3. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables in Vercel Dashboard
# Project Settings → Environment Variables
```

#### 4. Configure Custom Domain
```bash
# In Vercel Dashboard
# Project → Settings → Domains
# Add: highlandai.com/products/claude-setup
```

### Week 6: Stripe Integration

#### 1. Create Products
Go to Stripe Dashboard → Products → Add Product

**Product 1: One-Time**
- Name: Claude Code Setup
- Price: $9.99 USD
- Type: One-time
- Save Price ID

**Product 2: Monthly**
- Name: Claude Code Setup Unlimited
- Price: $24.99/month
- Type: Recurring (monthly)
- Save Price ID

#### 2. Set Up Webhooks
```bash
# In Stripe Dashboard → Developers → Webhooks
# Add endpoint:
URL: https://highlandai.com/api/webhook/stripe
Events to send:
  - checkout.session.completed
  - customer.subscription.created
  - customer.subscription.updated
  - customer.subscription.deleted

# Save webhook signing secret
```

#### 3. Update Environment Variables
Add to Vercel:
```bash
STRIPE_PRICE_ID_ONETIME=price_xxxxx
STRIPE_PRICE_ID_MONTHLY=price_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Week 7: Launch

#### 1. Final Testing
```bash
# Test complete flow:
1. Visit product page
2. Purchase ($9.99 one-time)
3. Receive email with command
4. Run: npx @highland-ai/claude-setup --token XXXX
5. Verify setup works
```

#### 2. Product Hunt Launch
- [ ] Create Product Hunt listing
- [ ] Prepare 3-minute demo video
- [ ] Schedule launch for Thursday
- [ ] Prepare launch announcement

#### 3. Marketing
- [ ] Post on Reddit (r/ClaudeAI, r/webdev, r/SideProject)
- [ ] Tweet build-in-public thread
- [ ] HackerNews Show HN post
- [ ] Email existing Highland AI customers

## Environment Variables Summary

### CLI (.env)
```bash
HIGHLAND_AI_API_URL=https://api.highlandai.com
```

### Backend (Lambda Environment Variables)
```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbG...
JWT_SECRET=your-super-secret-key
PLAYBOOKS_BUCKET=highland-ai-playbooks
TEMPLATES_BUCKET=highland-ai-templates
```

### Frontend (Vercel Environment Variables)
```bash
# Public
NEXT_PUBLIC_URL=https://highlandai.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# Private
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_ONETIME=price_...
STRIPE_PRICE_ID_MONTHLY=price_...
SUPABASE_SERVICE_KEY=eyJhbG...
JWT_SECRET=your-super-secret-key
BACKEND_API_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com/prod
RESEND_API_KEY=re_...
EMAIL_FROM=setup@highlandai.com
```

## Cost Tracking

### Monthly Costs (Base Case: 1,000 setups/month)
| Service | Free Tier | Paid | Notes |
|---------|-----------|------|-------|
| Vercel | ✅ Free | $0 | Hobby plan |
| Supabase | ✅ Free | $0 | 500MB storage |
| AWS Lambda | ✅ Free | $0 | 1M requests/month |
| AWS S3 | ✅ Free | $0 | 5GB storage |
| npm | ✅ Free | $0 | Public packages |
| Stripe | - | ~$300/year | 2.9% + $0.30 per sale |
| **Total** | - | **~$300/year** | 99% profit margin |

## Monitoring

### Set Up Monitoring
```bash
# CloudWatch for Lambda
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=claude-setup-analyze \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-31T23:59:59Z \
  --period 3600 \
  --statistics Sum

# Vercel Analytics (built-in)
# View in Vercel Dashboard

# Supabase Logs
# View in Supabase Dashboard → Logs
```

## Troubleshooting

### Lambda Deployment Fails
```bash
# Check SAM template
sam validate

# Check CloudFormation events
aws cloudformation describe-stack-events --stack-name claude-setup-backend
```

### Vercel Build Fails
```bash
# Check build logs
vercel logs

# Test locally
npm run build
```

### Stripe Webhook Not Working
```bash
# Test webhook locally
stripe listen --forward-to localhost:3000/api/webhook/stripe

# Check webhook signature
# Verify STRIPE_WEBHOOK_SECRET is correct
```

## Rollback Plan

### Rollback Lambda
```bash
# List previous versions
aws lambda list-versions-by-function --function-name claude-setup-analyze

# Rollback
aws lambda update-alias \
  --function-name claude-setup-analyze \
  --name prod \
  --function-version 2
```

### Rollback Vercel
```bash
# Vercel Dashboard → Deployments → Rollback
# Or via CLI:
vercel rollback
```

## Support After Launch

### Customer Support
- Email: support@highlandai.com
- Discord: Highland AI Community
- Documentation: highlandai.com/products/claude-setup/docs

### Monitoring Metrics
- Daily active users (DAU)
- Conversion rate (free → paid)
- Churn rate (monthly subscribers)
- Average revenue per user (ARPU)
- Customer acquisition cost (CAC)

---

**Deployment Complete! 🎉**

Next steps:
1. Monitor metrics
2. Collect user feedback
3. Iterate on features
4. Scale as needed
