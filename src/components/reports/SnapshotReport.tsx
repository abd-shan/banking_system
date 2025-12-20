import React from 'react';
import { useReport } from '@/context/ReportContext';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    TrendingUp,
    TrendingDown,
    Shield,
    AlertCircle
} from 'lucide-react';

const SnapshotReport: React.FC = () => {
    const {
        snapshot,
        isLoading,
        errors,
        formatCurrency
    } = useReport();

    if (isLoading.snapshot) {
        return (
            <div className="space-y-6">
                <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
                <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
                <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
            </div>
        );
    }

    if (errors.snapshot) {
        return (
            <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-900/30">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
                    Failed to load system snapshot
                </h3>
                <p className="text-red-600 dark:text-red-400">{errors.snapshot?.message || 'An unexpected error occurred'}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors duration-300"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!snapshot) {
        return (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    No snapshot data available
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                    System snapshot data could not be loaded
                </p>
            </div>
        );
    }

    const systemStatus = snapshot.failedTransactions === 0 && snapshot.pendingApprovals === 0
        ? 'HEALTHY'
        : snapshot.failedTransactions > 0
            ? 'CRITICAL'
            : 'WARNING';

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'HEALTHY':
                return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
            case 'WARNING':
                return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
            case 'CRITICAL':
                return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
            default:
                return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'HEALTHY':
                return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
            case 'WARNING':
                return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
            case 'CRITICAL':
                return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
            default:
                return <Shield className="h-5 w-5 text-slate-500" />;
        }
    };

    return (
        <div id="printable-report" className="space-y-6 print:space-y-4">
            {/* System Status Header */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 print:border-slate-300">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-white print:text-black">
                                System Health Snapshot
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 print:text-gray-600">
                                Real-time overview of system performance and issues
                            </p>
                        </div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${getStatusColor(systemStatus)}`}>
                        {getStatusIcon(systemStatus)}
                        <span className="font-semibold">{systemStatus}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
                    <div className={`p-4 rounded-lg border ${
                        snapshot.failedTransactions > 0
                            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30'
                            : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30'
                    }`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                {snapshot.failedTransactions > 0 ? (
                                    <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                                ) : (
                                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                                )}
                                <span className="font-medium text-slate-800 dark:text-white print:text-black">
                  Failed Transactions
                </span>
                            </div>
                            <span className={`text-xl font-bold ${
                                snapshot.failedTransactions > 0
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-green-600 dark:text-green-400'
                            }`}>
                {snapshot.failedTransactions}
              </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 print:text-gray-600">
                            {snapshot.failedTransactions > 0
                                ? `There are ${snapshot.failedTransactions} failed transactions that require attention`
                                : 'All transactions processed successfully'}
                        </p>
                    </div>

                    <div className={`p-4 rounded-lg border ${
                        snapshot.pendingApprovals > 0
                            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900/30'
                            : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30'
                    }`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                {snapshot.pendingApprovals > 0 ? (
                                    <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                ) : (
                                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                )}
                                <span className="font-medium text-slate-800 dark:text-white print:text-black">
                  Pending Approvals
                </span>
                            </div>
                            <span className={`text-xl font-bold ${
                                snapshot.pendingApprovals > 0
                                    ? 'text-yellow-600 dark:text-yellow-400'
                                    : 'text-green-600 dark:text-green-400'
                            }`}>
                {snapshot.pendingApprovals}
              </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 print:text-gray-600">
                            {snapshot.pendingApprovals > 0
                                ? `There are ${snapshot.pendingApprovals} transactions awaiting approval`
                                : 'All approvals have been processed'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Recommendations */}
            {(snapshot.failedTransactions > 0 || snapshot.pendingApprovals > 0) && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-900/30 p-6 print:bg-blue-100 print:border-blue-300">
                    <div className="flex items-start gap-3 mb-4">
                        <AlertTriangle className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1 print:text-blue-800" />
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2 print:text-black">
                                Recommended Actions
                            </h3>
                            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 print:text-gray-800">
                                {snapshot.failedTransactions > 0 && (
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-500 font-bold">•</span>
                                        <span>
                      <span className="font-semibold">Review failed transactions:</span>
                      Investigate and resolve the {snapshot.failedTransactions} failed transaction(s) in the transaction logs
                    </span>
                                    </li>
                                )}
                                {snapshot.pendingApprovals > 0 && (
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-500 font-bold">•</span>
                                        <span>
                      <span className="font-semibold">Process pending approvals:</span>
                      Review and approve the {snapshot.pendingApprovals} pending transaction(s)
                    </span>
                                    </li>
                                )}
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 font-bold">•</span>
                                    <span>
                    <span className="font-semibold">Monitor system health:</span>
                    Check the dashboard for real-time system performance metrics
                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 font-bold">•</span>
                                    <span>
                    <span className="font-semibold">Audit review:</span>
                    Review audit logs for any suspicious activities or errors
                  </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* System Metrics Summary */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-6 print:bg-gray-100 print:border-gray-300">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 print:text-black">
                    System Metrics Summary
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 print:bg-white print:border-gray-300">
                        <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400 print:text-gray-600">
                System Status
              </span>
                            <div className={`h-2 w-2 rounded-full ${
                                systemStatus === 'HEALTHY' ? 'bg-green-500' :
                                    systemStatus === 'WARNING' ? 'bg-yellow-500' : 'bg-red-500'
                            } animate-pulse`} />
                        </div>
                        <div className="text-xl font-bold text-slate-800 dark:text-white print:text-black">
                            {systemStatus}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 print:bg-white print:border-gray-300">
                        <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400 print:text-gray-600">
                Failed Rate
              </span>
                            <TrendingDown className="h-4 w-4 text-red-500" />
                        </div>
                        <div className="text-xl font-bold text-slate-800 dark:text-white print:text-black">
                            {snapshot.failedTransactions > 0 ? `${snapshot.failedTransactions}` : '0%'}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 print:bg-white print:border-gray-300">
                        <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400 print:text-gray-600">
                Pending Rate
              </span>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div className="text-xl font-bold text-slate-800 dark:text-white print:text-black">
                            {snapshot.pendingApprovals > 0 ? `${snapshot.pendingApprovals}` : '0%'}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 print:bg-white print:border-gray-300">
                        <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400 print:text-gray-600">
                Resolution Time
              </span>
                            <Clock className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="text-xl font-bold text-slate-800 dark:text-white print:text-black">
                            {snapshot.failedTransactions === 0 && snapshot.pendingApprovals === 0
                                ? 'Immediate'
                                : '24-48h'}
                        </div>
                    </div>
                </div>

                {/* Last Updated */}
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 print:border-gray-300">
                    <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400 print:text-gray-600">
              Last Updated
            </span>
                        <span className="font-medium text-slate-800 dark:text-white print:text-black">
              {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
                    </div>
                </div>
            </div>

            {/* For Print Only - Additional Information */}
            <div className="hidden print:block mt-8 pt-8 border-t border-slate-800">
                <h4 className="font-semibold text-slate-800 mb-2">Snapshot Report Details</h4>
                <div className="text-xs text-slate-600 space-y-1">
                    <p><strong>Report ID:</strong> SNAP-{new Date().getFullYear()}-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                    <p><strong>Generated For:</strong> BankSys System Administrators</p>
                    <p><strong>Time Range:</strong> Current System State</p>
                    <p><strong>Confidentiality:</strong> Level 2 - Internal Use Only</p>
                    <p className="mt-4 text-xs italic">This snapshot provides real-time system health information for operational monitoring.</p>
                </div>
            </div>
        </div>
    );
};

export default SnapshotReport;