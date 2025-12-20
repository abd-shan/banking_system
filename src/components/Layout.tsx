// src/components/Layout.tsx
'use client';

import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { AuthProvider } from '@/context/AuthContext';

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (

            <div className="min-h-screen flex flex-col overflow-hidden">
                <Navbar />
                <div className="flex flex-grow">
                    <Sidebar />
                    <main className="flex-grow p-4">
                        {children}
                    </main>
                </div>
                <footer className="bg-gray-800 text-white p-4 text-center text-sm">
                    Bank Management System Frontend
                </footer>
            </div>

    );
};