import { useState } from "react";

export type UploadState = "idle" | "uploading" | "complete" | "error";

export interface SelectedFile {
    file: File;
    name: string;
    size: number;
}

export const useFileUpload = (acceptedFileTypes: string[], maxFileSizeMB: number) => {
    const [uploadState, setUploadState] = useState<UploadState>("idle");
    const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleFileSelect = (file: File) => {
        setErrorMessage("");
        const ext = Array.from(file.name.matchAll(/\.[^.]+/g)).pop();
        const fileExtension = ext ? ext[0].toLowerCase() : "";
        if (!acceptedFileTypes.includes(fileExtension)) {
            setErrorMessage(`Invalid file type. Accepted types: ${acceptedFileTypes.join(", ")}`);
            return;
        }
        if (file.size > maxFileSizeMB * 1024 * 1024) {
            setErrorMessage(`File size exceeds ${maxFileSizeMB}MB limit.`);
            return;
        }
        setSelectedFile({
            file,
            name: file.name,
            size: file.size,
        });
        setUploadState("idle");
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setUploadState("idle");
        setErrorMessage("");
    };

    const resetUpload = () => {
        setSelectedFile(null);
        setUploadState("idle");
        setErrorMessage("");
        setIsDragOver(false);
    };

    return {
        uploadState,
        selectedFile,
        isDragOver,
        errorMessage,
        setIsDragOver,
        setErrorMessage,
        setUploadState,
        handleFileSelect,
        handleRemoveFile,
        resetUpload,
    };
};
