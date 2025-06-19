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
  User,
  Mail,
  Phone,
  LogOut,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { s3 } from "@/lib/s3";
import toast from "react-hot-toast";
import UserDashboardHeader from "./UserDashboardHeader";
import UploadTab from "./UploadTab";
import ResponsesTab from "./ResponsesTab";
import FormsTab from "./FormsTab";
import NotificationsTab from "./NotificationsTab";

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
    "upload" | "responses" | "notifications" | "forms" | "profile"
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
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [editContact, setEditContact] = useState(false);
  const [contactNumber, setContactNumber] = useState("");
  const [savingContact, setSavingContact] = useState(false);

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

  // Fetch user profile info
  const fetchProfile = async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const res = await fetch("/api/user/info");
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setProfile(data);
      setContactNumber(data.contactNumber || "");
    } catch (err: any) {
      setProfileError(err.message || "Failed to load profile");
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (activeTab === "profile") fetchProfile();
  }, [activeTab]);

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
      <UserDashboardHeader
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
        onLogout={async () => {
          await signOut({ callbackUrl: "/login" });
          router.push("/login");
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "upload" && (
          <UploadTab
            uploadedFiles={uploadedFiles}
            isLoading={isLoading}
            selectedFile={selectedFile}
            isUploading={isUploading}
            handleFileSelect={handleFileSelect}
            handleFileUpload={handleFileUpload}
            setSelectedFile={setSelectedFile}
            fetchData={fetchData}
          />
        )}
        {activeTab === "responses" && (
          <ResponsesTab responseFiles={responseFiles} isLoading={isLoading} />
        )}
        {activeTab === "forms" && (
          <FormsTab forms={forms} isLoading={isLoading} router={router} />
        )}
        {activeTab === "notifications" && (
          <NotificationsTab
            notifications={notifications}
            isLoading={isLoading}
            setNotifications={setNotifications}
            setIsLoading={setIsLoading}
          />
        )}
        {activeTab === "profile" && (
          <div className="flex flex-col items-center w-full">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center relative">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4 border-4 border-gray-200">
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <div className="text-2xl font-bold mb-1">
                {profile?.name || "-"}
              </div>
              <div className="text-gray-500 mb-6">User Profile</div>
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
                  await signOut({ callbackUrl: "/login" });
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
