// src/api/AccountService.ts
import { apiClient } from './ApiClient';
import { 
  Account, 
  CreateAccountDto, 
  ChangeAccountStatusDto 
} from '@/types';

export class AccountService {
  private readonly endpoint = '/accounts';

  /**
   * GET /accounts - Get accounts for the current user.
   */
  async getAccounts(): Promise<Account[]> {
    const response = await apiClient.get<Account[]>(this.endpoint);
    return response.data;
  }

  /**
   * POST /accounts - Create a new account (Staff only).
   */
  async createAccount(dto: CreateAccountDto): Promise<Account> {
    const response = await apiClient.post<Account>(this.endpoint, dto);
    return response.data;
  }

  /**
   * POST /accounts/:id/close - Close a specific account.
   */
  async closeAccount(accountId: string): Promise<void> {
    await apiClient.post(`${this.endpoint}/${accountId}/close`);
  }

  /**
   * PUT /accounts/:id/status - Change account status (Admin only).
   */
  async changeAccountStatus(accountId: string, dto: ChangeAccountStatusDto): Promise<Account> {
    const response = await apiClient.put<Account>(`${this.endpoint}/${accountId}/status`, dto);
    return response.data;
  }

  /**
   * GET /accounts/:id/balance - Get the aggregated balance for an account.
   */
  async getAccountBalance(accountId: string): Promise<{ balance: number }> {
    const response = await apiClient.get<{ balance: number }>(`${this.endpoint}/${accountId}/balance`);
    return response.data;
  }

  /**
   * POST /accounts/:id/close-hierarchy - Close an account hierarchy.
   */
  async closeAccountHierarchy(accountId: string): Promise<void> {
    await apiClient.post(`${this.endpoint}/${accountId}/close-hierarchy`);
  }

  /**
   * PUT /accounts/:id/freeze-hierarchy - Freeze an account hierarchy.
   */
  async freezeAccountHierarchy(accountId: string): Promise<void> {
    await apiClient.put(`${this.endpoint}/${accountId}/freeze-hierarchy`);
  }
}
