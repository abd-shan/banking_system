// src/utils/readNotificationStorage.ts

const READ_NOTIFICATIONS_KEY = 'READ_NOTIFICATIONS';


function getReadIds(): Set<string> {
    if (typeof window === 'undefined') return new Set();
    const raw = localStorage.getItem(READ_NOTIFICATIONS_KEY);
    try {
        const array = raw ? JSON.parse(raw) : [];

        return new Set(array.filter((id: any) => typeof id === 'string'));
    } catch {
        return new Set();
    }
}


function setReadIds(ids: Set<string>): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(Array.from(ids)));
}

export const readNotificationStorage = {
    getReadIds,


    markOneAsRead(id: string): Set<string> {
        const ids = getReadIds();
        ids.add(id);
        setReadIds(ids);
        return ids;
    },



    markManyAsRead(newIds: string[]): Set<string> {
        const ids = getReadIds();
        newIds.forEach(id => ids.add(id));
        setReadIds(ids);
        return ids;
    },



    isRead(id: string): boolean {
        return getReadIds().has(id);
    },



    clearAll(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(READ_NOTIFICATIONS_KEY);
    }
};