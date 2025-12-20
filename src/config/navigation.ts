// src/config/navigation.ts
import { UserRole } from '@/utils/rbac';

export interface NavItem {
    title: string;
    href: string;
    icon: string;
    requiredRole: UserRole;
}

export const NAVIGATION_ITEMS: NavItem[] = [
    // --- General User (CUSTOMER is the minimum) ---
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: 'Home',
        requiredRole: UserRole.MANAGER,
    },
    {
        title: 'Reports',
        href: '/reports',
        icon: 'Reports',
        requiredRole: UserRole.MANAGER,
    },
    {
        title: 'My Account',
        href: '/account',
        icon: 'CreditCard',
        requiredRole: UserRole.CUSTOMER,
    },
    {
        title: 'Transactions',
        href: '/transactions',
        icon: 'Transfer',
        requiredRole: UserRole.CUSTOMER,
    },
    {
        title: 'Notifications',
        href: '/notifications',
        icon: 'Bell',
        requiredRole: UserRole.CUSTOMER,
    },
    {
        title: 'Support Tickets',
        href: '/tickets',
        icon: 'Ticket',
        requiredRole: UserRole.CUSTOMER,
    },

    // --- Manager/Admin Features (MANAGER is the minimum) ---
    {
        title: 'User Management',
        href: '/admin/users',
        icon: 'Users',
        requiredRole: UserRole.MANAGER,
    },
    {
        title: 'Account Control',
        href: '/admin/accounts',
        icon: 'Settings',
        requiredRole: UserRole.MANAGER,
    },
    {
        title: 'Pending Transactions',
        href: '/admin/transactions/pending',
        icon: 'Clock',
        requiredRole: UserRole.MANAGER,
    },
    {
        title: 'Ticket Management',
        href: '/admin/tickets',
        icon: 'ClipboardList',
        requiredRole: UserRole.MANAGER,
    },


    // --- (ADMIN is the minimum) ---
    {
        title: 'Audit Logs',
        href: '/audit',
        icon: 'Shield',
        requiredRole: UserRole.ADMIN,
    },
];