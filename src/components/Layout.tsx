// src/components/Layout.tsx
'use client';

import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { AuthProvider } from '@/context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>
        <footer className="bg-gray-800 text-white p-4 text-center text-sm">
            Bank Management System Frontend (Next.js + Facade Pattern)
        </footer>
      </div>
    </AuthProvider>
  );
};
