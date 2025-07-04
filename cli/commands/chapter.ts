import { Command } from 'commander';
import { apiRequest } from '../utils/apiClient';
import { promptForString } from '../utils/prompts';
import { printTable, printJson, printError } from '../utils/output';

/**
 * Registers the 'chapter' subcommands to the CLI program.
 * @param {Command} program - The main CLI program
 * @returns {void}
 */
export function registerChapterCommands(program: Command): void {
  const chapter = new Command('chapter')
    .description('Manage chapters for a series');

  // chapter:add TODO: change this so that when a series is addes, a chapter is created autonatically
  chapter
    .command('add <seriesName> <chapterNumber>')
    .description('Add a new chapter to a series')
    .option('--json', 'Output as JSON')
    .option('--debug', 'Show debug info')
    .action(async (seriesName, chapterNumber, options) => {
      try {
        const result = await apiRequest('POST', `/supabase/chapters`, {
          seriesName,
          chapterNumber,
          words: [],
        }, options);
        if (options.json) {
          printJson(result);
        } else if (result.chapter) {
          printTable([result.chapter]);
        } else {
            printJson(result);
        }
      } catch (err) {
        printError(err, options.debug);
      }
    });

  // chapter:list
  chapter
    .command('list <seriesId>')
    .description('List all chapters of a given series')
    .option('--json', 'Output as JSON')
    .option('--debug', 'Show debug info')
    .action(async (seriesId, options) => {
      try {
        // Call API (endpoint: GET /series/:seriesId/chapters)
        const result = await apiRequest('GET', `/supabase/series/${seriesId}/chapters`, undefined, options);
        options.json ? printJson(result) : printTable(result.chapters || []);
      } catch (err) {
        printError(err, options.debug);
      }
    });

  program.addCommand(chapter);
} 