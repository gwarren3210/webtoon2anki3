import axios, { AxiosRequestConfig, Method } from 'axios';
import { getSessionToken } from './config';

/**
 * Makes an HTTP request to the backend API.
 * @param method - HTTP method (GET, POST, etc.)
 * @param path - API path (e.g., /series)
 * @param data - Request body (for POST/PUT)
 * @param options - { json?: boolean, debug?: boolean }
 * @returns The API response data
 */
export async function apiRequest<T = any>(
  method: Method,
  path: string,
  data?: any,
  options?: { json?: boolean; debug?: boolean }
): Promise<T> {
  const baseUrl = "https://staging-backend-dnz2.encr.app/";
  const token = getSessionToken();
  const config: AxiosRequestConfig = {
    method,
    url: baseUrl + path,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(data ? { data } : {}),
  };
  try {
    const response = await axios(config);
    if (options?.debug) {
      console.error('DEBUG: Request', config);
      console.error('DEBUG: Response', response.data);
    }
    return response.data;
  } catch (err: any) {
    if (options?.debug) {
      console.error('DEBUG: Error', err);
    }
    throw new Error(err.response?.data?.error || err.message);
  }
} 