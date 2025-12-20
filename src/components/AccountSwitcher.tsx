// src/components/AccountSwitcher.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { bankFacade } from '@/facades/BankFacade';
import { Account } from '@/types';
import { tokenStorage } from '@/auth/tokenStorage';

export const AccountSwitcher = () => {
    const { isAuthenticated, switchAccount } = useAuthContext();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const activeAccountNumber = tokenStorage.getActiveAccountNumber();

    useEffect(() => {
        if (!isAuthenticated) {
            setAccounts([]);
            setIsLoading(false);
            return;
        }

        const fetchAccounts = async () => {
            setIsLoading(true);
            setError(null);
            try {

                const userAccounts = await bankFacade.fetchUserAccounts();
                setAccounts(userAccounts);
            } catch (err: any) {
                console.error('Failed to fetch accounts:', err);
                setError('Failed to load accounts.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccounts();
    }, [isAuthenticated, activeAccountNumber]);

    const handleSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newAccountNumber = Number(e.target.value);
        if (newAccountNumber !== activeAccountNumber) {

            switchAccount(newAccountNumber);
        }
    };

    if (isLoading) {
        return <div className="text-sm text-gray-400">Loading accounts...</div>;
    }

    if (error) {
        return <div className="text-sm text-red-400">{error}</div>;
    }

    if (accounts.length === 0) {
        return <div className="text-sm text-gray-400">No accounts found.</div>;
    }

    return (
        <div className="mt-2">
            <label htmlFor="account-select" className="block text-xs font-medium text-gray-400 mb-1">
                Active Account:
            </label>
            <select
                id="account-select"

                value={activeAccountNumber?.toString() || ''}
                onChange={handleSwitch}
                className="w-full p-2 text-sm bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            >
                {accounts.map((account,index) => (
                    <option
                        key={index}

                        value={account.accountNumber|| ""}
                    >
                        {account.accountNumber} ({account.category})
                    </option>
                ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
                {accounts.length} account(s) available.
            </p>
        </div>
    );
};