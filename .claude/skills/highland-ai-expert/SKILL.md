---
name: highland-ai-expert
description: Expert knowledge on Highland AI Claude Code Setup Tool - the product architecture, codebase, business model, and development workflow. Use when working on this project.
---

# Highland AI Product Expert

## Overview

This skill makes Claude an expert on the Highland AI Claude Code Setup Tool - a Micro-SaaS that configures Claude Code in 5 minutes.

## When to Use This Skill

- Working on any file in this repository
- Answering questions about the product
- Making architectural decisions
- Adding new features
- Debugging issues

## Product Knowledge

### What It Does

1. User pays $2.99-$4.99/month on website
2. Completes AI-driven questionnaire
3. Receives email with token
4. Runs: `npx @highland-ai/claude-setup --token XXX`
5. CLI installs MCPs, skills, rules, CLAUDE.md
6. Claude is now configured for their project

### Two Tiers

| Tier | Price | For |
|------|-------|-----|
| Basic | $2.99/mo | Hobbyists, new to Claude Code |
| Pro | $4.99/mo (5 projects) | Serious developers |

**Basic:** Popular MCPs, standard setup, quick questionnaire
**Pro:** Bespoke skills, custom rules, API credential walkthrough, Claude Q&A on startup

### Tech Stack

- **CLI:** Node.js, Commander.js, Inquirer.js
- **Backend:** AWS Lambda, DynamoDB, Claude API
- **Frontend:** Next.js 14, Tailwind, Vercel
- **Database:** Supabase
- **Payments:** Stripe

### Key Business Metrics

- Cost per setup: < $0.20
- Margin: > 95%
- Setup time: < 5 minutes

## Development Guidelines

### When Adding Features

1. Check if it's Basic or Pro tier feature
2. Update relevant playbooks/knowledge base if needed
3. Add tests
4. Update ROADMAP.md if it's a milestone

### When Fixing Bugs

1. Check `cli/src/__tests__/` for related tests
2. Add failing test first
3. Fix the bug
4. Verify test passes

### Key Files

| If working on... | Look at... |
|------------------|------------|
| CLI flow | `cli/src/index.js` |
| MCP installation | `cli/src/installers.js` |
| CLAUDE.md generation | `cli/src/generators.js` |
| AI matching | `backend/functions/analyze-project/` |
| Website | `frontend/src/app/` |
| Playbooks | `playbooks/` |

## Common Tasks

### Add a New MCP to Knowledge Base

1. Create `knowledge/mcps/[name].md`
2. Update `knowledge/mcps/index.json`
3. Add to relevant playbooks in `playbooks/frameworks/`

### Add a New Framework

1. Create `playbooks/frameworks/[name].json`
2. Create template `playbooks/templates/[name]-template.md`
3. Add to `cli/src/generators.js` TEMPLATES object

### Test the CLI Locally

```bash
cd cli
npm install
node src/index.js --token test-token
```

## What Makes a Good Setup

Users should feel:
- "Claude knows my stack"
- "Claude follows my style"
- "I discovered tools I didn't know existed"
