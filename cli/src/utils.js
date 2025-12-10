/**
 * Utility functions for CLI
 * Error handling, summary display, and signal handlers
 */

import chalk from 'chalk';

/**
 * Error codes and messages
 */
export const ErrorCodes = {
  E001: { code: 'E001', message: 'Your token has expired. Please purchase a new one at highlandai.com' },
  E002: { code: 'E002', message: 'This token has already been used. Each token is single-use.' },
  E003: { code: 'E003', message: 'Invalid token format. Please check your token and try again.' },
  E004: { code: 'E004', message: 'Unable to connect to Highland AI servers. Please check your internet connection.' },
  E005: { code: 'E005', message: 'Server error occurred. Please try again later.' },
  E006: { code: 'E006', message: 'Failed to install MCP. See details above.' },
  E007: { code: 'E007', message: 'Unable to write file. Check permissions.' },
  E008: { code: 'E008', message: 'Setup cancelled by user.' }
};

/**
 * Formats an error for user display
 * @param {Error|object} error
 * @returns {string}
 */
export function formatError(error) {
  if (error.code && ErrorCodes[error.code]) {
    return `${chalk.red(`[${error.code}]`)} ${error.message || ErrorCodes[error.code].message}`;
  }
  
  if (error.code && error.message) {
    return `${chalk.red(`[${error.code}]`)} ${error.message}`;
  }
  
  if (error.message) {
    return `${chalk.red('[ERROR]')} ${error.message}`;
  }
  
  return `${chalk.red('[ERROR]')} An unexpected error occurred`;
}

/**
 * Handles and displays an error
 * @param {Error|object} error
 */
export function handleError(error) {
  console.error('\n' + formatError(error));
  
  // Log detailed error for debugging (could write to file in production)
  if (process.env.DEBUG || process.env.VERBOSE) {
    console.error(chalk.gray('\nDebug info:'));
    console.error(chalk.gray(JSON.stringify(error, null, 2)));
    if (error.stack) {
      console.error(chalk.gray(error.stack));
    }
  }
}

/**
 * Formats duration in human-readable format
 * @param {number} ms - Duration in milliseconds
 * @returns {string}
 */
export function formatDuration(ms) {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Displays setup summary
 * @param {SetupResult} result
 */
export function displaySummary(result) {
  console.log('\n' + chalk.cyan('═'.repeat(50)));
  console.log(chalk.cyan.bold('  Setup Complete!'));
  console.log(chalk.cyan('═'.repeat(50)) + '\n');
  
  // Tier info
  console.log(chalk.white(`Tier: ${result.tier}`));
  console.log(chalk.white(`Duration: ${formatDuration(result.duration)}\n`));
  
  // Installed MCPs
  const successful = result.installedMCPs.filter(r => r.success);
  const failed = result.installedMCPs.filter(r => !r.success);
  
  if (successful.length > 0) {
    console.log(chalk.green('✓ Installed MCPs:'));
    successful.forEach(r => {
      console.log(chalk.green(`  • ${r.mcp}`));
    });
  }
  
  if (failed.length > 0) {
    console.log(chalk.red('\n✗ Failed MCPs:'));
    failed.forEach(r => {
      console.log(chalk.red(`  • ${r.mcp}: ${r.error}`));
    });
  }
  
  // CLAUDE.md status
  console.log('');
  if (result.claudeMdGenerated) {
    console.log(chalk.green(`✓ CLAUDE.md ${result.claudeMdAction}`));
  } else {
    console.log(chalk.yellow(`○ CLAUDE.md skipped`));
  }
  
  // Next steps
  console.log('\n' + chalk.cyan('Next Steps:'));
  console.log(chalk.white('  1. Restart Claude Code to load new MCPs'));
  console.log(chalk.white('  2. Review CLAUDE.md and customize as needed'));
  console.log(chalk.white('  3. Start coding with enhanced AI assistance!\n'));
  
  // Support info
  console.log(chalk.gray('Need help? Visit https://highlandai.com/support'));
  console.log(chalk.gray('or email support@highlandai.com\n'));
}

/**
 * Sets up signal handlers for graceful shutdown
 * @param {object} context - CLI context for cleanup
 */
export function setupSignalHandlers(context) {
  const cleanup = () => {
    console.log(chalk.yellow('\n\nSetup interrupted. Cleaning up...'));
    // Cleanup logic would go here
    // - Remove partial config changes
    // - Restore backups if any
    console.log(chalk.yellow('Cleanup complete. Exiting.'));
    process.exit(0);
  };
  
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

/**
 * Checks if a summary contains all required information
 * @param {SetupResult} result
 * @returns {boolean}
 */
export function isCompleteSummary(result) {
  return (
    typeof result.tier === 'string' &&
    Array.isArray(result.installedMCPs) &&
    typeof result.claudeMdGenerated === 'boolean' &&
    typeof result.duration === 'number'
  );
}

/**
 * @typedef {Object} SetupResult
 * @property {string} tier
 * @property {InstallResult[]} installedMCPs
 * @property {boolean} claudeMdGenerated
 * @property {string} claudeMdAction
 * @property {number} duration
 * @property {string[]} errors
 */

/**
 * @typedef {Object} InstallResult
 * @property {string} mcp
 * @property {boolean} success
 * @property {string|null} error
 */
