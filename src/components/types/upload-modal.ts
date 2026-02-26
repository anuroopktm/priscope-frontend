export interface UploadModalProps {
    open: boolean;
    onClose: () => void;
    onImportComplete?: (result: any) => void;
    templateDownloadUrl?: string;
    templateName?: string;
    acceptedFileTypes?: string[];
    maxFileSize?: number;
    feature?: string;
    setShowLoader?: React.Dispatch<React.SetStateAction<boolean>>;
}
