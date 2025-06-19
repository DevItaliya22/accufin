import { Button } from "@/components/ui/button";
import {
  Shield,
  Users,
  FileText,
  BookOpen,
  MapPin,
  Settings,
  User,
  Mail,
  Phone,
  LogOut,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { s3 } from "@/lib/s3";
import toast from "react-hot-toast";
import BlogManagement from "./BlogManagement";
import OpenContactsManagement from "./OpenContactsManagement";
import FormsManagement from "./FormsManagement";
import NotificationManagement from "./NotificationManagement";
import UserManagement from "./UserManagement";
import DashboardHeader from "./DashboardHeader";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "users" | "notifications" | "blogs" | "contacts" | "forms" | "profile"
  >("users");

  // Loading and error states
  const [loading, setLoading] = useState(true);
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

  // Profile state
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [editContact, setEditContact] = useState(false);
  const [contactNumber, setContactNumber] = useState("");
  const [savingContact, setSavingContact] = useState(false);

  // Fetch users and notifications on mount
  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetch("/api/admin/get-users").then((res) =>
        res.ok ? res.json() : Promise.reject("Failed to fetch users")
      ),
      fetch("/api/admin/notification").then((res) =>
        res.ok ? res.json() : Promise.reject("Failed to fetch notifications")
      ),
    ])
      .then(([usersData, notificationsData]) => {
        setUsers(usersData);
        setNotifications(notificationsData);
        setLoading(false);
      })
      .catch((err) => {
        setError(typeof err === "string" ? err : "Failed to load data");
        setLoading(false);
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

  // Fetch admin profile info
  const fetchProfile = async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const res = await fetch("/api/user/info");
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setProfile(data);
    } catch (err: any) {
      setProfileError(err.message || "Failed to load profile");
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "profile") fetchProfile();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "profile" && profile) {
      setContactNumber(profile.contactNumber || "");
    }
  }, [activeTab, profile]);

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

    // Refresh notifications
    setLoading(true);
    fetch("/api/admin/notification")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setNotifications(data))
      .finally(() => setLoading(false));
  };

  const handlePrivateUpload = async () => {
    if (!privateUploadFile || !session?.user?.id || !selectedUser) return;
    setPrivateUploadLoading(true);
    try {
      const filePath = s3.getAdminPrivateUploadPath(
        session.user.id,
        selectedUser,
        privateUploadFile.name
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
          name: privateUploadFile.name,
          size: `${(privateUploadFile.size / 1024).toFixed(1)} KB`,
          type: privateUploadFile.type,
          uploadedById: session.user.id,
          isAdminOnlyPrivateFile: true,
          receivedById: selectedUser,
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

  const handleResponseUpload = async () => {
    if (!responseUploadFile || !session?.user?.id || !selectedUser) return;
    setResponseUploadLoading(true);
    try {
      const filePath = s3.getUserReceivedFilePath(
        selectedUser,
        responseUploadFile.name
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
          name: responseUploadFile.name,
          size: `${(responseUploadFile.size / 1024).toFixed(1)} KB`,
          type: responseUploadFile.type,
          uploadedById: session.user.id,
          receivedById: selectedUser,
          isAdminOnlyPrivateFile: false,
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
        onLogout={async () => {
          await signOut({ redirect: false });
          router.push("/login");
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "users" && (
          <UserManagement
            users={users}
            loading={loading}
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
          />
        )}
        {activeTab === "notifications" && (
          <NotificationManagement
            notifications={notifications}
            loading={loading}
            error={error}
            onMarkAllAsRead={handleMarkAllNotificationsAsRead}
          />
        )}
        {activeTab === "blogs" && <BlogManagement />}
        {activeTab === "contacts" && <OpenContactsManagement />}
        {activeTab === "forms" && <FormsManagement />}
        {activeTab === "profile" && (
          <div className="flex flex-col items-center w-full">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center relative">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4 border-4 border-gray-200">
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <div className="text-2xl font-bold mb-1">
                {profile?.name || "-"}
              </div>
              <div className="text-gray-500 mb-6">Admin Profile</div>
              <div className="w-full flex flex-col gap-4">
                <div className="flex items-center gap-3 border-b pb-4">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-700">
                    {profile?.email}
                  </span>
                </div>
                <div className="flex items-center gap-3 border-b pb-4">
                  <Phone className="w-5 h-5 text-gray-400" />
                  {editContact ? (
                    <>
                      <input
                        className="border rounded px-2 py-1 flex-1 text-gray-700"
                        type="text"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="Enter contact number"
                        disabled={savingContact}
                        autoFocus
                      />
                      <button
                        className="ml-2 text-green-600 hover:text-green-800"
                        onClick={async () => {
                          setSavingContact(true);
                          try {
                            const res = await fetch("/api/user/info", {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                name: profile.name,
                                contactNumber,
                              }),
                            });
                            if (!res.ok) throw new Error("Failed to update");
                            const data = await res.json();
                            setProfile(data);
                            setEditContact(false);
                            toast.success("Contact number updated");
                          } catch (err) {
                            toast.error(
                              (err as any).message || "Failed to update"
                            );
                          } finally {
                            setSavingContact(false);
                          }
                        }}
                        disabled={savingContact}
                        title="Save"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        className="ml-1 text-gray-400 hover:text-gray-600"
                        onClick={() => {
                          setEditContact(false);
                          setContactNumber(profile.contactNumber || "");
                        }}
                        disabled={savingContact}
                        title="Cancel"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span
                        className={
                          "font-medium text-gray-700 " +
                          (profile?.contactNumber ? "" : "text-gray-400")
                        }
                      >
                        {profile?.contactNumber || "Not set"}
                      </span>
                      <button
                        className="ml-2 text-blue-600 hover:text-blue-800"
                        onClick={() => setEditContact(true)}
                        title={profile?.contactNumber ? "Edit" : "Add"}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <span className="text-xs text-gray-400">
                    Member since{" "}
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
              </div>
              <button
                className="mt-8 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all text-lg shadow"
                onClick={async () => {
                  await signOut({ redirect: false });
                  router.push("/login");
                }}
              >
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
