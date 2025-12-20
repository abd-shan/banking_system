import { AuthService } from '@/api/AuthService';
import { AccountService } from '@/api/AccountService';
import { TransactionService } from '@/api/TransactionService';
import { UserService } from '@/api/UserService';
import { NotificationService } from '@/api/NotificationService';
import { DashboardService } from '@/api/DashboardService';
import {ReportService} from '@/api/ReportService';

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
  User,
  AccountSummary,
  Notification,
  DashboardMetrics,
  DashboardHealth,
  DashboardTickets,
  ApiResponse, AccountReport,
  AuditReport, ReportSnapshot, TransactionReport, CreateTicketDto, Ticket
} from '@/types';
import {TicketService} from "@/api/TicketService";

export class BankFacade {
  private authService: AuthService;
  private accountService: AccountService;
  private transactionService: TransactionService;
  private userService: UserService;
  private notificationService: NotificationService;
  private dashboardService: DashboardService;
  private reportService: ReportService;
  private ticketService: TicketService;

  constructor() {
    this.authService = new AuthService();
    this.accountService = new AccountService();
    this.transactionService = new TransactionService();
    this.userService = new UserService();
    this.notificationService = new NotificationService();
    this.dashboardService = new DashboardService();
    this.reportService = new ReportService();
    this.ticketService = new TicketService();
  }

  // --- Authentication Facade Methods ---
  async login(credentials: LoginDto): Promise<{
    token: any;
    accountNumber: number;
    role: any;
    meta: { fullName: string; accountCategory: any }
  }> {
    return this.authService.login(credentials);
  }

  logout(): void {
    this.authService.logout();
  }

  // --- Account Facade Methods ---
  async fetchAccountSummaries(): Promise<AccountSummary[]> {
    const accounts: Account[] = await this.accountService.getAccounts();
    return accounts.map((acc) => ({
      id: acc.id,
      accountNumber: Number(acc.accountNumber ?? acc.account_number),
      category: acc.category,
    }));
  }

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

  // --- Notification Facade Methods ---
  async fetchLatestNotifications(): Promise<Notification[]> {
    return this.notificationService.getLatestNotifications();
  }

  // --- Dashboard Facade Methods ---
  async getDashboardMetrics(): Promise<ApiResponse<DashboardMetrics>> {
    return this.dashboardService.getMetrics();
  }

  async getDashboardHealth(): Promise<ApiResponse<DashboardHealth>> {
    return this.dashboardService.getHealth();
  }

  async getDashboardTickets(): Promise<ApiResponse<DashboardTickets>> {
    return this.dashboardService.getTickets();
  }

  async getCompleteDashboardData(): Promise<{
    metrics: DashboardMetrics;
    health: DashboardHealth;
    tickets: DashboardTickets;
  }> {
    return this.dashboardService.getAllDashboardData();
  }

  async getTransactionsReport(
      from: string,
      to: string,
      page?: number,
      limit?: number
  ): Promise<ApiResponse<TransactionReport[]>> {
    return this.reportService.getTransactionsReport(from, to);
  }

  async getAccountsReport(
      page?: number,
      limit?: number
  ): Promise<ApiResponse<AccountReport[]>> {
    return this.reportService.getAccountsReport();
  }

  async getAuditReport(
      from: string,
      to: string,
      page?: number,
      limit?: number
  ): Promise<ApiResponse<AuditReport[]>> {
    return this.reportService.getAuditReport(from, to);
  }

  async getSnapshotReport(): Promise<ApiResponse<ReportSnapshot>> {
    return this.reportService.getSnapshotReport();
  }

  async generatePDFReport(reportType: string, data: any): Promise<Blob> {
    return this.reportService.generateReportPDF(reportType, data);
  }

  async exportCSVReport(reportType: string, data: any): Promise<Blob> {
    return this.reportService.exportReportCSV(reportType, data);
  }


  // --- Ticket Facade Methods ---
  async createTicket(dto: CreateTicketDto): Promise<ApiResponse<Ticket>> {
    return this.ticketService.createTicket(dto);
  }

  async getMyTickets(page?: number, limit?: number): Promise<ApiResponse<Ticket[]>> {
    return this.ticketService.getMyTickets(page, limit);
  }

}

// Export a singleton instance of the Facade
export const bankFacade = new BankFacade();