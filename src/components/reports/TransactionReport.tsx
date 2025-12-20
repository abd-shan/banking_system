import React from 'react';
import { useReport } from '@/context/ReportContext';
import {
    ArrowUpRight,
    ArrowDownRight,
    Repeat,
    CheckCircle,
    Clock,
    XCircle, BarChart3
} from 'lucide-react';

const TransactionReport: React.FC = () => {
    const {
        transactions,
        isLoading,
        errors,
        formatCurrency,
        formatDate,
        getTransactionTypeColor,
        getStatusColor,
        calculateSummary,
        pagination,
        setPage
    } = useReport();

    const summary = calculateSummary('transactions');

    if (isLoading.transactions) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (errors.transactions) {
        return (
            <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-900/30">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
                    Failed to load transactions
                </h3>
                <p className="text-red-600 dark:text-red-400">{errors.transactions.message}</p>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <Repeat className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    No transactions found
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                    Try adjusting your date range or filters
                </p>
            </div>
        );
    }

    return (
        <div id="printable-report">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 print:grid-cols-4 print:gap-2">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Amount</span>
                        <ArrowUpRight className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">
                        {formatCurrency(summary.totalAmount)}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Transactions</span>
                        <BarChart3 className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">
                        {summary.totalCount}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Deposits</span>
                        <ArrowDownRight className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">
                        {summary.deposits}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Withdrawals</span>
                        <ArrowUpRight className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">
                        {summary.withdrawals}
                    </div>
                </div>
            </div>


            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden print:border-none">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-900/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Date & Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                From Account
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                To Account
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {transactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                    {formatDate(transaction.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getTransactionTypeColor(transaction.type)}`}>
                      {transaction.type}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800 dark:text-white">
                                    {formatCurrency(transaction.amount)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                    {transaction.fromAccount?.account_number || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                    {transaction.toAccount?.account_number || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(transaction.status)}`}>
                        {transaction.status === 'APPROVED' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {transaction.status === 'PENDING' && <Clock className="h-3 w-3 mr-1" />}
                          {transaction.status}
                      </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* الباجينيشن */}
                {pagination.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 print:hidden">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                Showing <span className="font-semibold">{((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}</span> to{' '}
                                <span className="font-semibold">
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                </span> of{' '}
                                <span className="font-semibold">{pagination.totalItems}</span> results
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1}
                                    className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                                <button
                                    onClick={() => setPage(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionReport;