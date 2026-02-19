"use client";

import theme from "@/shared/styles/theme";
import { ActionType, ProgressEvent } from "@/shared/types/progress.types";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Props = {
  event: ProgressEvent;
  setShowFilesModal: Dispatch<SetStateAction<boolean>>;
  setModule: Dispatch<SetStateAction<string>>;
  setActiveTab: Dispatch<SetStateAction<"uploaded" | "downloaded">>;
};

export default function ProgressCard({ event, setShowFilesModal, setModule, setActiveTab }: Props) {
  const { status, processed_rows = 0, total_rows = 0, action, type } = event;
  const EVENT_TYPE = type === "upload_progress" ? "Upload" : "Export"

  const isFailed = status === "processed_failed";

  const targetProgress =
    total_rows > 0
      ? Math.min(100, Math.round((processed_rows / total_rows) * 100))
      : 0;

  const [progress, setProgress] = useState(targetProgress);

  const isProcessed = status === "processed";

  useEffect(() => {
    setProgress(targetProgress);
  }, [targetProgress]);

  const handleViewFiles = (action: ActionType) => {
    // const event = new CustomEvent<ActionType>(`${action}-ViewFileEvent`);
    // window.dispatchEvent(event);
    setShowFilesModal(true)
    setModule(action)
    type === "upload_progress" ? setActiveTab("uploaded") : setActiveTab("downloaded")
  }

  const statusMessages: Record<string, string> = {
    uploaded: " Completed",
    processing: " in progress",
    processed: " Successful",
    processed_failed: " failed",
  };

  const message = EVENT_TYPE + statusMessages[status];

  return (
    <Box
      sx={{
        width: 280,
        bgcolor: "background.paper",
        border: 1,
        borderColor: "grey.300",
        borderRadius: 12,
        p: 2,
        boxShadow: 2,
      }}
      className="transition-all duration-300 ease-in-out opacity-0 animate-fadeIn"
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        {isFailed && <ErrorOutlineIcon color="error" fontSize="small" />}
        {isProcessed && (
          <CheckCircleOutlineIcon color="success" fontSize="small" />
        )}
        <Typography
          variant="body2"
          fontWeight={500}
          fontSize={16}
          color={isFailed ? "error.main" : theme.custom.textColor}
        >
          {message}
        </Typography>
      </Box>

      {isProcessed && (
        <Box sx={{ display: "flex", alignItems: "start" }}>
          <Button sx={{ backgroundColor: theme.custom.midnightBlue, width: 'fit', height: 32 }} variant="contained" onClick={() =>{
             handleViewFiles(action)
             }}>
            <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'white' }}>
              View Files
            </Typography>
          </Button>
        </Box>
      )}

      {!isFailed && !isProcessed && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 4,
                // borderRadius: 4,
                bgcolor: "#a1b8c7",
                "& .MuiLinearProgress-bar": {
                  bgcolor: theme.custom.midnightBlue,
                  transition: "width 0.4s ease smooth",
                },
              }}
            />
          </Box>

          {/* Percentage */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ minWidth: 35, textAlign: "right", fontWeight: 600 }}
          >
            {progress}%
          </Typography>
        </Box>
      )}
    </Box>
  );
}
