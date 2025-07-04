import { Command } from 'commander';
import { apiRequest } from '../utils/apiClient';
import { promptForString } from '../utils/prompts';
import { printTable, printJson, printError } from '../utils/output';

/**
 * Registers the 'user' subcommands to the CLI program.
 * @param {Command} program - The main CLI program
 * @returns {void}
 */
export function registerUserCommands(program: Command): void {
  const user = new Command('user')
    .description('Manage users for development and testing');

  // user:create
  user
    .command('create <username>')
    .description('Create a new user')
    .option('--guest', 'Create as guest')
    .option('--email <email>', 'Email address')
    .option('--password <password>', 'Password')
    .option('--avatar <avatar>', 'Avatar URL')
    .option('--json', 'Output as JSON')
    .option('--debug', 'Show debug info')
    .action(async (username, options) => {
      try {
        const email = options.email || await promptForString('Email (optional):', '');
        const password = options.password || await promptForString('Password (optional):', '');
        const avatar = options.avatar || await promptForString('Avatar URL (optional):', '');
        // Call API (endpoint: POST /users)
        const result = await apiRequest('POST', '/users', {
          username,
          guest: !!options.guest,
          email,
          password,
          avatar,
        }, options);
        options.json ? printJson(result) : printTable([result]);
      } catch (err) {
        printError(err, options.debug);
      }
    });

  // user:login
  user
    .command('login <username>')
    .description('Simulate login as a specific user')
    .option('--debug', 'Show debug info')
    .action(async (username, options) => {
      try {
        // Call API (endpoint: POST /users/login)
        const result = await apiRequest('POST', '/users/login', { username }, options);
        printTable([result]);
      } catch (err) {
        printError(err, options.debug);
      }
    });

  // user:progress
  user
    .command('progress <userId>')
    .description('Show user\'s deck history, streak, most studied series')
    .option('--json', 'Output as JSON')
    .option('--debug', 'Show debug info')
    .action(async (userId, options) => {
      try {
        // Call API (endpoint: GET /users/:userId/progress)
        const result = await apiRequest('GET', `/users/${userId}/progress`, undefined, options);
        options.json ? printJson(result) : printTable([result]);
      } catch (err) {
        printError(err, options.debug);
      }
    });

  // user:reset
  user
    .command('reset <userId>')
    .description('Wipe user progress')
    .option('--debug', 'Show debug info')
    .action(async (userId, options) => {
      try {
        // Call API (endpoint: POST /users/${userId}/reset)
        const result = await apiRequest('POST', `/users/${userId}/reset`, undefined, options);
        printTable([result]);
      } catch (err) {
        printError(err, options.debug);
      }
    });

  program.addCommand(user);
} 