import FileBrowser from "@/app/_component/FileBrowser";
import { ManagedFile } from "@/types/files";

type ResponsesTabProps = {
  responseFiles: ManagedFile[];
  folders: string[];
  isLoading: boolean;
  currentPath: string;
  onPathChange: (path: string) => void;
};

export default function ResponsesTab({
  responseFiles,
  folders,
  isLoading,
  currentPath,
  onPathChange,
}: ResponsesTabProps) {
  return (
    <FileBrowser
      files={responseFiles}
      folders={folders}
      isLoading={isLoading}
      currentPath={currentPath}
      onPathChange={onPathChange}
      // The following props are for read-only mode
      isUploading={false}
      handleFileSelect={() => {}}
      handleFileUpload={() => {}}
      selectedFiles={[]}
      onRemoveSelectedFile={() => {}}
      showUploadButton={false}
      showAddFolderButton={false}
      theme="admin-response"
    />
  );
}
