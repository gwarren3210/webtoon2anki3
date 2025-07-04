import { Command } from 'commander';

/**
 * Registers the 'login' and 'logout' commands to the CLI program.
 * @param {Command} program - The main CLI program
 * @returns {void}
 */
export function registerAuthCommands(program: Command): void {
  // login
  program
    .command('login')
    .description('Authenticate and store session token')
    .option('--debug', 'Show debug info')
    .action(async (options) => {
      // TODO: Implement login logic (prompt for credentials, call API, store token)
      console.log('Logging in...');
    });

  // logout
  program
    .command('logout')
    .description('Clear session/auth state')
    .option('--debug', 'Show debug info')
    .action(async (options) => {
      // TODO: Implement logout logic (clear session file)
      console.log('Logging out...');
    });
} 