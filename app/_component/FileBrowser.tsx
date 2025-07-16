import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Upload,
  Download,
  Folder,
  ChevronRight,
  Plus,
  Archive,
  ArchiveRestore,
} from "lucide-react";
import React, { useState } from "react";
import { ManagedFile } from "@/types/files";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

type FileBrowserProps = {
  files: ManagedFile[];
  folders: string[];
  isLoading: boolean;
  currentPath: string;
  onPathChange: (path: string) => void;
  onFolderCreate?: (folderName: string) => void;
  isUploading: boolean;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileUpload: () => void;
  selectedFile: { name: string } | null;
  setSelectedFile: (file: null) => void;
  onFileArchive?: (fileId: string) => void;
  onFileUnarchive?: (fileId: string) => void;
  showUploadButton?: boolean;
  showAddFolderButton?: boolean;
  theme?: "user" | "admin-private" | "admin-response" | "archive";
};

const Breadcrumbs = ({
  path,
  setPath,
  theme = "user",
}: {
  path: string;
  setPath: (path: string) => void;
  theme?: string;
}) => {
  const parts = path.split("/").filter((p) => p);

  const breadcrumbColors = {
    user: "text-blue-600",
    "admin-private": "text-purple-600",
    "admin-response": "text-green-600",
    archive: "text-gray-600",
  };

  const currentColor =
    breadcrumbColors[theme as keyof typeof breadcrumbColors] || "text-gray-500";

  return (
    <div
      className={`flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm mb-4 overflow-x-auto pb-1 ${currentColor}`}
    >
      <button
        onClick={() => setPath("")}
        className="hover:underline whitespace-nowrap"
      >
        All Folders
      </button>
      {parts.map((part, index) => {
        const current = parts.slice(0, index + 1).join("/");
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <button
              onClick={() => setPath(current)}
              className="hover:underline whitespace-nowrap"
            >
              {part}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default function FileBrowser({
  files,
  folders,
  isLoading,
  currentPath,
  onPathChange,
  onFolderCreate,
  isUploading,
  handleFileSelect,
  handleFileUpload,
  selectedFile,
  setSelectedFile,
  onFileArchive,
  onFileUnarchive,
  showUploadButton = true,
  showAddFolderButton = true,
  theme = "user",
}: FileBrowserProps) {
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);

  // Color theme system
  const colorTheme = {
    user: {
      folder: "text-blue-700",
      file: "text-blue-800",
      bg: "bg-blue-50",
      border: "border-blue-300",
      hover: "hover:bg-blue-100",
      card: "bg-blue-50",
      cardBorder: "border-blue-400",
      headerBg: "bg-blue-100",
      headerText: "text-blue-900",
    },
    "admin-private": {
      folder: "text-purple-700",
      file: "text-purple-800",
      bg: "bg-purple-50",
      border: "border-purple-300",
      hover: "hover:bg-purple-100",
      card: "bg-purple-50",
      cardBorder: "border-purple-400",
      headerBg: "bg-purple-100",
      headerText: "text-purple-900",
    },
    "admin-response": {
      folder: "text-green-700",
      file: "text-green-800",
      bg: "bg-green-50",
      border: "border-green-300",
      hover: "hover:bg-green-100",
      card: "bg-green-50",
      cardBorder: "border-green-400",
      headerBg: "bg-green-100",
      headerText: "text-green-900",
    },
    archive: {
      folder: "text-gray-700",
      file: "text-gray-800",
      bg: "bg-gray-100",
      border: "border-gray-400",
      hover: "hover:bg-gray-200",
      card: "bg-gray-100",
      cardBorder: "border-gray-500",
      headerBg: "bg-gray-200",
      headerText: "text-gray-900",
    },
  };

  const currentTheme = colorTheme[theme];

  // Simple drag and drop handlers - no UI feedback
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      // Create the exact same event structure that the file input would create
      const fakeEvent = {
        target: {
          files: e.dataTransfer.files,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      handleFileSelect(fakeEvent);
    }
  };

  const handleFolderDoubleClick = (folderName: string) => {
    onPathChange(currentPath ? `${currentPath}/${folderName}` : folderName);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim() && onFolderCreate) {
      if (newFolderName.includes("/")) {
        toast.error("Folder name cannot contain '/'");
        return;
      }
      onFolderCreate(newFolderName.trim());
      setNewFolderName("");
      setShowNewFolderDialog(false);
    }
  };

  return (
    <>
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
            />
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleCreateFolder} className="w-full sm:w-auto">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div
        className="relative"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <Card className={`shadow-none border-0 ${currentTheme.bg}`}>
          <CardHeader
            className={`border-0 ${currentTheme.headerBg} ${currentTheme.headerText} ${currentTheme.bg}`}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg sm:text-xl">
                  File Management
                </CardTitle>
                <Breadcrumbs
                  path={currentPath}
                  setPath={onPathChange}
                  theme={theme}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {showAddFolderButton && onFolderCreate && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewFolderDialog(true)}
                    className={`w-full sm:w-auto ${currentTheme.border} ${currentTheme.hover}`}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Folder
                  </Button>
                )}
                {showUploadButton && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                    className={`w-full sm:w-auto ${currentTheme.border} ${currentTheme.hover}`}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                )}
                {showUploadButton && (
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    id="file-upload"
                    className="hidden"
                  />
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className={`p-0 sm:p-6 ${currentTheme.bg}`}>
            {selectedFile && (
              <div
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 mb-4 rounded-lg border gap-3 ${currentTheme.bg} ${currentTheme.border}`}
              >
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <FileText
                    className={`w-5 h-5 ${currentTheme.file} flex-shrink-0`}
                  />
                  <p className="font-medium text-sm truncate">
                    {selectedFile.name}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleFileUpload}
                    disabled={isUploading}
                    className="w-full sm:w-auto"
                  >
                    {isUploading ? "Uploading..." : "Confirm Upload"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : (
              <div className={`max-h-80 overflow-y-auto ${currentTheme.bg}`}>
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4 pr-2 ${currentTheme.bg}`}
                >
                  {folders.map((folder) => (
                    <div
                      key={folder}
                      onClick={() => handleFolderDoubleClick(folder)}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${currentTheme.border} ${currentTheme.hover}`}
                    >
                      <Folder
                        className={`w-6 h-6 ${currentTheme.folder} flex-shrink-0 mr-3`}
                      />
                      <span className="text-sm font-medium truncate flex-1">
                        {folder}
                      </span>
                    </div>
                  ))}
                </div>
                <div className={`space-y-2 pr-2 ${currentTheme.bg}`}>
                  {files.map((file) => (
                    <div
                      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border-2 rounded-lg ${currentTheme.border}`}
                      key={file.id}
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <FileText
                          className={`w-6 h-6 ${currentTheme.file} flex-shrink-0`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate text-sm">
                            {file.name}
                          </p>
                          {file.size && file.createdAt && (
                            <p className="text-xs text-gray-500 truncate">
                              {file.size} •{" "}
                              {new Date(file.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`whitespace-nowrap w-full sm:w-auto ${currentTheme.border} ${currentTheme.hover}`}
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
                        {onFileArchive && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onFileArchive(file.id)}
                            className="w-full sm:w-auto"
                          >
                            <Archive className="w-4 h-4 mr-2" />
                            Archive
                          </Button>
                        )}
                        {onFileUnarchive && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onFileUnarchive(file.id)}
                            className="w-full sm:w-auto"
                          >
                            <ArchiveRestore className="w-4 h-4 mr-2" />
                            Unarchive
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {!isLoading && files.length === 0 && folders.length === 0 && (
                  <div className="text-center py-6 sm:py-8 text-gray-500">
                    <Folder
                      className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 ${currentTheme.folder} opacity-30`}
                    />
                    <p className="text-base sm:text-lg font-medium mb-2">
                      This folder is empty
                    </p>
                    <p className="text-xs sm:text-sm px-4">
                      Drag and drop files here or use the upload button
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
