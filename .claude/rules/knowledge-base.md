---
paths:
  - "knowledge/**/*"
  - "playbooks/**/*"
---

# Knowledge Base Rules

## Purpose

The knowledge base is the "brain" of the product - it powers all AI matching and recommendations.

## Directory Structure

```
knowledge/
├── mcps/               # MCP documentation
│   ├── index.json      # Registry of all MCPs
│   └── *.md            # Individual MCP docs
├── skills/             # Skill definitions
│   └── index.json      # Registry of all skills
├── frameworks/         # Framework guides
└── best-practices/     # Coding patterns

playbooks/
├── frameworks/         # Framework-specific configs (JSON)
├── integrations/       # Integration configs (JSON)
├── use-cases/          # Use case configs (JSON)
└── templates/          # CLAUDE.md templates (Markdown)
```

## MCP Documentation Format

Each MCP in `knowledge/mcps/`:

```markdown
# MCP Name

## Description
What this MCP does.

## Installation
npm package name and command.

## Configuration
Required environment variables, OAuth flows.

## Use Cases
When to recommend this MCP.

## Keywords
Terms that should trigger this MCP recommendation.
```

## Playbook JSON Format

```json
{
  "name": "Framework Name",
  "description": "What it is",
  "required_mcps": ["@package/name"],
  "optional_mcps": ["@package/name"],
  "skills": ["skill-name"],
  "claude_md_template": "template-name.md",
  "instructions": ["Instruction 1", "Instruction 2"],
  "keywords": ["keyword1", "keyword2"],
  "tech_stack": {
    "framework": "Name",
    "language": "TypeScript"
  }
}
```

## Quality Standards

- Every MCP must have complete documentation
- Every playbook must have keywords for matching
- Templates must be production-ready, not placeholders
- Update `index.json` files when adding new items

## Adding New Content

1. **New MCP:** Add `.md` file to `knowledge/mcps/`, update `index.json`
2. **New Framework:** Add `.json` to `playbooks/frameworks/`, add template to `playbooks/templates/`
3. **New Integration:** Add `.json` to `playbooks/integrations/`
