// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { bankFacade } from '@/facades/BankFacade';
import { LoginDto, User, AuthResponse } from '@/types';
import { useRouter } from 'next/navigation';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  const router = useRouter();

  // Function to load user from storage (e.g., local storage or cookie)
  const loadUser = useCallback(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');
      if (storedUser && token) {
        const user: User = JSON.parse(storedUser);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    } catch (e) {
      console.error('Error loading user from storage:', e);
      setState((s) => ({ ...s, isLoading: false, user: null, isAuthenticated: false }));
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (credentials: LoginDto) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const response: AuthResponse = await bankFacade.login(credentials);
      
      // Store user data and token
      localStorage.setItem('user', JSON.stringify(response.user));
      // Token is already stored in ApiClient interceptor, but we'll keep it here for clarity
      localStorage.setItem('accessToken', response.accessToken); 

      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      router.push('/dashboard'); // Redirect to dashboard on successful login
    } catch (e: any) {
      const errorMessage = e.response?.data?.message || 'Login failed. Please check your credentials.';
      setState((s) => ({ ...s, isLoading: false, error: errorMessage }));
    }
  }, [router]);

  const logout = useCallback(() => {
    bankFacade.logout();
    localStorage.removeItem('user');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    router.push('/login'); // Redirect to login page on logout
  }, [router]);

  return {
    ...state,
    login,
    logout,
    loadUser,
  };
};
