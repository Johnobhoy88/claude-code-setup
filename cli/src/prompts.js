/**
 * Interactive prompts module
 * Handles user input via Inquirer.js
 */

import inquirer from 'inquirer';
import chalk from 'chalk';

/**
 * Prompts user for project description
 * @returns {Promise<string>}
 */
export async function promptProjectDescription() {
  const { description } = await inquirer.prompt([
    {
      type: 'input',
      name: 'description',
      message: 'Tell me about your project (framework, integrations, use case):',
      validate: (input) => {
        if (!input || input.trim().length === 0) {
          return 'Please provide a project description';
        }
        return true;
      }
    }
  ]);
  
  return description.trim();
}

/**
 * Prompts user to confirm, modify, or cancel recommendations
 * @param {MCPRecommendation[]} mcps
 * @returns {Promise<ConfirmResult>}
 */
export async function promptConfirmRecommendations(mcps) {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'How would you like to proceed?',
      choices: [
        { name: 'Install all recommended MCPs', value: 'confirm' },
        { name: 'Modify selection', value: 'modify' },
        { name: 'Cancel setup', value: 'cancel' }
      ]
    }
  ]);
  
  return { action };
}

/**
 * Prompts user to modify MCP selection
 * @param {MCPRecommendation[]} mcps
 * @returns {Promise<MCPRecommendation[]>}
 */
export async function promptModifyMCPs(mcps) {
  const { selected } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selected',
      message: 'Select MCPs to install:',
      choices: mcps.map(mcp => ({
        name: `${mcp.name}${mcp.required ? chalk.red(' (required)') : ''}`,
        value: mcp.name,
        checked: true,
        disabled: mcp.required ? 'Required' : false
      }))
    }
  ]);
  
  // Always include required MCPs
  const requiredNames = mcps.filter(m => m.required).map(m => m.name);
  const selectedSet = new Set([...selected, ...requiredNames]);
  
  return mcps.filter(mcp => selectedSet.has(mcp.name));
}

/**
 * Prompts user for environment variable values
 * @param {string[]} vars - Required environment variable names
 * @param {string} mcpName - Name of MCP requiring these vars
 * @returns {Promise<Record<string, string>>}
 */
export async function promptEnvVars(vars, mcpName) {
  console.log(chalk.yellow(`\n${mcpName} requires the following environment variables:`));
  
  const answers = await inquirer.prompt(
    vars.map(varName => ({
      type: 'password',
      name: varName,
      message: `Enter ${varName}:`,
      mask: '*',
      validate: (input) => {
        if (!input || input.trim().length === 0) {
          return `${varName} is required`;
        }
        return true;
      }
    }))
  );
  
  return answers;
}

/**
 * Prompts user for OAuth setup
 * @param {string} mcpName - Name of MCP requiring OAuth
 * @returns {Promise<boolean>} - Whether to proceed with OAuth
 */
export async function promptOAuthSetup(mcpName) {
  console.log(chalk.yellow(`\n${mcpName} requires OAuth authentication.`));
  
  const { proceed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'proceed',
      message: 'Would you like to set up OAuth now?',
      default: true
    }
  ]);
  
  return proceed;
}

/**
 * Prompts user when CLAUDE.md already exists
 * @returns {Promise<'overwrite' | 'merge' | 'skip'>}
 */
export async function promptExistingClaudeMd() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'CLAUDE.md already exists. What would you like to do?',
      choices: [
        { name: 'Overwrite existing file', value: 'overwrite' },
        { name: 'Merge with existing content', value: 'merge' },
        { name: 'Skip (keep existing)', value: 'skip' }
      ]
    }
  ]);
  
  return action;
}

/**
 * Prompts user to select from available MCPs (manual mode)
 * @param {MCPRecommendation[]} availableMCPs
 * @returns {Promise<MCPRecommendation[]>}
 */
export async function promptManualMCPSelection(availableMCPs) {
  const { selected } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selected',
      message: 'Select MCPs to install:',
      choices: availableMCPs.map(mcp => ({
        name: mcp.name,
        value: mcp.name,
        checked: mcp.required
      })),
      pageSize: 15
    }
  ]);
  
  return availableMCPs.filter(mcp => selected.includes(mcp.name));
}

/**
 * @typedef {Object} ConfirmResult
 * @property {'confirm' | 'modify' | 'cancel'} action
 */

/**
 * @typedef {Object} MCPRecommendation
 * @property {string} name
 * @property {string} package
 * @property {boolean} required
 * @property {string[]} requiresEnvVars
 * @property {boolean} requiresOAuth
 */
