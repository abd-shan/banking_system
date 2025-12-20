import axios, { AxiosError } from 'axios';
import { tokenStorage } from '@/auth/tokenStorage';

export const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

/* ================================
   Request Interceptor
================================ */
apiClient.interceptors.request.use(
    (config) => {
        const token = tokenStorage.getActiveToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

/* ================================
   Response Interceptor (401 Handler)
================================ */
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            console.warn('[API] 401 Unauthorized');


            try {
                tokenStorage.switchAccount(null as any); // سنحسّنها بعد قليل
            } catch {
                // ignore
            }



            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    },
);
