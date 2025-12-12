# Highland AI - Claude Code Setup Tool
## Product Roadmap & Vision

*Documented from Q&A session - December 2024*

---

## Product Vision

**One sentence:** A CLI tool that sets up Claude Code completely - MCPs, skills, plugins, rules, hooks, and CLAUDE.md - so Claude feels like it's working *with* the developer from the first moment.

**The feeling we're selling:** "Claude already knows my stack. Claude follows my style. Claude has tools I didn't know existed."

---

## Target Market

| Segment | Description |
|---------|-------------|
| **Primary** | Solo developers, small teams |
| **Future** | Scale to agencies, enterprises |

---

## Pricing (Launch)

| Tier | Price | For Who | What They Get |
|------|-------|---------|---------------|
| **Basic** | $2.99/month | New to Claude Code, hobbyists | Popular MCPs, official skills/plugins, standard CLAUDE.md, basic questionnaire |
| **Pro** | $4.99/month (5 projects) | Serious devs, engineers | Bespoke skills, custom rules/CLAUDE.md, all integrations, cloud skills, API credential walkthrough, Claude final Q&A on startup |

---

## User Experience Flow

### Basic Tier
```
Website → Quick questionnaire (framework, project type)
       → Payment
       → Email with token + instructions
       → CLI install: npx @highland-ai/claude-setup --token XXX
       → MCPs installed, CLAUDE.md generated
       → Done
```

### Pro Tier
```
Website → Deep AI questionnaire (project, integrations, workflow, preferences)
       → Payment
       → Email with token + instructions
       → CLI install: npx @highland-ai/claude-setup --token XXX
       → API credential walkthrough (AWS, GitHub, etc.)
       → Prompt to restart Claude Code
       → Claude Code first startup: Final Q&A with Claude reading codebase
       → Done - Claude is now an expert on this project
```

---

## What Gets Installed

| Component | Basic | Pro |
|-----------|-------|-----|
| **MCPs** | Popular essentials (filesystem, memory, context7, puppeteer) | Full selection + cloud (AWS, GCP, Azure) |
| **Skills** | Official + community | Bespoke, AI-matched to project |
| **Plugins** | Official marketplace | Full marketplace access |
| **Rules** | Standard defaults | Project-specific `.claude/rules/` |
| **Hooks** | None | Session-start, pre-commit, etc. |
| **CLAUDE.md** | Template-based | Custom generated |

---

## User Type Experiences

| Aspect | Pro Dev | Hobby | Vibe Coder |
|--------|---------|-------|------------|
| **Questionnaire** | Fast, assumes knowledge | Balanced, explains | Guided, educational |
| **MCPs** | Advanced, full control | Helpful defaults | Safe, essential only |
| **Rules/Skills tone** | Terse, efficient | Helpful | Maximum explanation |
| **Hand-holding** | Minimal | Moderate | Claude explains everything |

### Vibe Coder Special Handling
- Explain recommendations: "I'm adding this MCP because..."
- Safer defaults, more guardrails
- Rules that say "always explain what you're doing before you do it"

---

## Knowledge Base Architecture

### What's In It
- All MCPs (official + community)
- All Skills (official + community)
- All Plugins
- Framework playbooks
- Integration configs
- Example projects
- Coding patterns
- Best practices

### Living Knowledge Base
- Updates daily/weekly with new releases
- Scans Anthropic releases, community repos
- Curated quality layer on top
- AI works from this source of truth

### Storage
- Hosted on AWS
- Static gates for matching
- Version controlled

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    WEBSITE (Next.js/Vercel)                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │     AI-Driven Questionnaire                          │   │
│  │     - Basic: 5 questions                             │   │
│  │     - Pro: 10-15 questions                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │     Payment (Stripe)                                 │   │
│  │     - Basic: $2.99/month                             │   │
│  │     - Pro: $4.99/month (5 projects)                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    AWS BACKEND                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │     Lambda: Generate Config                          │   │
│  │     - Query knowledge base                           │   │
│  │     - AI matching (Bedrock/Claude)                   │   │
│  │     - Generate skills, rules, CLAUDE.md              │   │
│  │     - Create token                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │     Knowledge Base (S3 + DynamoDB)                   │   │
│  │     - MCPs, Skills, Plugins                          │   │
│  │     - Frameworks, Integrations                       │   │
│  │     - Templates, Examples                            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ (Email with token)
┌─────────────────────────────────────────────────────────────┐
│                    CLI (npm package)                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │     npx @highland-ai/claude-setup --token XXX        │   │
│  │     - Validate token                                 │   │
│  │     - Download generated config                      │   │
│  │     - Install MCPs                                   │   │
│  │     - Write skills to ~/.claude/skills/              │   │
│  │     - Write rules to .claude/rules/                  │   │
│  │     - Write hooks                                    │   │
│  │     - Generate CLAUDE.md                             │   │
│  │     - Pro: API credential walkthrough                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ (Pro only)
┌─────────────────────────────────────────────────────────────┐
│                    CLAUDE CODE (First Startup)              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │     Session-start hook triggers                      │   │
│  │     - Claude reads codebase                          │   │
│  │     - Final Q&A with user                            │   │
│  │     - Validates setup is correct                     │   │
│  │     - Claude is now an expert on this project        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Branding & Affiliate

### Branding in Output
- "Generated by Highland AI" in CLAUDE.md and files
- Affiliate link included

### Referral Program (v2)
- Discount codes preferred over cash payouts
- Example: "10 referrals = 3 months free"
- Tracked and automated
- Rewards: discount codes, free months, tier upgrades

---

## Cost Per Setup

| Model | AI Cost | Infra | Total |
|-------|---------|-------|-------|
| Claude Sonnet (premium) | $0.14 | $0.002 | ~$0.15 |
| Haiku + Sonnet hybrid | $0.05 | $0.002 | ~$0.05 |
| Llama 3.1 (budget) | $0.02 | $0.002 | ~$0.02 |

**Margins at $2.99:** 95-99%
**Margins at $4.99:** 97-99%

---

## Launch Scope (MVP)

### Must Have
- [ ] Two-tier pricing (Basic $2.99, Pro $4.99)
- [ ] Website questionnaire (Basic: quick, Pro: deep)
- [ ] CLI installs: MCPs, skills, rules, CLAUDE.md
- [ ] Token-based authentication
- [ ] Email delivery with instructions
- [ ] Knowledge base (curated, 30+ MCPs, 15+ skills)

### Pro Tier Must Have
- [ ] API credential walkthrough in CLI
- [ ] Session-start hook for Claude first-run Q&A
- [ ] Custom rules generation
- [ ] Bespoke skills selection

### Nice to Have (v2+)
- [ ] Live knowledge base updates
- [ ] Affiliate/referral system
- [ ] Cross-machine sync
- [ ] Auto-updates for configs
- [ ] Dashboard for subscribers
- [ ] Community tips/blog

---

## Development Priorities

1. **Knowledge base depth** - Research and document all MCPs, skills, plugins
2. **Proof of concept** - Set up THIS repo perfectly as demonstration
3. **Website questionnaire** - AI-driven discovery flow
4. **CLI expansion** - Install skills, rules, hooks, plugins
5. **Two-tier split** - Differentiate Basic vs Pro experience

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Setup time | < 5 minutes |
| User satisfaction | "Claude gets my project" on first use |
| Cost per setup | < $0.20 |
| Margin | > 95% |

---

*Last updated: December 2024*
*Status: Planning → Proof of Concept*
