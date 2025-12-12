# Add MCP to Knowledge Base

Add a new MCP to the Highland AI knowledge base.

## Usage
/add-mcp [mcp-name]

## Instructions

1. Research the MCP:
   - Find the npm package name
   - Understand what it does
   - Identify required environment variables
   - Determine use cases

2. Create documentation file:
   - Create `knowledge/mcps/[name].md`
   - Follow the format of existing MCP docs

3. Update the registry:
   - Add entry to `knowledge/mcps/index.json`

4. Update relevant playbooks:
   - Check which frameworks/integrations should include this MCP
   - Update `playbooks/frameworks/*.json` as needed

5. Report what was added and where.
