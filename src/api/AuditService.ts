// src/api/AuditService.ts
import { apiClient } from './ApiClient';
import { AuditLog, PaginatedResponse } from '@/types';

export class AuditService {
    private readonly endpoint = '/audit/audit';

    async getLogs(page: number = 1, limit: number = 10): Promise<PaginatedResponse<AuditLog>> {
        const response = await apiClient.get<PaginatedResponse<AuditLog>>(this.endpoint, {
            params: { page, limit },
        });
        return response.data;
    }
}