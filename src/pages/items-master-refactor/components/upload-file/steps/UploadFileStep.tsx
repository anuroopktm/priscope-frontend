import uploadIcon from "@/assets/items-master/upload-icon.svg";
import { useUploadItemMasterFile } from "@/services/queries/item-master-refactor/item-master-refactor.queries";
import {
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  InsertDriveFileOutlined as FileIcon,
} from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
  ACCEPTED_FILE_TYPES,
  isValidFileType,
} from "../../../constants/upload.constants";
import { getFileHeaders } from "../../../utils/getFileHeaders";
import type { UploadFormValues } from "../types";

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
  border: `1px solid ${theme.palette.divider}`,
}));

const UploadFileStep = ({
  onHeadersFetched,
}: {
  onHeadersFetched: (headers: string[]) => void;
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { control, setValue } = useFormContext<UploadFormValues>();
  const file = useWatch({ control, name: "file" });
  const [fileStatus, setFileStatus] = useState<"loading" | "complete" | "">("");

  const { mutate: uploadFile, isPending } = useUploadItemMasterFile();

  const handleFileUpload = async (selectedFile: File) => {
    setValue("file", selectedFile);
    setFileStatus("loading");

    uploadFile(
      { file: selectedFile },
      {
        onSuccess: (data: { upload_id: string }) => {
          setValue("uploadId", data.upload_id);
          setFileStatus("complete");
          getFileHeaders(selectedFile).then(onHeadersFetched);
        },
        onError: () => {
          setFileStatus("");
        },
      },
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} mb={1}>
        Upload File
      </Typography>
      {!file ? (
        <DropZone
          isDragOver={isDragOver}
          onDragOver={(e: React.DragEvent) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e: React.DragEvent) => {
            e.preventDefault();
            setIsDragOver(false);
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile && isValidFileType(droppedFile))
              handleFileUpload(droppedFile);
          }}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <img src={uploadIcon} alt="upload" width={35} height={35} />
          </Box>
          <Typography color="primary">Drag and drop CSV/Excel File</Typography>
          <input
            id="file-input"
            type="file"
            accept={ACCEPTED_FILE_TYPES}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              e.target.files?.[0] && handleFileUpload(e.target.files[0])
            }
            style={{ display: "none" }}
          />
        </DropZone>
      ) : (
        <FileItem>
          <FileIcon color="primary" sx={{ fontSize: 40 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2">{file.name}</Typography>
            <Typography variant="caption" color="textSecondary">
              {Math.round(file.size / 1024)}kb •{" "}
              {fileStatus === "loading" ? "Uploading..." : "Completed"}
            </Typography>
          </Box>
          <IconButton
            onClick={() => {
              setValue("file", null);
              setFileStatus("");
            }}
            disabled={isPending}
          >
            <DeleteIcon />
          </IconButton>
          {fileStatus === "loading" && <CircularProgress size={20} />}
          {fileStatus === "complete" && <CheckCircleIcon color="success" />}
        </FileItem>
      )}
    </Box>
  );
};

export default UploadFileStep;
