// src/types/index.ts

// --- Enums/Constants (Inferred from NestJS code) ---
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
  // Add other user fields as needed
}

export interface Account {
  id: string;
  accountNumber: string;
  ownerId: string;
  balance: number;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
  // Add other account fields as needed
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  sourceAccountId: string;
  destinationAccountId?: string; // For transfers
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  createdAt: string;
  // Add other transaction fields as needed
}

// --- DTOs (Data Transfer Objects) ---

// Auth DTOs
export interface LoginDto {
  email: string;
  password: string;
  accountNumber: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// Account DTOs
export interface CreateAccountDto {
  ownerId: string;
  initialDeposit: number;
  // ... other fields for account creation
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
  toAccountId: string;
  amount: number;
}

export interface ReviewTransactionDto {
  decision: ReviewDecision;
}
