import {apiClient} from './ApiClient';
import {
    DashboardMetrics,
    DashboardHealth,
    DashboardTickets,
    ApiResponse,
    ApiError
} from '@/types';

export class DashboardService {
    async getMetrics(): Promise<ApiResponse<DashboardMetrics>> {
        try {
            const response = await apiClient.get('/dashboard/metrics');
            return {
                success: true,
                data: response.data,
                timestamp: new Date().toISOString()
            };
        } catch (error: any) {
            const apiError: ApiError = {
                message: error.response?.data?.message || 'Failed to fetch dashboard metrics',
                code: error.response?.status || 500,
                timestamp: new Date().toISOString()
            };
            throw apiError;
        }
    }

    async getHealth(): Promise<ApiResponse<DashboardHealth>> {
        try {
            const response = await apiClient.get('/dashboard/health');
            return {
                success: true,
                data: response.data,
                timestamp: new Date().toISOString()
            };
        } catch (error: any) {
            const apiError: ApiError = {
                message: error.response?.data?.message || 'Failed to fetch system health',
                code: error.response?.status || 500,
                timestamp: new Date().toISOString()
            };
            throw apiError;
        }
    }

    async getTickets(): Promise<ApiResponse<DashboardTickets>> {
        try {
            const response = await apiClient.get('/dashboard/tickets');
            return {
                success: true,
                data: response.data,
                timestamp: new Date().toISOString()
            };
        } catch (error: any) {
            const apiError: ApiError = {
                message: error.response?.data?.message || 'Failed to fetch tickets data',
                code: error.response?.status || 500,
                timestamp: new Date().toISOString()
            };
            throw apiError;
        }
    }

    async getAllDashboardData(): Promise<{
        metrics: DashboardMetrics;
        health: DashboardHealth;
        tickets: DashboardTickets;
    }> {
        try {
            const [metricsResponse, healthResponse, ticketsResponse] = await Promise.all([
                this.getMetrics(),
                this.getHealth(),
                this.getTickets()
            ]);

            return {
                metrics: metricsResponse.data,
                health: healthResponse.data,
                tickets: ticketsResponse.data
            };
        } catch (error: any) {
            const apiError: ApiError = {
                message: 'Failed to fetch complete dashboard data',
                code: error.code || 500,
                timestamp: new Date().toISOString()
            };
            throw apiError;
        }
    }
}

export const dashboardService = new DashboardService();