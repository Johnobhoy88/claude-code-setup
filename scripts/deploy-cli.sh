#!/bin/bash

# Highland AI - Claude Code Setup Tool
# CLI Deployment Script

set -e

echo "🏔️  Highland AI - Deploying CLI to npm..."
echo ""

# Navigate to CLI directory
cd "$(dirname "$0")/../cli"

# Verify we're in the right place
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found"
  exit 1
fi

# Check if logged in to npm
if ! npm whoami &> /dev/null; then
  echo "❌ Not logged in to npm"
  echo "Run: npm login"
  exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "Current version: $CURRENT_VERSION"
echo ""

# Ask for version bump
echo "Select version bump:"
echo "1) patch (bug fixes)"
echo "2) minor (new features)"
echo "3) major (breaking changes)"
read -p "Enter choice (1-3): " VERSION_CHOICE

case $VERSION_CHOICE in
  1) BUMP_TYPE="patch" ;;
  2) BUMP_TYPE="minor" ;;
  3) BUMP_TYPE="major" ;;
  *) echo "Invalid choice"; exit 1 ;;
esac

# Bump version
npm version $BUMP_TYPE --no-git-tag-version
NEW_VERSION=$(node -p "require('./package.json').version")

echo ""
echo "Bumped version: $CURRENT_VERSION → $NEW_VERSION"
echo ""

# Run tests
echo "📋 Running tests..."
npm test || {
  echo "❌ Tests failed"
  exit 1
}
echo "✅ Tests passed"
echo ""

# Build
echo "🔨 Building..."
npm run build || {
  echo "❌ Build failed"
  exit 1
}
echo "✅ Build complete"
echo ""

# Lint
echo "🔍 Linting..."
npm run lint || {
  echo "❌ Linting failed"
  exit 1
}
echo "✅ Linting passed"
echo ""

# Show package contents
echo "📦 Package contents:"
npm pack --dry-run
echo ""

# Confirm publication
read -p "Publish v$NEW_VERSION to npm? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
  echo "❌ Publication cancelled"
  exit 0
fi

# Publish to npm
echo ""
echo "📤 Publishing to npm..."
npm publish --access public || {
  echo "❌ Publish failed"
  exit 1
}

echo ""
echo "✅ Published @highland-ai/claude-setup@$NEW_VERSION to npm"
echo ""
echo "Verify installation:"
echo "  npx @highland-ai/claude-setup@$NEW_VERSION --version"
echo ""
echo "Git commit:"
echo "  git add ."
echo "  git commit -m \"chore: release v$NEW_VERSION\""
echo "  git tag v$NEW_VERSION"
echo "  git push origin main --tags"
echo ""
