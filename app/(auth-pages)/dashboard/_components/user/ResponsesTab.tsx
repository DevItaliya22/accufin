import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
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

type ResponsesTabProps = {
  responseFiles: FileRecord[];
  isLoading: boolean;
};

export default function ResponsesTab({
  responseFiles,
  isLoading,
}: ResponsesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Response Documents</CardTitle>
        <CardDescription>
          Documents shared by admin as responses to your uploads
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : responseFiles.length > 0 ? (
            responseFiles.map((file) => (
              <div
                key={file.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg bg-green-50 border-green-200"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {file.size} •{" "}
                      {new Date(file.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-300 text-green-700 hover:bg-green-100 whitespace-nowrap"
                  asChild
                >
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">
                No Response Documents Yet
              </p>
              <p className="text-sm">
                Admin will add response documents when available
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
