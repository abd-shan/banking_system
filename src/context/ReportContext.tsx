'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { bankFacade } from '@/facades/BankFacade';
import {
    TransactionReport,
    AccountReport,
    AuditReport,
    ReportSnapshot,
    ApiError,
    ReportFilters
} from '@/types';

interface ReportContextType {
    // البيانات
    transactions: TransactionReport[];
    accounts: AccountReport[];
    auditLogs: AuditReport[];
    snapshot: ReportSnapshot | null;

    // حالات التحميل
    isLoading: {
        transactions: boolean;
        accounts: boolean;
        audit: boolean;
        snapshot: boolean;
    };

    // الأخطاء
    errors: {
        transactions: ApiError | null;
        accounts: ApiError | null;
        audit: ApiError | null;
        snapshot: ApiError | null;
    };

    // الفلاتر
    filters: ReportFilters;

    // الباجينيشن
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };

    // دوال إدارة الحالة
    setFilters: (filters: Partial<ReportFilters>) => void;
    setPage: (page: number) => void;

    // دوال جلب البيانات
    fetchTransactions: () => Promise<void>;
    fetchAccounts: () => Promise<void>;
    fetchAuditLogs: () => Promise<void>;
    fetchSnapshot: () => Promise<void>;
    fetchAllReports: () => Promise<void>;
    refreshReports: () => Promise<void>;


    exportToPDF: (reportType: string) => Promise<void>;
    exportToCSV: (reportType: string) => Promise<void>;
    printReport: (reportType: string) => void;


    formatCurrency: (amount: string | number) => string;
    formatDate: (dateString: string) => string;
    getTransactionTypeColor: (type: string) => string;
    getStatusColor: (status: string) => string;
    calculateSummary: (type: 'transactions' | 'accounts' | 'audit') => any;
}

const defaultFilters: ReportFilters = {
    dateRange: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        to: new Date().toISOString()
    },
    transactionType: 'ALL',
    accountStatus: 'ALL',
    auditAction: 'ALL'
};

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [transactions, setTransactions] = useState<TransactionReport[]>([]);
    const [accounts, setAccounts] = useState<AccountReport[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditReport[]>([]);
    const [snapshot, setSnapshot] = useState<ReportSnapshot | null>(null);

    const [isLoading, setIsLoading] = useState({
        transactions: false,
        accounts: false,
        audit: false,
        snapshot: false
    });

    const [errors, setErrors] = useState({
        transactions: null as ApiError | null,
        accounts: null as ApiError | null,
        audit: null as ApiError | null,
        snapshot: null as ApiError | null
    });

    const [filters, setFiltersState] = useState<ReportFilters>(defaultFilters);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20
    });

    const setFilters = (newFilters: Partial<ReportFilters>) => {
        setFiltersState(prev => ({ ...prev, ...newFilters }));
    };

    const setPage = (page: number) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const fetchTransactions = async () => {
        setIsLoading(prev => ({ ...prev, transactions: true }));
        setErrors(prev => ({ ...prev, transactions: null }));

        try {
            const response = await bankFacade.getTransactionsReport(
                filters.dateRange.from,
                filters.dateRange.to,
                pagination.currentPage,
                pagination.itemsPerPage
            );

            setTransactions(response.data);

            // تحديث الباجينيشن (يفترض أن ال API ترجع بيانات الباجينيشن)
            setPagination(prev => ({
                ...prev,
                totalItems: response.data.length * 10, // هذا مثال، يجب أن يكون من ال API
                totalPages: Math.ceil((response.data.length * 10) / prev.itemsPerPage)
            }));
        } catch (error: any) {
            console.error('Failed to fetch transactions:', error);
            setErrors(prev => ({ ...prev, transactions: error }));
            setTransactions([]);
        } finally {
            setIsLoading(prev => ({ ...prev, transactions: false }));
        }
    };

    const fetchAccounts = async () => {
        setIsLoading(prev => ({ ...prev, accounts: true }));
        setErrors(prev => ({ ...prev, accounts: null }));

        try {
            const response = await bankFacade.getAccountsReport(
                pagination.currentPage,
                pagination.itemsPerPage
            );

            setAccounts(response.data);

            setPagination(prev => ({
                ...prev,
                totalItems: response.data.length * 5,
                totalPages: Math.ceil((response.data.length * 5) / prev.itemsPerPage)
            }));
        } catch (error: any) {
            console.error('Failed to fetch accounts:', error);
            setErrors(prev => ({ ...prev, accounts: error }));
            setAccounts([]);
        } finally {
            setIsLoading(prev => ({ ...prev, accounts: false }));
        }
    };

    const fetchAuditLogs = async () => {
        setIsLoading(prev => ({ ...prev, audit: true }));
        setErrors(prev => ({ ...prev, audit: null }));

        try {
            const response = await bankFacade.getAuditReport(
                filters.dateRange.from,
                filters.dateRange.to,
                pagination.currentPage,
                pagination.itemsPerPage
            );

            setAuditLogs(response.data);

            setPagination(prev => ({
                ...prev,
                totalItems: response.data.length * 8,
                totalPages: Math.ceil((response.data.length * 8) / prev.itemsPerPage)
            }));
        } catch (error: any) {
            console.error('Failed to fetch audit logs:', error);
            setErrors(prev => ({ ...prev, audit: error }));
            setAuditLogs([]);
        } finally {
            setIsLoading(prev => ({ ...prev, audit: false }));
        }
    };

    const fetchSnapshot = async () => {
        setIsLoading(prev => ({ ...prev, snapshot: true }));
        setErrors(prev => ({ ...prev, snapshot: null }));

        try {
            const response = await bankFacade.getSnapshotReport();
            setSnapshot(response.data);
        } catch (error: any) {
            console.error('Failed to fetch snapshot:', error);
            setErrors(prev => ({ ...prev, snapshot: error }));
            setSnapshot({ failedTransactions: 0, pendingApprovals: 0 });
        } finally {
            setIsLoading(prev => ({ ...prev, snapshot: false }));
        }
    };

    const fetchAllReports = async () => {
        await Promise.all([
            fetchTransactions(),
            fetchAccounts(),
            fetchAuditLogs(),
            fetchSnapshot()
        ]);
    };

    const refreshReports = async () => {
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        await fetchAllReports();
    };

    const exportToPDF = async (reportType: string) => {
        try {
            let data;
            switch (reportType) {
                case 'transactions':
                    data = { transactions, filters };
                    break;
                case 'accounts':
                    data = { accounts, filters };
                    break;
                case 'audit':
                    data = { auditLogs, filters };
                    break;
                default:
                    data = {};
            }

            const blob = await bankFacade.generatePDFReport(reportType, data);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to export PDF:', error);
            alert('Failed to export PDF. Please try again.');
        }
    };

    const exportToCSV = async (reportType: string) => {
        try {
            let data;
            switch (reportType) {
                case 'transactions':
                    data = { transactions, filters };
                    break;
                case 'accounts':
                    data = { accounts, filters };
                    break;
                case 'audit':
                    data = { auditLogs, filters };
                    break;
                default:
                    data = {};
            }

            const blob = await bankFacade.exportCSVReport(reportType, data);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to export CSV:', error);
            alert('Failed to export CSV. Please try again.');
        }
    };

    const printReport = (reportType: string) => {
        const printContent = document.getElementById('printable-report');
        if (printContent) {
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContent.innerHTML;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload();
        }
    };

    const formatCurrency = (amount: string | number): string => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numAmount);
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

    const getTransactionTypeColor = (type: string): string => {
        switch (type) {
            case 'DEPOSIT':
                return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
            case 'WITHDRAW':
                return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
            case 'TRANSFER':
                return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
            default:
                return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
        }
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'APPROVED':
            case 'ACTIVE':
            case 'SUCCESS':
                return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
            case 'PENDING':
                return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
            case 'REJECTED':
            case 'INACTIVE':
            case 'FAILED':
                return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
            default:
                return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
        }
    };

    const calculateSummary = (type: 'transactions' | 'accounts' | 'audit') => {
        switch (type) {
            case 'transactions':
                const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
                const deposits = transactions.filter(t => t.type === 'DEPOSIT').length;
                const withdrawals = transactions.filter(t => t.type === 'WITHDRAW').length;
                const transfers = transactions.filter(t => t.type === 'TRANSFER').length;

                return {
                    totalAmount,
                    deposits,
                    withdrawals,
                    transfers,
                    totalCount: transactions.length
                };

            case 'accounts':
                const totalBalance = accounts.reduce((sum, a) => sum + parseFloat(a.balance), 0);
                const activeAccounts = accounts.filter(a => a.status === 'ACTIVE').length;
                const investmentAccounts = accounts.filter(a => a.category === 'INVESTMENT').length;

                return {
                    totalBalance,
                    activeAccounts,
                    investmentAccounts,
                    totalCount: accounts.length
                };

            case 'audit':
                const creates = auditLogs.filter(a => a.action === 'CREATE').length;
                const updates = auditLogs.filter(a => a.action === 'UPDATE').length;
                const deletes = auditLogs.filter(a => a.action === 'DELETE').length;

                return {
                    creates,
                    updates,
                    deletes,
                    totalCount: auditLogs.length
                };

            default:
                return {};
        }
    };

    useEffect(() => {
        fetchAllReports();
    }, [filters.dateRange, pagination.currentPage]);

    const contextValue: ReportContextType = {
        transactions,
        accounts,
        auditLogs,
        snapshot,
        isLoading,
        errors,
        filters,
        pagination,
        setFilters,
        setPage,
        fetchTransactions,
        fetchAccounts,
        fetchAuditLogs,
        fetchSnapshot,
        fetchAllReports,
        refreshReports,
        exportToPDF,
        exportToCSV,
        printReport,
        formatCurrency,
        formatDate,
        getTransactionTypeColor,
        getStatusColor,
        calculateSummary
    };

    return (
        <ReportContext.Provider value={contextValue}>
            {children}
        </ReportContext.Provider>
    );
};

export const useReport = (): ReportContextType => {
    const context = useContext(ReportContext);
    if (context === undefined) {
        throw new Error('useReport must be used within a ReportProvider');
    }
    return context;
};