/**
 * Project analyzer module
 * Handles AI-powered project analysis via API
 */

import fetch from 'node-fetch';

function getApiBaseUrl() {
  const url = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url) {
    throw new Error('API_BASE_URL is not configured. Set API_BASE_URL or NEXT_PUBLIC_API_BASE_URL.');
  }
  return url.replace(/\/+$/, '');
}

/**
 * Free tier MCPs - 4 essential MCPs for every project
 */
const FREE_TIER_MCPS = [
  {
    name: 'context7',
    package: '@upstash/context7-mcp',
    description: 'Up-to-date library documentation lookup',
    required: true,
    requiresEnvVars: [],
    requiresOAuth: false,
    priority: 'essential'
  },
  {
    name: 'memory',
    package: '@modelcontextprotocol/server-memory',
    description: 'Persistent memory across sessions',
    required: true,
    requiresEnvVars: [],
    requiresOAuth: false,
    priority: 'essential'
  },
  {
    name: 'puppeteer',
    package: '@anthropic/puppeteer-mcp',
    description: 'Browser automation and debugging',
    required: true,
    requiresEnvVars: [],
    requiresOAuth: false,
    priority: 'essential'
  },
  {
    name: 'filesystem',
    package: '@modelcontextprotocol/server-filesystem',
    description: 'File system access for project files',
    required: true,
    requiresEnvVars: [],
    requiresOAuth: false,
    priority: 'essential'
  }
];

/**
 * Returns the free tier MCP recommendations
 * @returns {AnalysisResult}
 */
export function getFreeTierMCPs() {
  return {
    framework: 'generic',
    integrations: [],
    useCases: [],
    mcps: [...FREE_TIER_MCPS],
    skills: [],
    template: 'default'
  };
}

/**
 * Validates that an analysis result has all required fields
 * @param {object} result - API response
 * @returns {boolean}
 */
export function isValidAnalysisResult(result) {
  if (!result || typeof result !== 'object') {
    return false;
  }
  
  // Must have mcps array
  if (!Array.isArray(result.mcps)) {
    return false;
  }
  
  // Each MCP must have required fields
  return result.mcps.every(mcp => 
    typeof mcp.name === 'string' &&
    typeof mcp.package === 'string'
  );
}

/**
 * Normalizes MCP data from API response
 * @param {object} mcp - Raw MCP data
 * @returns {MCPRecommendation}
 */
function normalizeMCP(mcp) {
  return {
    name: mcp.name,
    package: mcp.package,
    required: mcp.required ?? false,
    requiresEnvVars: mcp.requiresEnvVars ?? mcp.required_env_vars ?? [],
    requiresOAuth: mcp.requiresOAuth ?? mcp.oauth_flow ?? false
  };
}

/**
 * Analyzes project via API and returns recommendations
 * @param {AnalysisRequest} request
 * @returns {Promise<AnalysisResult>}
 */
export async function analyzeProject(request) {
  const { userInput, tier, token } = request;

  if (!userInput || typeof userInput !== 'string') {
    throw new Error('Project description is required');
  }

  if (!token) {
    throw new Error('Token is required for project analysis');
  }

  const apiBaseUrl = getApiBaseUrl();

  const response = await fetch(`${apiBaseUrl}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userInput,
      tier,
      token
    })
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to analyze project');
  }
  
  const data = await response.json();
  
  if (!isValidAnalysisResult(data)) {
    throw new Error('Invalid response from analysis API');
  }
  
  return {
    framework: data.framework || 'generic',
    integrations: data.integrations || [],
    useCases: data.useCases || data.use_cases || [],
    mcps: data.mcps.map(normalizeMCP),
    skills: data.skills || [],
    template: data.template || 'default'
  };
}

/**
 * Formats analysis result for display
 * @param {AnalysisResult} result
 * @returns {string}
 */
export function formatAnalysisResult(result) {
  const lines = [];
  
  if (result.framework && result.framework !== 'generic') {
    lines.push(`Framework: ${result.framework}`);
  }
  
  if (result.integrations.length > 0) {
    lines.push(`Integrations: ${result.integrations.join(', ')}`);
  }
  
  if (result.useCases.length > 0) {
    lines.push(`Use Cases: ${result.useCases.join(', ')}`);
  }
  
  lines.push(`\nRecommended MCPs (${result.mcps.length}):`);
  result.mcps.forEach(mcp => {
    const flags = [];
    if (mcp.required) flags.push('required');
    if (mcp.requiresEnvVars.length > 0) flags.push('needs env vars');
    if (mcp.requiresOAuth) flags.push('needs OAuth');
    
    const flagStr = flags.length > 0 ? ` [${flags.join(', ')}]` : '';
    lines.push(`  • ${mcp.name}${flagStr}`);
  });
  
  if (result.skills.length > 0) {
    lines.push(`\nSkills: ${result.skills.join(', ')}`);
  }
  
  if (result.template && result.template !== 'default') {
    lines.push(`Template: ${result.template}`);
  }
  
  return lines.join('\n');
}

/**
 * @typedef {Object} AnalysisRequest
 * @property {string} userInput - Project description
 * @property {string} tier - User tier (onetime/monthly)
 * @property {string} token - License token for API authentication
 */

/**
 * @typedef {Object} AnalysisResult
 * @property {string} framework - Detected framework
 * @property {string[]} integrations - Detected integrations
 * @property {string[]} useCases - Detected use cases
 * @property {MCPRecommendation[]} mcps - Recommended MCPs
 * @property {string[]} skills - Recommended skills
 * @property {string} template - CLAUDE.md template name
 */

/**
 * @typedef {Object} MCPRecommendation
 * @property {string} name - MCP name
 * @property {string} package - npm package name
 * @property {boolean} required - Whether MCP is required
 * @property {string[]} requiresEnvVars - Required environment variables
 * @property {boolean} requiresOAuth - Whether OAuth is required
 */
