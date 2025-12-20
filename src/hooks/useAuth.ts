// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { bankFacade } from '@/facades/BankFacade';
import { LoginDto, User } from '@/types';
import { tokenStorage } from '@/auth/tokenStorage';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  role: string | null;
  fullName: string | null;
  user: User | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
    role: null,
    fullName: null,
    user: null,
  });

  const router = useRouter();

  useEffect(() => {
    const token = tokenStorage.getActiveToken();
    const role = tokenStorage.getActiveRole();
    const name = tokenStorage.getActiveName();

    setState({
      isAuthenticated: Boolean(token),
      isLoading: false,
      error: null,
      role: role,
      fullName: name,
      user: token ? { email: '', role: role as any, firstName: name || '', id: '', lastName: '' } : null,

    });
  }, []);

  const login = useCallback(async (credentials: LoginDto) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const result = await bankFacade.login(credentials);

      tokenStorage.saveToken(
          result.accountNumber,
          result.token,
          result.role,
          result.meta.fullName
      );

      setState({
        isAuthenticated: true,
        isLoading: false,
        error: null,
        role: result.role,
        fullName: result.meta.fullName,
        user: { email: credentials.email, role: result.role, firstName: result.meta.fullName, id: '', lastName: '' }
      });

      router.replace('/account');
    } catch (e: any) {
      setState((s) => ({
        ...s,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: e.response?.data?.message || 'Login failed',
      }));
    }
  }, [router]);

  const logout = useCallback(() => {
    bankFacade.logout();
    tokenStorage.clearAll();
    setState({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      role: null,
      fullName: null,
      user: null,
    });
    router.push('/login');
  }, [router]);


  const switchAccount = useCallback((accountNumber: number) => {
    if (tokenStorage.hasToken(accountNumber)) {
      tokenStorage.switchAccount(accountNumber);

      window.location.reload();
    } else {
      router.push('/login');
    }
  }, [router]);

  return { ...state, login, logout, switchAccount };
};