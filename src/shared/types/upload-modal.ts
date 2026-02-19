export interface FileData {
  name: string;
  size: string;
  file: File;
}

export type UploadState = "idle" | "uploading" | "complete" | "error";

export interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onImportComplete?: (fileData: FileData) => void;
  templateDownloadUrl?: string;
  templateName?: string;
  acceptedFileTypes?: string[];
  maxFileSize?: number; 
  feature: string;
  setShowLoader: React.Dispatch<React.SetStateAction<boolean>>;
}
