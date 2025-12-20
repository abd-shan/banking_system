// src/utils/NotificationSubject.ts
import { NotificationState, Notification } from '@/types';

export interface NotificationObserver {
    update: (state: NotificationState) => void;
}

class NotificationSubject {
    private observers: NotificationObserver[] = [];
    private state: NotificationState = {
        notifications: [],
        unreadCount: 0,
    };


    attach(observer: NotificationObserver): void {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }


    detach(observer: NotificationObserver): void {
        this.observers = this.observers.filter((obs) => obs !== observer);
    }


    getState(): NotificationState {
        return this.state;
    }


    setState(newState: Partial<NotificationState>): void {
        this.state = { ...this.state, ...newState };
        this.notify();
    }

    private notify(): void {
        this.observers.forEach((observer) => observer.update(this.state));
    }
}


export const notificationSubject = new NotificationSubject();