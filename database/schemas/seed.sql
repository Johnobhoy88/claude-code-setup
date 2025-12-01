-- Highland AI - Claude Code Setup Tool
-- Seed Data for MCP Templates

-- Essential MCPs (installed by default in free tier)
INSERT INTO mcp_templates (name, category, description, install_command, required_env_vars, oauth_flow, popularity_score) VALUES
  ('Memory', 'core', 'Persistent memory across sessions', '@modelcontextprotocol/server-memory', '{}', false, 1000),
  ('Filesystem', 'core', 'Local file operations', '@modelcontextprotocol/server-filesystem', '{}', false, 1000),
  ('Sequential Thinking', 'core', 'Step-by-step reasoning for complex tasks', 'sequential-thinking-mcp', '{}', false, 900);

-- Integration MCPs
INSERT INTO mcp_templates (name, category, description, install_command, required_env_vars, oauth_flow, popularity_score) VALUES
  ('GitHub', 'integrations', 'GitHub repository management', '@modelcontextprotocol/server-github', '{"GITHUB_TOKEN"}', true, 950),
  ('Notion', 'integrations', 'Notion workspace integration', '@notionhq/notion-mcp-server', '{"NOTION_API_KEY"}', true, 800),
  ('Slack', 'integrations', 'Slack workspace integration', '@slack/mcp-server', '{"SLACK_TOKEN"}', true, 700),
  ('Linear', 'integrations', 'Linear issue tracking', '@linear/mcp-server', '{"LINEAR_API_KEY"}', true, 600),
  ('Jira', 'integrations', 'Jira project management', '@atlassian/mcp-jira', '{"JIRA_TOKEN"}', true, 500);

-- Development Tools
INSERT INTO mcp_templates (name, category, description, install_command, required_env_vars, oauth_flow, popularity_score) VALUES
  ('Git', 'dev-tools', 'Git version control operations', '@modelcontextprotocol/server-git', '{}', false, 850),
  ('Docker', 'dev-tools', 'Docker container management', 'docker-mcp-server', '{}', false, 700),
  ('PostgreSQL', 'dev-tools', 'PostgreSQL database operations', '@modelcontextprotocol/server-postgres', '{"DATABASE_URL"}', false, 650),
  ('Redis', 'dev-tools', 'Redis cache operations', 'redis-mcp-server', '{"REDIS_URL"}', false, 550);

-- AI/ML MCPs
INSERT INTO mcp_templates (name, category, description, install_command, required_env_vars, oauth_flow, popularity_score) VALUES
  ('Ollama', 'ai-ml', 'Local LLM inference', 'ollama-mcp', '{}', false, 800),
  ('Hugging Face', 'ai-ml', 'Hugging Face model hub', '@huggingface/mcp-server', '{"HF_TOKEN"}', true, 700),
  ('MLflow', 'ai-ml', 'ML experiment tracking', 'mlflow-mcp', '{"MLFLOW_TRACKING_URI"}', false, 600);

-- Data Processing
INSERT INTO mcp_templates (name, category, description, install_command, required_env_vars, oauth_flow, popularity_score) VALUES
  ('RAG Engine', 'data', 'Retrieval Augmented Generation', 'rag-engine-mcp', '{}', false, 750),
  ('PDF Parser', 'data', 'PDF document processing', 'pdf-parser-mcp', '{}', false, 700),
  ('Web Scraper', 'data', 'Web scraping utilities', 'web-scraper-mcp', '{}', false, 650);

-- Cloud Platforms
INSERT INTO mcp_templates (name, category, description, install_command, required_env_vars, oauth_flow, popularity_score) VALUES
  ('Vercel', 'cloud', 'Vercel deployment integration', '@vercel/mcp-server', '{"VERCEL_TOKEN"}', true, 700),
  ('AWS', 'cloud', 'AWS services integration', '@aws/mcp-server', '{"AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"}', false, 650),
  ('Supabase', 'cloud', 'Supabase backend integration', '@supabase/mcp-server', '{"SUPABASE_URL", "SUPABASE_KEY"}', false, 600);

-- Productivity
INSERT INTO mcp_templates (name, category, description, install_command, required_env_vars, oauth_flow, popularity_score) VALUES
  ('Google Calendar', 'productivity', 'Google Calendar integration', '@google/mcp-calendar', '{"GOOGLE_CALENDAR_TOKEN"}', true, 600),
  ('Todoist', 'productivity', 'Todoist task management', 'todoist-mcp', '{"TODOIST_TOKEN"}', true, 550),
  ('Trello', 'productivity', 'Trello board management', 'trello-mcp', '{"TRELLO_TOKEN"}', true, 500);
