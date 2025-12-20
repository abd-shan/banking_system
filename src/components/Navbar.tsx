// src/components/Navbar.tsx
'use client';
import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';
import { useNotificationContext } from "@/context/NotificationContext";

export const Navbar = () => {
    const { isAuthenticated, fullName, role, logout } = useAuthContext();
    const { unreadCount } = useNotificationContext();

    return (
        <nav className="bg-slate-900 border-b border-slate-700 p-4 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">


                <div className="flex items-center gap-8">
                    <Link href="/" className="text-2xl font-extrabold tracking-tighter text-blue-400 hover:text-blue-300 transition">
                        BANK<span className="text-white">SYS</span>
                    </Link>

                    {isAuthenticated && (
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                            <Link href="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
                            {role === 'ADMIN' && (
                                <Link href="/admin/users" className="hover:text-blue-400 transition">Management</Link>
                            )}
                        </div>
                    )}
                </div>


                <div className="flex items-center gap-6">
                    {isAuthenticated ? (
                        <>

                            <Link href="/notifications" className="relative p-2 text-slate-300 hover:text-white transition">
                                <span className="text-sm font-medium">Notifications</span>
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-slate-900 animate-pulse">
                                      {unreadCount > 9 ? '+9' : unreadCount}
                                    </span>
                                )}
                            </Link>


                            <div className="flex flex-col items-end border-l border-slate-700 pl-6">
                                <span className="text-sm font-semibold text-slate-100">{fullName}</span>
                                <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">{role}</span>
                            </div>


                            <button
                                onClick={logout}
                                className="bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white px-4 py-2 rounded-md text-sm font-bold transition-all border border-slate-700 hover:border-red-500"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md text-sm font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                        >
                            Login to Account
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};