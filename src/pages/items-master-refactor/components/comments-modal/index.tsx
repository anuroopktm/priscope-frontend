import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";

type CommentsModalProps = {
  open?: boolean;
  onClose: () => void;
  onSubmit: ((comment: string) => void) | null;
};

const CommentsModal = ({
  open = true,
  onClose,
  onSubmit,
}: CommentsModalProps) => {
  const [comment, setComment] = useState("");
  const [hasError, setHasError] = useState(false);

  const handleSubmit = () => {
    if (!comment.trim()) {
      setHasError(true);
      return;
    }
    onSubmit(comment);
    setComment("");
    setHasError(false);
    onClose();
  };

  const handleCancel = () => {
    setComment("");
    setHasError(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          width: "499px",
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          fontSize: "20px",
          fontWeight: 600,
          color: "#1A2B44",
        }}
      >
        Comments
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ pb: 1 }}>
        <textarea
          placeholder="Comment is required."
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            if (hasError) setHasError(false);
          }}
          style={{
            width: "100%",
            height: "120px",
            padding: "12px",
            border: hasError ? "1px solid red" : "1px solid #ddd8d8ff",
            borderRadius: "8px",
            fontSize: "14px",
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.2s ease",
          }}
          onFocus={(e) => {
            if (!hasError) e.target.style.borderColor = "#144E72";
          }}
          onBlur={(e) => {
            if (!hasError) e.target.style.borderColor = "#ddd8d8ff";
          }}
        />
        {hasError && (
          <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
            Failed to add comment. Please try again.
          </p>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          gap: 1,
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <Button
          onClick={handleCancel}
          variant="outlined"
          sx={{
            height: "40px",
            textTransform: "none",
            borderColor: "#144E72",
            color: "#144E72",
            borderRadius: "8px",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            height: "40px",
            textTransform: "none",
            borderRadius: "8px",
            backgroundColor: "#144E72",
            "&:hover": {
              backgroundColor: "#144E72",
            },
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommentsModal;