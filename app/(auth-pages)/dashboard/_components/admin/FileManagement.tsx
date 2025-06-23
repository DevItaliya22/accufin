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
  Archive,
  ArchiveRestore,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "@/components/ui/loader";
import { useMemo, useState } from "react";
import FileBrowser from "@/app/_component/FileBrowser";
import { ManagedFile } from "@/types/files";
import { toast } from "react-hot-toast";

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
  onPrivateUpload: () => Promise<void>;
  onResponseUpload: () => Promise<void>;
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
      () => processFiles(userDetails?.userPrivateFiles, privateFilesPath),
      [userDetails?.userPrivateFiles, privateFilesPath]
    );

  const { files: processedResponseFiles, folders: processedResponseFolders } =
    useMemo(
      () => processFiles(userDetails?.userReceivedFiles, responseFilesPath),
      [userDetails?.userReceivedFiles, responseFilesPath]
    );

  const handleAdminFolderCreate = async (
    folderName: string,
    parentPath: string,
    type: "private" | "response"
  ) => {
    if (!selectedUser) return;
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
      toast.success("Folder created successfully");
      onRefreshUserDetails();
    } catch (err) {
      toast.error("Failed to create folder");
    }
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

  return (
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
                onChange={(e) => onSearchChange(e.target.value)}
              />
              {users
                .filter((user) =>
                  user.email.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((user) => (
                  <div
                    key={user.id}
                    onClick={() => onUserSelect(user.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedUser === user.id
                        ? "bg-blue-100 border-blue-300"
                        : "bg-gray-50 hover:bg-gray-100"
                    } border`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{user.email}</p>
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
                        selectedFile={null}
                        setSelectedFile={() => {}}
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
                        selectedFile={null}
                        setSelectedFile={() => {}}
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

                    <TabsContent value="private" className="space-y-4 pt-4">
                      <FileBrowser
                        files={processedPrivateFiles}
                        folders={processedPrivateFolders}
                        isLoading={userDetailsLoading}
                        currentPath={privateFilesPath}
                        onPathChange={setPrivateFilesPath}
                        onFileArchive={handleArchiveFile}
                        onFolderCreate={(name) =>
                          handleAdminFolderCreate(
                            name,
                            privateFilesPath,
                            "private"
                          )
                        }
                        isUploading={privateUploadLoading}
                        handleFileSelect={(e) =>
                          onPrivateFileSelect(e.target.files?.[0] || null)
                        }
                        handleFileUpload={onPrivateUpload}
                        selectedFile={privateUploadFile}
                        setSelectedFile={() => onPrivateFileSelect(null)}
                      />
                    </TabsContent>

                    <TabsContent value="response" className="space-y-4 pt-4">
                      <FileBrowser
                        files={processedResponseFiles}
                        folders={processedResponseFolders}
                        isLoading={userDetailsLoading}
                        currentPath={responseFilesPath}
                        onFileUnarchive={handleUnarchiveFile}
                        onPathChange={setResponseFilesPath}
                        onFolderCreate={(name) =>
                          handleAdminFolderCreate(
                            name,
                            responseFilesPath,
                            "response"
                          )
                        }
                        isUploading={responseUploadLoading}
                        handleFileSelect={(e) =>
                          onResponseFileSelect(e.target.files?.[0] || null)
                        }
                        handleFileUpload={onResponseUpload}
                        selectedFile={responseUploadFile}
                        setSelectedFile={() => onResponseFileSelect(null)}
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
                Choose a user from the left panel to manage their documents
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
