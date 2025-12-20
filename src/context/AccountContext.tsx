'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { bankFacade } from '@/facades/BankFacade';
import { tokenStorage } from '@/auth/tokenStorage';
import { Account } from '@/types';
import { useAuthContext } from '@/context/AuthContext';

interface AccountContextType {
    accounts: Account[];
    isLoading: boolean;
    activeAccountNumber: number | null;
    refreshAccounts: () => Promise<void>;
    switchAccount: (accountNumber: number) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading: authLoading } = useAuthContext();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [activeAccountNumber, setActiveAccountNumber] =
        useState<number | null>(null);


    const refreshAccounts = useCallback(async () => {
        if (!isAuthenticated) return;
        setIsFetching(true);
        try {
            const data = await bankFacade.fetchUserAccounts();
            setAccounts(data);
        } catch (error) {
            console.error("Failed to fetch accounts:", error);
        } finally {
            setIsFetching(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (authLoading) return;
        if (isAuthenticated) {
            setActiveAccountNumber(tokenStorage.getActiveAccountNumber());
            refreshAccounts();
        } else {
            setAccounts([]);
            setActiveAccountNumber(null);
        }
    }, [isAuthenticated, authLoading, refreshAccounts]);

    const switchAccount = (accountNumber: number) => {
        if (tokenStorage.hasToken(accountNumber)) {
            tokenStorage.switchAccount(accountNumber);
            setActiveAccountNumber(accountNumber);
            refreshAccounts();
        } else {
            window.location.href = '/login';
        }
    };

    return (
        <AccountContext.Provider
            value={{ accounts, isLoading: isFetching, activeAccountNumber, refreshAccounts, switchAccount }}
        >
            {children}
        </AccountContext.Provider>
    );
};

export const useAccountContext = () => {
    const ctx = useContext(AccountContext);
    if (!ctx) throw new Error('useAccountContext must be used within AccountProvider');
    return ctx;
};