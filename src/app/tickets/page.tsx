'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TicketProvider, useTicket } from '@/context/TicketContext';
import TicketForm from '@/components/tickets/TicketForm';
import TicketList from '@/components/tickets/TicketList';
import {
    MessageSquare,
    Plus,
    HelpCircle,
    Shield,
    Clock
} from 'lucide-react';

const TicketsContent: React.FC = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                            Support Tickets
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Create and track your support requests
                        </p>
                    </div>

                    {!showCreateForm && (
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20"
                        >
                            <Plus className="h-5 w-5" />
                            New Ticket
                        </button>
                    )}
                </div>

                {/* Create Ticket Form */}
                {showCreateForm && (
                    <div className="mb-8">
                        <TicketForm
                            onSuccess={() => setShowCreateForm(false)}
                            onCancel={() => setShowCreateForm(false)}
                        />
                    </div>
                )}

                {/* Main Content - Tickets List */}
                <div className="grid grid-cols-1 gap-6">
                    <TicketList />
                </div>

                {/* Help Information */}
                {!showCreateForm && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                                    How to Get Help
                                </h3>
                            </div>
                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li>• Be specific about your issue</li>
                                <li>• Include relevant account details</li>
                                <li>• Attach screenshots if possible</li>
                                <li>• Check existing tickets for solutions</li>
                            </ul>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-green-500/10 rounded-lg">
                                    <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                                    Response Times
                                </h3>
                            </div>
                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li>• Urgent: Within 1 hour</li>
                                <li>• High: Within 4 hours</li>
                                <li>• Medium: Within 24 hours</li>
                                <li>• Low: Within 48 hours</li>
                            </ul>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                                    Security Tips
                                </h3>
                            </div>
                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li>• Never share passwords</li>
                                <li>• Use secure communication</li>
                                <li>• Verify support agent identity</li>
                                <li>• Report suspicious activity</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const TicketsPage: React.FC = () => {
    return (
        <ProtectedRoute>
            <TicketProvider>
                <TicketsContent />
            </TicketProvider>
        </ProtectedRoute>
    );
};

export default TicketsPage;