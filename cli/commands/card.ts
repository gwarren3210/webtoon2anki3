import { Command } from 'commander';
import { apiRequest } from '../utils/apiClient';
import { promptForString } from '../utils/prompts';
import { printTable, printJson, printError } from '../utils/output';

/**
 * Registers the 'card' subcommands to the CLI program.
 * @param {Command} program - The main CLI program
 * @returns {void}
 */
export function registerCardCommands(program: Command): void {
  const card = new Command('card')
    .description('Manage vocabulary cards for chapters');

  // card:add
  card
    .command('add <chapterId>')
    .description('Manually add a vocab card')
    .option('--word <word>', 'Word')
    .option('--definition <definition>', 'Definition')
    .option('--example <example>', 'Example sentence')
    .option('--json', 'Output as JSON')
    .option('--debug', 'Show debug info')
    .action(async (chapterId, options) => {
      try {
        const word = options.word || await promptForString('Word:');
        const definition = options.definition || await promptForString('Definition:');
        // Call API (endpoint: POST /chapters/:chapterId/cards)
        const result = await apiRequest('POST', `/supabase/chapters/${chapterId}/cards`, {
          word,
          definition,
        }, options);
        options.json ? printJson(result) : printTable([result]);
      } catch (err) {
        printError(err, options.debug);
      }
    });

  // card:edit
  card
    .command('edit <cardId>')
    .description('Modify an existing card')
    .option('--word <word>', 'Word')
    .option('--definition <definition>', 'Definition')
    .option('--json', 'Output as JSON')
    .option('--debug', 'Show debug info')
    .action(async (cardId, options) => {
      try {
        // Call API (endpoint: PATCH /cards/:cardId)
        const result = await apiRequest('PATCH', `/supabase/cards/${cardId}`, {
          word: options.word,
          definition: options.definition,
        }, options);
        options.json ? printJson(result) : printTable([result]);
      } catch (err) {
        printError(err, options.debug);
      }
    });

  // card:delete
  card
    .command('delete <cardId>')
    .description('Remove a card')
    .option('--debug', 'Show debug info')
    .action(async (cardId, options) => {
      try {
        // Call API (endpoint: DELETE /cards/:cardId)
        const result = await apiRequest('DELETE', `/supabase/cards/${cardId}`, undefined, options);
        printTable([result]);
      } catch (err) {
        printError(err, options.debug);
      }
    });

  // card:list
  card
    .command('list <chapterId>')
    .description('List all flashcards in a chapter')
    .option('--json', 'Output as JSON')
    .option('--debug', 'Show debug info')
    .action(async (chapterId, options) => {
      try {
        // Call API (endpoint: GET /chapters/:chapterId/cards)
        const result = await apiRequest('GET', `/supabase/chapters/${chapterId}/cards`, undefined, options);
        options.json ? printJson(result) : printTable(result.cards || []);
      } catch (err) {
        printError(err, options.debug);
      }
    });

  program.addCommand(card);
} 