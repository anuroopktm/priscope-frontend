import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

interface CommentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void;
  isLoading?: boolean;
}

const CommentModal = ({
  open,
  onClose,
  onConfirm,
  isLoading,
}: CommentModalProps) => {
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (open) {
      setCommentText("");
    }
  }, [open]);

  const handleSubmit = () => {
    if (commentText.trim()) {
      onConfirm(commentText.trim());
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Typography variant="h6" sx={{ color: "primary.main", px: 3, py: 2 }}>
        Comments
      </Typography>

      <Divider sx={{ borderColor: "#E2E8F0" }} />

      <DialogContent sx={{ py: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          placeholder="Type your Comments here"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          variant="outlined"
          autoFocus
        />
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, justifyContent: "start", gap: 1 }}>
        <Button size="small" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="small"
          variant="contained"
          disabled={!commentText.trim()}
          loading={isLoading}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommentModal;
