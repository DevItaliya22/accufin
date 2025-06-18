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
  Bell,
  Download,
  FormInput,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { s3 } from "@/lib/s3";
import toast from "react-hot-toast";

type FileRecord = {
  id: string;
  url: string;
  path: string;
  name: string | null;
  size: string | null;
  type: string | null;
  createdAt: string;
  updatedAt: string;
};

type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

type SelectedFile = {
  id: string;
  url: string;
  path: string;
  name: string;
  size: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  file: globalThis.File;
};

type FormWithStatus = {
  id: string;
  title: string;
  description: string | null;
  isActive: boolean;
  isCompulsory: boolean;
  createdAt: string;
  isCompleted: boolean;
  completedAt: string | null;
};

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<
    "upload" | "responses" | "notifications" | "forms"
  >("upload");
  const router = useRouter();
  const { data: session } = useSession();
  const [uploadedFiles, setUploadedFiles] = useState<FileRecord[]>([]);
  const [responseFiles, setResponseFiles] = useState<FileRecord[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [forms, setForms] = useState<FormWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchData = async () => {
    try {
      const [uploadedFilesRes, responseFilesRes, notificationsRes, formsRes] =
        await Promise.all([
          fetch("/api/user/listUploadedFile"),
          fetch("/api/user/listResponseFile"),
          fetch("/api/user/notification"),
          fetch("/api/user/forms"),
        ]);

      const [
        uploadedFilesData,
        responseFilesData,
        notificationsData,
        formsData,
      ] = await Promise.all([
        uploadedFilesRes.json(),
        responseFilesRes.json(),
        notificationsRes.json(),
        formsRes.json(),
      ]);

      setUploadedFiles(uploadedFilesData);
      setResponseFiles(responseFilesData);
      setNotifications(notificationsData);
      setForms(formsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile({
        id: crypto.randomUUID(),
        url: "",
        path: "",
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        file: file,
      });
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !session?.user?.id) return;

    try {
      setIsUploading(true);
      const file = selectedFile;
      const filePath = s3.getUserSendingFilePath(session.user.id, file.name!);

      // Get signed URL for upload
      const signedUrlRes = await fetch("/api/s3/put", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filePath,
          contentType: file.type,
        }),
      });

      if (!signedUrlRes.ok) {
        toast.error("Failed to get signed URL. Try again, please.");
        setIsUploading(false);
        return;
      }
      const { signedUrl } = await signedUrlRes.json();

      // Upload file to S3
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: file.file,
        headers: {
          "Content-Type": file.type!,
        },
      });

      if (!uploadRes.ok) {
        toast.error("Failed to upload file. Try again, please.");
        setIsUploading(false);
        return;
      }

      // Store file info in database
      const dbRes = await fetch("/api/s3/db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filePath,
          url: signedUrl,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedById: session.user.id,
          isAdminOnlyPrivateFile: false,
        }),
      });

      if (!dbRes.ok) {
        toast.error("Failed to store file info. Try again, please.");
        setIsUploading(false);
        return;
      }
      const newFile = await dbRes.json();

      setUploadedFiles((prev) => [newFile, ...prev]);
      fetchData();
      setSelectedFile(null);
      toast.success("File uploaded successfully!");
    } catch (error) {
      toast.error("Error uploading file. Please try again.");
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Document Manager
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">User Dashboard</span>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await signOut({
                    callbackUrl: "/login",
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
        {/* tab list */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-8">
          {[
            { key: "upload", label: "Upload & My Files", icon: Upload },
            { key: "responses", label: "Admin Responses", icon: FileText },
            { key: "forms", label: "Forms", icon: FormInput },
            { key: "notifications", label: "Notifications", icon: Bell },
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

        {activeTab === "upload" && (
          <div className="space-y-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>
                  Upload your files for processing and admin review
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop files here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports PDF, DOC, DOCX, and image files
                  </p>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      id="file-upload"
                      accept="*"
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                    >
                      Choose File
                    </Button>
                  </div>
                  {selectedFile && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 m-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-6 h-6 text-blue-600" />
                          <div>
                            <p className="font-medium">{selectedFile?.name}</p>
                            <p className="text-sm text-gray-500">
                              {selectedFile?.size}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedFile(null)}
                        >
                          Remove
                        </Button>
                      </div>
                      <Button onClick={handleFileUpload} disabled={isUploading}>
                        {isUploading ? "Uploading..." : "Upload File"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* My Uploaded Files */}
            <Card>
              <CardHeader>
                <CardTitle>My Uploaded Files</CardTitle>
                <CardDescription>
                  View and manage your uploaded documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="text-center py-8 text-gray-500">
                      Loading...
                    </div>
                  ) : uploadedFiles.length > 0 ? (
                    uploadedFiles.map((file) => (
                      <div
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg"
                        key={file.id}
                      >
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">{file.name}</p>
                            <p className="text-sm text-gray-500 truncate">
                              {file.size} •{" "}
                              {new Date(file.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="whitespace-nowrap"
                            asChild
                          >
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
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">
                        No Files Uploaded Yet
                      </p>
                      <p className="text-sm">
                        Upload your first document to get started
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "responses" && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Response Documents</CardTitle>
              <CardDescription>
                Documents shared by admin as responses to your uploads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading...
                  </div>
                ) : responseFiles.length > 0 ? (
                  responseFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg bg-green-50 border-green-200"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-sm text-gray-500 truncate">
                            {file.size} •{" "}
                            {new Date(file.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-300 text-green-700 hover:bg-green-100 whitespace-nowrap"
                        asChild
                      >
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
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">
                      No Response Documents Yet
                    </p>
                    <p className="text-sm">
                      Admin will add response documents when available
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "forms" && (
          <Card>
            <CardHeader>
              <CardTitle>Available Forms</CardTitle>
              <CardDescription>
                Complete required forms and view optional ones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading forms...
                  </div>
                ) : forms.length > 0 ? (
                  forms.map((form) => {
                    // Determine background color based on status
                    let bgColor = "bg-white";
                    let borderColor = "border-gray-200";
                    let statusIcon = (
                      <Clock className="w-5 h-5 text-gray-500" />
                    );
                    let statusText = "Pending";
                    let statusTextColor = "text-gray-600";

                    if (form.isCompleted) {
                      // Green for completed forms
                      bgColor = "bg-green-50";
                      borderColor = "border-green-200";
                      statusIcon = (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      );
                      statusText = "Completed";
                      statusTextColor = "text-green-700";
                    } else if (form.isCompulsory) {
                      // Red for compulsory and not filled
                      bgColor = "bg-red-50";
                      borderColor = "border-red-200";
                      statusIcon = (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      );
                      statusText = "Required";
                      statusTextColor = "text-red-700";
                    } else {
                      // Blue for not compulsory and not filled
                      bgColor = "bg-blue-50";
                      borderColor = "border-blue-200";
                      statusIcon = <Clock className="w-5 h-5 text-blue-600" />;
                      statusText = "Optional";
                      statusTextColor = "text-blue-700";
                    }

                    return (
                      <div
                        key={form.id}
                        className={`p-4 border rounded-lg ${bgColor} ${borderColor} hover:shadow-md transition-shadow`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {form.title}
                              </h3>
                              <div className="flex items-center space-x-1">
                                {statusIcon}
                                <span
                                  className={`text-sm font-medium ${statusTextColor}`}
                                >
                                  {statusText}
                                </span>
                              </div>
                              {form.isCompulsory && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Required
                                </Badge>
                              )}
                            </div>
                            {form.description && (
                              <p className="text-gray-600 mb-3 text-sm">
                                {form.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>
                                Created{" "}
                                {new Date(form.createdAt).toLocaleDateString()}
                              </span>
                              {form.completedAt && (
                                <>
                                  <span>•</span>
                                  <span>
                                    Completed{" "}
                                    {new Date(
                                      form.completedAt
                                    ).toLocaleDateString()}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {form.isCompleted ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  router.push(`/forms/${form.id}/view`)
                                }
                                className="flex items-center space-x-1"
                              >
                                <FileText className="w-4 h-4" />
                                <span>View Submission</span>
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() =>
                                  router.push(`/forms/${form.id}/fill`)
                                }
                                className={`flex items-center space-x-1 ${
                                  form.isCompulsory
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }`}
                              >
                                <FormInput className="w-4 h-4" />
                                <span>Fill Form</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <FormInput className="w-16 h-16 mx-auto mb-4 text-gray-300 opacity-20" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Forms Available
                    </h3>
                    <p className="text-gray-500">
                      There are no forms assigned to you at the moment.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "notifications" && (
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Stay updated with your document status and admin responses
              </CardDescription>
              {notifications.length > 0 &&
                notifications.some((n) => !n.isRead) && (
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
                  <div className="text-center py-8 text-gray-500">
                    Loading...
                  </div>
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
                            className={`${
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
                          {new Date(
                            notification.createdAt
                          ).toLocaleDateString()}
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
        )}
      </div>
    </div>
  );
}
