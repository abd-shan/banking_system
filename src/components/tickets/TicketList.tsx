import React from 'react';
import { useTicket } from '@/context/TicketContext';
import {
    MessageSquare,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Filter,
    SortAsc,
    SortDesc
} from 'lucide-react';

const TicketList: React.FC = () => {
    const {
        tickets,
        isLoading,
        errors,
        filters,
        sortBy,
        sortOrder,
        setFilters,
        setSortBy,
        setSortOrder,
        formatRelativeTime,
        getStatusColor,
        getStatusIcon,
        getTicketStats
    } = useTicket();

    const stats = getTicketStats();

    if (isLoading.tickets) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (errors.tickets) {
        return (
            <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-900/30">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
                    Failed to load tickets
                </h3>
                <p className="text-red-600 dark:text-red-400">{errors.tickets.message}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors duration-300"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (tickets.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    No support tickets found
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                    You haven't created any support tickets yet
                </p>
            </div>
        );
    }

    const statusOptions = [
        { value: 'ALL', label: 'All Statuses' },
        { value: 'OPEN', label: 'Open' },
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'RESOLVED', label: 'Resolved' },
        { value: 'CLOSED', label: 'Closed' }
    ];

    const sortOptions = [
        { value: 'createdAt', label: 'Date Created' },
        { value: 'updatedAt', label: 'Last Updated' }
    ];

    return (
        <div className="space-y-6">
            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total</span>
                        <MessageSquare className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">
                        {stats.total}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Open</span>
                        <AlertCircle className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">
                        {stats.open}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">In Progress</span>
                        <Clock className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">
                        {stats.inProgress}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Resolved</span>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">
                        {stats.resolved}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Closed</span>
                        <XCircle className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">
                        {stats.closed}
                    </div>
                </div>
            </div>

            {/* Filters and Sorting */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-slate-500" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter by:</span>
                            </div>

                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            {sortOrder === 'asc' ? (
                                <SortAsc className="h-4 w-4 text-slate-500" />
                            ) : (
                                <SortDesc className="h-4 w-4 text-slate-500" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Tickets List */}
            <div className="space-y-3">
                {tickets.map(ticket => (
                    <div
                        key={ticket.id}
                        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <h4 className="text-lg font-semibold text-slate-800 dark:text-white truncate">
                                        {ticket.subject}
                                    </h4>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(ticket.status)}`}>
                                        {getStatusIcon(ticket.status)}
                                                            <span className="ml-1">{ticket.status.replace('_', ' ')}</span>
                                      </span>
                                </div>

                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                    {ticket.message}
                                </p>

                                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>Created: {formatRelativeTime(ticket.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>Updated: {formatRelativeTime(ticket.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TicketList;