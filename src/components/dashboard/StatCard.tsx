import React from 'react';
import {
    Users,
    CreditCard,
    DollarSign,
    Activity,
    Clock,
    AlertCircle,
    TrendingUp,
    Shield,
    CheckCircle2
} from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    icon?: React.ReactNode;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo';
    loading?: boolean;
}

const iconMap = {
    users: <Users className="h-6 w-6" />,
    accounts: <CreditCard className="h-6 w-6" />,
    balance: <DollarSign className="h-6 w-6" />,
    transactions: <Activity className="h-6 w-6" />,
    approvals: <Clock className="h-6 w-6" />,
    alert: <AlertCircle className="h-6 w-6" />,
    trend: <TrendingUp className="h-6 w-6" />,
    shield: <Shield className="h-6 w-6" />,
    check: <CheckCircle2 className="h-6 w-6" />
};

const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    green: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    red: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
};

const StatCard: React.FC<StatCardProps> = ({
                                               title,
                                               value,
                                               change,
                                               icon,
                                               color = 'blue',
                                               loading = false
                                           }) => {
    if (loading) {
        return (
            <div className={`bg-white dark:bg-slate-800 rounded-xl border p-6 shadow-sm animate-pulse`}>
                <div className="flex justify-between items-start mb-4">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                    <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                </div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-2"></div>
                {change && <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>}
            </div>
        );
    }

    return (
        <div className={`bg-white dark:bg-slate-800 rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow duration-300 ${colorClasses[color]}`}>
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    {title}
                </h3>
                <div className={`p-2 rounded-lg ${colorClasses[color].split(' ')[0]}`}>
                    {icon}
                </div>
            </div>

            <div className="mb-1">
        <span className="text-2xl font-bold text-slate-800 dark:text-white">
          {value}
        </span>
            </div>

            {change && (
                <div className="text-sm font-medium flex items-center gap-1">
                    <span className="text-green-600 dark:text-green-400">+{change}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-xs">from last month</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;