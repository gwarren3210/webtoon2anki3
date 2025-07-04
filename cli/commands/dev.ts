import { Command } from 'commander';
import { apiRequest } from '../utils/apiClient';
import { printTable, printError } from '../utils/output';

/**
 * Registers the 'dev' subcommands to the CLI program.
 * @param {Command} program - The main CLI program
 * @returns {void}
 */
export function registerDevCommands(program: Command): void {
  const dev = new Command('dev')
    .description('Development and seed utilities (guarded by --allow-dev)');

  // dev:seed
  dev
    .command('seed')
    .description('Seed the database with test users, series, and sample decks')
    .option('--allow-dev', 'Allow dev command (required)')
    .option('--debug', 'Show debug info')
    .action(async (options) => {
      if (!options.allowDev) {
        printError('You must pass --allow-dev to run this command.');
        return;
      }
      try {
        // Call API (endpoint: POST /dev/seed)
        const result = await apiRequest('POST', '/dev/seed', undefined, options);
        printTable([result]);
      } catch (err) {
        printError(err, options.debug);
      }
    });

  // dev:reset
  dev
    .command('reset')
    .description('Wipe all content and reseed clean')
    .option('--allow-dev', 'Allow dev command (required)')
    .option('--debug', 'Show debug info')
    .action(async (options) => {
      if (!options.allowDev) {
        printError('You must pass --allow-dev to run this command.');
        return;
      }
      try {
        // Call API (endpoint: POST /dev/reset)
        const result = await apiRequest('POST', '/dev/reset', undefined, options);
        printTable([result]);
      } catch (err) {
        printError(err, options.debug);
      }
    });

  // dev:export
  dev
    .command('export')
    .description('Export current database or content')
    .option('--allow-dev', 'Allow dev command (required)')
    .option('--debug', 'Show debug info')
    .action(async (options) => {
      if (!options.allowDev) {
        printError('You must pass --allow-dev to run this command.');
        return;
      }
      try {
        // Call API (endpoint: GET /dev/export)
        const result = await apiRequest('GET', '/dev/export', undefined, options);
        printTable([result]);
      } catch (err) {
        printError(err, options.debug);
      }
    });

  // dev:watch
  dev
    .command('watch')
    .description('Watch a directory for new uploads and auto-parse decks (optional)')
    .option('--allow-dev', 'Allow dev command (required)')
    .option('--debug', 'Show debug info')
    .action(async (options) => {
      if (!options.allowDev) {
        printError('You must pass --allow-dev to run this command.');
        return;
      }
      try {
        // Call API (endpoint: POST /dev/watch)
        const result = await apiRequest('POST', '/dev/watch', undefined, options);
        printTable([result]);
      } catch (err) {
        printError(err, options.debug);
      }
    });

  // dev:lock-chapter
  dev
    .command('lock-chapter <seriesId> <chapterNumber>')
    .description('Lock chapter until prerequisites are met')
    .option('--debug', 'Show debug info')
    .action(async (seriesId, chapterNumber, options) => {
      try {
        const result = await apiRequest('POST', `/supabase/series/${seriesId}/chapters/${chapterNumber}/lock`, undefined, options);
        printTable([result]);
      } catch (err) {
        printError(err, options.debug);
      }
    });

  // dev:unlock-chapter
  dev
    .command('unlock-chapter <seriesId> <chapterNumber>')
    .description('Force-unlock a chapter (for testing)')
    .option('--debug', 'Show debug info')
    .action(async (seriesId, chapterNumber, options) => {
      try {
        const result = await apiRequest('POST', `/supabase/series/${seriesId}/chapters/${chapterNumber}/unlock`, undefined, options);
        printTable([result]);
      } catch (err) {
        printError(err, options.debug);
      }
    });

  program.addCommand(dev);
} 