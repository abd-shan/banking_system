// src/components/AccountList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { bankFacade } from '@/facades/BankFacade';
import { Account } from '@/types';

export const AccountList = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoading(true);
        // Use the Facade to fetch accounts
        const fetchedAccounts = await bankFacade.fetchUserAccounts();
        setAccounts(fetchedAccounts);
      } catch (e: any) {
        setError(e.response?.data?.message || 'Failed to fetch accounts.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Loading accounts...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (accounts.length === 0) {
    return <div className="text-center py-8 text-gray-500">No accounts found.</div>;
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Your Accounts</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Overview of all your bank accounts.</p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          {accounts.map((account, index) => (
            <div
              key={account.id}
              className={`${
                index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              } px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
            >
              <dt className="text-sm font-medium text-gray-500">Account Number</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {account.accountNumber}
              </dd>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    account.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                    account.status === 'CLOSED' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                }`}>
                    {account.status}
                </span>
              </dd>
              <dt className="text-sm font-medium text-gray-500">Balance</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-bold">
                ${account.balance.toFixed(2)}
              </dd>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(account.createdAt).toLocaleDateString()}
              </dd>
              <dt className="text-sm font-medium text-gray-500">Actions</dt>
              <dd className="mt-1 text-sm text-blue-600 sm:mt-0 sm:col-span-2">
                <button 
                    onClick={() => alert(`Navigating to transactions for ${account.accountNumber}`)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                    View Transactions
                </button>
                {/* Example of an action using the Facade */}
                <button 
                    onClick={async () => {
                        if (confirm(`Are you sure you want to close account ${account.accountNumber}?`)) {
                            try {
                                await bankFacade.closeAccount(account.id);
                                alert('Account closure initiated.');
                                // Re-fetch accounts to update the list
                                window.location.reload(); 
                            } catch (e: any) {
                                alert(`Failed to close account: ${e.response?.data?.message || 'Unknown error'}`);
                            }
                        }
                    }}
                    className="text-red-600 hover:text-red-900"
                    disabled={account.status === 'CLOSED'}
                >
                    Close Account
                </button>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};
