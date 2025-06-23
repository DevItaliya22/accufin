import { useState, useEffect, useMemo } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { s3 } from "@/lib/s3";
import toast from "react-hot-toast";
import UserDashboardHeader from "./UserDashboardHeader";
import ResponsesTab from "./ResponsesTab";
import FormsTab from "./FormsTab";
import NotificationsTab from "./NotificationsTab";
import ProfileTab from "./ProfileTab";
import FileBrowser from "@/app/_component/FileBrowser";
import { ManagedFile } from "@/types/files";

type FileRecord = {
  id: string;
  url: string;
  path: string;
  name: string | null;
  size: string | null;
  type: string | null;
  createdAt: string;
  updatedAt: string;
  isCompleted: boolean;
  completedAt: string | null;
  folderName?: string | null;
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
  const [currentPath, setCurrentPath] = useState("");
  const [tempFolders, setTempFolders] = useState<string[]>([]);

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
          folderName: currentPath,
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

  const handleFolderCreate = (folderName: string) => {
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    setTempFolders((prev) => [...prev, newPath]);
    toast.success(`Folder "${folderName}" created.`);
  };

  const { files: displayedFiles, folders: displayedFolders } = useMemo(() => {
    const folders = new Set<string>();
    const files: FileRecord[] = [];

    const allFolderPaths = [
      ...uploadedFiles.map((f) => f.folderName),
      ...tempFolders,
    ];

    allFolderPaths.forEach((path) => {
      if (!path) return;

      if (currentPath === "") {
        folders.add(path.split("/")[0]);
      } else if (path.startsWith(`${currentPath}/`)) {
        const subPath = path.substring(currentPath.length + 1);
        if (subPath.split("/").length > 0) {
          folders.add(subPath.split("/")[0]);
        }
      }
    });

    uploadedFiles.forEach((file) => {
      const path = file.folderName || "";
      if (path === currentPath) {
        files.push(file);
      }
    });

    return { files, folders: Array.from(folders) };
  }, [uploadedFiles, currentPath, tempFolders]);

  const managedFiles: ManagedFile[] = displayedFiles.map((file) => ({
    id: file.id,
    name: file.name || "Unnamed File",
    url: file.url,
    size: file.size,
    createdAt: file.createdAt,
    folderName: file.folderName,
  }));

  return (
    <div className="min-h-screen bg-cyan-50">
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
          <FileBrowser
            files={managedFiles}
            folders={displayedFolders}
            isLoading={isLoading}
            currentPath={currentPath}
            onPathChange={setCurrentPath}
            onFolderCreate={handleFolderCreate}
            isUploading={isUploading}
            handleFileSelect={handleFileSelect}
            handleFileUpload={handleFileUpload}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
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
        {activeTab === "profile" && <ProfileTab />}
      </div>
    </div>
  );
}
