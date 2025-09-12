"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users, EyeOff, Eye, ChevronUp, ChevronDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "@/components/ui/loader";
import { useMemo, useState, useEffect } from "react";
import FileBrowser from "@/app/_component/FileBrowser";
import { ManagedFile } from "@/types/files";
import { toast } from "react-hot-toast";
import { s3 } from "@/lib/s3";

interface User {
  id: string;
  email: string;
  uploadedFiles: number;
}

interface FileDetail {
  id: string;
  name: string;
  size: string;
  url: string;
  createdAt?: string;
  folderName?: string;
  type?: string;
}

interface UserDetails {
  userUploadedFiles?: FileDetail[];
  userPrivateFiles?: FileDetail[];
  userReceivedFiles?: FileDetail[];
  userArchivedFiles?: FileDetail[];
}

interface SelectedFile {
  id: string;
  url: string;
  path: string;
  name: string;
  size: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  file: globalThis.File;
}

interface FileManagementProps {
  users: User[];
  loading: boolean;
  error: string | null;
  selectedUser: string | null;
  userDetails: UserDetails | null;
  userDetailsLoading: boolean;
  userDetailsError: string | null;
  searchQuery: string;
  privateUploadFile: File | null;
  responseUploadFile: File | null;
  privateUploadLoading: boolean;
  responseUploadLoading: boolean;
  onUserSelect: (userId: string) => void;
  onSearchChange: (query: string) => void;
  onPrivateFileSelect: (file: File | null) => void;
  onResponseFileSelect: (file: File | null) => void;
  onPrivateUpload: (folderPath: string, overrideName?: string) => Promise<void>;
  onResponseUpload: (
    folderPath: string,
    overrideName?: string
  ) => Promise<void>;
  onRefreshUserDetails: () => void;
}

const processFiles = (
  allFiles: FileDetail[] | undefined,
  currentPath: string
) => {
  const folders = new Set<string>();
  const files: FileDetail[] = [];
  if (!allFiles) {
    return { files: [], folders: [] };
  }

  allFiles.forEach((file) => {
    const path = file.folderName || "";
    if (currentPath === "") {
      if (path === "") {
        if (file.type === "folder" && file.name) folders.add(file.name);
        else if (file.type !== "folder") files.push(file);
      } else {
        const topLevelFolder = path.split("/")[0];
        if (topLevelFolder) folders.add(topLevelFolder);
      }
    } else {
      if (path === currentPath) {
        if (file.type === "folder" && file.name) folders.add(file.name);
        else if (file.type !== "folder") files.push(file);
      } else if (path.startsWith(`${currentPath}/`)) {
        const remainingPath = path.substring(currentPath.length + 1);
        const nextLevelFolder = remainingPath.split("/")[0];
        if (nextLevelFolder) folders.add(nextLevelFolder);
      }
    }
  });

  const managedFiles: ManagedFile[] = files.map((file) => ({
    id: file.id,
    name: file.name || "Unnamed File",
    url: file.url,
    size: file.size,
    createdAt: file.createdAt,
    folderName: file.folderName,
  }));
  return { files: managedFiles, folders: Array.from(folders) };
};

export default function FileManagement({
  users,
  loading,
  error,
  selectedUser,
  userDetails,
  userDetailsLoading,
  userDetailsError,
  searchQuery,
  privateUploadFile,
  responseUploadFile,
  privateUploadLoading,
  responseUploadLoading,
  onUserSelect,
  onSearchChange,
  onPrivateFileSelect,
  onResponseFileSelect,
  onPrivateUpload,
  onResponseUpload,
  onRefreshUserDetails,
}: FileManagementProps) {
  const [uploadedFilesPath, setUploadedFilesPath] = useState("");
  const [archivedFilesPath, setArchivedFilesPath] = useState("");
  const [privateFilesPath, setPrivateFilesPath] = useState("");
  const [responseFilesPath, setResponseFilesPath] = useState("");
  const [isUsersCollapsed, setIsUsersCollapsed] = useState(false);

  // Local optimistic state for Document Management lists
  const [privateFilesData, setPrivateFilesData] = useState<
    FileDetail[] | undefined
  >(undefined);
  const [responseFilesData, setResponseFilesData] = useState<
    FileDetail[] | undefined
  >(undefined);
  const [privateSelectedName, setPrivateSelectedName] = useState<string | null>(
    null
  );
  const [responseSelectedName, setResponseSelectedName] = useState<
    string | null
  >(null);

  // Multiple file upload state
  const [privateSelectedFiles, setPrivateSelectedFiles] = useState<
    SelectedFile[]
  >([]);
  const [responseSelectedFiles, setResponseSelectedFiles] = useState<
    SelectedFile[]
  >([]);
  const [privateUploadingIds, setPrivateUploadingIds] = useState<string[]>([]);
  const [responseUploadingIds, setResponseUploadingIds] = useState<string[]>(
    []
  );

  // Sync local state with userDetails for optimistic updates
  useEffect(() => {
    if (userDetails) {
      setPrivateFilesData(userDetails.userPrivateFiles);
      setResponseFilesData(userDetails.userReceivedFiles);
    }
  }, [userDetails]);

  useEffect(() => {
    setPrivateSelectedName(privateUploadFile ? privateUploadFile.name : null);
  }, [privateUploadFile]);
  useEffect(() => {
    setResponseSelectedName(
      responseUploadFile ? responseUploadFile.name : null
    );
  }, [responseUploadFile]);

  // Multiple file selection handlers
  const handlePrivateFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list || list.length === 0) return;
    const newItems: SelectedFile[] = Array.from(list).map((file) => ({
      id: crypto.randomUUID(),
      url: "",
      path: "",
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      file,
    }));
    setPrivateSelectedFiles((prev) => [...prev, ...newItems]);
  };

  const handleResponseFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list || list.length === 0) return;
    const newItems: SelectedFile[] = Array.from(list).map((file) => ({
      id: crypto.randomUUID(),
      url: "",
      path: "",
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      file,
    }));
    setResponseSelectedFiles((prev) => [...prev, ...newItems]);
  };

  // File removal handlers
  const handleRemovePrivateSelectedFile = (selectedTempId: string) => {
    setPrivateSelectedFiles((prev) =>
      prev.filter((f) => f.id !== selectedTempId)
    );
  };

  const handleRemoveResponseSelectedFile = (selectedTempId: string) => {
    setResponseSelectedFiles((prev) =>
      prev.filter((f) => f.id !== selectedTempId)
    );
  };

  // Clear all selected files
  const handleClearPrivateSelectedFiles = () => {
    setPrivateSelectedFiles([]);
  };

  const handleClearResponseSelectedFiles = () => {
    setResponseSelectedFiles([]);
  };

  // File name change handlers
  const handlePrivateSelectedFileNameChange = (
    selectedTempId: string,
    newName: string
  ) => {
    setPrivateSelectedFiles((prev) =>
      prev.map((f) => (f.id === selectedTempId ? { ...f, name: newName } : f))
    );
  };

  const handleResponseSelectedFileNameChange = (
    selectedTempId: string,
    newName: string
  ) => {
    setResponseSelectedFiles((prev) =>
      prev.map((f) => (f.id === selectedTempId ? { ...f, name: newName } : f))
    );
  };

  const { files: processedUploadedFiles, folders: processedUploadedFolders } =
    useMemo(
      () => processFiles(userDetails?.userUploadedFiles, uploadedFilesPath),
      [userDetails?.userUploadedFiles, uploadedFilesPath]
    );

  const { files: processedArchivedFiles, folders: processedArchivedFolders } =
    useMemo(
      () => processFiles(userDetails?.userArchivedFiles, archivedFilesPath),
      [userDetails?.userArchivedFiles, archivedFilesPath]
    );

  const { files: processedPrivateFiles, folders: processedPrivateFolders } =
    useMemo(
      () => processFiles(privateFilesData, privateFilesPath),
      [privateFilesData, privateFilesPath]
    );

  const { files: processedResponseFiles, folders: processedResponseFolders } =
    useMemo(
      () => processFiles(responseFilesData, responseFilesPath),
      [responseFilesData, responseFilesPath]
    );

  const handleAdminFolderCreate = async (
    folderName: string,
    parentPath: string,
    type: "private" | "response"
  ) => {
    if (!selectedUser) return;
    // Optimistic insert of a temp folder record
    const tempFolder = {
      id: `temp-${Date.now()}`,
      name: folderName,
      size: "",
      url: "",
      createdAt: new Date().toISOString(),
      folderName: parentPath,
      type: "folder",
    } as FileDetail;
    const revert = () => {
      if (type === "private") {
        setPrivateFilesData((prev) =>
          (prev || []).filter((f) => f.id !== tempFolder.id)
        );
      } else {
        setResponseFilesData((prev) =>
          (prev || []).filter((f) => f.id !== tempFolder.id)
        );
      }
    };
    if (type === "private") {
      setPrivateFilesData((prev) => [...(prev || []), tempFolder]);
    } else {
      setResponseFilesData((prev) => [...(prev || []), tempFolder]);
    }
    try {
      const res = await fetch("/api/s3/admin-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isFolderCreation: true,
          folderName,
          parentPath,
          userId: selectedUser,
          isAdminOnlyPrivateFile: type === "private",
        }),
      });
      if (!res.ok) throw new Error("Failed to create folder");
      const created = await res.json();
      // Replace temp with actual
      if (type === "private") {
        setPrivateFilesData((prev) =>
          (prev || []).map((f) =>
            f.id === tempFolder.id ? { ...f, id: created.id } : f
          )
        );
      } else {
        setResponseFilesData((prev) =>
          (prev || []).map((f) =>
            f.id === tempFolder.id ? { ...f, id: created.id } : f
          )
        );
      }
      toast.success("Folder created successfully");
      // Optional sync refresh can run in background if needed
    } catch (err) {
      toast.error("Failed to create folder");
      revert();
    }
  };

  // Multiple file upload handlers
  const uploadPrivateFile = async (sf: SelectedFile) => {
    if (!selectedUser) return false;
    if (!privateFilesPath) {
      toast.error("Please select or create a folder before uploading a file.");
      return false;
    }
    try {
      setPrivateUploadingIds((prev) => [...prev, sf.id]);

      // Create a temporary file record for optimistic UI
      const tempFile = {
        id: `temp-${Date.now()}`,
        name: sf.name,
        size: sf.size,
        url: "",
        createdAt: new Date().toISOString(),
        folderName: privateFilesPath,
      } as FileDetail;

      setPrivateFilesData((prev) => [tempFile, ...(prev || [])]);

      const filePath = s3.getUserSendingFilePath(
        selectedUser,
        sf.name,
        privateFilesPath
      );

      const signedUrlRes = await fetch("/api/s3/put", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filePath,
          contentType: sf.type,
        }),
      });

      if (!signedUrlRes.ok) {
        throw new Error("Failed to get signed URL");
      }

      const { signedUrl } = await signedUrlRes.json();

      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: sf.file,
        headers: {
          "Content-Type": sf.type,
        },
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload file to S3");
      }

      const dbRes = await fetch("/api/s3/admin-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath,
          url: signedUrl,
          name: sf.name,
          size: sf.size,
          type: sf.type,
          uploadedById: selectedUser,
          receivedById: selectedUser,
          isAdminOnlyPrivateFile: true,
          folderName: privateFilesPath,
        }),
      });

      if (!dbRes.ok) {
        throw new Error("Failed to save file in database");
      }

      const newFile = await dbRes.json();

      // Replace temp file with actual file
      setPrivateFilesData((prev) =>
        (prev || []).map((f) => (f.id === tempFile.id ? newFile : f))
      );

      toast.success(`${sf.name} uploaded successfully!`);
      return true;
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast.error(error.message || "Failed to upload file");

      // Remove temp file on error
      setPrivateFilesData((prev) =>
        (prev || []).filter((f) => f.id !== `temp-${Date.now()}`)
      );
      return false;
    } finally {
      setPrivateUploadingIds((prev) => prev.filter((id) => id !== sf.id));
    }
  };

  const uploadResponseFile = async (sf: SelectedFile) => {
    if (!selectedUser) return false;
    if (!responseFilesPath) {
      toast.error("Please select or create a folder before uploading a file.");
      return false;
    }
    try {
      setResponseUploadingIds((prev) => [...prev, sf.id]);

      // Create a temporary file record for optimistic UI
      const tempFile = {
        id: `temp-${Date.now()}`,
        name: sf.name,
        size: sf.size,
        url: "",
        createdAt: new Date().toISOString(),
        folderName: responseFilesPath,
      } as FileDetail;

      setResponseFilesData((prev) => [tempFile, ...(prev || [])]);

      const filePath = s3.getUserSendingFilePath(
        selectedUser,
        sf.name,
        responseFilesPath
      );

      const signedUrlRes = await fetch("/api/s3/put", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filePath,
          contentType: sf.type,
        }),
      });

      if (!signedUrlRes.ok) {
        throw new Error("Failed to get signed URL");
      }

      const { signedUrl } = await signedUrlRes.json();

      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: sf.file,
        headers: {
          "Content-Type": sf.type,
        },
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload file to S3");
      }

      const dbRes = await fetch("/api/s3/admin-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath,
          url: signedUrl,
          name: sf.name,
          size: sf.size,
          type: sf.type,
          uploadedById: selectedUser,
          receivedById: selectedUser,
          isAdminOnlyPrivateFile: false,
          folderName: responseFilesPath,
        }),
      });

      if (!dbRes.ok) {
        throw new Error("Failed to save file in database");
      }

      const newFile = await dbRes.json();

      // Replace temp file with actual file
      setResponseFilesData((prev) =>
        (prev || []).map((f) => (f.id === tempFile.id ? newFile : f))
      );

      toast.success(`${sf.name} uploaded successfully!`);
      return true;
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast.error(error.message || "Failed to upload file");

      // Remove temp file on error
      setResponseFilesData((prev) =>
        (prev || []).filter((f) => f.id !== `temp-${Date.now()}`)
      );
      return false;
    } finally {
      setResponseUploadingIds((prev) => prev.filter((id) => id !== sf.id));
    }
  };

  // Upload individual files
  const handlePrivateFileUploadById = async (selectedTempId: string) => {
    const sf = privateSelectedFiles.find((f) => f.id === selectedTempId);
    if (!sf) return;

    const ok = await uploadPrivateFile(sf);
    if (ok) {
      setPrivateSelectedFiles((prev) =>
        prev.filter((f) => f.id !== selectedTempId)
      );
    }
  };

  const handleResponseFileUploadById = async (selectedTempId: string) => {
    const sf = responseSelectedFiles.find((f) => f.id === selectedTempId);
    if (!sf) return;

    const ok = await uploadResponseFile(sf);
    if (ok) {
      setResponseSelectedFiles((prev) =>
        prev.filter((f) => f.id !== selectedTempId)
      );
    }
  };

  // Upload all files
  const handlePrivateConfirmAll = async () => {
    if (privateSelectedFiles.length === 0) return;

    for (const sf of privateSelectedFiles) {
      // Skip if duplicate name exists in current view
      const duplicate = processedPrivateFiles.some((f) => f.name === sf.name);
      if (duplicate) continue;

      await uploadPrivateFile(sf);
    }

    setPrivateSelectedFiles([]);
    toast.success("All uploads attempted.");
  };

  const handleResponseConfirmAll = async () => {
    if (responseSelectedFiles.length === 0) return;

    for (const sf of responseSelectedFiles) {
      // Skip if duplicate name exists in current view
      const duplicate = processedResponseFiles.some((f) => f.name === sf.name);
      if (duplicate) continue;

      await uploadResponseFile(sf);
    }

    setResponseSelectedFiles([]);
    toast.success("All uploads attempted.");
  };

  const handleArchiveFile = async (fileId: string) => {
    try {
      const res = await fetch(`/api/admin/files/${fileId}/archive`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to archive file");
      toast.success("File archived successfully");
      onRefreshUserDetails();
    } catch (err) {
      toast.error("Failed to archive file");
    }
  };
  const handleUnarchiveFile = async (fileId: string) => {
    try {
      const res = await fetch(`/api/admin/files/${fileId}/unarchive`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to unarchive file");
      toast.success("File unarchived successfully");
      onRefreshUserDetails();
    } catch (err) {
      toast.error("Failed to unarchive file");
    }
  };

  // Admin rename/delete for Document Management (private/response)
  const handlePrivateRenameFile = async (fileId: string, newName: string) => {
    const prev = privateFilesData;
    setPrivateFilesData((curr) =>
      (curr || []).map((f) => (f.id === fileId ? { ...f, name: newName } : f))
    );
    try {
      const res = await fetch(`/api/user/files/${fileId}/rename`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newName }),
      });
      if (!res.ok) throw new Error("Failed to rename file");
      toast.success("File renamed successfully");
      // UI already updated optimistically
    } catch (e) {
      setPrivateFilesData(prev);
      toast.error("Failed to rename file");
    }
  };

  const handleResponseRenameFile = async (fileId: string, newName: string) => {
    const prev = responseFilesData;
    setResponseFilesData((curr) =>
      (curr || []).map((f) => (f.id === fileId ? { ...f, name: newName } : f))
    );
    try {
      const res = await fetch(`/api/user/files/${fileId}/rename`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newName }),
      });
      if (!res.ok) throw new Error("Failed to rename file");
      toast.success("File renamed successfully");
      // UI already updated optimistically
    } catch (e) {
      setResponseFilesData(prev);
      toast.error("Failed to rename file");
    }
  };

  const handlePrivateRenameFolder = async (
    folderName: string,
    newName: string
  ) => {
    const parentPath = privateFilesPath;
    const folderEntry = (privateFilesData || [])?.find(
      (f) =>
        f.type === "folder" &&
        f.name === folderName &&
        (f.folderName || "") === parentPath
    );
    // Optimistic update regardless of explicit record
    const oldFull = parentPath ? `${parentPath}/${folderName}` : folderName;
    const newFull = parentPath ? `${parentPath}/${newName}` : newName;
    const prev = privateFilesData;
    setPrivateFilesData((curr) =>
      (curr || []).map((f) => {
        // Update descendants folder paths
        const fn = f.folderName || "";
        if (fn.startsWith(oldFull))
          return {
            ...f,
            folderName: `${newFull}${fn.slice(oldFull.length)}`,
          } as any;
        // If there is an explicit folder record, update its display name
        if (folderEntry && f.id === folderEntry.id)
          return { ...f, name: newName } as any;
        return f;
      })
    );
    try {
      const url = folderEntry
        ? `/api/user/files/${folderEntry.id}/rename`
        : `/api/admin/folders/rename`;
      const method = folderEntry ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: folderEntry
          ? JSON.stringify({ newName })
          : JSON.stringify({
              selectedUserId: selectedUser,
              parentPath,
              folderName,
              newName,
              isPrivate: true,
            }),
      });
      if (!res.ok) throw new Error("Failed to rename folder");
      toast.success("Folder renamed successfully");
      // UI already updated optimistically
    } catch (e) {
      setPrivateFilesData(prev);
      toast.error("Failed to rename folder");
    }
  };

  const handleResponseRenameFolder = async (
    folderName: string,
    newName: string
  ) => {
    const parentPath = responseFilesPath;
    const folderEntry = (responseFilesData || [])?.find(
      (f) =>
        f.type === "folder" &&
        f.name === folderName &&
        (f.folderName || "") === parentPath
    );
    // Optimistic update regardless of explicit record
    const oldFull = parentPath ? `${parentPath}/${folderName}` : folderName;
    const newFull = parentPath ? `${parentPath}/${newName}` : newName;
    const prev = responseFilesData;
    setResponseFilesData((curr) =>
      (curr || []).map((f) => {
        // Update descendants folder paths
        const fn = f.folderName || "";
        if (fn.startsWith(oldFull))
          return {
            ...f,
            folderName: `${newFull}${fn.slice(oldFull.length)}`,
          } as any;
        // If there is an explicit folder record, update its display name
        if (folderEntry && f.id === folderEntry.id)
          return { ...f, name: newName } as any;
        return f;
      })
    );
    try {
      const url = folderEntry
        ? `/api/user/files/${folderEntry.id}/rename`
        : `/api/admin/folders/rename`;
      const method = folderEntry ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: folderEntry
          ? JSON.stringify({ newName })
          : JSON.stringify({
              selectedUserId: selectedUser,
              parentPath,
              folderName,
              newName,
              isPrivate: false,
            }),
      });
      if (!res.ok) throw new Error("Failed to rename folder");
      toast.success("Folder renamed successfully");
      // UI already updated optimistically
    } catch (e) {
      setResponseFilesData(prev);
      toast.error("Failed to rename folder");
    }
  };

  const handlePrivateDeleteFile = async (fileId: string) => {
    const prev = privateFilesData;
    setPrivateFilesData((curr) => (curr || []).filter((f) => f.id !== fileId));
    try {
      const res = await fetch(`/api/user/files/${fileId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete file");
      toast.success("File deleted successfully");
      // UI already updated optimistically
    } catch (e) {
      setPrivateFilesData(prev);
      toast.error("Failed to delete file");
    }
  };

  const handleResponseDeleteFile = async (fileId: string) => {
    const prev = responseFilesData;
    setResponseFilesData((curr) => (curr || []).filter((f) => f.id !== fileId));
    try {
      const res = await fetch(`/api/user/files/${fileId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete file");
      toast.success("File deleted successfully");
      // UI already updated optimistically
    } catch (e) {
      setResponseFilesData(prev);
      toast.error("Failed to delete file");
    }
  };

  const handlePrivateDeleteFolder = async (folderName: string) => {
    const parentPath = privateFilesPath;
    const folderEntry = (privateFilesData || [])?.find(
      (f) =>
        f.type === "folder" &&
        f.name === folderName &&
        (f.folderName || "") === parentPath
    );
    const full = parentPath ? `${parentPath}/${folderName}` : folderName;
    const prev = privateFilesData;
    setPrivateFilesData((curr) =>
      (curr || []).filter((f) => {
        const fn = f.folderName || "";
        // Remove any descendants under the folder path
        if (fn.startsWith(full)) return false;
        // Also remove the explicit folder record itself if it exists
        if (folderEntry && f.id === folderEntry.id) return false;
        // Be defensive: remove any folder item matching name+parentPath
        if (
          f.type === "folder" &&
          f.name === folderName &&
          (f.folderName || "") === parentPath
        )
          return false;
        return true;
      })
    );
    try {
      const url = folderEntry
        ? `/api/user/files/${folderEntry.id}`
        : `/api/admin/folders/delete`;
      const method = folderEntry ? "DELETE" : "POST";
      const res = await fetch(url, {
        method,
        headers: folderEntry
          ? undefined
          : { "Content-Type": "application/json" },
        body: folderEntry
          ? undefined
          : JSON.stringify({
              selectedUserId: selectedUser,
              parentPath,
              folderName,
              isPrivate: true,
            }),
      });
      if (!res.ok) throw new Error("Failed to delete folder");
      toast.success("Folder deleted successfully");
      // UI already updated optimistically
    } catch (e) {
      setPrivateFilesData(prev);
      toast.error("Failed to delete folder");
    }
  };

  const handleResponseDeleteFolder = async (folderName: string) => {
    const parentPath = responseFilesPath;
    const folderEntry = (responseFilesData || [])?.find(
      (f) =>
        f.type === "folder" &&
        f.name === folderName &&
        (f.folderName || "") === parentPath
    );
    const full = parentPath ? `${parentPath}/${folderName}` : folderName;
    const prev = responseFilesData;
    setResponseFilesData((curr) =>
      (curr || []).filter((f) => {
        const fn = f.folderName || "";
        // Remove any descendants under the folder path
        if (fn.startsWith(full)) return false;
        // Also remove the explicit folder record itself if it exists
        if (folderEntry && f.id === folderEntry.id) return false;
        // Be defensive: remove any folder item matching name+parentPath
        if (
          f.type === "folder" &&
          f.name === folderName &&
          (f.folderName || "") === parentPath
        )
          return false;
        return true;
      })
    );
    try {
      const url = folderEntry
        ? `/api/user/files/${folderEntry.id}`
        : `/api/admin/folders/delete`;
      const method = folderEntry ? "DELETE" : "POST";
      const res = await fetch(url, {
        method,
        headers: folderEntry
          ? undefined
          : { "Content-Type": "application/json" },
        body: folderEntry
          ? undefined
          : JSON.stringify({
              selectedUserId: selectedUser,
              parentPath,
              folderName,
              isPrivate: false,
            }),
      });
      if (!res.ok) throw new Error("Failed to delete folder");
      toast.success("Folder deleted successfully");
      // UI already updated optimistically
    } catch (e) {
      setResponseFilesData(prev);
      toast.error("Failed to delete folder");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              {!isUsersCollapsed && (
                <CardDescription>
                  Select a user to manage their documents
                </CardDescription>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsUsersCollapsed(!isUsersCollapsed)}
              className="h-8 w-8 p-0"
            >
              {isUsersCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </div>
          {isUsersCollapsed && selectedUser && (
            <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-3 h-3 text-blue-600" />
              </div>
              <span>
                {users.find((u) => u.id === selectedUser)?.email ||
                  "Selected user"}
              </span>
            </div>
          )}
        </CardHeader>
        {!isUsersCollapsed && (
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <Loader size={48} className="mb-2 text-blue-500" />
                Loading users...
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Search users by email..."
                  className="w-full max-w-md p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
                <div className="max-h-80 overflow-y-auto">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 pr-2">
                    {users
                      .filter((user) =>
                        user.email
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      )
                      .map((user) => (
                        <div
                          key={user.id}
                          onClick={() => onUserSelect(user.id)}
                          className={`p-2 rounded-md cursor-pointer transition-all duration-200 ${
                            selectedUser === user.id
                              ? "bg-blue-50 border-2 border-blue-300 shadow-sm"
                              : "bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-2 h-2 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-900 truncate">
                                {user.email}
                              </p>
                              <p className="text-xs text-gray-500">
                                {user.uploadedFiles} files
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      <div>
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
                  <CardTitle>Files from User</CardTitle>
                  <CardDescription>
                    Files uploaded by the user, and their archived files.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="uploaded">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="uploaded">Uploaded</TabsTrigger>
                      <TabsTrigger value="archived">Archived</TabsTrigger>
                    </TabsList>
                    <TabsContent value="uploaded" className="pt-4">
                      <FileBrowser
                        files={processedUploadedFiles}
                        folders={processedUploadedFolders}
                        isLoading={userDetailsLoading}
                        currentPath={uploadedFilesPath}
                        onPathChange={setUploadedFilesPath}
                        showAddFolderButton={false}
                        showUploadButton={false}
                        isUploading={false}
                        handleFileSelect={() => {}}
                        handleFileUpload={() => {}}
                        selectedFiles={[]}
                        onRemoveSelectedFile={() => {}}
                        onClearSelectedFiles={() => {}}
                        onSelectedFileNameChange={() => {}}
                        theme="user"
                      />
                    </TabsContent>
                    <TabsContent value="archived" className="pt-4">
                      <FileBrowser
                        files={processedArchivedFiles}
                        folders={processedArchivedFolders}
                        isLoading={userDetailsLoading}
                        currentPath={archivedFilesPath}
                        onPathChange={setArchivedFilesPath}
                        showAddFolderButton={false}
                        showUploadButton={false}
                        isUploading={false}
                        handleFileSelect={() => {}}
                        handleFileUpload={() => {}}
                        selectedFiles={[]}
                        onRemoveSelectedFile={() => {}}
                        onClearSelectedFiles={() => {}}
                        onSelectedFileNameChange={() => {}}
                        theme="archive"
                      />
                    </TabsContent>
                  </Tabs>
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
                    <TabsList className="flex flex-col sm:flex-row gap-2 w-full bg-gray-100">
                      <TabsTrigger
                        value="private"
                        className="w-full flex-1 flex items-center justify-center bg-gray-100 text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900"
                      >
                        <EyeOff className="w-4 h-4" />
                        <span>Work in Progress - Internal Use</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="response"
                        className="w-full flex-1 flex items-center justify-center bg-gray-100 text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Response Documents</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="private" className="space-y-4 pt-4">
                      <FileBrowser
                        files={processedPrivateFiles}
                        folders={processedPrivateFolders}
                        isLoading={userDetailsLoading}
                        currentPath={privateFilesPath}
                        onPathChange={setPrivateFilesPath}
                        onFolderCreate={(name) =>
                          handleAdminFolderCreate(
                            name,
                            privateFilesPath,
                            "private"
                          )
                        }
                        onRenameFile={handlePrivateRenameFile}
                        onRenameFolder={handlePrivateRenameFolder}
                        onDeleteFile={handlePrivateDeleteFile}
                        onDeleteFolder={handlePrivateDeleteFolder}
                        isUploading={privateUploadLoading}
                        handleFileSelect={handlePrivateFileSelect}
                        handleFileUpload={handlePrivateFileUploadById}
                        handleConfirmAll={handlePrivateConfirmAll}
                        selectedFiles={privateSelectedFiles.map((f) => ({
                          id: f.id,
                          name: f.name,
                        }))}
                        onRemoveSelectedFile={handleRemovePrivateSelectedFile}
                        onClearSelectedFiles={handleClearPrivateSelectedFiles}
                        onSelectedFileNameChange={
                          handlePrivateSelectedFileNameChange
                        }
                        theme="admin-private"
                        uploadingIds={privateUploadingIds}
                      />
                    </TabsContent>

                    <TabsContent value="response" className="space-y-4 pt-4">
                      <FileBrowser
                        files={processedResponseFiles}
                        folders={processedResponseFolders}
                        isLoading={userDetailsLoading}
                        currentPath={responseFilesPath}
                        onPathChange={setResponseFilesPath}
                        onFolderCreate={(name) =>
                          handleAdminFolderCreate(
                            name,
                            responseFilesPath,
                            "response"
                          )
                        }
                        onRenameFile={handleResponseRenameFile}
                        onRenameFolder={handleResponseRenameFolder}
                        onDeleteFile={handleResponseDeleteFile}
                        onDeleteFolder={handleResponseDeleteFolder}
                        isUploading={responseUploadLoading}
                        handleFileSelect={handleResponseFileSelect}
                        handleFileUpload={handleResponseFileUploadById}
                        handleConfirmAll={handleResponseConfirmAll}
                        selectedFiles={responseSelectedFiles.map((f) => ({
                          id: f.id,
                          name: f.name,
                        }))}
                        onRemoveSelectedFile={handleRemoveResponseSelectedFile}
                        onClearSelectedFiles={handleClearResponseSelectedFiles}
                        onSelectedFileNameChange={
                          handleResponseSelectedFileNameChange
                        }
                        theme="admin-response"
                        uploadingIds={responseUploadingIds}
                      />
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
                Choose a user from above to manage their documents
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
