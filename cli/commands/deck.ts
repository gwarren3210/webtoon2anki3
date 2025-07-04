import { Command } from 'commander';
import { apiRequest } from '../utils/apiClient';
import { printTable, printJson, printError } from '../utils/output';

/**
 * Registers the 'deck' subcommands to the CLI program.
 * @param {Command} program - The main CLI program
 * @returns {void}
 */
export function registerDeckCommands(program: Command): void {
  const deck = new Command('deck')
    .description('Manage shared/public decks and metadata');

  // deck:list
  deck
    .command('list')
    .description('View all available decks')
    .option('--json', 'Output as JSON')
    .option('--debug', 'Show debug info')
    .action(async (options) => {
      try {
        // Call API (endpoint: GET /decks)
        const result = await apiRequest('GET', '/supabase/decks', undefined, options);
        options.json ? printJson(result) : printTable(result.decks || []);
      } catch (err) {
        printError(err, options.debug);
      }
    });

  // deck:feature TODO: make it based on the chapter and/or series not the deck
  deck
    .command('feature <deckId>')
    .description('Apply quality badges to a deck')
    .option('--badge <type>', 'Badge type (beginner-friendly, editor-choice, verified)')
    .option('--debug', 'Show debug info')
    .action(async (deckId, options) => {
      try {
        // Call API (endpoint: POST /decks/:deckId/feature)
        const result = await apiRequest('POST', `/supabase/decks/${deckId}/feature`, {
          badge: options.badge,
        }, options);
        printTable([result]);
      } catch (err) {
        printError(err, options.debug);
      }
    });

  // deck:preview TODO: make it print the word with the date
  deck
    .command('preview <deckId>')
    .description('Print or display summary card data in the CLI')
    .option('--json', 'Output as JSON')
    .option('--debug', 'Show debug info')
    .action(async (deckId, options) => {
      try {
        // Call API (endpoint: GET /decks/:deckId/preview)
        const result = await apiRequest('GET', `/supabase/decks/${deckId}/preview`, undefined, options);
        options.json ? printJson(result) : printTable([result]);
      } catch (err) {
        printError(err, options.debug);
      }
    });

  // deck:create
  deck
    .command('create')
    .description('Create a deck from a chapter')
    .requiredOption('--series <seriesName>', 'Series name')
    .requiredOption('--chapter <chapterNumber>', 'Chapter number')
    .option('--max-length <maxLength>', 'Maximum number of cards', parseInt)
    .option('--json', 'Output as JSON')
    .option('--debug', 'Show debug info')
    .action(async (options) => {
      try {
        const { getConfig } = await import('../utils/config');
        const config = await getConfig();
        const userId = config.userId;
        if (!userId) {
          printError('No userId found in config. Please login or set userId.');
          return;
        }
        const payload = {
          seriesName: options.series,
          chapterNumber: options.chapter,
          userId,
          maxLength: options.maxLength,
        };
        const result = await apiRequest('POST', '/supabase/decks', payload, options);
        options.json ? printJson(result) : printTable([result.deck, ...(result.cards || [])]);
      } catch (err) {
        printError(err, options.debug);
      }
    });

  // deck:view (alias for preview)
  deck
    .command('view <deckId>')
    .description('View all data for a deck (alias for preview)')
    .option('--json', 'Output as JSON')
    .option('--debug', 'Show debug info')
    .action(async (deckId, options) => {
      try {
        const result = await apiRequest('GET', `/supabase/decks/${deckId}/preview`, undefined, options);
        options.json ? printJson(result) : printTable([result.deck, ...(result.cards || [])]);
      } catch (err) {
        printError(err, options.debug);
      }
    });

  // deck:due
  deck
    .command('due <deckId>')
    .description('Show all cards due or overdue for review in a deck')
    .option('--json', 'Output as JSON')
    .option('--debug', 'Show debug info')
    .action(async (deckId, options) => {
      try {
        const result = await apiRequest('GET', `/supabase/decks/${deckId}/due`, undefined, options);
        options.json ? printJson(result) : printTable(result.due || []);
      } catch (err) {
        printError(err, options.debug);
      }
    });

  program.addCommand(deck);
} 