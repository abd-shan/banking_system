// src/context/NotificationContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NotificationState, Notification } from '@/types';
import { notificationSubject, NotificationObserver } from '@/utils/NotificationSubject';
import { readNotificationStorage } from '@/utils/readNotificationStorage';
import { bankFacade } from '@/facades/BankFacade';
import { useAuthContext } from './AuthContext';

interface NotificationContextType extends NotificationState {
    markAllAsRead: () => void;
    markOneAsRead: (id: string) => void;
    // Function to manually fetch and update state
    fetchNotifications: () => Promise<void>;
    isNotificationRead: (id: string) => boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuthContext();
    const [state, setState] = useState<NotificationState>(notificationSubject.getState());

    // Observer implementation
    const observer: NotificationObserver = {
        update: (newState) => {
            setState(newState);
        },
    };


    const calculateUnreadCount = (notifications: Notification[]): number => {
        const readIds = readNotificationStorage.getReadIds();
        const unreadNotifications = notifications.filter(n => !readIds.has(n.id));
        return unreadNotifications.length;
    };


    const fetchNotifications = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const notifications = await bankFacade.fetchLatestNotifications();


            const unreadCount = calculateUnreadCount(notifications);

            notificationSubject.setState({ notifications, unreadCount });
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    }, [isAuthenticated]);

    // Initial load and periodic polling (optional, but good for real-time feel)
    useEffect(() => {
        notificationSubject.attach(observer);
        fetchNotifications();


        const intervalId = setInterval(fetchNotifications, 60000);

        return () => {
            notificationSubject.detach(observer);
            clearInterval(intervalId);
        };
    }, [fetchNotifications]);



    const markAllAsRead = useCallback(() => {
        if (state.notifications.length === 0) return;

        const allIds = state.notifications.map(n => n.id);
        readNotificationStorage.markManyAsRead(allIds);


        notificationSubject.setState({ unreadCount: 0 });
    }, [state.notifications]);

    const markOneAsRead = useCallback((id: string) => {
        if (readNotificationStorage.isRead(id)) return;

        readNotificationStorage.markOneAsRead(id);


        const currentReadIds = readNotificationStorage.getReadIds();
        const newUnreadCount = state.notifications.filter(n => !currentReadIds.has(n.id)).length;

        notificationSubject.setState({ unreadCount: newUnreadCount });
    }, [state.notifications]);


    const isNotificationRead = useCallback((id: string): boolean => {
        return readNotificationStorage.isRead(id);
    }, []);

    const contextValue: NotificationContextType = {
        ...state,
        markAllAsRead,
        markOneAsRead,
        fetchNotifications,
        isNotificationRead,
    };

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotificationContext must be used within a NotificationProvider');
    }
    return context;
};