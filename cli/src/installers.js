/**
 * MCP installer module
 * Handles MCP installation and configuration file management
 */

import { execa } from 'execa';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import ora from 'ora';
import chalk from 'chalk';
import { promptEnvVars, promptOAuthSetup } from './prompts.js';

/**
 * Gets the MCP config path for Claude Code (terminal CLI)
 * Claude Code uses .mcp.json in project root or ~/.claude/.mcp.json globally
 * @param {boolean} global - Whether to use global config
 * @returns {string}
 */
export function getMCPConfigPath(global = false) {
  if (global) {
    const home = os.homedir();
    return path.join(home, '.claude', 'mcp.json');
  }
  // Project-local config
  return path.join(process.cwd(), '.mcp.json');
}

/**
 * Reads existing MCP config or returns empty config
 * @returns {Promise<MCPConfig>}
 */
export async function readConfig() {
  const configPath = getMCPConfigPath();
  
  try {
    const content = await fs.readFile(configPath, 'utf8');
    const parsed = JSON.parse(content);
    // Ensure mcpServers exists
    if (!parsed.mcpServers) {
      parsed.mcpServers = {};
    }
    return parsed;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return { mcpServers: {} };
    }
    // If JSON is malformed, start fresh but preserve the error info
    if (err instanceof SyntaxError) {
      console.log('\n⚠️  Existing config file has invalid JSON. Creating new config.\n');
      return { mcpServers: {} };
    }
    throw err;
  }
}

/**
 * Writes MCP config to disk (project-local .mcp.json for Claude Code)
 * @param {InstallResult[]} installedMCPs
 * @returns {Promise<void>}
 */
export async function writeConfig(installedMCPs) {
  const configPath = getMCPConfigPath(false); // Project-local
  
  // Read existing config
  const existingConfig = await readConfig();
  
  // Merge new MCPs
  const newConfig = {
    ...existingConfig,
    mcpServers: {
      ...existingConfig.mcpServers
    }
  };
  
  for (const result of installedMCPs) {
    if (result.success && result.config) {
      newConfig.mcpServers[result.mcp] = result.config;
    }
  }
  
  // Write config to project root
  await fs.writeFile(configPath, JSON.stringify(newConfig, null, 2), 'utf8');
}

/**
 * Generates MCP server config
 * @param {MCPRecommendation} mcp
 * @param {Record<string, string>} envVars
 * @returns {MCPServerConfig}
 */
export function generateMCPConfig(mcp, envVars = {}) {
  const config = {
    command: 'npx',
    args: ['-y', mcp.package]
  };
  
  // Add project path for filesystem MCP
  // Use forward slashes for cross-platform compatibility in JSON
  if (mcp.name === 'filesystem') {
    const projectPath = process.cwd().replace(/\\/g, '/');
    config.args.push(projectPath);
  }
  
  // Add environment variables if any
  if (Object.keys(envVars).length > 0) {
    config.env = envVars;
  }
  
  return config;
}

/**
 * Installs a single MCP
 * @param {MCPRecommendation} mcp
 * @param {object} context
 * @returns {Promise<InstallResult>}
 */
export async function installMCP(mcp, context = {}) {
  const result = {
    mcp: mcp.name,
    success: false,
    error: null,
    config: null
  };
  
  try {
    let envVars = {};
    
    // Handle environment variables
    if (mcp.requiresEnvVars && mcp.requiresEnvVars.length > 0) {
      envVars = await promptEnvVars(mcp.requiresEnvVars, mcp.name);
    }
    
    // Handle OAuth
    if (mcp.requiresOAuth) {
      const proceed = await promptOAuthSetup(mcp.name);
      if (!proceed) {
        result.error = 'OAuth setup skipped by user';
        return result;
      }
      // OAuth flow would be handled here
      // For now, we just note it needs manual setup
      console.log(chalk.yellow(`  Please complete OAuth setup for ${mcp.name} manually.`));
    }
    
    // Verify package exists by checking npm registry
    // (In production, we'd validate the package exists)
    
    // Generate config
    result.config = generateMCPConfig(mcp, envVars);
    result.success = true;
    
  } catch (err) {
    result.error = err.message;
  }
  
  return result;
}

/**
 * Installs multiple MCPs with progress display
 * @param {MCPRecommendation[]} mcps
 * @param {object} context
 * @returns {Promise<InstallResult[]>}
 */
export async function installMCPs(mcps, context = {}) {
  const results = [];
  
  console.log(chalk.blue('\nInstalling MCPs...\n'));
  
  for (const mcp of mcps) {
    const spinner = ora(`Installing ${mcp.name}...`).start();
    
    try {
      const result = await installMCP(mcp, context);
      results.push(result);
      
      if (result.success) {
        spinner.succeed(`${mcp.name} configured`);
      } else {
        spinner.fail(`${mcp.name} failed: ${result.error}`);
      }
    } catch (err) {
      spinner.fail(`${mcp.name} failed: ${err.message}`);
      results.push({
        mcp: mcp.name,
        success: false,
        error: err.message,
        config: null
      });
    }
  }
  
  return results;
}

/**
 * Modifies MCP list based on add/remove operations
 * @param {MCPRecommendation[]} mcps - Current MCP list
 * @param {object} operations - Add/remove operations
 * @param {string[]} operations.add - MCPs to add
 * @param {string[]} operations.remove - MCPs to remove
 * @returns {MCPRecommendation[]}
 */
export function modifyMCPList(mcps, operations) {
  const { add = [], remove = [] } = operations;
  
  // First, deduplicate input MCPs (keep first occurrence)
  const seenNames = new Set();
  const dedupedMcps = mcps.filter(mcp => {
    if (seenNames.has(mcp.name)) {
      return false;
    }
    seenNames.add(mcp.name);
    return true;
  });
  
  // Remove MCPs (except required ones)
  let result = dedupedMcps.filter(mcp => 
    mcp.required || !remove.includes(mcp.name)
  );
  
  // Add new MCPs (avoid duplicates)
  const existingNames = new Set(result.map(m => m.name));
  for (const name of add) {
    if (!existingNames.has(name)) {
      result.push({
        name,
        package: `@modelcontextprotocol/server-${name}`,
        required: false,
        requiresEnvVars: [],
        requiresOAuth: false
      });
      existingNames.add(name);
    }
  }
  
  return result;
}

/**
 * @typedef {Object} MCPConfig
 * @property {Record<string, MCPServerConfig>} mcpServers
 */

/**
 * @typedef {Object} MCPServerConfig
 * @property {string} command
 * @property {string[]} args
 * @property {Record<string, string>} [env]
 */

/**
 * @typedef {Object} InstallResult
 * @property {string} mcp - MCP name
 * @property {boolean} success
 * @property {string|null} error
 * @property {MCPServerConfig|null} config
 */

/**
 * @typedef {Object} MCPRecommendation
 * @property {string} name
 * @property {string} package
 * @property {boolean} required
 * @property {string[]} requiresEnvVars
 * @property {boolean} requiresOAuth
 */
