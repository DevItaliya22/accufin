import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  FileText,
  Upload,
  Download,
  Shield,
  Users,
  EyeOff,
  Eye,
  Bell,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { s3 } from "@/lib/s3";
import toast from "react-hot-toast";
import { Loader } from "@/components/ui/loader";
import BlogManagement from "./BlogManagement";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "users" | "notifications" | "blogs"
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

  // Private file upload handler
  const handlePrivateFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPrivateUploadFile(file);
  };
  const openPrivateFilePicker = () => {
    privateFileInputRef.current?.click();
  };

  // Response file upload handler
  const handleResponseFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setResponseUploadFile(file);
  };
  const openResponseFilePicker = () => {
    responseFileInputRef.current?.click();
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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-red-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Administrator</span>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await signOut({
                    redirect: false,
                  });
                  router.push("/login");
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-1 mb-8">
          {[
            { key: "users", label: "User Management", icon: Users },
            { key: "notifications", label: "Notifications", icon: FileText },
            { key: "blogs", label: "Blogs", icon: BookOpen },
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={activeTab === key ? "default" : "ghost"}
              onClick={() => setActiveTab(key as any)}
              className="flex items-center space-x-2"
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
              {key === "notifications" &&
                notifications.filter((n) => !n.isRead).length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {notifications.filter((n) => !n.isRead).length}
                  </Badge>
                )}
            </Button>
          ))}
        </div>

        {activeTab === "users" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  Select a user to manage their documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <Loader size={48} className="mb-2 text-blue-500" />
                    Loading users...
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">{error}</div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Search users"
                      className="w-full p-2 rounded-lg border border-gray-300"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {users
                      .filter((user) =>
                        user.email
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      )
                      .map((user) => (
                        <div
                          key={user.id}
                          onClick={() => setSelectedUser(user.id)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedUser === user.id
                              ? "bg-blue-100 border-blue-300"
                              : "bg-gray-50 hover:bg-gray-100"
                          } border`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">
                                {user.email}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {user.uploadedFiles} files
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="lg:col-span-3">
              {selectedUser ? (
                userDetailsLoading ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      Loading user details...
                    </CardContent>
                  </Card>
                ) : userDetailsError ? (
                  <Card>
                    <CardContent className="text-center py-12 text-red-500">
                      {userDetailsError}
                    </CardContent>
                  </Card>
                ) : userDetails ? (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Uploaded Files</CardTitle>
                        <CardDescription>
                          Files uploaded by the user
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {userDetails.userUploadedFiles?.length > 0 ? (
                            userDetails.userUploadedFiles.map((file: any) => (
                              <div
                                key={file.id}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-lg bg-blue-50"
                              >
                                <div className="flex items-center space-x-3 min-w-0 flex-1">
                                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="font-medium break-all">
                                      {file.name}
                                    </p>
                                    <p className="text-sm text-gray-500 break-all">
                                      {file.size}•{" "}
                                      {file.createdAt
                                        ? new Date(
                                            file.createdAt
                                          ).toLocaleDateString()
                                        : ""}
                                    </p>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                  </a>
                                </Button>
                              </div>
                            ))
                          ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                              <FileText className="w-16 h-16 mb-2 opacity-20" />
                              <span>No files uploaded</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Document Management</CardTitle>
                        <CardDescription>
                          Manage private and response documents for this user
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="private" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger
                              value="private"
                              className="flex items-center space-x-2"
                            >
                              <EyeOff className="w-4 h-4" />
                              <span>Private Documents</span>
                            </TabsTrigger>
                            <TabsTrigger
                              value="response"
                              className="flex items-center space-x-2"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Response Documents</span>
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="private" className="space-y-4">
                            <div className="border-2 border-dashed border-red-300 rounded-lg p-6 text-center bg-red-50">
                              <Shield className="w-8 h-8 text-red-600 mx-auto mb-2" />
                              <p className="font-medium text-red-900 mb-2">
                                Upload Private Documents
                              </p>
                              <p className="text-sm text-red-700 mb-4">
                                Only visible to administrators
                              </p>
                              <input
                                type="file"
                                className="hidden"
                                ref={privateFileInputRef}
                                onChange={handlePrivateFileSelect}
                                disabled={privateUploadLoading}
                              />
                              <Button
                                variant="outline"
                                className="cursor-pointer border-red-300 text-red-700 hover:bg-red-100"
                                disabled={privateUploadLoading}
                                onClick={openPrivateFilePicker}
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Choose File
                              </Button>
                              {privateUploadFile && (
                                <div className="mt-4 flex flex-col items-center space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <FileText className="w-5 h-5 text-red-600" />
                                    <span className="font-medium">
                                      {privateUploadFile.name}
                                    </span>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPrivateUploadFile(null)}
                                    disabled={privateUploadLoading}
                                  >
                                    Remove
                                  </Button>
                                  <Button
                                    onClick={handlePrivateUpload}
                                    disabled={privateUploadLoading}
                                    className="mt-2"
                                  >
                                    {privateUploadLoading
                                      ? "Uploading..."
                                      : "Upload Private"}
                                  </Button>
                                </div>
                              )}
                            </div>
                            <div className="space-y-3">
                              <h4 className="font-medium">Private Documents</h4>
                              {userDetails.userPrivateFiles?.length > 0 ? (
                                userDetails.userPrivateFiles.map((doc: any) => (
                                  <div
                                    key={doc.id}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-lg bg-red-50 border-red-200"
                                  >
                                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                                      <Shield className="w-6 h-6 text-red-600" />
                                      <div>
                                        <p className="font-medium truncate">
                                          {doc.name}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                          {doc.size}•{" "}
                                          {doc.createdAt
                                            ? new Date(
                                                doc.createdAt
                                              ).toLocaleDateString()
                                            : ""}
                                        </p>
                                      </div>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                      <a
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                      </a>
                                    </Button>
                                  </div>
                                ))
                              ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                  <Shield className="w-16 h-16 mb-2 opacity-20" />
                                  <span>No private documents</span>
                                </div>
                              )}
                            </div>
                          </TabsContent>

                          <TabsContent value="response" className="space-y-4">
                            <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center bg-green-50">
                              <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                              <p className="font-medium text-green-900 mb-2">
                                Upload Response Documents
                              </p>
                              <p className="text-sm text-green-700 mb-4">
                                Visible to user as responses
                              </p>
                              <input
                                type="file"
                                className="hidden"
                                ref={responseFileInputRef}
                                onChange={handleResponseFileSelect}
                                disabled={responseUploadLoading}
                              />
                              <Button
                                variant="outline"
                                className="cursor-pointer border-green-300 text-green-700 hover:bg-green-100"
                                disabled={responseUploadLoading}
                                onClick={openResponseFilePicker}
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Choose File
                              </Button>
                              {responseUploadFile && (
                                <div className="mt-4 flex flex-col items-center space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <FileText className="w-5 h-5 text-green-600" />
                                    <span className="font-medium">
                                      {responseUploadFile.name}
                                    </span>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setResponseUploadFile(null)}
                                    disabled={responseUploadLoading}
                                  >
                                    Remove
                                  </Button>
                                  <Button
                                    onClick={handleResponseUpload}
                                    disabled={responseUploadLoading}
                                    className="mt-2"
                                  >
                                    {responseUploadLoading
                                      ? "Uploading..."
                                      : "Upload Response"}
                                  </Button>
                                </div>
                              )}
                            </div>
                            <div className="space-y-3">
                              <h4 className="font-medium">
                                Response Documents
                              </h4>
                              {userDetails.userReceivedFiles?.length > 0 ? (
                                userDetails.userReceivedFiles.map(
                                  (doc: any) => (
                                    <div
                                      key={doc.id}
                                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-lg bg-green-50 border-green-200"
                                    >
                                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                                        <FileText className="w-6 h-6 text-green-600" />
                                        <div>
                                          <p className="font-medium truncate">
                                            {doc.name}
                                          </p>
                                          <p className="text-sm text-gray-500 truncate">
                                            {doc.size}•{" "}
                                            {doc.createdAt
                                              ? new Date(
                                                  doc.createdAt
                                                ).toLocaleDateString()
                                              : ""}
                                          </p>
                                        </div>
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                      >
                                        <a
                                          href={doc.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <Download className="w-4 h-4 mr-2" />
                                          Download
                                        </a>
                                      </Button>
                                    </div>
                                  )
                                )
                              ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                  <FileText className="w-16 h-16 mb-2 opacity-20" />
                                  <span>No response documents</span>
                                </div>
                              )}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </div>
                ) : null
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300 opacity-20" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a User
                    </h3>
                    <p className="text-gray-500">
                      Choose a user from the left panel to manage their
                      documents
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Notifications</CardTitle>
              <CardDescription>
                System alerts and user activity updates
              </CardDescription>
              {notifications.length > 0 &&
                notifications.some((n) => !n.isRead) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={async () => {
                      try {
                        const res = await fetch(
                          "/api/admin/notification/read",
                          { method: "POST" }
                        );
                        if (!res.ok) throw new Error("Failed to mark as read");
                        toast.success("All notifications marked as read!");
                        // Refresh notifications
                        setLoading(true);
                        fetch("/api/admin/notification")
                          .then((res) => (res.ok ? res.json() : []))
                          .then((data) => setNotifications(data))
                          .finally(() => setLoading(false));
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
                            className={`${
                              !notification.isRead ? "font-medium" : ""
                            }`}
                          >
                            {notification.message}
                          </p>
                          <span className="text-xs text-gray-500">
                            {notification.createdAt
                              ? new Date(
                                  notification.createdAt
                                ).toLocaleString()
                              : ""}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">
                        No Notifications
                      </p>
                      <p className="text-sm">You're all caught up!</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "blogs" && <BlogManagement />}
      </div>
    </div>
  );
}
