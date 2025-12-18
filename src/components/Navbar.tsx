// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthContext();

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Bank Management
        </Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm">Welcome, {user?.firstName || user?.email} ({user?.role})</span>
              <Link href="/dashboard" className="hover:text-gray-300">
                Dashboard
              </Link>
              {user?.role === 'ADMIN' && (
                <Link href="/admin/users" className="hover:text-gray-300">
                  User Management
                </Link>
              )}
              <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:text-gray-300">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
