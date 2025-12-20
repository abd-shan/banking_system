'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { bankFacade } from '@/facades/BankFacade';
import { Ticket, CreateTicketDto, ApiError } from '@/types';

interface TicketContextType {
    tickets: Ticket[];
    isLoading: {
        tickets: boolean;
        creating: boolean;
    };
    errors: {
        tickets: ApiError | null;
        create: ApiError | null;
    };
    filters: {
        status: 'ALL' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    };
    sortBy: 'createdAt' | 'updatedAt';
    sortOrder: 'asc' | 'desc';
    setFilters: (filters: { status: 'ALL' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' }) => void;
    setSortBy: (sortBy: 'createdAt' | 'updatedAt') => void;
    setSortOrder: (order: 'asc' | 'desc') => void;
    fetchTickets: () => Promise<void>;
    refreshTickets: () => Promise<void>;
    createNewTicket: (dto: CreateTicketDto) => Promise<Ticket>;
    formatDate: (dateString: string) => string;
    formatRelativeTime: (dateString: string) => string;
    getStatusColor: (status: string) => string;
    getStatusIcon: (status: string) => React.ReactNode;
    getTicketStats: () => {
        open: number;
        inProgress: number;
        resolved: number;
        closed: number;
        total: number;
    };
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tickets, setTickets] = useState<Ticket[]>([]);

    const [isLoading, setIsLoading] = useState({
        tickets: false,
        creating: false
    });

    const [errors, setErrors] = useState({
        tickets: null as ApiError | null,
        create: null as ApiError | null
    });

    const [filters, setFiltersState] = useState({
        status: 'ALL' as 'ALL' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
    });

    const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const setFilters = (newFilters: { status: 'ALL' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' }) => {
        setFiltersState(newFilters);
    };

    const fetchTickets = async () => {
        setIsLoading(prev => ({ ...prev, tickets: true }));
        setErrors(prev => ({ ...prev, tickets: null }));

        try {
            const response = await bankFacade.getMyTickets();


            let filteredTickets = response.data;

            if (filters.status !== 'ALL') {
                filteredTickets = filteredTickets.filter(ticket => ticket.status === filters.status);
            }


            filteredTickets.sort((a, b) => {
                let aValue: number, bValue: number;

                if (sortBy === 'createdAt') {
                    aValue = new Date(a.createdAt).getTime();
                    bValue = new Date(b.createdAt).getTime();
                } else {
                    aValue = new Date(a.updatedAt).getTime();
                    bValue = new Date(b.updatedAt).getTime();
                }

                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            });

            setTickets(filteredTickets);
        } catch (error: any) {
            console.error('Failed to fetch tickets:', error);
            setErrors(prev => ({ ...prev, tickets: error }));
            setTickets([]);
        } finally {
            setIsLoading(prev => ({ ...prev, tickets: false }));
        }
    };

    const refreshTickets = async () => {
        await fetchTickets();
    };

    const createNewTicket = async (dto: CreateTicketDto): Promise<Ticket> => {
        setIsLoading(prev => ({ ...prev, creating: true }));
        setErrors(prev => ({ ...prev, create: null }));

        try {
            const response = await bankFacade.createTicket(dto);
            await fetchTickets();
            return response.data;
        } catch (error: any) {
            console.error('Failed to create ticket:', error);
            setErrors(prev => ({ ...prev, create: error }));
            throw error;
        } finally {
            setIsLoading(prev => ({ ...prev, creating: false }));
        }
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatRelativeTime = (dateString: string): string => {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return formatDate(dateString);
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'OPEN':
                return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
            case 'IN_PROGRESS':
                return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
            case 'RESOLVED':
                return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
            case 'CLOSED':
                return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
            default:
                return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
        }
    };

    const getStatusIcon = (status: string): React.ReactNode => {
        switch (status) {
            case 'OPEN':
                return (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                );
            case 'IN_PROGRESS':
                return (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'RESOLVED':
                return (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'CLOSED':
                return (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const getTicketStats = () => {
        const open = tickets.filter(t => t.status === 'OPEN').length;
        const inProgress = tickets.filter(t => t.status === 'IN_PROGRESS').length;
        const resolved = tickets.filter(t => t.status === 'RESOLVED').length;
        const closed = tickets.filter(t => t.status === 'CLOSED').length;

        return {
            open,
            inProgress,
            resolved,
            closed,
            total: tickets.length
        };
    };

    useEffect(() => {
        fetchTickets();
    }, [filters.status, sortBy, sortOrder]);

    const contextValue: TicketContextType = {
        tickets,
        isLoading,
        errors,
        filters,
        sortBy,
        sortOrder,
        setFilters,
        setSortBy,
        setSortOrder,
        fetchTickets,
        refreshTickets,
        createNewTicket,
        formatDate,
        formatRelativeTime,
        getStatusColor,
        getStatusIcon,
        getTicketStats
    };

    return (
        <TicketContext.Provider value={contextValue}>
            {children}
        </TicketContext.Provider>
    );
};

export const useTicket = (): TicketContextType => {
    const context = useContext(TicketContext);
    if (context === undefined) {
        throw new Error('useTicket must be used within a TicketProvider');
    }
    return context;
};