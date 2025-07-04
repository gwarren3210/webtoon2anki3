import { Command } from 'commander';
import { getConfig, setConfig } from '../utils/config';
import { printJson, printError } from '../utils/output';

/**
 * Registers the 'config' subcommands to the CLI program.
 * @param {Command} program - The main CLI program
 * @returns {void}
 */
export function registerConfigCommands(program: Command): void {
  const config = new Command('config')
    .description('Manage CLI configuration');

  // config:set
  config
    .command('set <key> <value>')
    .description('Set CLI default (e.g., default user, file paths)')
    .action(async (key, value) => {
      try {
        const current = await getConfig();
        current[key] = value;
        await setConfig(current);
        console.log(`Config set: ${key} = ${value}`);
      } catch (err) {
        printError(err);
      }
    });

  // config:get
  config
    .command('get <key>')
    .description('Retrieve current config value')
    .action(async (key) => {
      try {
        const current = await getConfig();
        printJson({ [key]: current[key] });
      } catch (err) {
        printError(err);
      }
    });

  program.addCommand(config);
} 