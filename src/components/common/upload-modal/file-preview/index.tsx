import InsertDriveFileIcon from "@/assets/rate-libraries/fileUploaded.svg";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import type { SelectedFile, UploadState } from "../../../hooks/useFileUpload";

interface FilePreviewProps {
  file: SelectedFile;
  uploadState: UploadState;
  onRemove: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  uploadState,
  onRemove,
}) => {
  const theme = useTheme();

  const getStatusText = () => {
    switch (uploadState) {
      case "uploading":
        return "Loading";
      case "complete":
        return "Complete";
      case "error":
        return "Error";
      default:
        return "Ready";
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          border: `1px solid ${theme.palette.grey[300]}`,
          borderRadius: 1,
          gap: 2,
          bgcolor: "transparent",
        }}
      >
        <img
          src={InsertDriveFileIcon}
          alt="Uploaded File"
          width={42}
          height={42}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
            {file.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {file.size}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              •
            </Typography>
            <Typography
              variant="body2"
              color={uploadState === "error" ? "error" : "text.secondary"}
            >
              {getStatusText()}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {uploadState === "uploading" && (
            <CircularProgress size={20} sx={{ color: theme.palette.divider }} />
          )}
          {uploadState === "complete" && (
            <CheckCircleIcon
              sx={{
                color: "#4CAF50",
                fontSize: 20,
              }}
            />
          )}
          <IconButton
            onClick={onRemove}
            size="small"
            sx={{ color: theme.palette.grey[500] }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default FilePreview;
