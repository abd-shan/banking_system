'use client';

import React from 'react';
import { useAccountContext } from '@/context/AccountContext';
import { bankFacade } from '@/facades/BankFacade';

export const AccountList = () => {
  const { accounts, isLoading, refreshAccounts } = useAccountContext();

  const handleCloseAccount = async (id: string, num: number | undefined) => {
    if (confirm(`Are you sure you want to close account ${num}?`)) {
      try {
        await bankFacade.closeAccount(id);
        alert('Account closed successfully');
        await refreshAccounts();
      } catch (e: any) {
        alert(e.response?.data?.message || 'Error closing account');
      }
    }
  };

  if (isLoading && accounts.length === 0) return <div className="text-center py-8">Loading...</div>;

  return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-bold">Your Accounts</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {accounts.map((account) => (
              <div key={account.id} className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                <div>
                  <p className="text-sm text-gray-500">Account Number</p>
                  <p className="font-mono font-bold">{account.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${account.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {account.status}
              </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Balance</p>
                  <p className="text-lg font-bold text-blue-600">${Number(account.balance).toFixed(2)}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                      onClick={() => handleCloseAccount(account.id, account.accountNumber)}
                      className="text-red-500 hover:underline text-sm"
                      disabled={account.status === 'CLOSED'}
                  >
                    Close
                  </button>
                </div>
              </div>
          ))}
        </div>

      </div>
  );
};