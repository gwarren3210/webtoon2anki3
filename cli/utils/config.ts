import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.webtoon-cli');
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json');
const SESSION_PATH = path.join(CONFIG_DIR, 'session.json');

/**
 * Ensures the config directory exists.
 */
async function ensureConfigDir() {
  await fs.mkdir(CONFIG_DIR, { recursive: true });
}

/**
 * Reads the CLI config file.
 */
export async function getConfig(): Promise<any> {
  const defaultConfig = {
    baseURL: 'https://staging-backend-dnz2.encr.app/'
  };

  try {
    await ensureConfigDir();
    const data = await fs.readFile(CONFIG_PATH, 'utf-8');
    const storedConfig = JSON.parse(data);
    return { ...defaultConfig, ...storedConfig };
  } catch {
    return defaultConfig;
  }
}

/**
 * Writes to the CLI config file.
 */
export async function setConfig(config: any): Promise<void> {
  await ensureConfigDir();
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

/**
 * Reads the session file and returns the auth token.
 */
export function getSessionToken(): string | null {
  try {
    const data = require(SESSION_PATH);
    return data.token || null;
  } catch {
    return null;
  }
}

/**
 * Writes the session token to the session file.
 */
export async function setSessionToken(token: string): Promise<void> {
  await ensureConfigDir();
  await fs.writeFile(SESSION_PATH, JSON.stringify({ token }, null, 2), 'utf-8');
} 