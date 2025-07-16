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
  onPrivateUpload: (folderPath: string) => Promise<void>;
  onResponseUpload: (folderPath: string) => Promise<void>;
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
                        selectedFile={null}
                        setSelectedFile={() => {}}
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
                        selectedFile={null}
                        setSelectedFile={() => {}}
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
                        isUploading={privateUploadLoading}
                        handleFileSelect={(e) =>
                          onPrivateFileSelect(e.target.files?.[0] || null)
                        }
                        handleFileUpload={() =>
                          onPrivateUpload(privateFilesPath)
                        }
                        selectedFile={privateUploadFile}
                        setSelectedFile={() => onPrivateFileSelect(null)}
                        theme="admin-private"
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
                        isUploading={responseUploadLoading}
                        handleFileSelect={(e) =>
                          onResponseFileSelect(e.target.files?.[0] || null)
                        }
                        handleFileUpload={() =>
                          onResponseUpload(responseFilesPath)
                        }
                        selectedFile={responseUploadFile}
                        setSelectedFile={() => onResponseFileSelect(null)}
                        theme="admin-response"
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
