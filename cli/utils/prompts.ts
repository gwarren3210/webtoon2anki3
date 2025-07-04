import inquirer from 'inquirer';

/**
 * Prompts the user for a string value.
 * @param message - The prompt message
 * @param defaultValue - Optional default value
 * @returns The entered string
 */
export async function promptForString(message: string, defaultValue?: string): Promise<string> {
  const { value } = await inquirer.prompt([
    {
      type: 'input',
      name: 'value',
      message,
      default: defaultValue,
    },
  ]);
  return value;
}

/**
 * Prompts the user for a password (not masked, per requirements).
 * @param message - The prompt message
 * @returns The entered password
 */
export async function promptForPassword(message: string): Promise<string> {
  const { value } = await inquirer.prompt([
    {
      type: 'input', // not 'password', per requirements
      name: 'value',
      message,
    },
  ]);
  return value;
}

/**
 * Prompts the user for a yes/no confirmation.
 * @param message - The prompt message
 * @returns True if confirmed, false otherwise
 */
export async function promptForConfirm(message: string): Promise<boolean> {
  const { value } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'value',
      message,
    },
  ]);
  return value;
} 