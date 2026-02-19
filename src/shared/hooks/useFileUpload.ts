"use client";
import { useState, useCallback } from "react";
import { FileData, UploadState } from "../types/upload-modal";

export const useFileUpload = (
  acceptedFileTypes: string[],
  maxFileSize: number
) => {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const validateFile = useCallback(
    (file: File): string | null => {
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!acceptedFileTypes.includes(fileExtension)) {
        return `Please select a valid file type: ${acceptedFileTypes.join(
          ", "
        )}`;
      }

      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxFileSize) {
        return `File size must be less than ${maxFileSize}MB`;
      }

      return null;
    },
    [acceptedFileTypes, maxFileSize]
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      const validationError = validateFile(file);

      if (validationError) {
        setErrorMessage(validationError);
        setUploadState("error");
        return;
      }

      setSelectedFile({
        name: file.name,
        size: `${Math.round(file.size / 1024)}kb`,
        file: file,
      });

      setUploadState("complete"); 
      setErrorMessage("");
    },
    [validateFile]
  );

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadState("idle");
    setErrorMessage("");
  };

  const resetUpload = () => {
    setUploadState("idle");
    setSelectedFile(null);
    setIsDragOver(false);
    setErrorMessage("");
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
