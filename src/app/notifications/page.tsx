// src/app/notifications/page.tsx
'use client';

import { useNotificationContext } from '@/context/NotificationContext';
import { Notification } from '@/types';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {NotificationItem} from "@/components/NotificationItem";


export default function Page() {
    const { isAuthenticated, isLoading } = useAuthContext();
    const router = useRouter();
    const { notifications, unreadCount, markAllAsRead } = useNotificationContext();




    if (isLoading) {
        return <div className="text-center py-10">Loading...</div>;
    }


    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
                <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-lg font-medium text-gray-600">Unread: {unreadCount}</span>
                    <button
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition"
                    >
                        Mark All as Read
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 text-lg">
                        You have no notifications.
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                        />
                    ))
                )}
            </div>
        </div>
    );
}