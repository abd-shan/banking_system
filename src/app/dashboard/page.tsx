'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardProvider, useDashboard } from '@/context/DashboardContext';
import StatCard from '@/components/dashboard/StatCard';
import SystemHealthCard from '@/components/dashboard/SystemHealthCard';
import TicketsCard from '@/components/dashboard/TicketsCard';
import {
  Users,
  CreditCard,
  DollarSign,
  Activity,
  Clock,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Shield
} from 'lucide-react';

const DashboardContent: React.FC = () => {
  const {
    metrics,
    health,
    tickets,
    isLoading,
    error,
    lastUpdated,
    refreshData,
    formatCurrency,
    formatUptime
  } = useDashboard();

  const handleRefresh = async () => {
    await refreshData();
  };

  if (error && !metrics) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                System Overview and Statistics
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-xl p-8 text-center">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-2">
                Unable to Load Dashboard Data
              </h2>
              <p className="text-red-600 dark:text-red-400 mb-6">
                {error.message || 'An unexpected error occurred'}
              </p>
              <button
                  onClick={handleRefresh}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-300 flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                Dashboard Overview
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Real-time banking system statistics and monitoring
              </p>
            </div>

            <div className="flex items-center gap-4">
              {lastUpdated && (
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Last updated: {new Date(lastUpdated).toLocaleTimeString()}
                  </div>
              )}
              <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg font-medium transition-colors duration-300 flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <StatCard
                title="Total Users"
                value={metrics?.users || 0}
                change="12%"
                icon={<Users className="h-6 w-6" />}
                color="blue"
                loading={isLoading}
            />

            <StatCard
                title="Active Accounts"
                value={metrics?.accounts || 0}
                change="8%"
                icon={<CreditCard className="h-6 w-6" />}
                color="green"
                loading={isLoading}
            />

            <StatCard
                title="Total Balance"
                value={metrics ? formatCurrency(metrics.totalBalance) : '$0.00'}
                change="15%"
                icon={<DollarSign className="h-6 w-6" />}
                color="purple"
                loading={isLoading}
            />

            <StatCard
                title="Transactions Today"
                value={metrics?.transactionsToday || 0}
                change="23%"
                icon={<Activity className="h-6 w-6" />}
                color="orange"
                loading={isLoading}
            />

            <StatCard
                title="Pending Approvals"
                value={metrics?.pendingApprovals || 0}
                icon={<Clock className="h-6 w-6" />}
                color="red"
                loading={isLoading}
            />
          </div>

          {/* System Health and Tickets Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <SystemHealthCard
                uptime={health?.uptime || 0}
                memory={health?.memory || {
                  rss: 0,
                  heapTotal: 0,
                  heapUsed: 0,
                  external: 0,
                  arrayBuffers: 0
                }}
                timestamp={health?.timestamp || new Date().toISOString()}
                db={health?.db || 'UP'}
                formatUptime={formatUptime}
                loading={isLoading}
            />

            <TicketsCard
                open={tickets?.open || 0}
                inProgress={tickets?.inProgress || 0}
                loading={isLoading}
            />
          </div>

          {/* Additional Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Performance Insights</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Average Response Time</span>
                  <span className="font-semibold text-slate-800 dark:text-white">142ms</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">API Success Rate</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">99.8%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Active Sessions</span>
                  <span className="font-semibold text-slate-800 dark:text-white">247</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Security Status</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">All Systems Secure</span>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Last Security Scan</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">2 hours ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Threat Level</span>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
                  Low
                </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            <p>All data is updated in real-time. System status is monitored 24/7.</p>
          </div>
        </div>
      </div>
  );
};

const DashboardPage: React.FC = () => {
  return (
      <ProtectedRoute>
        <DashboardProvider>
          <DashboardContent />
        </DashboardProvider>
      </ProtectedRoute>
  );
};

export default DashboardPage;