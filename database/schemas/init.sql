-- Highland AI - Claude Code Setup Tool
-- Supabase Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Install Tokens Table
-- Stores one-time use tokens for license validation
CREATE TABLE install_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('onetime', 'monthly')),
  stripe_session_id TEXT,
  stripe_customer_id TEXT,
  used BOOLEAN DEFAULT false,
  used_at TIMESTAMP,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX idx_install_tokens_token ON install_tokens(token);
CREATE INDEX idx_install_tokens_email ON install_tokens(email);
CREATE INDEX idx_install_tokens_used ON install_tokens(used);
CREATE INDEX idx_install_tokens_created_at ON install_tokens(created_at);

-- Subscribers Table
-- Tracks active monthly subscribers
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_stripe_customer_id ON subscribers(stripe_customer_id);
CREATE INDEX idx_subscribers_status ON subscribers(status);

-- Claude Configs Table
-- Stores saved configurations for monthly subscribers
CREATE TABLE claude_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  config_json JSONB NOT NULL,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_claude_configs_user_id ON claude_configs(user_id);
CREATE INDEX idx_claude_configs_created_at ON claude_configs(created_at);

-- MCP Templates Table
-- Pre-built configurations for different MCPs
CREATE TABLE mcp_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  install_command TEXT NOT NULL,
  config_template JSONB,
  required_env_vars TEXT[],
  oauth_flow BOOLEAN DEFAULT false,
  popularity_score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_mcp_templates_category ON mcp_templates(category);
CREATE INDEX idx_mcp_templates_popularity ON mcp_templates(popularity_score DESC);

-- Analytics Table (optional)
-- Track usage for insights
CREATE TABLE usage_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  user_email TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX idx_usage_analytics_event_type ON usage_analytics(event_type);
CREATE INDEX idx_usage_analytics_created_at ON usage_analytics(created_at);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE install_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE claude_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcp_templates ENABLE ROW LEVEL SECURITY;

-- Policies for install_tokens (service role only)
CREATE POLICY "Service role can manage install_tokens"
  ON install_tokens
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policies for subscribers
CREATE POLICY "Users can view their own subscription"
  ON subscribers
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Service role can manage subscribers"
  ON subscribers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policies for claude_configs
CREATE POLICY "Users can view their own configs"
  ON claude_configs
  FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM subscribers WHERE email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Users can insert their own configs"
  ON claude_configs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id IN (
      SELECT id FROM subscribers WHERE email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Users can update their own configs"
  ON claude_configs
  FOR UPDATE
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM subscribers WHERE email = auth.jwt() ->> 'email'
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT id FROM subscribers WHERE email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Users can delete their own configs"
  ON claude_configs
  FOR DELETE
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM subscribers WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Policies for mcp_templates (read-only for authenticated users)
CREATE POLICY "Anyone can view MCP templates"
  ON mcp_templates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can manage MCP templates"
  ON mcp_templates
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Functions

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_subscribers_updated_at
  BEFORE UPDATE ON subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claude_configs_updated_at
  BEFORE UPDATE ON claude_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mcp_templates_updated_at
  BEFORE UPDATE ON mcp_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE install_tokens IS 'One-time use tokens for license validation';
COMMENT ON TABLE subscribers IS 'Active monthly subscription users';
COMMENT ON TABLE claude_configs IS 'Saved Claude Code configurations';
COMMENT ON TABLE mcp_templates IS 'Pre-built MCP installation templates';
COMMENT ON TABLE usage_analytics IS 'Product usage analytics';
