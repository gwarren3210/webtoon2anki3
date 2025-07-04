/**
 * Prints data as a pretty table or list.
 * @param data - Array of objects or strings
 */
export function printTable(data: any[]): void {
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
    console.table(data);
  } else {
    (data || []).forEach((item: any) => console.log(item));
  }
}

/**
 * Prints data as JSON (pretty-printed).
 * @param data - Any data
 */
export function printJson(data: any): void {
  console.log(JSON.stringify(data, null, 2));
}

/**
 * Prints an error message, with optional debug info.
 * @param error - The error object or string
 * @param debug - If true, print stack trace or details
 */
export function printError(error: any, debug = false): void {
  if (debug && error instanceof Error) {
    console.error(error.stack || error.message);
  } else if (typeof error === 'object' && error.message) {
    console.error('Error:', error.message);
  } else {
    console.error('Error:', error);
  }
} 