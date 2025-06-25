import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Bell, Clock, Check, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import toast from "react-hot-toast";

type NotificationRecord = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

type NotificationManagementProps = {
  notifications: NotificationRecord[];
  isLoading: boolean;
  setNotifications: (notifications: NotificationRecord[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  handleMarkAllAsRead: () => void;
};

export default function NotificationManagement({
  notifications,
  isLoading,
  setNotifications,
  handleMarkAllAsRead,
  setIsLoading,
}: NotificationManagementProps) {
  const [markingAsRead, setMarkingAsRead] = React.useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Admin Notifications
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread messages`
              : "You're all caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            disabled={markingAsRead}
            onClick={async () => {
              setMarkingAsRead(true);

              // Store original state for potential rollback
              const originalNotifications = [...notifications];

              // Optimistic update - mark all as read immediately
              const optimisticNotifications = notifications.map(
                (notification) => ({
                  ...notification,
                  isRead: true,
                })
              );
              setNotifications(optimisticNotifications);

              try {
                await handleMarkAllAsRead();
                toast.success("All notifications marked as read!");
              } catch (err) {
                // Rollback on failure
                setNotifications(originalNotifications);
                toast.error("Failed to mark notifications as read");
              } finally {
                setMarkingAsRead(false);
              }
            }}
          >
            {markingAsRead ? (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Marking as read...</span>
              </div>
            ) : (
              "Mark all as read"
            )}
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
            <div
              className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-7 h-7 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No notifications yet
          </h3>
          <p className="text-gray-500">
            We'll notify you when something important happens.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <div
              key={notification.id}
              className={`group relative bg-white border rounded-xl p-4 transition-all duration-200 hover:shadow-md ${
                !notification.isRead
                  ? "border-blue-200 shadow-sm"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              style={{
                animation: `slideIn 0.3s ease-out ${index * 50}ms both`,
              }}
            >
              {/* Unread indicator */}
              {!notification.isRead && (
                <div className="absolute left-0 top-4 w-1 h-8 bg-blue-500 rounded-r-full"></div>
              )}

              <div className="flex items-start space-x-3 pl-3">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${
                    !notification.isRead ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  {!notification.isRead ? (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  ) : (
                    <Check className="w-4 h-4 text-gray-500" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium leading-5 ${
                          !notification.isRead
                            ? "text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        {notification.message}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(notification.createdAt)}
                      </div>
                    </div>

                    {/* Options button */}
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Add styles
const styles = `
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

if (typeof document !== "undefined") {
  const existingStyle = document.getElementById("admin-notifications-styles");
  if (!existingStyle) {
    const styleSheet = document.createElement("style");
    styleSheet.id = "admin-notifications-styles";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  }
}
