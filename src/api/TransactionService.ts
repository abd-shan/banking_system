// src/api/TransactionService.ts
import { apiClient } from './ApiClient';
import { 
  Transaction, 
  CreateDepositDto, 
  CreateWithdrawDto, 
  CreateTransferDto, 
  ReviewTransactionDto 
} from '@/types';

export class TransactionService {
  private readonly endpoint = '/transactions';

  /**
   * POST /transactions/deposit - Deposit funds.
   */
  async deposit(dto: CreateDepositDto): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(`${this.endpoint}/deposit`, dto);
    return response.data;
  }

  /**
   * POST /transactions/withdraw - Withdraw funds.
   */
  async withdraw(dto: CreateWithdrawDto): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(`${this.endpoint}/withdraw`, dto);
    return response.data;
  }

  /**
   * POST /transactions/transfer - Transfer funds between accounts.
   */
  async transfer(dto: CreateTransferDto): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(`${this.endpoint}/transfer`, dto);
    return response.data;
  }

  /**
   * GET /transactions/account/:id - Get transaction history for an account.
   */
  async getAccountHistory(accountId: string): Promise<Transaction[]> {
    const response = await apiClient.get<Transaction[]>(`${this.endpoint}/account/${accountId}`);
    return response.data;
  }

  /**
   * GET /transactions/pending - Get pending transactions.
   */
  async getPendingTransactions(): Promise<Transaction[]> {
    const response = await apiClient.get<Transaction[]>(`${this.endpoint}/pending`);
    return response.data;
  }

  /**
   * POST /transactions/:id/review - Review a pending transaction.
   */
  async reviewTransaction(transactionId: string, dto: ReviewTransactionDto): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(`${this.endpoint}/${transactionId}/review`, dto);
    return response.data;
  }
}
