// src/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { NAVIGATION_ITEMS } from '@/config/navigation';
import { hasRequiredRole, UserRole } from '@/utils/rbac';
import {AccountSwitcher} from "@/components/AccountSwitcher";


const Icon = ({ name }: { name: string }) => <span className="w-5 h-5 mr-3">{name[0]}</span>;

export const Sidebar = () => {
    const pathname = usePathname();
    const { role } = useAuthContext();


    const activeRole = role || UserRole.CUSTOMER;

    const filteredItems = NAVIGATION_ITEMS.filter((item) =>
        hasRequiredRole(activeRole, item.requiredRole)
    );

    return (
        <div className="flex flex-col w-64 bg-gray-800 text-white flex-shrink-0 p-4">
            <div className="text-2xl font-bold mb-8 text-blue-400">Bank Admin</div>

            <nav className="flex-grow">
                {filteredItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center py-2 px-4 rounded-lg transition-colors mb-2 
                            ${isActive
                                ? 'bg-blue-600 text-white font-semibold'
                                : 'hover:bg-gray-700 text-gray-300'
                            }`}
                        >

                            {item.title}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                    Current Role: <span className="font-semibold text-yellow-400">{activeRole}</span>
                </p>
                {/* Placeholder for Account Switcher component */}
                <div className="mt-2">
                     <AccountSwitcher />
                </div>
            </div>
        </div>
    );
};