import {apiClient} from './ApiClient';
import {
    Ticket,
    CreateTicketDto,
    ApiResponse,
    ApiError
} from '@/types';

export class TicketService {
    async createTicket(dto: CreateTicketDto): Promise<ApiResponse<Ticket>> {
        try {
            const response = await apiClient.post('/tickets', dto);
            return {
                success: true,
                data: response.data,
                timestamp: new Date().toISOString()
            };
        } catch (error: any) {
            const apiError: ApiError = {
                message: error.response?.data?.message || 'Failed to create ticket',
                code: error.response?.status || 500,
                timestamp: new Date().toISOString(),
                details: error.response?.data
            };
            throw apiError;
        }
    }

    async getMyTickets(page: number = 1, limit: number = 20): Promise<ApiResponse<Ticket[]>> {
        try {
            const response = await apiClient.get('/tickets/my', {
                params: { page, limit }
            });
            return {
                success: true,
                data: response.data,
                timestamp: new Date().toISOString()
            };
        } catch (error: any) {
            const apiError: ApiError = {
                message: error.response?.data?.message || 'Failed to fetch tickets',
                code: error.response?.status || 500,
                timestamp: new Date().toISOString()
            };
            throw apiError;
        }
    }


}

