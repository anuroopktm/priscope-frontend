import UploadFileImage from "@/assets/rate-libraries/uploadfile.svg";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useCallback } from "react";

interface UploadDropZoneProps {
  isDragOver: boolean;
  onDragOver: (isDragOver: boolean) => void;
  onFileSelect: (file: File) => void;
  acceptedFileTypes: string[];
}

const UploadDropZone: React.FC<UploadDropZoneProps> = ({
  isDragOver,
  onDragOver,
  onFileSelect,
  acceptedFileTypes,
}) => {
  const theme = useTheme();

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      onDragOver(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect, onDragOver],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      onDragOver(true);
    },
    [onDragOver],
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      onDragOver(false);
    },
    [onDragOver],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect],
  );

  const getAcceptString = () => acceptedFileTypes.join(",");

  return (
    <Box
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      sx={{
        border: `1px dashed ${
          isDragOver ? theme.palette.primary.main : theme.palette.grey[300]
        }`,
        borderRadius: 2,
        p: 4,
        textAlign: "center",
        bgcolor: isDragOver ? theme.palette.action.hover : "transparent",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        minHeight: "120px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
        mb: 3,
      }}
      onClick={() => document.getElementById("file-input")?.click()}
    >
      <img src={UploadFileImage} alt="Upload File" width={42} height={42} />
      <Typography color="text.secondary" fontSize={14}>
        Drag and drop CSV/Excel File
      </Typography>
      <input
        id="file-input"
        type="file"
        accept={getAcceptString()}
        onChange={handleFileInputChange}
        style={{ display: "none" }}
      />
    </Box>
  );
};

export default UploadDropZone;
