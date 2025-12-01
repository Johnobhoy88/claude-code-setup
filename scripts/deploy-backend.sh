#!/bin/bash

# Highland AI - Claude Code Setup Tool
# Backend Deployment Script (AWS SAM)

set -e

echo "🏔️  Highland AI - Deploying Backend to AWS..."
echo ""

# Navigate to backend directory
cd "$(dirname "$0")/../backend"

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
  echo "❌ AWS credentials not configured"
  echo "Run: aws configure"
  exit 1
fi

echo "✅ AWS credentials verified"
echo ""

# Check if SAM CLI is installed
if ! command -v sam &> /dev/null; then
  echo "❌ AWS SAM CLI not installed"
  echo "Install: pip install aws-sam-cli"
  exit 1
fi

echo "✅ AWS SAM CLI found"
echo ""

# Check for required environment variables
if [ -z "$ANTHROPIC_API_KEY" ]; then
  read -p "Enter Anthropic API Key: " ANTHROPIC_API_KEY
fi

if [ -z "$SUPABASE_URL" ]; then
  read -p "Enter Supabase URL: " SUPABASE_URL
fi

if [ -z "$SUPABASE_SERVICE_KEY" ]; then
  read -p "Enter Supabase Service Key: " SUPABASE_SERVICE_KEY
fi

if [ -z "$JWT_SECRET" ]; then
  read -p "Enter JWT Secret: " JWT_SECRET
fi

echo ""
echo "🔨 Building Lambda functions..."
sam build || {
  echo "❌ Build failed"
  exit 1
}
echo "✅ Build complete"
echo ""

# Validate template
echo "🔍 Validating SAM template..."
sam validate || {
  echo "❌ Template validation failed"
  exit 1
}
echo "✅ Template valid"
echo ""

# Deploy
echo "📤 Deploying to AWS..."
sam deploy \
  --stack-name claude-setup-backend \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    AnthropicApiKey="$ANTHROPIC_API_KEY" \
    SupabaseUrl="$SUPABASE_URL" \
    SupabaseServiceKey="$SUPABASE_SERVICE_KEY" \
    JwtSecret="$JWT_SECRET" \
  --no-confirm-changeset \
  --no-fail-on-empty-changeset || {
  echo "❌ Deployment failed"
  exit 1
}

echo ""
echo "✅ Deployment complete!"
echo ""

# Get API endpoint
API_URL=$(aws cloudformation describe-stacks \
  --stack-name claude-setup-backend \
  --query "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue" \
  --output text)

echo "📍 API Endpoint: $API_URL"
echo ""
echo "Save this to your frontend .env:"
echo "  BACKEND_API_URL=$API_URL"
echo ""

# Upload playbooks to S3
read -p "Upload playbooks to S3? (y/n): " UPLOAD_PLAYBOOKS

if [ "$UPLOAD_PLAYBOOKS" = "y" ]; then
  echo ""
  echo "📤 Uploading playbooks..."
  cd ../playbooks
  aws s3 sync . s3://highland-ai-playbooks/
  echo "✅ Playbooks uploaded"
fi

echo ""
echo "Deployment Summary:"
echo "  Stack: claude-setup-backend"
echo "  Region: $(aws configure get region)"
echo "  API URL: $API_URL"
echo ""
