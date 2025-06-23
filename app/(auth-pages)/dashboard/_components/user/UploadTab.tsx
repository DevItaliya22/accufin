import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FileText, Upload, Download, Folder, ChevronRight } from "lucide-react";
import React from "react";

type FileRecord = {
  id: string;
  url: string;
  path: string;
  name: string | null;
  size: string | null;
  type: string | null;
  createdAt: string;
  updatedAt: string;
  folderName?: string | null;
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

type UploadTabProps = {
  uploadedFiles: FileRecord[];
  folders: string[];
  isLoading: boolean;
  selectedFile: SelectedFile | null;
  isUploading: boolean;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileUpload: () => void;
  setSelectedFile: (file: SelectedFile | null) => void;
  fetchData: () => void;
  currentPath: string;
  setCurrentPath: (path: string) => void;
};

const Breadcrumbs = ({
  path,
  setPath,
}: {
  path: string;
  setPath: (path: string) => void;
}) => {
  const parts = path.split("/").filter((p) => p);
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
      <button onClick={() => setPath("")} className="hover:underline">
        All Folders
      </button>
      {parts.map((part, index) => {
        const current = parts.slice(0, index + 1).join("/");
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-4 h-4" />
            <button
              onClick={() => setPath(current)}
              className="hover:underline"
            >
              {part}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default function UploadTab({
  uploadedFiles,
  folders,
  isLoading,
  selectedFile,
  isUploading,
  handleFileSelect,
  handleFileUpload,
  setSelectedFile,
  currentPath,
  setCurrentPath,
}: UploadTabProps) {
  const handleFolderDoubleClick = (folderName: string) => {
    setCurrentPath(currentPath ? `${currentPath}/${folderName}` : folderName);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>File Management</CardTitle>
          <CardDescription>
            Double-click folders to open them, and upload files to the current
            directory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Breadcrumbs path={currentPath} setPath={setCurrentPath} />

          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                {folders.map((folder) => (
                  <div
                    key={folder}
                    onDoubleClick={() => handleFolderDoubleClick(folder)}
                    className="flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <Folder className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500" />
                    <span className="mt-2 text-sm font-medium text-center truncate w-full">
                      {folder}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {uploadedFiles.map((file) => (
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
                ))}
              </div>

              {!isLoading &&
                uploadedFiles.length === 0 &&
                folders.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Folder className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">
                      This folder is empty
                    </p>
                  </div>
                )}
            </>
          )}

          {/* Upload Section */}
          <div className="mt-8 border-t pt-8">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop files here or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Files will be uploaded to the current folder
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
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
