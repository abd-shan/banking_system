// src/components/ProtectedRoute.tsx
'use client';

import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[]; // Optional array of roles allowed to access this route
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/login');
    } else if (!isLoading && isAuthenticated && allowedRoles && user && !allowedRoles.includes(user.role)) {
      // Redirect to a forbidden page or dashboard if role is not allowed
      console.warn(`User role ${user.role} not allowed on this route.`);
      router.push('/dashboard'); // Or a dedicated /forbidden page
    }
  }, [isAuthenticated, isLoading, router, allowedRoles, user]);

  if (isLoading || !isAuthenticated || (allowedRoles && user && !allowedRoles.includes(user.role))) {
    // Show a loading spinner or null while checking auth status
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return <>{children}</>;
};
