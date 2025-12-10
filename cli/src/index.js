#!/usr/bin/env node

/**
 * Highland AI - Claude Code Setup Tool
 * Main CLI entry point
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { validateToken } from './validators.js';
import { analyzeProject, getFreeTierMCPs } from './analyzers.js';
import { promptProjectDescription, promptConfirmRecommendations, promptModifyMCPs } from './prompts.js';
import { installMCPs, writeConfig } from './installers.js';
import { generateClaudeMd } from './generators.js';
import { displaySummary, handleError, setupSignalHandlers } from './utils.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

// CLI Context
const context = {
  tier: 'free',
  email: null,
  tokenData: null,
  startTime: Date.now()
};

const program = new Command();

program
  .name('claude-setup')
  .description('Highland AI - Claude Code Setup Tool. Set up Claude Code in 5 minutes.')
  .version(pkg.version)
  .option('-t, --token <token>', 'License token for paid features')
  .option('-v, --verbose', 'Enable verbose output')
  .action(async (options) => {
    setupSignalHandlers(context);
    
    try {
      console.log(chalk.cyan('\n🏔️  Highland AI - Claude Code Setup Tool\n'));
      
      // Determine tier based on token
      if (options.token) {
        const spinner = ora('Validating token...').start();
        const result = await validateToken(options.token);
        
        if (!result.valid) {
          spinner.fail('Token validation failed');
          handleError(result.error);
          process.exit(1);
        }
        
        spinner.succeed(`Token validated - ${result.tier} tier`);
        context.tier = result.tier;
        context.email = result.email;
        context.tokenData = result;
      } else {
        console.log(chalk.yellow('Running in free tier mode. Use --token for premium features.\n'));
        context.tier = 'free';
      }
      
      // Get recommendations
      let recommendations;
      if (context.tier === 'free') {
        recommendations = getFreeTierMCPs();
        console.log(chalk.blue('Free tier includes 3 essential MCPs:\n'));
      } else {
        const description = await promptProjectDescription();
        const spinner = ora('Analyzing your project...').start();

        try {
          recommendations = await analyzeProject({
            userInput: description,
            tier: context.tier,
            token: options.token
          });
          spinner.succeed('Analysis complete');
        } catch (err) {
          spinner.warn('API unavailable, falling back to manual selection');
          recommendations = getFreeTierMCPs();
        }
      }
      
      // Display and confirm recommendations
      console.log(chalk.green('\nRecommended MCPs:'));
      recommendations.mcps.forEach(mcp => {
        const badge = mcp.required ? chalk.red('[required]') : chalk.gray('[optional]');
        console.log(`  ${chalk.white('•')} ${mcp.name} ${badge}`);
      });
      
      const confirmation = await promptConfirmRecommendations(recommendations.mcps);
      
      if (confirmation.action === 'cancel') {
        console.log(chalk.yellow('\nSetup cancelled.'));
        process.exit(0);
      }
      
      let mcpsToInstall = recommendations.mcps;
      if (confirmation.action === 'modify') {
        mcpsToInstall = await promptModifyMCPs(recommendations.mcps);
      }
      
      // Install MCPs
      const installResults = await installMCPs(mcpsToInstall, context);
      
      // Write MCP config
      await writeConfig(installResults.filter(r => r.success));
      
      // Generate CLAUDE.md
      const claudeMdResult = await generateClaudeMd({
        framework: recommendations.framework || 'generic',
        mcps: mcpsToInstall.map(m => m.name),
        skills: recommendations.skills || [],
        template: recommendations.template || 'default'
      });
      
      // Display summary
      displaySummary({
        tier: context.tier,
        installedMCPs: installResults,
        claudeMdGenerated: claudeMdResult.generated,
        claudeMdAction: claudeMdResult.action,
        duration: Date.now() - context.startTime,
        errors: installResults.filter(r => !r.success).map(r => r.error)
      });
      
    } catch (err) {
      handleError(err);
      process.exit(1);
    }
  });

program.parse();

export { context };
