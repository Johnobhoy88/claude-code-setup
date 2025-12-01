#!/bin/bash

# Highland AI - Claude Code Setup Tool
# Database Setup Script (Supabase)

set -e

echo "🏔️  Highland AI - Setting up Supabase Database..."
echo ""

# Navigate to database directory
cd "$(dirname "$0")/../database"

# Check for Supabase credentials
if [ -z "$SUPABASE_URL" ]; then
  read -p "Enter Supabase URL: " SUPABASE_URL
fi

if [ -z "$SUPABASE_SERVICE_KEY" ]; then
  read -p "Enter Supabase Service Key: " SUPABASE_SERVICE_KEY
fi

if [ -z "$SUPABASE_DB_PASSWORD" ]; then
  read -p "Enter Supabase DB Password: " SUPABASE_DB_PASSWORD
fi

# Extract project ref from URL
PROJECT_REF=$(echo $SUPABASE_URL | sed -E 's/https:\/\/([^.]+).*/\1/')

echo ""
echo "Project: $PROJECT_REF"
echo ""

# Construct database URL
DATABASE_URL="postgresql://postgres:$SUPABASE_DB_PASSWORD@db.$PROJECT_REF.supabase.co:5432/postgres"

echo "🔗 Database URL constructed"
echo ""

# Check if psql is installed
if ! command -v psql &> /dev/null; then
  echo "❌ psql not installed"
  echo "Install PostgreSQL client tools"
  exit 1
fi

echo "✅ psql found"
echo ""

# Test connection
echo "🔌 Testing database connection..."
if ! psql "$DATABASE_URL" -c "SELECT 1" &> /dev/null; then
  echo "❌ Database connection failed"
  echo "Check your credentials and network"
  exit 1
fi
echo "✅ Database connection successful"
echo ""

# Run init schema
echo "📋 Running init schema..."
psql "$DATABASE_URL" -f schemas/init.sql || {
  echo "❌ Schema creation failed"
  exit 1
}
echo "✅ Schema created"
echo ""

# Seed data
read -p "Seed database with MCP templates? (y/n): " SEED_DB

if [ "$SEED_DB" = "y" ]; then
  echo ""
  echo "🌱 Seeding database..."
  psql "$DATABASE_URL" -f schemas/seed.sql || {
    echo "❌ Seeding failed"
    exit 1
  }
  echo "✅ Database seeded"
fi

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Tables created:"
echo "  - install_tokens"
echo "  - subscribers"
echo "  - claude_configs"
echo "  - mcp_templates"
echo "  - usage_analytics"
echo ""
echo "Save these to your .env files:"
echo "  SUPABASE_URL=$SUPABASE_URL"
echo "  SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_KEY"
echo ""
