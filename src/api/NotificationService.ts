// src/api/NotificationService.ts
import { apiClient } from './ApiClient';
import { Notification } from '@/types';

export class NotificationService {
    private readonly endpoint = '/notifications';

    /**
     * GET /notifications/latest - Fetches the latest notifications for the active user.
     * @returns A promise that resolves to an array of Notification objects.
     */
    async getLatestNotifications(): Promise<Notification[]> {
        const response = await apiClient.get<Notification[]>(`${this.endpoint}/latest`);
        return response.data;
    }


}