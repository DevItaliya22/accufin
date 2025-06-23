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
import { ManagedFile } from "@/types/files";
import FileBrowser from "@/app/_component/FileBrowser";
import ArchiveTab from "./ArchiveTab";

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
  isArchived: boolean;
  file: globalThis.File;
};

type NotificationRecord = {
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
    "upload" | "responses" | "notifications" | "forms" | "profile" | "archive"
  >("upload");
  const router = useRouter();
  const { data: session } = useSession();
  const [uploadedFiles, setUploadedFiles] = useState<FileRecord[]>([]);
  const [responseFiles, setResponseFiles] = useState<FileRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [forms, setForms] = useState<FormWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [currentResponsePath, setCurrentResponsePath] = useState("");
  const [archivedFilesList, setArchivedFilesList] = useState<FileRecord[]>([]);
  const [currentArchivePath, setCurrentArchivePath] = useState("");

  const fetchData = async () => {
    try {
      const [
        uploadedFilesRes,
        responseFilesRes,
        notificationsRes,
        formsRes,
        archivedFilesRes,
      ] = await Promise.all([
        fetch("/api/user/listUploadedFile"),
        fetch("/api/user/listResponseFile"),
        fetch("/api/user/notification"),
        fetch("/api/user/forms"),
        fetch("/api/user/archived-files"),
      ]);

      const [
        uploadedFilesData,
        responseFilesData,
        notificationsData,
        formsData,
        archivedFilesData,
      ] = await Promise.all([
        uploadedFilesRes.json(),
        responseFilesRes.json(),
        notificationsRes.json(),
        formsRes.json(),
        archivedFilesRes.json(),
      ]);

      setUploadedFiles(
        Array.isArray(uploadedFilesData) ? uploadedFilesData : []
      );
      setResponseFiles(
        Array.isArray(responseFilesData) ? responseFilesData : []
      );
      setNotifications(
        Array.isArray(notificationsData) ? notificationsData : []
      );
      setForms(Array.isArray(formsData) ? formsData : []);
      setArchivedFilesList(
        Array.isArray(archivedFilesData) ? archivedFilesData : []
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      // Ensure state is an array even on catastrophic failure
      setUploadedFiles([]);
      setResponseFiles([]);
      setNotifications([]);
      setForms([]);
      setArchivedFilesList([]);
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

  const handleFolderCreate = async (folderName: string) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to create a folder.");
      return;
    }

    try {
      const res = await fetch("/api/s3/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isFolderCreation: true,
          folderName: folderName,
          parentPath: currentPath,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create folder.");
      }

      toast.success(`Folder "${folderName}" created successfully!`);
      await fetchData(); // Refresh data
    } catch (error) {
      toast.error("Failed to create folder. Please try again.");
      console.error("Error creating folder:", error);
    }
  };

  const handleArchiveFile = async (fileId: string) => {
    const fileToMove = uploadedFiles.find((f) => f.id === fileId);
    if (!fileToMove) return;

    // Optimistic UI update
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    setArchivedFilesList((prev) => [
      ...prev,
      { ...fileToMove, isArchived: true },
    ]);
    toast.success("File archived.");

    try {
      const res = await fetch(`/api/user/files/${fileId}/archive`, {
        method: "PATCH",
      });
      if (!res.ok) {
        toast.error("Failed to archive file.");
        // Revert on error
        setUploadedFiles((prev) => [...prev, fileToMove]);
        setArchivedFilesList((prev) => prev.filter((f) => f.id !== fileId));
      }
    } catch (error) {
      toast.error("Failed to archive file. Please try again.");
      setUploadedFiles((prev) => [...prev, fileToMove]);
      setArchivedFilesList((prev) => prev.filter((f) => f.id !== fileId));
    }
  };

  const handleUnarchiveFile = async (fileId: string) => {
    const fileToMove = archivedFilesList.find((f) => f.id === fileId);
    if (!fileToMove) return;

    // Optimistic UI update
    setArchivedFilesList((prev) => prev.filter((f) => f.id !== fileId));
    setUploadedFiles((prev) => [...prev, { ...fileToMove, isArchived: false }]);
    toast.success("File unarchived.");

    try {
      const res = await fetch(`/api/user/files/${fileId}/unarchive`, {
        method: "PATCH",
      });
      if (!res.ok) {
        toast.error("Failed to unarchive file.");
        // Revert on error
        setArchivedFilesList((prev) => [...prev, fileToMove]);
        setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
      }
    } catch (error) {
      toast.error("Failed to unarchive file. Please try again.");
      setArchivedFilesList((prev) => [...prev, fileToMove]);
      setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    }
  };

  const { files: displayedFiles, folders: displayedFolders } = useMemo(() => {
    const folders = new Set<string>();
    const files: FileRecord[] = [];

    uploadedFiles.forEach((file) => {
      const path = file.folderName || "";

      if (currentPath === "") {
        if (path === "") {
          if (file.type === "folder" && file.name) {
            folders.add(file.name);
          } else if (file.type !== "folder") {
            files.push(file);
          }
        } else {
          const topLevelFolder = path.split("/")[0];
          if (topLevelFolder) {
            folders.add(topLevelFolder);
          }
        }
      } else {
        if (path === currentPath) {
          if (file.type === "folder" && file.name) {
            folders.add(file.name);
          } else if (file.type !== "folder") {
            files.push(file);
          }
        } else if (path.startsWith(`${currentPath}/`)) {
          const remainingPath = path.substring(currentPath.length + 1);
          const nextLevelFolder = remainingPath.split("/")[0];
          if (nextLevelFolder) {
            folders.add(nextLevelFolder);
          }
        }
      }
    });

    return {
      files,
      folders: Array.from(folders),
    };
  }, [uploadedFiles, currentPath]);

  const { files: displayedResponseFiles, folders: displayedResponseFolders } =
    useMemo(() => {
      const folders = new Set<string>();
      const files: FileRecord[] = [];

      responseFiles.forEach((file) => {
        const path = file.folderName || "";
        if (currentResponsePath === "") {
          if (path === "") {
            if (file.type === "folder" && file.name) folders.add(file.name);
            else if (file.type !== "folder") files.push(file);
          } else {
            const topLevelFolder = path.split("/")[0];
            if (topLevelFolder) folders.add(topLevelFolder);
          }
        } else {
          if (path === currentResponsePath) {
            if (file.type === "folder" && file.name) folders.add(file.name);
            else if (file.type !== "folder") files.push(file);
          } else if (path.startsWith(`${currentResponsePath}/`)) {
            const remainingPath = path.substring(
              currentResponsePath.length + 1
            );
            const nextLevelFolder = remainingPath.split("/")[0];
            if (nextLevelFolder) folders.add(nextLevelFolder);
          }
        }
      });
      return { files, folders: Array.from(folders) };
    }, [responseFiles, currentResponsePath]);

  const { files: displayedArchivedFiles, folders: displayedArchivedFolders } =
    useMemo(() => {
      const folders = new Set<string>();
      const files: FileRecord[] = [];

      archivedFilesList.forEach((file) => {
        const path = file.folderName || "";
        if (currentArchivePath === "") {
          if (path === "") {
            if (file.type === "folder" && file.name) folders.add(file.name);
            else if (file.type !== "folder") files.push(file);
          } else {
            const topLevelFolder = path.split("/")[0];
            if (topLevelFolder) folders.add(topLevelFolder);
          }
        } else {
          if (path === currentArchivePath) {
            if (file.type === "folder" && file.name) folders.add(file.name);
            else if (file.type !== "folder") files.push(file);
          } else if (path.startsWith(`${currentArchivePath}/`)) {
            const remainingPath = path.substring(currentArchivePath.length + 1);
            const nextLevelFolder = remainingPath.split("/")[0];
            if (nextLevelFolder) folders.add(nextLevelFolder);
          }
        }
      });
      return { files, folders: Array.from(folders) };
    }, [archivedFilesList, currentArchivePath]);

  const managedFiles: ManagedFile[] = displayedFiles.map((file) => ({
    id: file.id,
    name: file.name || "Unnamed File",
    url: file.url,
    size: file.size,
    createdAt: file.createdAt,
    folderName: file.folderName,
  }));

  const managedResponseFiles: ManagedFile[] = displayedResponseFiles.map(
    (file) => ({
      id: file.id,
      name: file.name || "Unnamed File",
      url: file.url,
      size: file.size,
      createdAt: file.createdAt,
      folderName: file.folderName,
    })
  );

  const managedArchivedFiles: ManagedFile[] = displayedArchivedFiles.map(
    (file) => ({
      id: file.id,
      name: file.name || "Unnamed File",
      url: file.url,
      size: file.size,
      createdAt: file.createdAt,
      folderName: file.folderName,
    })
  );

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
            onFileArchive={handleArchiveFile}
          />
        )}
        {activeTab === "responses" && (
          <ResponsesTab
            responseFiles={managedResponseFiles}
            folders={displayedResponseFolders}
            isLoading={isLoading}
            currentPath={currentResponsePath}
            onPathChange={setCurrentResponsePath}
          />
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
        {activeTab === "archive" && (
          <ArchiveTab
            archivedFiles={managedArchivedFiles}
            folders={displayedArchivedFolders}
            isLoading={isLoading}
            currentPath={currentArchivePath}
            onPathChange={setCurrentArchivePath}
            onFileUnarchive={handleUnarchiveFile}
          />
        )}
        {activeTab === "profile" && <ProfileTab />}
      </div>
    </div>
  );
}
