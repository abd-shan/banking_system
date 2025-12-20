// src/types/index.ts

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  TELLER = 'TELLER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  FROZEN = 'FROZEN',
  PENDING = 'PENDING',
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  TRANSFER = 'TRANSFER',
}

export enum ReviewDecision {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}

// --- Data Models ---

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface CreateUserDto {
  full_name: string;
  email: string;
  password: string;
  phone_number: string;
  role: UserRole;
}

export interface Account {
  id: string;
  accountNumber?: number;
  account_number?: number;
  balance: string | number;
  status: AccountStatus;
  category: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}



export interface AccountSummary {
  id: string;
  accountNumber: number;
  category: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  sourceAccountId: string;
  destinationAccountId?: string;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  createdAt: string;
}

// --- DTOs (Data Transfer Objects) ---

// Auth DTOs
export interface LoginDto {
  email: string;
  password: string;
  accountNumber: number;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// Account DTOs
export interface CreateAccountDto {
  ownerId: string;
  initialDeposit: number;
}

export interface ChangeAccountStatusDto {
  status: AccountStatus;
}

// Transaction DTOs
export interface CreateDepositDto {
  amount: number;
}

export interface CreateWithdrawDto {
  amount: number;
}

export interface CreateTransferDto {
  toAccountNumber: number;
  amount: number;
}

export interface ReviewTransactionDto {
  decision: ReviewDecision;
}


// --- Notification Types ---
export interface Notification {
  id: string;
  message: string;
  transaction_id: string;
  createdAt: string; // ISO date string
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

// Dashboard Types
export interface DashboardMetrics {
  users: number;
  accounts: number;
  totalBalance: string;
  transactionsToday: number;
  pendingApprovals: number;
}

export interface DashboardHealth {
  uptime: number;
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
    arrayBuffers: number;
  };
  timestamp: string;
  db: 'UP' | 'DOWN';
}

export interface DashboardTickets {
  open: number;
  inProgress: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  message: string;
  code: number;
  timestamp: string;
  details?: any;
}

// Extend existing types if needed
export interface Notification {
  id: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  message: string;
  timestamp: string;
  read: boolean;
}


// Report Types
export interface TransactionReport {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';
  amount: string;
  status: string;
  approvedById: string | null;
  fromAccountId: string | null;
  toAccountId: string | null;
  createdAt: string;
  fromAccount: {
    account_number: number;
  } | null;
  toAccount: {
    account_number: number;
  } | null;
}

export interface AccountReport {
  id: string;
  account_number: number;
  balance: string;
  status: string;
  category: string;
  owner: {
    full_name: string;
    email: string;
  };
  _count: {
    incomingTransactions: number;
    outgoingTransactions: number;
  };
}

export interface AuditReport {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  performedById: string;
  metadata: Record<string, any>;
  ipAddress: string | null;
  createdAt: string;
  performedBy: {
    full_name: string;
    email: string;
    role: string;
  };
}

export interface ReportSnapshot {
  failedTransactions: number;
  pendingApprovals: number;
}

export interface ReportFilters {
  dateRange: {
    from: string;
    to: string;
  };
  transactionType: 'ALL' | 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';
  accountStatus: 'ALL' | 'ACTIVE' | 'INACTIVE';
  auditAction: 'ALL' | 'CREATE' | 'UPDATE' | 'DELETE';
}

export interface ExportOptions {
  format: 'PDF' | 'CSV' | 'EXCEL';
  includeCharts: boolean;
  includeSummary: boolean;
  paperSize: 'A4' | 'LETTER' | 'LEGAL';
}

export interface ReportSnapshot {
  failedTransactions: number;
  pendingApprovals: number;
}

// Ticket Types
export interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  userId: string;
  assignedToId: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export interface CreateTicketDto {
  subject: string;
  message: string;
}


//audit

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  performedById: string;
  metadata: Record<string, any>;
  ipAddress: string | null;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
