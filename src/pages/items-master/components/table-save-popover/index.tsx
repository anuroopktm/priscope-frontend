import React, { useEffect } from "react";
import { Box, IconButton, TextareaAutosize } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

interface TableSavePopoverProps {
  comment: string;
  onSave: () => void;
  onCancel: () => void;
  setComment: (comment: string) => void;
  commentAdded: boolean;
}

const TableSavePopover: React.FC<TableSavePopoverProps> = ({
  comment,
  onSave,
  onCancel,
  setComment,
  commentAdded,
}) => {
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  useEffect(() => {
    setComment("");
  }, []);

  const isCommentValid = comment.trim().length;
  const showError = !isCommentValid && commentAdded;
  return (
    <Box
      sx={{
        pt: 0.5,
        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        gap: 1.25,
        zIndex: 100,
        alignItems: "flex-start",
      }}
    >
      <Box
        sx={{
          p: 1.25,
          backgroundColor: "white",
          // borderRadius: 5,
          boxShadow: 5,
          border: "1px solid",
          borderColor: showError ? "#d32f2f" : "grey.400",
        }}
      >
        <TextareaAutosize
          value={comment}
          aria-label="comment-box"
          minRows={3}
          maxRows={6}
          onChange={handleCommentChange}
          onKeyDownCapture={(e) => {
            if (e.key === "Backspace") {
              e.stopPropagation();
            }
          }}
          placeholder="Comments"
          style={{
            width: 200,
            padding: "5px",
            border: "none",
            outline: "none",
            resize: "none",
            fontFamily: "inherit",
          }}
        />
      </Box>

      <IconButton
        size="small"
        onClick={onSave}
        sx={{
          bgcolor: "white",
          color: "success.main",
          borderRadius: "50%",
          "&:hover": { bgcolor: "success.dark", color: "white" },
          boxShadow: 5,
          width: 32,
          height: 32,
        }}
      >
        <CheckIcon fontSize="small" />
      </IconButton>

      <IconButton
        size="small"
        onClick={() => {
          onCancel();
        }}
        sx={{
          bgcolor: "white",
          color: "error.main",
          borderRadius: "50%",
          "&:hover": { bgcolor: "error.dark", color: "white" },
          boxShadow: 5,
          width: 32,
          height: 32,
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default TableSavePopover;
