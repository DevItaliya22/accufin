import FileBrowser from "@/app/_component/FileBrowser";
import { ManagedFile } from "@/types/files";

type ArchiveTabProps = {
  archivedFiles: ManagedFile[];
  folders: string[];
  isLoading: boolean;
  currentPath: string;
  onPathChange: (path: string) => void;
  onFileUnarchive: (fileId: string) => void;
};

export default function ArchiveTab({
  archivedFiles,
  folders,
  isLoading,
  currentPath,
  onPathChange,
  onFileUnarchive,
}: ArchiveTabProps) {
  return (
    <FileBrowser
      files={archivedFiles}
      folders={folders}
      isLoading={isLoading}
      currentPath={currentPath}
      onPathChange={onPathChange}
      onFileUnarchive={onFileUnarchive}
      // Read-only mode for most actions
      showUploadButton={false}
      showAddFolderButton={false}
      isUploading={false}
      handleFileSelect={() => {}}
      handleFileUpload={() => {}}
      selectedFile={null}
      setSelectedFile={() => {}}
      theme="archive"
    />
  );
}
