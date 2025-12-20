import {apiClient} from './ApiClient';
import {
    TransactionReport,
    AccountReport,
    AuditReport,
    ReportSnapshot,
    ApiResponse,
    ApiError
} from '@/types';

export class ReportService {
    async getTransactionsReport(
        from: string,
        to: string,
        page: number = 1,
        limit: number = 50
    ): Promise<ApiResponse<TransactionReport[]>> {
        try {
            const response = await apiClient.get('/dashboard/reports/transactions', {
                params: { from, to,  }
            });
            return {
                success: true,
                data: response.data,
                timestamp: new Date().toISOString()
            };
        } catch (error: any) {
            const apiError: ApiError = {
                message: error.response?.data?.message || 'Failed to fetch transactions report',
                code: error.response?.status || 500,
                timestamp: new Date().toISOString(),
                details: error.response?.data
            };
            throw apiError;
        }
    }

    async getAccountsReport(
        page: number = 1,
        limit: number = 50
    ): Promise<ApiResponse<AccountReport[]>> {
        try {
            const response = await apiClient.get('/dashboard/reports/accounts', {
                params: { page, limit }
            });
            return {
                success: true,
                data: response.data,
                timestamp: new Date().toISOString()
            };
        } catch (error: any) {
            const apiError: ApiError = {
                message: error.response?.data?.message || 'Failed to fetch accounts report',
                code: error.response?.status || 500,
                timestamp: new Date().toISOString()
            };
            throw apiError;
        }
    }

    async getAuditReport(
        from: string,
        to: string,
        page: number = 1,
        limit: number = 50
    ): Promise<ApiResponse<AuditReport[]>> {
        try {
            const response = await apiClient.get('/dashboard/reports/audit', {
                params: { from, to}
            });
            return {
                success: true,
                data: response.data,
                timestamp: new Date().toISOString()
            };
        } catch (error: any) {
            const apiError: ApiError = {
                message: error.response?.data?.message || 'Failed to fetch audit report',
                code: error.response?.status || 500,
                timestamp: new Date().toISOString()
            };
            throw apiError;
        }
    }

    async getSnapshotReport(): Promise<ApiResponse<ReportSnapshot>> {
        try {
            const response = await apiClient.get('/dashboard/reports/snapshot');
            return {
                success: true,
                data: response.data,
                timestamp: new Date().toISOString()
            };
        } catch (error: any) {
            const apiError: ApiError = {
                message: error.response?.data?.message || 'Failed to fetch snapshot report',
                code: error.response?.status || 500,
                timestamp: new Date().toISOString()
            };
            throw apiError;
        }
    }

    async generateReportPDF(reportType: string, data: any): Promise<Blob> {
        try {
            const response = await apiClient.post(`/dashboard/reports/export/${reportType}/pdf`,
                data,
                { responseType: 'blob' }
            );
            return response.data;
        } catch (error: any) {
            const apiError: ApiError = {
                message: error.response?.data?.message || 'Failed to generate PDF report',
                code: error.response?.status || 500,
                timestamp: new Date().toISOString()
            };
            throw apiError;
        }
    }

    async exportReportCSV(reportType: string, data: any): Promise<Blob> {
        try {
            const response = await apiClient.post(`/dashboard/reports/export/${reportType}/csv`,
                data,
                { responseType: 'blob' }
            );
            return response.data;
        } catch (error: any) {
            const apiError: ApiError = {
                message: error.response?.data?.message || 'Failed to export CSV report',
                code: error.response?.status || 500,
                timestamp: new Date().toISOString()
            };
            throw apiError;
        }
    }
}


