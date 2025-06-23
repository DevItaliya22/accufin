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
}: FileBrowserProps) {
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);

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
        <DialogContent>
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
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>File Management</CardTitle>
              <Breadcrumbs path={currentPath} setPath={onPathChange} />
            </div>
            <div className="flex gap-2">
              {showAddFolderButton && onFolderCreate && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewFolderDialog(true)}
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
        <CardContent>
          {selectedFile && (
            <div className="flex items-center justify-between p-2 mb-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <p className="font-medium text-sm">{selectedFile.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleFileUpload}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Confirm Upload"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

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

              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    className="flex items-center justify-between gap-3 p-2 border rounded-lg"
                    key={file.id}
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <FileText className="w-6 h-6 text-blue-600 flex-shrink-0" />
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
                      {onFileArchive && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onFileArchive(file.id)}
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
                <div className="text-center py-8 text-gray-500">
                  <Folder className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">
                    This folder is empty
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
