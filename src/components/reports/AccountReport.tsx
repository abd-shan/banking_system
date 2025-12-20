import React from 'react';
import { useReport } from '@/context/ReportContext';
import {
    CreditCard,
    User,
    TrendingUp,
    TrendingDown,
    Shield,
    Building
} from 'lucide-react';

const AccountReport: React.FC = () => {
    const {
        accounts,
        isLoading,
        errors,
        formatCurrency,
        getStatusColor,
        calculateSummary
    } = useReport();

    const summary = calculateSummary('accounts');

    if (isLoading.accounts) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (errors.accounts) {
        return (
            <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-900/30">
                <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
                    Failed to load accounts
                </h3>
                <p className="text-red-600 dark:text-red-400">{errors.accounts.message}</p>
            </div>
        );
    }

    if (accounts.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <CreditCard className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    No accounts found
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                    There are no accounts in the system
                </p>
            </div>
        );
    }

    return (
        <div id="printable-report">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 print:grid-cols-3 print:gap-2">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Balance</span>
                        <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">
                        {formatCurrency(summary.totalBalance)}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Accounts</span>
                        <User className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">
                        {summary.activeAccounts}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Investment Accounts</span>
                        <Building className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">
                        {summary.investmentAccounts}
                    </div>
                </div>
            </div>


            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden print:border-none">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-900/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Account #
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Owner
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Balance
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Transactions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {accounts.map((account) => (
                            <tr key={account.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <CreditCard className="h-5 w-5 text-slate-400 mr-3" />
                                        <span className="font-mono font-semibold text-slate-800 dark:text-white">
                        {account.account_number}
                      </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="font-medium text-slate-800 dark:text-white">
                                            {account.owner.full_name}
                                        </div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            {account.owner.email}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-lg font-bold text-slate-800 dark:text-white">
                                        {formatCurrency(account.balance)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                      {account.category}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(account.status)}`}>
                      {account.status}
                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <div className="text-xs text-slate-500 dark:text-slate-400">Incoming</div>
                                            <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                {account._count.incomingTransactions}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs text-slate-500 dark:text-slate-400">Outgoing</div>
                                            <div className="text-sm font-semibold text-red-600 dark:text-red-400">
                                                {account._count.outgoingTransactions}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AccountReport;