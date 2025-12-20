import React from 'react';
import {
    Download,
    Printer,
    Filter,
    RefreshCw,
    Calendar,
    FileText,
    BarChart3
} from 'lucide-react';
import { useReport } from '@/context/ReportContext';

interface ReportHeaderProps {
    title: string;
    description: string;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({
                                                       title,
                                                       description,
                                                       activeTab,
                                                       onTabChange
                                                   }) => {
    const {
        filters,
        setFilters,
        refreshReports,
        isLoading,
        exportToPDF,
        exportToCSV,
        printReport
    } = useReport();

    const tabs = [
        { id: 'transactions', label: 'Transactions', icon: <FileText className="h-4 w-4" /> },
        { id: 'accounts', label: 'Accounts', icon: <BarChart3 className="h-4 w-4" /> },
        { id: 'audit', label: 'Audit Logs', icon: <Filter className="h-4 w-4" /> },
        { id: 'snapshot', label: 'Snapshot', icon: <Calendar className="h-4 w-4" /> }
    ];

    const handleDateChange = (field: 'from' | 'to', value: string) => {
        setFilters({
            dateRange: {
                ...filters.dateRange,
                [field]: value
            }
        });
    };

    const handleExport = (format: 'PDF' | 'CSV') => {
        if (format === 'PDF') {
            exportToPDF(activeTab);
        } else {
            exportToCSV(activeTab);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm mb-6 print:hidden">

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{title}</h1>
                <p className="text-slate-600 dark:text-slate-400">{description}</p>
            </div>


            <div className="mb-6 border-b border-slate-200 dark:border-slate-700">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
                                activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>


            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-slate-500" />
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="flex flex-col">
                                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    From Date
                                </label>
                                <input
                                    type="date"
                                    value={filters.dateRange.from.split('T')[0]}
                                    onChange={(e) => handleDateChange('from', `${e.target.value}T00:00:00.000Z`)}
                                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    To Date
                                </label>
                                <input
                                    type="date"
                                    value={filters.dateRange.to.split('T')[0]}
                                    onChange={(e) => handleDateChange('to', `${e.target.value}T23:59:59.999Z`)}
                                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>


                <div className="flex items-center gap-3">
                    <button
                        onClick={() => refreshReports()}
                        disabled={isLoading.transactions || isLoading.accounts || isLoading.audit}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg font-medium text-sm transition-colors duration-300 flex items-center gap-2 disabled:opacity-50"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading.transactions ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>

                    {/*<div className="relative group">*/}
                    {/*    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm transition-colors duration-300 flex items-center gap-2">*/}
                    {/*        <Download className="h-4 w-4" />*/}
                    {/*        Export*/}
                    {/*    </button>*/}
                    {/*    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">*/}
                    {/*        <button*/}
                    {/*            onClick={() => handleExport('PDF')}*/}
                    {/*            className="w-full px-4 py-3 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-t-lg flex items-center gap-2"*/}
                    {/*        >*/}
                    {/*            <FileText className="h-4 w-4" />*/}
                    {/*            Export as PDF*/}
                    {/*        </button>*/}
                    {/*        <button*/}
                    {/*            onClick={() => handleExport('CSV')}*/}
                    {/*            className="w-full px-4 py-3 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-b-lg flex items-center gap-2"*/}
                    {/*        >*/}
                    {/*            <Download className="h-4 w-4" />*/}
                    {/*            Export as CSV*/}
                    {/*        </button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    <button
                        onClick={() => printReport(activeTab)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-lg font-medium text-sm transition-colors duration-300 flex items-center gap-2"
                    >
                        <Printer className="h-4 w-4" />
                        Print
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportHeader;