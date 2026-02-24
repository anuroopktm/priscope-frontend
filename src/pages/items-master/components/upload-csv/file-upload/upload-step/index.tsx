import React, {
  useState,
  useCallback,
  type ChangeEvent,
  type DragEvent,
} from "react";
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Paper,
} from "@mui/material";
import {
  InsertDriveFileOutlined as FileIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import {
  ACCEPTED_FILE_TYPES,
  type UploadedFile,
  isValidFileType,
} from "@/pages/items-master/constants/upload.constants";
import { getFileHeaders } from "@/pages/items-master/utils/getFileHeaders";
import { useItemMasterStore } from "../../../../store/itemMasterStore";
import uploadIcon from "@/assets/items-master/upload-icon.svg";
import { theme } from "@/theme/theme";
// import Image from "next/image";

type FileUploadStepProps = {
  uploadedFile: UploadedFile | null;
  fileStatus: "loading" | "complete" | "";
  onFileUpload: (file: UploadedFile) => void;
  onFileRemove: () => void;
  onStatusChange: (status: "loading" | "complete" | "") => void;
  onHeadersFetched: (headers: string[]) => void;
  isUploadPending: boolean;
};

const DropZone = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isDragOver",
})<{ isDragOver: boolean }>(({ theme, isDragOver }) => ({
  border: `1px dashed ${
    isDragOver ? theme.palette.primary.main : theme.palette.grey[300]
  }`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main,
  },
}));

const FileItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  boxShadow: "none",
}));

const FileUploadStep: React.FC<FileUploadStepProps> = ({
  uploadedFile,
  fileStatus,
  onFileUpload,
  onFileRemove,
  onStatusChange,
  onHeadersFetched,
  isUploadPending,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const setHeaders = useItemMasterStore((s) => s.setHeaders);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    if (file && isValidFileType(file)) {
      handleFileUpload(file);
    }
  }, []);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleFileUpload = async (file: File) => {
    const uploadedFileData: UploadedFile = {
      name: file.name,
      size: `${Math.round(file.size / 1024)}kb`,
      file,
    };

    onFileUpload(uploadedFileData);
    onStatusChange("loading");

    try {
      const headers = await getFileHeaders(file);
      setHeaders(headers);
      onHeadersFetched(headers);
      onStatusChange("complete");
    } catch (error) {
      console.error("Error parsing CSV headers:", error);
      onStatusChange("");
    }
  };

  const handleRemoveFile = () => {
    onFileRemove();
    onStatusChange("");
    onHeadersFetched([]); // Clear headers when file is removed
  };

  return (
    <Box>
      <Typography
        variant="subtitle1"
        sx={{
          color: theme.palette.primary.main,
          fontWeight: 600,
          fontSize: 16,
        }}
      >
        Upload File
      </Typography>
      {!uploadedFile ? (
        <DropZone
          isDragOver={isDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img src={uploadIcon} alt="upload-icon" width={35} height={35} />
          </Box>
          <Typography
            variant="body1"
            sx={{ color: theme.palette.primary.main }}
          >
            Drag and drop CSV/Excel File
          </Typography>
          <input
            id="file-input"
            type="file"
            accept={ACCEPTED_FILE_TYPES}
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
        </DropZone>
      ) : (
        <FileItem>
          <FileIcon
            sx={{ color: theme.palette.brand.buttonBg, fontSize: 40 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography fontWeight="normal">{uploadedFile.name}</Typography>
            <Typography
              variant="caption"
              color={theme.palette.brand.subTextColor}
            >
              {uploadedFile.size}
              <Box
                component="span"
                sx={{ mx: 0.5, color: theme.palette.brand.subTextColor }}
              >
                •
              </Box>
              {fileStatus === "loading"
                ? "Loading..."
                : fileStatus === "complete"
                  ? "Completed"
                  : ""}
            </Typography>
          </Box>

          <IconButton onClick={handleRemoveFile} disabled={isUploadPending}>
            <DeleteIcon />
          </IconButton>
          {fileStatus === "loading" && (
            <Box sx={{ ml: 1 }}>
              <CircularProgress />
            </Box>
          )}
          {fileStatus === "complete" && <CheckCircleIcon color="success" />}
        </FileItem>
      )}
    </Box>
  );
};

export default FileUploadStep;
