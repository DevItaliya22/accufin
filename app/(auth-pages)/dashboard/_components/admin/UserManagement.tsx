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
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "@/components/ui/loader";
import { useRef } from "react";

interface User {
  id: string;
  email: string;
  uploadedFiles: number;
}

interface UserDetails {
  userUploadedFiles?: Array<{
    id: string;
    name: string;
    size: string;
    url: string;
    createdAt?: string;
  }>;
  userPrivateFiles?: Array<{
    id: string;
    name: string;
    size: string;
    url: string;
    createdAt?: string;
  }>;
  userReceivedFiles?: Array<{
    id: string;
    name: string;
    size: string;
    url: string;
    createdAt?: string;
  }>;
}

interface UserManagementProps {
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
}

export default function UserManagement({
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
}: UserManagementProps) {
  const privateFileInputRef = useRef<HTMLInputElement>(null);
  const responseFileInputRef = useRef<HTMLInputElement>(null);

  const handlePrivateFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onPrivateFileSelect(file || null);
  };

  const handleResponseFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onResponseFileSelect(file || null);
  };

  const openPrivateFilePicker = () => {
    privateFileInputRef.current?.click();
  };

  const openResponseFilePicker = () => {
    responseFileInputRef.current?.click();
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
                  <CardTitle>Uploaded Files</CardTitle>
                  <CardDescription>Files uploaded by the user</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userDetails.userUploadedFiles && userDetails.userUploadedFiles.length > 0 ? (
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
                              onClick={() => onPrivateFileSelect(null)}
                              disabled={privateUploadLoading}
                            >
                              Remove
                            </Button>
                            <Button
                              onClick={onPrivateUpload}
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
                        {userDetails.userPrivateFiles && userDetails.userPrivateFiles.length > 0 ? (
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
                              onClick={() => onResponseFileSelect(null)}
                              disabled={responseUploadLoading}
                            >
                              Remove
                            </Button>
                            <Button
                              onClick={onResponseUpload}
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
                        <h4 className="font-medium">Response Documents</h4>
                        {userDetails.userReceivedFiles && userDetails.userReceivedFiles.length > 0 ? (
                          userDetails.userReceivedFiles.map((doc: any) => (
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
                Choose a user from the left panel to manage their documents
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
