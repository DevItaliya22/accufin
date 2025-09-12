"use client";
import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { s3 } from "@/lib/s3";
import toast from "react-hot-toast";
import BlogManagement from "./BlogManagement";
import TestimonialsManagement from "./TestimonialsManagement";
import OpenContactsManagement from "./OpenContactsManagement";
import FormsManagement from "./FormsManagement";
import NotificationManagement from "./NotificationManagement";
import FileManagement from "./FileManagement";
import DashboardHeader from "./DashboardHeader";
import ProfileManagement from "./ProfileManagement";
import UserManagement from "./UserManagement";

export default function AdminDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<
    | "users"
    | "files"
    | "notifications"
    | "blogs"
    | "testimonials"
    | "contacts"
    | "forms"
    | "profile"
  >("users");

  // Check for tab parameter in URL and set active tab
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (
      tabParam &&
      [
        "users",
        "files",
        "notifications",
        "blogs",
        "testimonials",
        "contacts",
        "forms",
        "profile",
      ].includes(tabParam)
    ) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  // Loading and error states
  const [usersLoading, setUsersLoading] = useState(true);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // User details
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [userDetailsError, setUserDetailsError] = useState<string | null>(null);

  const { data: session } = useSession();

  // Private file upload state
  const [privateUploadLoading, setPrivateUploadLoading] = useState(false);
  const [privateUploadFile, setPrivateUploadFile] = useState<File | null>(null);
  const privateFileInputRef = useRef<HTMLInputElement>(null);

  // Response file upload state
  const [responseUploadLoading, setResponseUploadLoading] = useState(false);
  const [responseUploadFile, setResponseUploadFile] = useState<File | null>(
    null
  );
  const responseFileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Add userDetailsCache and prefetching state
  const [userDetailsCache, setUserDetailsCache] = useState<{
    [userId: string]: any;
  }>({});
  const [prefetching, setPrefetching] = useState(false);

  // Fetch users and notifications on mount (independently)
  useEffect(() => {
    setError(null);
    setUsersLoading(true);
    setNotificationsLoading(true);

    // Users
    fetch("/api/admin/get-users")
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Failed to fetch users")
      )
      .then((usersData) => {
        setUsers(usersData);
      })
      .catch((err) => {
        setError(typeof err === "string" ? err : "Failed to load data");
      })
      .finally(() => {
        setUsersLoading(false);
      });

    // Notifications
    fetch("/api/admin/notification")
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Failed to fetch notifications")
      )
      .then((notificationsData) => {
        setNotifications(notificationsData);
      })
      .catch(() => {
        // We intentionally don't set global error here to avoid blocking users UI
      })
      .finally(() => {
        setNotificationsLoading(false);
      });
  }, []);

  // After users are loaded, prefetch user details with concurrency limit
  useEffect(() => {
    if (users.length === 0) return;
    setPrefetching(true);
    let isCancelled = false;
    const concurrency = 3;
    let index = 0;
    let active = 0;
    const cache: { [userId: string]: any } = {};

    function fetchNext() {
      if (isCancelled || index >= users.length) return;
      while (active < concurrency && index < users.length) {
        const userId = users[index].id;
        index++;
        active++;
        fetch(`/api/admin/user-details/${userId}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data && !isCancelled) {
              cache[userId] = data;
              setUserDetailsCache((prev) => ({ ...prev, [userId]: data }));
            }
          })
          .catch(() => {})
          .finally(() => {
            active--;
            if (index < users.length) {
              fetchNext();
            } else if (active === 0) {
              setPrefetching(false);
            }
          });
      }
    }
    fetchNext();
    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  // When a user is selected, check cache first
  useEffect(() => {
    if (!selectedUser) return;
    if (userDetailsCache[selectedUser]) {
      setUserDetails(userDetailsCache[selectedUser]);
      setUserDetailsLoading(false);
      setUserDetailsError(null);
      return;
    }
    setUserDetailsLoading(true);
    setUserDetailsError(null);
    setUserDetails(null);
    fetch(`/api/admin/user-details/${selectedUser}`)
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Failed to fetch user details")
      )
      .then((data) => {
        setUserDetails(data);
        setUserDetailsCache((prev) => ({ ...prev, [selectedUser]: data }));
        setUserDetailsLoading(false);
      })
      .catch((err) => {
        setUserDetailsError(
          typeof err === "string" ? err : "Failed to load user details"
        );
        setUserDetailsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  // Handler functions to pass to child components
  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handlePrivateFileSelect = (file: File | null) => {
    setPrivateUploadFile(file);
  };

  const handleResponseFileSelect = (file: File | null) => {
    setResponseUploadFile(file);
  };

  const handleMarkAllNotificationsAsRead = async () => {
    const res = await fetch("/api/admin/notification/read", { method: "POST" });
    if (!res.ok) throw new Error("Failed to mark as read");
  };

  const handlePrivateUpload = async (
    folderPath: string,
    overrideName?: string
  ) => {
    if (!privateUploadFile || !session?.user?.id || !selectedUser) return;
    setPrivateUploadLoading(true);
    try {
      const finalName = (() => {
        if (!overrideName) return privateUploadFile.name;
        const original = privateUploadFile.name;
        const dot = original.lastIndexOf(".");
        const ext = dot > 0 ? original.slice(dot + 1) : "";
        const raw = overrideName.includes(".")
          ? overrideName.slice(0, overrideName.lastIndexOf("."))
          : overrideName;
        return ext ? `${raw}.${ext}` : raw;
      })();

      const filePath = s3.getAdminPrivateUploadPath(
        session.user.id,
        selectedUser,
        finalName,
        folderPath
      );
      const signedUrlRes = await fetch("/api/s3/put", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath, contentType: privateUploadFile.type }),
      });
      if (!signedUrlRes.ok) {
        toast.error("Failed to get signed URL. Try again, please.");
        setPrivateUploadLoading(false);
        return;
      }
      const { signedUrl } = await signedUrlRes.json();
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: privateUploadFile,
        headers: {
          "Content-Type": privateUploadFile.type || "application/octet-stream",
        },
      });
      if (!uploadRes.ok) {
        toast.error("Failed to upload file to S3. Try again, please.");
        setPrivateUploadLoading(false);
        return;
      }
      const dbRes = await fetch("/api/s3/admin-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath,
          url: signedUrl,
          name: finalName,
          size: `${(privateUploadFile.size / 1024).toFixed(1)} KB`,
          type: privateUploadFile.type,
          uploadedById: session.user.id,
          isAdminOnlyPrivateFile: true,
          receivedById: selectedUser,
          folderName: folderPath,
        }),
      });
      if (!dbRes.ok) {
        toast.error("Failed to save file in DB. Try again, please.");
        setPrivateUploadLoading(false);
        return;
      }
      setPrivateUploadFile(null);
      toast.success("Private file uploaded successfully!");
      fetch(`/api/admin/user-details/${selectedUser}`)
        .then((res) =>
          res.ok ? res.json() : Promise.reject("Failed to fetch user details")
        )
        .then((data) => setUserDetails(data));
    } catch (err: any) {
      toast.error(err.message || "Upload failed. Please try again.");
    } finally {
      setPrivateUploadLoading(false);
    }
  };

  const handleResponseUpload = async (
    folderPath: string,
    overrideName?: string
  ) => {
    if (!responseUploadFile || !session?.user?.id || !selectedUser) return;
    setResponseUploadLoading(true);
    try {
      const finalName = (() => {
        if (!overrideName) return responseUploadFile.name;
        const original = responseUploadFile.name;
        const dot = original.lastIndexOf(".");
        const ext = dot > 0 ? original.slice(dot + 1) : "";
        const raw = overrideName.includes(".")
          ? overrideName.slice(0, overrideName.lastIndexOf("."))
          : overrideName;
        return ext ? `${raw}.${ext}` : raw;
      })();

      const filePath = s3.getUserReceivedFilePath(
        selectedUser,
        finalName,
        folderPath
      );
      const signedUrlRes = await fetch("/api/s3/put", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath,
          contentType: responseUploadFile.type,
        }),
      });
      if (!signedUrlRes.ok) {
        toast.error("Failed to get signed URL. Try again, please.");
        setResponseUploadLoading(false);
        return;
      }
      const { signedUrl } = await signedUrlRes.json();
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: responseUploadFile,
        headers: {
          "Content-Type": responseUploadFile.type || "application/octet-stream",
        },
      });
      if (!uploadRes.ok) {
        toast.error("Failed to upload file to S3. Try again, please.");
        setResponseUploadLoading(false);
        return;
      }
      const dbRes = await fetch("/api/s3/admin-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath,
          url: signedUrl,
          name: finalName,
          size: `${(responseUploadFile.size / 1024).toFixed(1)} KB`,
          type: responseUploadFile.type,
          uploadedById: session.user.id,
          receivedById: selectedUser,
          isAdminOnlyPrivateFile: false,
          folderName: folderPath,
        }),
      });
      if (!dbRes.ok) {
        toast.error("Failed to save file in DB. Try again, please.");
        setResponseUploadLoading(false);
        return;
      }
      setResponseUploadFile(null);
      toast.success("Response file uploaded successfully!");
      fetch(`/api/admin/user-details/${selectedUser}`)
        .then((res) =>
          res.ok ? res.json() : Promise.reject("Failed to fetch user details")
        )
        .then((data) => setUserDetails(data));
    } catch (err: any) {
      toast.error(err.message || "Upload failed. Please try again.");
    } finally {
      setResponseUploadLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  // Auto-signout if user becomes inactive
  useEffect(() => {
    let timer: any;
    async function checkActive() {
      try {
        const res = await fetch("/api/user/check-active", {
          cache: "no-store",
        });
        if (res.status === 401) return; // not logged in
        const data = await res.json();
        if (data && data.active === false) {
          toast.error(
            "Your account is inactive. You have been signed out by admin."
          );
          await signOut({ redirect: false });
          router.push("/login");
        }
      } catch {}
    }
    checkActive();
    timer = setInterval(checkActive, 30000);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-cyan-50">
      <DashboardHeader
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as any)}
        onLogout={handleLogout}
        unreadNotificationsCount={
          notifications.filter((n: any) => !n.isRead).length
        }
      />
      <div className="w-full sm:px-0 lg:px-6 py-8">
        {activeTab === "users" && (
          <UserManagement users={users} loading={usersLoading} error={error} />
        )}
        {activeTab === "files" && (
          <FileManagement
            users={users}
            loading={usersLoading}
            error={error}
            selectedUser={selectedUser}
            userDetails={userDetails}
            userDetailsLoading={userDetailsLoading}
            userDetailsError={userDetailsError}
            searchQuery={searchQuery}
            privateUploadFile={privateUploadFile}
            responseUploadFile={responseUploadFile}
            privateUploadLoading={privateUploadLoading}
            responseUploadLoading={responseUploadLoading}
            onUserSelect={handleUserSelect}
            onSearchChange={handleSearchChange}
            onPrivateFileSelect={handlePrivateFileSelect}
            onResponseFileSelect={handleResponseFileSelect}
            onPrivateUpload={handlePrivateUpload}
            onResponseUpload={handleResponseUpload}
            onRefreshUserDetails={() => {
              if (selectedUser) {
                fetch(`/api/admin/user-details/${selectedUser}`)
                  .then((res) =>
                    res.ok
                      ? res.json()
                      : Promise.reject("Failed to fetch user details")
                  )
                  .then((data) => {
                    setUserDetails(data);
                    setUserDetailsCache((prev) => ({
                      ...prev,
                      [selectedUser]: data,
                    }));
                  })
                  .catch(() => {});
              }
            }}
          />
        )}
        {activeTab === "notifications" && (
          <NotificationManagement
            handleMarkAllAsRead={handleMarkAllNotificationsAsRead}
            notifications={notifications}
            isLoading={notificationsLoading}
            setNotifications={setNotifications}
            setIsLoading={setNotificationsLoading}
          />
        )}
        {activeTab === "blogs" && <BlogManagement />}
        {activeTab === "testimonials" && <TestimonialsManagement />}
        {activeTab === "contacts" && <OpenContactsManagement />}
        {activeTab === "forms" && <FormsManagement />}
        {activeTab === "profile" && <ProfileManagement />}
      </div>
    </div>
  );
}
