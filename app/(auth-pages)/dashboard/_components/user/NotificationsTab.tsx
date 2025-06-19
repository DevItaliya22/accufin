import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import toast from "react-hot-toast";

type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

type NotificationsTabProps = {
  notifications: Notification[];
  isLoading: boolean;
  setNotifications: (notifications: Notification[]) => void;
  setIsLoading: (isLoading: boolean) => void;
};

export default function NotificationsTab({
  notifications,
  isLoading,
  setNotifications,
  setIsLoading,
}: NotificationsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Stay updated with your document status and admin responses
        </CardDescription>
        {notifications.length > 0 && notifications.some((n) => !n.isRead) && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={async () => {
              try {
                const res = await fetch("/api/user/notification/read", {
                  method: "POST",
                });
                if (!res.ok) throw new Error("Failed to mark as read");
                toast.success("All notifications marked as read!");
                // Refresh notifications
                setIsLoading(true);
                fetch("/api/user/notification")
                  .then((res) => (res.ok ? res.json() : []))
                  .then((data) => setNotifications(data))
                  .finally(() => setIsLoading(false));
              } catch (err) {
                toast.error("Failed to mark notifications as read");
              }
            }}
          >
            Mark all as read
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg ${
                  !notification.isRead
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <p
                      className={`$${
                        !notification.isRead ? "font-medium" : ""
                      } break-words`}
                    >
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 break-words">
                      {notification.message}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(notification.createdAt).toLocaleDateString()}
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
      </CardContent>
    </Card>
  );
}
