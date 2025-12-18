// src/api/ApiClient.ts
import axios, { AxiosInstance } from 'axios';

// The base URL for the NestJS backend.
// In a real application, this would be loaded from environment variables.
const BASE_URL = 'http://localhost:3000'; 

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Important for sending cookies/session data
    });

    // Request interceptor to attach the JWT token from local storage or a cookie
    this.client.interceptors.request.use(
      (config) => {
        // Assuming the token is stored in localStorage for simplicity in this example
        // In a real Next.js app, secure storage (like httpOnly cookies) should be used
        const token = localStorage.getItem('accessToken'); 
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for global error handling (e.g., 401 Unauthorized)
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Handle unauthorized access, e.g., redirect to login page
          console.error('Unauthorized access. Redirecting to login.');
          // In a real app, you would use Next.js router here:
          // router.push('/login'); 
        }
        return Promise.reject(error);
      }
    );
  }

  public getClient(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient().getClient();
