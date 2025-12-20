import React, { useState } from 'react';
import { useReport } from '@/context/ReportContext';
import {
    Shield,
    UserPlus,
    Edit,
    Trash2,
    Eye,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

const AuditReport: React.FC = () => {
    const {
        auditLogs,
        isLoading,
        errors,
        formatDate,
        calculateSummary
    } = useReport();

    const [expandedLogs, setExpandedLogs] = useState<string[]>([]);
    const summary = calculateSummary('audit');

    const toggleExpand = (logId: string) => {
        setExpandedLogs(prev =>
            prev.includes(logId)
                ? prev.filter(id => id !== logId)
                : [...prev, logId]
        );
    };

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'CREATE':
                return <UserPlus className="h-4 w-4 text-green-500" />;
            case 'UPDATE':
                return <Edit className="h-4 w-4 text-blue-500" />;
            case 'DELETE':
                return <Trash2 className="h-4 w-4 text-red-500" />;
            default:
                return <Shield className="h-4 w-4 text-slate-500" />;
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'CREATE':
                return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
            case 'UPDATE':
                return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
            case 'DELETE':
                return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
            default:
                return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
        }
    };

    if (isLoading.audit) {
        return (
            <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (errors.audit) {
        return (
            <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-900/30">
                <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
                    Failed to load audit logs
                </h3>
                <p className="text-red-600 dark:text-red-400">{errors.audit.message}</p>
            </div>
        );
    }

    if (auditLogs.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    No audit logs found
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                    Try adjusting your date range
                </p>
            </div>
        );
    }

    return (
        <div id="printable-report">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 print:grid-cols-3 print:gap-2">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Create Actions</span>
                        <UserPlus className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">
                        {summary.creates}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Update Actions</span>
                        <Edit className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">
                        {summary.updates}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Delete Actions</span>
                        <Trash2 className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">
                        {summary.deletes}
                    </div>
                </div>
            </div>


            <div className="space-y-4">
                {auditLogs.map((log) => (
                    <div
                        key={log.id}
                        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                    >
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                        {getActionIcon(log.action)}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800 dark:text-white">
                                            {log.entityType} {log.action}
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {formatDate(log.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getActionColor(log.action)}`}>
                    {log.action}
                  </span>
                                    <button
                                        onClick={() => toggleExpand(log.id)}
                                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                                    >
                                        {expandedLogs.includes(log.id) ? (
                                            <ChevronUp className="h-4 w-4 text-slate-500" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-slate-500" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Performed By</p>
                                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                                        {log.performedBy.full_name}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {log.performedBy.role} • {log.performedBy.email}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Entity ID</p>
                                    <p className="text-sm font-mono text-slate-800 dark:text-white">
                                        {log.entityId.slice(0, 8)}...
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">IP Address</p>
                                    <p className="text-sm font-mono text-slate-800 dark:text-white">
                                        {log.ipAddress || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {expandedLogs.includes(log.id) && (
                                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Eye className="h-4 w-4 text-slate-500" />
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Metadata Details
                    </span>
                                    </div>
                                    <pre className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-xs font-mono overflow-x-auto">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AuditReport;