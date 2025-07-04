import { Command } from 'commander';
import { apiRequest } from '../utils/apiClient';
import { printTable, printJson, printError } from '../utils/output';

async function handleOutput(apiCall: () => Promise<any>, options: { json?: boolean, debug?: boolean }) {
  try {
    const result = await apiCall();
    if (options.json) {
      printJson(result);
    } else {
      // The series property is not always present, so we check for it
      if (result.series) {
        const seriesData = Array.isArray(result.series) ? result.series : [result.series];
        printTable(seriesData);
      } else if (Array.isArray(result)) {
        printTable(result);
      }
      else {
        printJson(result);
      }
    }
  } catch (error) {
    printError(error, options.debug);
    process.exit(1);
  }
}

/**
 * Registers the 'series' subcommands to the CLI program.
 * @param {Command} program - The main CLI program
 * @returns {void}
 */
export function registerSeriesCommands(program: Command): void {
  const series = new Command('series')
    .description('Manage webtoon series');

  // series:list
  series
    .command('list')
    .description('List all existing series')
    .option('--json', 'Output as JSON')
    .option('--debug', 'Show debug info')
    .action(async (options) => {
      await handleOutput(
        () => apiRequest('GET', '/supabase/series'),
        options
      );
    });

  // series:create
  series
    .command('create <title>')
    .description('Create a new series')
    .option('--genre <genre>', 'Genre of the series')
    .option('--language <language>', 'Language of the series')
    .option('--json', 'Output as JSON')
    .option('--debug', 'Show debug info')
    .action(async (title, options) => {
      await handleOutput(
        () => apiRequest('POST', '/supabase/series', { name: title }),
        options
      );
    });

  // series:search
  series
    .command('search <query>')
    .description('Search for series by title')
    .option('--json', 'Output as JSON')
    .option('--debug', 'Show debug info')
    .action(async (query, options) => {
      await handleOutput(
        () => apiRequest('GET', `/supabase/series/search?query=${query}`),
        options
      );
    });

  program.addCommand(series);
} 