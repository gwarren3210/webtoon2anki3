import { Command } from 'commander';
import { apiRequest } from '../utils/apiClient';
import { promptForString } from '../utils/prompts';
import { printTable, printJson, printError } from '../utils/output';
//import { console } from 'inspector';

// The FSRS rating system is simpler than the old SM-2 grades.
enum FSRSRating {
  Again = 1,
  Hard = 2,
  Good = 3,
  Easy = 4,
}

const ratingDescription = `
1: Again (You didn't remember it)
2: Hard (You remembered it, but with difficulty)
3: Good (You remembered it with some effort)
4: Easy (You remembered it easily)
`;

/**
 * Registers the 'study' subcommands to the CLI program.
 * @param {Command} program - The main CLI program
 * @returns {void}
 */
export function registerStudyCommands(program: Command): void {
  const study = new Command('study')
    .description('Simulate studying and review progress');

  // study:start
  study
    .command('start <deckId>')
    .description('Begin a CLI-based review session for a deck')
    .option('--user <userId>', 'User ID for the session')
    .option('--debug', 'Show debug info')
    .action(async (deckId, options) => {
      try {
        let userId = options.user;
        if (!userId) {
          userId = await promptForString('Enter your user ID:');
        }
        
        // 1. Start session - this returns the initial state with the first card
        console.log('Starting session...');
        const { sessionState: initialSessionState } = await apiRequest('POST', '/study/session/start', { userId, deckId }, options);
        let sessionState = initialSessionState;
        if(!sessionState){
          console.warn("\n------------------------\nNO SESSION FOUND\n------------------------\n")
        }
        if(options.debug){
          console.log("------------------------")
          console.log("Session State:")
          console.log(sessionState)
          console.log("------------------------")
        }
        let quit = false;
        
        console.log("----------------");
        console.log("Entering loop");
        console.log("----------------");
        while (sessionState.currentCard) {
          const card = sessionState.currentCard;
          console.log("=== CARD ===", card);

          console.log(`\nWord: ${card.korean}`);
          const reveal = await promptForString('Press Enter to show definition, or type q to quit:');
          
          if (reveal.trim().toLowerCase() === 'q') {
            quit = true;
            break;
          }

          console.log(`Definition: ${card.english}`);
          let rating: number | null = null;
          
          while (rating === null) {
            // 1. Show rating options.
            console.log(ratingDescription);
            // 2. Prompt for rating.
            const input = await promptForString('How well did you recall this? (1-4, or q to quit):');
            // 3. Check for quit command.
            if (input.trim().toLowerCase() === 'q') {
              quit = true;
              break;
            }
            // 4. Validate input and set rating.
            const num = Number(input);
            if (Number.isInteger(num) && num >= FSRSRating.Again && num <= FSRSRating.Easy) {
              rating = num;
            } else {
              printError('Please enter a number from 1 to 4, or q to quit.');
            }
          }

          if (quit) break;

          // 2. Submit grade - this returns the *new* session state with the next card
          console.log('Submitting grade...');
          const { sessionState: newSessionState } = await apiRequest(
            'POST', 
            '/study/session/grade', 
            { sessionId: sessionState.sessionId, rating }, 
            options
          );
          sessionState = newSessionState; // Update state for the next loop iteration

          const progress = sessionState.progress;
          console.log(`Progress: ${progress.reviewed} cards reviewed.`);
        }

        // 3. End session
        await apiRequest('POST', '/study/session/end', { sessionId: sessionState.sessionId }, options);

        if (quit) {
          console.log('\nSession quit early.');
        } else {
          console.log('\n🎉 Session complete! No more cards to review.');
        }

        // 4. Session summary
        const progress = sessionState.progress;
        if (progress.reviewed > 0) {
          const avg = (progress.grades.reduce((a: number, b: number) => a + b, 0) / progress.grades.length).toFixed(2);
          const breakdown = progress.grades.reduce((acc: Record<number, number>, g: number) => {
            acc[g] = (acc[g] || 0) + 1;
            return acc;
          }, {} as Record<number, number>);

          console.log('\nSession Summary:');
          console.log(`Cards reviewed: ${progress.reviewed}`);
          console.log(`Average recall rating: ${avg}`);
          console.log('Rating breakdown:');
          Object.entries(breakdown).forEach(([g, count]) => {
            console.log(`  ${FSRSRating[Number(g)]} (Rated ${g}): ${count} time(s)`);
          });
        } else {
          console.log('No cards were reviewed this session.');
        }

      } catch (err) {
        printError(err, options.debug);
      }
    });

  program.addCommand(study);
} 