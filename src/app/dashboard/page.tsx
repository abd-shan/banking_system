// src/app/dashboard/page.tsx
'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AccountList } from '@/components/AccountList';
import { TransactionForm } from '@/components/TransactionForm';
import { useAuthContext } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuthContext();

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Welcome to the Dashboard, {user?.firstName || user?.email}!</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AccountList />
          </div>
          <div className="lg:col-span-1">
            <TransactionForm />
          </div>
        </div>
        
        {/* Transaction History for a specific account (placeholder for now) */}
        {/* <TransactionHistory accountId="some-account-id" /> */}
      </div>
    </ProtectedRoute>
  );
}
