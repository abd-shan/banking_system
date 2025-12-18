// src/api/AuthService.ts
import { apiClient } from './ApiClient';
import { LoginDto, AuthResponse } from '@/types';

export class AuthService {
  private readonly endpoint = '/auth';

  /**
   * Sends a login request to the backend.
   * @param credentials The user's login credentials.
   * @returns A promise that resolves to the authentication response (token and user info).
   */
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(`${this.endpoint}/login`, credentials);
    // Store the token for subsequent requests
    localStorage.setItem('accessToken', response.data.accessToken);
    return response.data;
  }

  /**
   * Simulates a logout by clearing the stored token.
   */
  logout(): void {
    localStorage.removeItem('accessToken');
    // In a real app, you might also call a backend logout endpoint to invalidate the token
  }
}
