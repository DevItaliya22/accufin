import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FileText, Upload, Download } from "lucide-react";
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
  isLoading: boolean;
  selectedFile: SelectedFile | null;
  isUploading: boolean;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileUpload: () => void;
  setSelectedFile: (file: SelectedFile | null) => void;
  fetchData: () => void;
};

export default function UploadTab({
  uploadedFiles,
  isLoading,
  selectedFile,
  isUploading,
  handleFileSelect,
  handleFileUpload,
  setSelectedFile,
  fetchData,
}: UploadTabProps) {
  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Upload your files for processing and admin review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports PDF, DOC, DOCX, and image files
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
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Choose File
              </Button>
            </div>
            {selectedFile && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 m-4 bg-gray-50 rounded-lg">
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
        </CardContent>
      </Card>
      {/* My Uploaded Files */}
      <Card>
        <CardHeader>
          <CardTitle>My Uploaded Files</CardTitle>
          <CardDescription>
            View and manage your uploaded documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : uploadedFiles.length > 0 ? (
              uploadedFiles.map((file) => (
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
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">
                  No Files Uploaded Yet
                </p>
                <p className="text-sm">
                  Upload your first document to get started
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
