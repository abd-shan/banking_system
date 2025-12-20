import {Notification} from "@/types";
import {useNotificationContext} from "@/context/NotificationContext";

export const NotificationItem = ({ notification }: { notification: Notification }) => {
    const { isNotificationRead, markOneAsRead } = useNotificationContext();
    const isRead = isNotificationRead(notification.id);

    const handleMarkAsRead = () => {
        markOneAsRead(notification.id);
    };

    return (
        <div
            className={`p-4 mb-3 rounded-lg shadow-md transition-all duration-200 ${!isRead ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-white border-l-4 border-gray-200 opacity-70'}`}
        >
            <div className="flex justify-between items-start">
                <p className={`font-medium ${!isRead ? 'text-gray-800' : 'text-gray-500'}`}>{notification.message}</p>
                <span className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</span>
            </div>
            {!isRead && (
                <button
                    onClick={handleMarkAsRead}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-semibold"
                >
                    Mark as Read
                </button>
            )}
        </div>
    );
};
