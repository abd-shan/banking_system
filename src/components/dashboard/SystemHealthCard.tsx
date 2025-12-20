import React from 'react';
import { Server, Database, Cpu, MemoryStick, Activity } from 'lucide-react';

interface SystemHealthCardProps {
    uptime: number;
    memory: {
        rss: number;
        heapTotal: number;
        heapUsed: number;
        external: number;
        arrayBuffers: number;
    };
    timestamp: string;
    db: string;
    formatUptime: (seconds: number) => string;
    loading?: boolean;
}

const SystemHealthCard: React.FC<SystemHealthCardProps> = ({
                                                               uptime,
                                                               memory,
                                                               timestamp,
                                                               db,
                                                               formatUptime,
                                                               loading = false
                                                           }) => {
    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl border p-6 shadow-sm animate-pulse">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-6"></div>
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const memoryUsagePercentage = (memory.heapUsed / memory.heapTotal) * 100;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-500/10 rounded-lg">
                    <Server className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">System Health</h3>
                <div className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${
                    db === 'UP'
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
                        : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                }`}>
                    {db === 'UP' ? 'Online' : 'Offline'}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Uptime</span>
                    </div>
                    <span className="font-mono text-sm font-semibold text-slate-800 dark:text-white">
            {formatUptime(uptime)}
          </span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MemoryStick className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Memory Usage</span>
                    </div>
                    <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold text-slate-800 dark:text-white">
              {formatBytes(memory.heapUsed)} / {formatBytes(memory.heapTotal)}
            </span>
                        <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                                className={`h-full rounded-full ${
                                    memoryUsagePercentage > 80
                                        ? 'bg-red-500'
                                        : memoryUsagePercentage > 60
                                            ? 'bg-orange-500'
                                            : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(memoryUsagePercentage, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">RSS Memory</span>
                    </div>
                    <span className="font-mono text-sm font-semibold text-slate-800 dark:text-white">
            {formatBytes(memory.rss)}
          </span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Database</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        db === 'UP'
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}>
                        {db}
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-right">
                        Last checked: {new Date(timestamp).toLocaleTimeString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SystemHealthCard;