#!/usr/bin/env node

import { Command } from 'commander';
import { registerSeriesCommands } from './commands/series';
import { registerAuthCommands } from './commands/login';
import { registerChapterCommands } from './commands/chapter';
import { registerCardCommands } from './commands/card';
import { registerStudyCommands } from './commands/study';
import { registerUserCommands } from './commands/user';
import { registerDeckCommands } from './commands/deck';
import { registerDevCommands } from './commands/dev';
import { registerConfigCommands } from './commands/config';

const program = new Command();

program
  .name('w2a')
  .description('Webtoon2Anki CLI tool for managing series, chapters, cards, and study workflows.')
  .version('0.2.0');

registerSeriesCommands(program);
registerAuthCommands(program);
registerChapterCommands(program);
registerCardCommands(program);
registerStudyCommands(program);
registerUserCommands(program);
registerDeckCommands(program);
registerDevCommands(program);
registerConfigCommands(program);

program.parseAsync(process.argv); 