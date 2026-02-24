"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Button,
  Typography,
  useTheme,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import { UploadModalProps } from "../../types/upload-modal";
import { useFileUpload } from "../../hooks/useFileUpload";
import UploadDropZone from "./upload-drop-zone";
import FilePreview from "./file-preview";
import ModalHeader from "./modal-header";
import ConfirmationDialog from "./confirmation-modal";

interface ExtendedUploadModalProps extends UploadModalProps {
  useUploadMutation?: () => {
    mutateAsync: (payload: {
      file: File;
      updateIfExists: boolean;
    }) => Promise<any>;
    isPending: boolean;
  };
}

type ToastState = {
  open: boolean;
  message: string;
  severity: "success" | "error";
};

const UploadModal: React.FC<ExtendedUploadModalProps> = ({
  open,
  onClose,
  onImportComplete,
  templateDownloadUrl,
  templateName = "Rate Template",
  acceptedFileTypes = [".csv", ".xlsx", ".xls"],
  maxFileSize = 10,
  useUploadMutation,
  feature,
  setShowLoader,
}) => {
  const theme = useTheme();
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    severity: "success",
  });

  const [overwriteModal, setShowOverwriteModal] = useState(false);

  const uploadMutation = useUploadMutation?.();

  const {
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
  } = useFileUpload(acceptedFileTypes, maxFileSize);

  const showToast = (message: string, severity: "success" | "error") => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const handleUpload = async (updateIfExists: boolean) => {
    if (!selectedFile) return;

    try {
      setUploadState("uploading");
      setErrorMessage("");

      if (uploadMutation) {
        const result = await uploadMutation.mutateAsync({
          file: selectedFile.file,
          updateIfExists,
        });

        if (onImportComplete) {
          onImportComplete(result);
        }

        setUploadState("complete");
        showToast("File uploaded successfully!", "success");

        setTimeout(() => {
          handleClose();
        }, 1500);
      }
    } catch (error) {
      setUploadState("error");
      const errorMessage = "Upload failed. Please try again.";

      setErrorMessage(errorMessage);
      showToast(errorMessage, "error");
    }
  };

  const handleClose = () => {
    resetUpload();
    handleCloseToast();
    onClose();
  };

  const isUploading = uploadState === "uploading" || uploadMutation?.isPending;

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: theme.palette.background.paper,
            borderRadius: 12,
            minHeight: "300px",
            maxWidth: "700px",
          },
        }}
      >
        <ModalHeader
          onClose={handleClose}
          showTemplate={!selectedFile}
          templateDownloadUrl={templateDownloadUrl}
          templateName={templateName}
          feature={feature}
          setShowLoader={setShowLoader}
        />
        <Divider />

        <DialogContent sx={{ pt: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ mb: 1, fontWeight: 500, color: theme.custom.textColor }}
          >
            Upload File
          </Typography>

          {!selectedFile ? (
            <UploadDropZone
              isDragOver={isDragOver}
              onDragOver={setIsDragOver}
              onFileSelect={handleFileSelect}
              acceptedFileTypes={acceptedFileTypes}
            />
          ) : (
            <FilePreview
              file={selectedFile}
              uploadState={uploadState}
              onRemove={handleRemoveFile}
            />
          )}

          {errorMessage && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Typography>
          )}

          <Box sx={{ mt: 2 }}>
            <Button
              onClick={() => setShowOverwriteModal(true)}
              disabled={!selectedFile || isUploading}
              variant="contained"
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                px: 3,
                py: 1,
                bgcolor: theme.palette.sidebar.highlight,
                "&:hover": { bgcolor: "#0F3A5A" },
                "&:disabled": {
                  bgcolor: theme.palette.grey[300],
                  color: theme.palette.grey[500],
                },
              }}
            >
              {isUploading ? (
                <>
                  <CircularProgress size={16} sx={{ mr: 1, color: "white" }} />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={overwriteModal}
        onClose={() => {
          setShowOverwriteModal(false);
          handleUpload(false);
        }}
        onConfirm={() => {
          setShowOverwriteModal(false);
          handleUpload(true);
        }}
        message="If duplicates exist, should they be overwritten?"
        confirmText="Yes"
        cancelText="No"
      />

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={10000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UploadModal;
