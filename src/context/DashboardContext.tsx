'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { bankFacade } from '@/facades/BankFacade';
import {
    DashboardMetrics,
    DashboardHealth,
    DashboardTickets,
    ApiError
} from '@/types';

interface DashboardContextType {
    metrics: DashboardMetrics | null;
    health: DashboardHealth | null;
    tickets: DashboardTickets | null;
    isLoading: boolean;
    error: ApiError | null;
    lastUpdated: string | null;
    refreshData: () => Promise<void>;
    formatCurrency: (amount: string | number) => string;
    formatUptime: (seconds: number) => string;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [health, setHealth] = useState<DashboardHealth | null>(null);
    const [tickets, setTickets] = useState<DashboardTickets | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<ApiError | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await bankFacade.getCompleteDashboardData();

            setMetrics(data.metrics);
            setHealth(data.health);
            setTickets(data.tickets);
            setLastUpdated(new Date().toISOString());
        } catch (err: any) {
            console.error('Failed to fetch dashboard data:', err);
            setError(err);

            // Set default/fallback data
            setMetrics({
                users: 0,
                accounts: 0,
                totalBalance: "0",
                transactionsToday: 0,
                pendingApprovals: 0
            });

            setTickets({
                open: 0,
                inProgress: 0
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();

        // Auto-refresh every 60 seconds
        const interval = setInterval(fetchDashboardData, 60000);
        return () => clearInterval(interval);
    }, []);

    const formatCurrency = (amount: string | number): string => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numAmount);
    };

    const formatUptime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    };

    const contextValue: DashboardContextType = {
        metrics,
        health,
        tickets,
        isLoading,
        error,
        lastUpdated,
        refreshData: fetchDashboardData,
        formatCurrency,
        formatUptime
    };

    return (
        <DashboardContext.Provider value={contextValue}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = (): DashboardContextType => {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};