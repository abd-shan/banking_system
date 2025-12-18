// src/facades/BankFacade.ts
import { AuthService } from '@/api/AuthService';
import { AccountService } from '@/api/AccountService';
import { TransactionService } from '@/api/TransactionService';
import { UserService } from '@/api/UserService';
import { 
  LoginDto, 
  AuthResponse, 
  Account, 
  CreateAccountDto, 
  ChangeAccountStatusDto, 
  CreateDepositDto, 
  CreateWithdrawDto, 
  CreateTransferDto, 
  Transaction, 
  ReviewTransactionDto,
  CreateUserDto,
  User
} from '@/types';

/**
 * The BankFacade provides a simplified interface to the complex subsystem 
 * of API services (Auth, Account, Transaction, User).
 * 
 * The UI components will only interact with this Facade, decoupling them 
 * from the underlying API implementation details.
 */
export class BankFacade {
  private authService: AuthService;
  private accountService: AccountService;
  private transactionService: TransactionService;
  private userService: UserService;

  constructor() {
    this.authService = new AuthService();
    this.accountService = new AccountService();
    this.transactionService = new TransactionService();
    this.userService = new UserService();
  }

  // --- Authentication Facade Methods ---

  async login(credentials: LoginDto): Promise<AuthResponse> {
    return this.authService.login(credentials);
  }

  logout(): void {
    this.authService.logout();
  }

  // --- Account Facade Methods ---

  async fetchUserAccounts(): Promise<Account[]> {
    return this.accountService.getAccounts();
  }

  async createNewAccount(dto: CreateAccountDto): Promise<Account> {
    return this.accountService.createAccount(dto);
  }

  async closeAccount(accountId: string): Promise<void> {
    return this.accountService.closeAccount(accountId);
  }

  async updateAccountStatus(accountId: string, dto: ChangeAccountStatusDto): Promise<Account> {
    return this.accountService.changeAccountStatus(accountId, dto);
  }

  async fetchAccountBalance(accountId: string): Promise<{ balance: number }> {
    return this.accountService.getAccountBalance(accountId);
  }

  // --- Transaction Facade Methods ---

  async performDeposit(dto: CreateDepositDto): Promise<Transaction> {
    return this.transactionService.deposit(dto);
  }

  async performWithdrawal(dto: CreateWithdrawDto): Promise<Transaction> {
    return this.transactionService.withdraw(dto);
  }

  async performTransfer(dto: CreateTransferDto): Promise<Transaction> {
    return this.transactionService.transfer(dto);
  }

  async fetchAccountHistory(accountId: string): Promise<Transaction[]> {
    return this.transactionService.getAccountHistory(accountId);
  }

  async fetchPendingTransactions(): Promise<Transaction[]> {
    return this.transactionService.getPendingTransactions();
  }

  async reviewTransaction(transactionId: string, dto: ReviewTransactionDto): Promise<Transaction> {
    return this.transactionService.reviewTransaction(transactionId, dto);
  }

  // --- User Facade Methods ---

  async createNewUser(dto: CreateUserDto): Promise<User> {
    return this.userService.createUser(dto);
  }
}

// Export a singleton instance of the Facade
export const bankFacade = new BankFacade();
