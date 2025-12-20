import React from 'react';
import { Ticket, AlertCircle, Clock, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface TicketsCardProps {
    open: number;
    inProgress: number;
    loading?: boolean;
}

const TicketsCard: React.FC<TicketsCardProps> = ({ open, inProgress, loading = false }) => {
    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl border p-6 shadow-sm animate-pulse">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-6"></div>
                <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                <div>
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-2"></div>
                                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                                </div>
                            </div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-8"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const totalTickets = open + inProgress;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Ticket className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Support Tickets</h3>
                </div>
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Total: <span className="text-slate-800 dark:text-white">{totalTickets}</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 rounded-full">
                            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800 dark:text-white">Open Tickets</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Requires immediate attention</p>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{open}</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-900/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/10 rounded-full">
                            <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800 dark:text-white">In Progress</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Currently being handled</p>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{inProgress}</div>
                </div>
            </div>

            {totalTickets === 0 ? (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
                    <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="font-medium text-green-700 dark:text-green-300">
              All tickets are resolved! Great work team.
            </span>
                    </div>
                </div>
            ) : (
                <div className="mt-6">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg font-medium transition-colors duration-300">
                        <span>View All Tickets</span>
                        <ArrowUpRight className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TicketsCard;