import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Bell } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
}

interface NotificationManagementProps {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  onMarkAllAsRead: () => Promise<void>;
}

export default function NotificationManagement({
  notifications,
  loading,
  error,
  onMarkAllAsRead,
}: NotificationManagementProps) {
  const handleMarkAllAsRead = async () => {
    try {
      await onMarkAllAsRead();
      toast.success("All notifications marked as read!");
    } catch (err) {
      toast.error("Failed to mark notifications as read");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Notifications</CardTitle>
        <CardDescription>
          System alerts and user activity updates
        </CardDescription>
        {notifications.length > 0 && notifications.some((n) => !n.isRead) && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Loader size={48} className="mb-2 text-blue-500" />
            Loading notifications...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg ${
                    !notification.isRead
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p
                      className={`${!notification.isRead ? "font-medium" : ""}`}
                    >
                      {notification.message}
                    </p>
                    <span className="text-xs text-gray-500">
                      {notification.createdAt
                        ? new Date(notification.createdAt).toLocaleString()
                        : ""}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No Notifications</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
