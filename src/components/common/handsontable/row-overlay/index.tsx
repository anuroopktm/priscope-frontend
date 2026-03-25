import React, { useState, useCallback } from "react";
import {
  IconButton,
  Box,
  TextareaAutosize,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

interface RowOverlayProps {
  rowIndex: number;
  position: { top: number; left: number };
  onConfirm: (rowIndex: number) => void;
  onCancel: (rowIndex: number) => void;
  isLoading?: boolean;
  showComment?: boolean;
  isCommentRequired?: boolean;
  commentRef: React.MutableRefObject<string | null>;
}

const RowOverlay: React.FC<RowOverlayProps> = ({
  rowIndex,
  position,
  onConfirm,
  onCancel,
  isLoading = false,
  showComment = false,
  isCommentRequired = false,
  commentRef,
}) => {
  const [error, setError] = useState(false);
  const [text, setText] = useState("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setText(value);
      commentRef.current = value;
      if (error) setError(false);
    },
    [error, commentRef]
  );

  const handleConfirm = useCallback(() => {
    if (showComment && isCommentRequired && text.trim() === "") {
      setError(true);
      return;
    }
    setError(false);
    onConfirm(rowIndex);
  }, [showComment, isCommentRequired, text, onConfirm, rowIndex]);

  const handleCancel = useCallback(() => {
    onCancel(rowIndex);
  }, [onCancel, rowIndex]);

  return (
    <Box
      sx={{
        pt: 0.5,
        position: "absolute",
        top: position.top,
        left: position.left,
        display: "flex",
        gap: 1.25,
        zIndex: 100,
        alignItems: "flex-start",
      }}
    >
      {showComment && !isLoading && (
        <Box
          sx={{
            p: 1.25,
            backgroundColor: "white",
            borderRadius: 1,
            boxShadow: 5,
            border: "1px solid",
            borderColor: error ? "error.main" : "grey.400",
          }}
        >
          <TextareaAutosize
            aria-label="comment-box"
            minRows={3}
            maxRows={6}
            placeholder={
              isCommentRequired ? "Comments*" : "Comments (Optional)"
            }
            value={text}
            onChange={handleChange}
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
      )}
      {!isLoading && (
        <>
          <IconButton
            size="small"
            onClick={(e) => {
              handleConfirm();
              e.stopPropagation();
              e.preventDefault();
            }}
            disabled={isLoading}
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
            onClick={(e) => {
              handleCancel();
              e.stopPropagation();
              e.preventDefault();
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
        </>
      )}
    </Box>
  );
};

export default RowOverlay;
